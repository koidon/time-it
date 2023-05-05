import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { Button, HStack, Image } from "@chakra-ui/react";

const NavBar = () => {
  const user = useUser();
  return (
    <HStack p="20px" justify="space-between">
      <Image src="/sogetiLogo.svg" alt="Sogeti logo" />
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
