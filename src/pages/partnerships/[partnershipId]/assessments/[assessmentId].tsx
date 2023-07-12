import React, { useCallback, useMemo, useState } from 'react';
import { NextPageWithLayout } from "../../../../NextPageWithLayout";
import AppLayout from "../../../../AppLayout";
import trpc, { trpcNext } from "../../../../trpc";
import PageBreadcrumb from 'components/PageBreadcrumb';
import { useRouter } from 'next/router';
import { parseQueryParameter } from '../../../../parseQueryParamter';
import Assessment from 'shared/Assessment';
import Loader from 'components/Loader';
import MarkdownEditor from 'components/MarkdownEditor';
import Autosaver from 'components/Autosaver';
import { Heading, Text, Flex } from '@chakra-ui/react';
import { getYearText } from '../assessments';

const Page: NextPageWithLayout = () => <AssessmentEditor />;

Page.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Page;

function AssessmentEditor() {
  const router = useRouter();
  const id = parseQueryParameter(router, "assessmentId");
  const partnershipId = parseQueryParameter(router, "partnershipId");
  const { data: assessment } = trpcNext.assessments.get.useQuery<Assessment>({ id });
  const [edited, setEdited] = useState<string | undefined>();

  const edit = useCallback((summary: string) => {
    setEdited(summary);
  }, []);

  const save = useCallback(async (summary: string) => {
    await trpc.assessments.update.mutate({ id, summary });
  }, [id]);

  // Receating the editor on each render will reset its focus (and possibly other states). So don't do it.
  const editor = useMemo(() => <MarkdownEditor 
    value={assessment?.summary || ''}
    onChange={edit}
    maxHeight="100px"
  />, [assessment, edit]);

  return (<>
    <PageBreadcrumb current={assessment ? getYearText(assessment.createdAt): "评估年度"} parents={[
      { name: "一对一导师管理", link: "/partnerships" },
      { name: "评估列表", link: `/partnerships/${partnershipId}/assessments` },
    ]} />

    {!assessment ? <Loader /> : <Flex direction="column" gap={6}>
      <Heading size="sm">总评</Heading>
      {editor}
      <Autosaver data={edited} onSave={save} />
      <Heading size="sm">按辅助层面评估</Heading>
      <Text color="disabled">尚未开发</Text>
    </Flex>}
  </>);
}
