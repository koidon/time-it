import React from "react";
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

const UsersList = () => {
  const { data: users } = api.users.getAll.useQuery();

  console.log(users);

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
                src={user.profileImageUrl}
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
              <Button>Assign as project leader</Button>
            </HStack>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default UsersList;
