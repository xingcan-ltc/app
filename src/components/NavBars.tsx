/**
 * Template from: https://chakra-templates.dev/navigation/sidebar
 */
import React, { ReactNode } from 'react';
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import {
  FiMenu,
  FiChevronDown,
} from 'react-icons/fi';
import { LockIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import { Guard, useGuard } from "@authing/guard-react18";
import useUserContext from 'useUserContext';
import { SidebarItem, sidebarItems } from 'sidebar';
import { isPermitted } from 'shared/Role';
import yuanjianLogo from '../../public/img/yuanjian-logo.png';
import Image from "next/image";

const sidebarWidth = 60;
export const topbarHeight = "60px";
export const sidebarBreakpoint = "lg";
export const sidebarContentMarginTop = "40px";

/**
 * The container for navbar, sidebar and page content that is passed in as `children`.
 */
export default function Navbars({
  children,
}: {
  children: ReactNode;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minHeight="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', [sidebarBreakpoint]: 'block' }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <Topbar onOpen={onOpen} />
      <Box marginLeft={{ base: 0, [sidebarBreakpoint]: sidebarWidth }}>
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const [user] = useUserContext();

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', [sidebarBreakpoint]: sidebarWidth }}
      pos="fixed"
      h="full"
      {...rest}>
      <Flex 
        height={{
          base: "100px",
          [sidebarBreakpoint]: topbarHeight,
        }}
        alignItems="center"
        marginX="8" 
        justifyContent="space-between"
      >
        <Image src={yuanjianLogo} alt="远见教育基金会" style={{ width: 112 }}/>
        <CloseButton display={{ base: 'flex', [sidebarBreakpoint]: 'none' }} onClick={onClose} />
      </Flex>
      <Box height={{
        base: 0,
        [sidebarBreakpoint]: sidebarContentMarginTop,
        }}/>
      {sidebarItems
        .filter(item => isPermitted(user.roles, item.role))
        .map(item => (
        <SidebarRow key={item.path} item={item}>
          {item.name}
        </SidebarRow>
      ))}
    </Box>
  );
};

interface SidebarRowProps extends FlexProps {
  item: SidebarItem;
}
const SidebarRow = ({ item, children, ...rest }: SidebarRowProps) => {
  return (
    <Link 
      as={NextLink} 
      href={item.path}
      color="gray.500" 
      fontWeight={500}
    >
      <Flex
        align="center"
        paddingX={4}
        paddingBottom={8}
        marginX="4"
        role="group"
        cursor="pointer"
        _hover={{ color: 'brand.c' }}
        {...rest}
      >
        {item.icon && (
          <Icon
            marginRight="4"
            _groupHover={{ color: 'brand.c' }}
            as={item.icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

interface TopbarProps extends FlexProps {
  onOpen: () => void;
}

const Topbar = ({ onOpen, ...rest }: TopbarProps) => {
	const guard = useGuard();
	const [user] = useUserContext();

  return (
    <Flex
      // Fix it to screen top: https://www.w3schools.com/howto/howto_css_sticky_element.asp
      position="sticky"
      top={0}
      zIndex={200}

      marginLeft={{ base: 0, [sidebarBreakpoint]: sidebarWidth }}
      paddingX={4}
      height={topbarHeight}
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', [sidebarBreakpoint]: 'flex-end' }}
      {...rest}
    >
      <IconButton
        display={{ base: 'flex', [sidebarBreakpoint]: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: 'flex', [sidebarBreakpoint]: 'none' }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold">
        Logo Mobile
      </Text>

      <HStack spacing={{ base: '0', [sidebarBreakpoint]: '6' }}>
        {/* <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
          icon={<FiBell />}
        /> */}
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: 'none' }}>
              <HStack>
                <Avatar
                  size={'sm'}
                  bg="brand.a"
                  color="white"
                  name={user.name || ""}
                />
                <Text 
                  display={{ base: 'none', [sidebarBreakpoint]: 'flex' }}
                  marginLeft="2"
                  fontSize="sm"
                >
                  {user.name || ""}
                </Text>
                <Box display={{ base: 'none', [sidebarBreakpoint]: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}>
              <MenuItem as={NextLink} href='/profile'>
                个人信息
              </MenuItem>
              <MenuDivider />
              <MenuItem as={NextLink} href='/whocanseemydata'>
                <LockIcon marginRight={1} />谁能看到我的数据
              </MenuItem>
              <MenuDivider />
              <MenuItem
                onClick={async () => {
                  // Wait until this is fixed
                  // https://github.com/Authing/Guard/issues/179
                  await logout.call(guard);
                  location.href = '/';
                }}              
              >退出登录</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

const logout = async function (this: Guard) {
	const authClient = await this.getAuthClient();
	await authClient.logout();
	localStorage.clear();
}
