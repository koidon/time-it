import React, { ReactNode } from "react";
import {
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Box,
  Text,
  Link,
} from "@chakra-ui/react";
import Image from "next/image";
import ColorModeSwitch from "~/Components/ColorModeSwitch";
import { SignOutButton, useUser } from "@clerk/nextjs";

interface PublicMetadata {
  [key: string]: boolean;
}

interface User {
  // Define other properties if needed
  publicMetadata?: PublicMetadata;
}

interface Props {
  userProfilePicture: string;
  username: string | null;
}

const UserMenu = ({ userProfilePicture, username }: Props) => {
  const { user } = useUser() as { user?: User };

  console.log(user);

  return (
    <Menu closeOnSelect={false}>
      <MenuButton
        p={5}
        as={Button}
        size="lg"
        rightIcon={
          <Box pl={5}>
            <Image
              src={userProfilePicture}
              alt="Profile picture"
              width={50}
              height={50}
              style={{ borderRadius: 9999 }}
            />
          </Box>
        }
      >
        <Text>{username}</Text>
      </MenuButton>
      <MenuList>
        <MenuItem>My profile</MenuItem>
        <MenuItem>
          <ColorModeSwitch />
        </MenuItem>
        <MenuItem>Settings</MenuItem>
        {user?.publicMetadata?.["isAdmin"] && <MenuItem>Test</MenuItem>}
        <MenuItem>Settings</MenuItem>
        <MenuItem>
          <SignOutButton>
            <Link variant="link">Sign Out</Link>
          </SignOutButton>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default UserMenu;
