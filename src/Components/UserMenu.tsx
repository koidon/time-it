import React from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Link,
  IconButton,
  Wrap,
  WrapItem,
  Avatar,
} from "@chakra-ui/react";
import ColorModeSwitch from "~/Components/ColorModeSwitch";
import { SignOutButton, useUser } from "@clerk/nextjs";
import NextLink from "next/link";

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

  return (
    <Menu closeOnSelect={false}>
      <MenuButton
        w="100%"
        as={IconButton}
        size="xl"
        variant=""
        bg="none"
        icon={
          <Wrap>
            <WrapItem>
              <Avatar
                size="md"
                name={username ?? ""}
                src={userProfilePicture}
              ></Avatar>
            </WrapItem>
          </Wrap>
        }
      />
      <MenuList>
        <MenuItem>My profile</MenuItem>
        <MenuItem>
          <ColorModeSwitch />
        </MenuItem>
        <MenuItem>Settings</MenuItem>
        {user?.publicMetadata?.["isAdmin"] && (
          <MenuItem>
            <Link as={NextLink} href="/roles" passHref>
              Assign roles
            </Link>
          </MenuItem>
        )}
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
