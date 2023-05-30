import { SignInButton, useUser } from "@clerk/nextjs";
import { Button, Center, Flex, HStack } from "@chakra-ui/react";
import Image from "next/image";
import UserMenu from "~/Components/UserMenu";
import sogetiLogo from "/public/sogetiLogo.png";
import Notifications from "~/Components/Notifications";

const NavBar = () => {
  const user = useUser();
  return (
    <HStack p="20px" justify="space-between">
      <Image
        src={sogetiLogo}
        alt="Sogeti logo"
        width={94}
        height={48}
        priority={true}
        style={{ width: 94, height: 48 }}
      />

      {!user.isSignedIn && (
        <SignInButton mode="modal">
          <Button m="8" ml="auto" colorScheme="teal">
            Sign in
          </Button>
        </SignInButton>
      )}
      {!!user.isSignedIn && (
        <Flex>
          <Center m={4}>
            <Notifications />
          </Center>
          <Center m={4}>
            <UserMenu
              userProfilePicture={user.user.imageUrl}
              username={
                user.user.username ? user.user.username : user.user.fullName
              }
            />
          </Center>
        </Flex>
      )}
    </HStack>
  );
};

export default NavBar;
