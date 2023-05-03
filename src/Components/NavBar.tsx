import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { Button, HStack, Image } from "@chakra-ui/react";

const NavBar = () => {
  const user = useUser();
  return (
    <HStack p="10px" justify="space-between">
      <Image src="/sogeti.webp" boxSize="60px" />
      {!user.isSignedIn && (
        <SignInButton mode="modal">
          <Button m="8" ml="auto" colorScheme="teal">
            Sign in
          </Button>
        </SignInButton>
      )}
      {!!user.isSignedIn && (
        <SignOutButton>
          <Button m="8" ml="auto" colorScheme="teal">
            Sign Out
          </Button>
        </SignOutButton>
      )}
    </HStack>
  );
};

export default NavBar;
