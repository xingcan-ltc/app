import {
  Button,
  Table,
  Tbody,
  Tr,
  Td,
  Flex,
  Box,
  LinkBox,
  LinkOverlay,
  Divider,
} from '@chakra-ui/react'
import React from 'react'
import AppLayout from 'AppLayout'
import { NextPageWithLayout } from '../../../NextPageWithLayout'
import { trpcNext } from "../../../trpc";
import trpc from 'trpc';
import { AddIcon, EditIcon } from '@chakra-ui/icons';
import Loader from 'components/Loader';
import { PartnershipWithAssessments } from 'shared/Partnership';
import { useRouter } from 'next/router';
import { parseQueryParameter } from '../../../parseQueryParamter';
import { prettifyDate } from 'shared/strings';
import { UserChips } from 'components/GroupBar';
import PageBreadcrumb from 'components/PageBreadcrumb';
import NextLink from "next/link";
import Assessment from 'shared/Assessment';

const Page: NextPageWithLayout = () => {
  const partnershipId = parseQueryParameter(useRouter(), "partnershipId");
  const { data: partnership } = trpcNext.partnerships.getWithAssessments
    .useQuery<PartnershipWithAssessments | undefined>({ id: partnershipId });

  return <>
    <PageBreadcrumb current="评估列表" parents={[
      { name: "一对一导师管理", link: "/partnerships" }
    ]}/>

    {!partnership ? <Loader /> : <Flex direction='column' gap={6}>
      <UserChips users={[partnership.mentee, partnership.mentor]} abbreviateOnMobile={false} />
      <Divider />
      <Table>
        <Tbody>
          {partnership.assessments.length > 0 ? partnership.assessments.map(a => (
            <AssessmentRow
              key={a.id} 
              partnershipId={partnershipId} 
              assessmentId={a.id}
              date={a.createdAt}
              summary={a.summary}
            />
          )) : <AssessmentRow
            partnershipId={partnershipId}  
            date={new Date()}
          />}
        </Tbody>
      </Table>
    </Flex>}
  </>;
}

// Date is optional merely to suppress typescript warning
export function getYearText(date?: Date | string): string {
  // @ts-ignore
  return new Date(date).getFullYear() + "年度";
}

function AssessmentRow({ partnershipId, assessmentId, date, summary } : {
  partnershipId: string,
  assessmentId?: string,  // When undefined, create a new assessment and enter the new assessment page.
  date?: Date | string,   // Optional merely to suppress typescript warning
  summary?: string | null,
}) {
  const router = useRouter();
  const url = (assessmentId: string) => `/partnerships/${partnershipId}/assessments/${assessmentId}`;
  const createAndGo = async () => {
    const id = await trpc.assessments.create.mutate({ partnershipId });
    router.push(url(id));
  };

  return <LinkBox as={Tr}>
    <Td>
      {getYearText(date)}
    </Td>
    {summary ? 
      <Td>{summary}</Td> : 
      <Td color="disabled">尚未评估</Td>
    }
    <Td>
      <LinkOverlay as={NextLink}
        href={assessmentId ? `/partnerships/${partnershipId}/assessments/${assessmentId}` : "#"}
        onClick={assessmentId ? undefined : createAndGo}
      >
        <EditIcon />
      </LinkOverlay>
    </Td>
  </LinkBox>

}

Page.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Page;
