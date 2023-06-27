import {
  Box,
  Button,
  SimpleGrid,
  useColorModeValue,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Badge,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  Checkbox
} from '@chakra-ui/react'
import React, { useState } from 'react'
import AppLayout from 'AppLayout'
import { NextPageWithLayout } from '../NextPageWithLayout'
import tClientBrowser from "../tClientBrowser";
import { Role, ALL_ROLES } from "../shared/roles";
import { HSeparator } from "../horizon-ui/components/separator/Separator";
import IUser from "../shared/IUser";
import { toast } from "react-toastify";
import tClientNext from "../tClientNext";

const Page: NextPageWithLayout = () => {
  const { data, refetch } = tClientNext.users.listUsers.useQuery();

  const [isOpen, setOpen] = useState(false);
  const textColor = useColorModeValue('navy.700', 'white');
  const brandStars = useColorModeValue('brand.500', 'brand.400');

  const [user, setUser] = useState<IUser | undefined>();
  const [name, setName] = useState('');
  const [roles, setRoles] = useState([] as Role[]);
  const [isCreating, setCreating] = useState(false);

  const onCreateUser = async () => {
    if (!user) {
      return;
    }
    setCreating(true);
    tClientBrowser.users.create.mutate({
      name,
      pinyin: user.pinyin,
      email: user.email,
      clientId: user.clientId,
      roles,
    })
      .then(() => {
        refetch();
        setOpen(false);
      })
      .catch((e) => toast.error(e.message, { autoClose: false }))
      .finally(() => setCreating(false));
  };

  return (
    <Box paddingTop={'80px'}>
      {/* TODO: move this long block into a separate function */}
      <Heading as="h1" mb="3">用户管理</Heading>
      {!data && <Button isLoading={true} loadingText={'读取用户信息中...'} disabled={true} />}
      <SimpleGrid
        mb='20px'
        columns={1}
        spacing={{ base: '20px', xl: '20px' }}
      >
        {data &&
          <Table variant='striped'>
            <Thead>
              <Tr>
                <Th>电子邮箱</Th>
                <Th>姓名</Th>
                <Th>权限</Th>
                <Th>用户ID</Th>
                <Th>AuthingID</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.users.map((item) => (
                <Tr key={item.id}>
                  <Td>{item.email}</Td>
                  <Td>{item.name}</Td>
                  <Td>
                    {item.roles ?
                      <Badge variant='outline' colorScheme='blue' fontSize='sm'>
                        {item.roles}
                      </Badge> : <Button colorScheme='blue' onClick={() => {
                        setName('');
                        setRoles([]);
                        setUser(item as IUser);
                        setOpen(true);
                      }}>Create and assign roles</Button>
                    }
                  </Td>
                  <Td>{item.id}</Td>
                  <Td>{item.clientId}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        }
      </SimpleGrid>

      {/* TODO: move this long block into a separate function */}
      {user &&
        <Modal isOpen={isOpen} onClose={() => setOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create user</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>
                This user is generated by Authing, but it&apos;s not in our database yet. It is treated as a visitor and
                cannot access anything.
              </Text>
              <Text mt={4}>
                Fill the form to create the user in our database and grant roles
              </Text>
              <Box mt={4}>
                <Flex align='center' mb='25px'>
                  <HSeparator />
                </Flex>
                <FormControl>
                  <FormLabel display='flex' ms='4px' fontSize='md' fontWeight='500' color={textColor} mb='8px'>
                    Email: <Text ml={4} fontSize='md' fontWeight='900' color={textColor}>{user.email}</Text>
                  </FormLabel>
                  <FormLabel display='flex' ms='4px' fontSize='md' fontWeight='500' color={textColor} mb='8px'>
                    Name<Text color={brandStars}>*</Text>
                  </FormLabel>
                  <Input
                    isRequired={true}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    variant='auth'
                    fontSize='sm'
                    ms={{ base: '0px', md: '0px' }}
                    type='email'
                    placeholder='foo@bar.com'
                    mb='24px'
                    fontWeight='500'
                    size='lg'
                  />
                  <FormLabel display='flex' ms='4px' fontSize='md' fontWeight='500' color={textColor} mb='8px'>
                    Roles<Text color={brandStars}>*</Text>
                  </FormLabel>
                  <Flex justifyContent='space-between' align='center' mb='24px' wrap={'wrap'}>
                    {ALL_ROLES.map(role => (role === 'ADMIN' ? false : (
                      <FormControl display='flex' alignItems='center' key={role}>
                        <Checkbox colorScheme='brandScheme' me='10px' checked={roles.includes(role)} onChange={() => {
                          setRoles(prev => {
                            if (prev.includes(role)) {
                              return prev.filter(r => r !== role);
                            } else {
                              return [...prev, role];
                            }
                          });
                        }} />
                        <FormLabel
                          mb='0'
                          fontWeight='normal'
                          color={textColor}
                          cursor={'pointer'}
                          fontSize='sm'>
                          {role}
                        </FormLabel>
                      </FormControl>
                    )))}
                  </Flex>
                  <Button
                    isLoading={isCreating}
                    loadingText='Creating'
                    fontSize='sm' variant='brand' fontWeight='500' w='100%' h='50' mb='24px' onClick={async () => {
                      await onCreateUser();
                    }}>
                    Create and assign roles
                  </Button>
                </FormControl>
              </Box>
            </ModalBody>
          </ModalContent>
        </Modal>
      }
    </Box>
  )
}

Page.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Page;
