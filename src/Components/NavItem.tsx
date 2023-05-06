import React from "react";
import { Flex, Image, Link, Menu, MenuButton, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";

interface Props {
  navSize: string;
  title: string;
  icon: string;
  route: string;
  alt: string;
}

const NavItem = ({ navSize, title, icon, route, alt }: Props) => {
  const router = useRouter();
  const currentRoute = router.pathname;

  return (
    <Flex
      mt={30}
      flexDir="column"
      w="100%"
      alignItems={navSize == "small" ? "center" : "flex-start"}
    >
      <Menu placement="right">
        <Link
          as={NextLink}
          href={route}
          passHref
          bg={currentRoute === route ? "gray.300" : ""}
          p={3}
          pb={1}
          borderRadius={8}
          _hover={{ textDecor: "none", backgroundColor: "gray.300" }}
          w={navSize == "large" ? "100%" : ""}
        >
          <MenuButton>
            <Flex>
              <Image src={icon} alt={alt} />
              <Text ml={5} display={navSize == "small" ? "none" : "flex"}>
                {title}
              </Text>
            </Flex>
          </MenuButton>
        </Link>
      </Menu>
    </Flex>
  );
};

export default NavItem;
