import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { Button, HStack } from "@chakra-ui/react";
import Image from "next/image";

const NavBar = () => {
  const user = useUser();
  return (
    <HStack p="20px" justify="space-between">
      <Image
        src="/sogetiLogo.png"
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
        <>
          <p>{user.user.id}</p>
          <SignOutButton>
            <Button m="8" ml="auto" colorScheme="teal">
              Sign Out
            </Button>
          </SignOutButton>
        </>
      )}
    </HStack>
  );
};

export default NavBar;
