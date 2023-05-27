import React, { useEffect, useState } from "react";
import {
  HStack,
  List,
  ListItem,
  Button,
  Heading,
  Text,
} from "@chakra-ui/react";
import { api } from "~/utils/api";
import Image from "next/image";

interface UserRoles {
  [userId: string]: boolean;
}

const UsersList = () => {
  const { data: users, refetch: refetchData } = api.users.getAll.useQuery();

  const updateRole = api.users.updateUserRole.useMutation({
    onSuccess: () => {
      void refetchData();
    },
  });

  const [userRoles, setUserRoles] = useState<UserRoles>({});

  useEffect(() => {
    if (users && users.length > 0) {
      const initialUserRoles: UserRoles = Object.fromEntries(
        users.map((user) => [
          user.id,
          user.publicMetadata.isProjectLeader as boolean,
        ])
      );
      setUserRoles(initialUserRoles);
    }
  }, [users]);

  const toggleRole = (userId: string) => {
    setUserRoles((prevUserRoles) => {
      const isProjectLeader = prevUserRoles[userId];
      const updatedRoles = { ...prevUserRoles, [userId]: !isProjectLeader };

      updateRole.mutate({
        isProjectLeader: updatedRoles[userId] ?? false,
        userId: userId,
      });

      return updatedRoles;
    });
  };

  const getButtonValue = (userId: string) => {
    const isProjectLeader = userRoles[userId];
    return isProjectLeader
      ? "Remove employee as project leader"
      : "Assign as project leader";
  };

  return (
    <>
      <Heading fontSize="2xl" m={5}>
        Users
      </Heading>
      <List m={5}>
        {users?.map((user) => (
          <ListItem key={user.id} paddingY="15px">
            <HStack gap={5} alignItems="center">
              <Image
                src={user.imageUrl}
                alt="Profile picture"
                width={50}
                height={50}
                style={{ borderRadius: 9999 }}
              />
              <Text w={20}>
                {user?.username
                  ? user?.username
                  : `${user?.firstName ?? ""}  ${user?.lastName ?? ""}`}
              </Text>
              <Button onClick={() => toggleRole(user.id)}>
                {getButtonValue(user.id)}
              </Button>
            </HStack>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default UsersList;
