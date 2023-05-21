import React from "react";
import { api } from "~/utils/api";
import { Flex, List, ListItem, Text } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";

const ActiveProjects = () => {
  const { data: projectData } = api.project.getAssignedProjects.useQuery();

  return (
    <List bg="#D2DFF3" mt={2}>
      <Text fontFamily="Inter" fontWeight="700" fontSize="24px" ml={2}>
        Active projects
      </Text>
      {projectData?.map((project) => (
        <ListItem
          key={project.id}
          bg="#4472C4"
          borderRadius="8px"
          mb={2}
          ml={2}
          mr={2}
          h={8}
        >
          <Flex align="center" justify="space-between" h={8}>
            <Text pl={2}>{project.projectName}</Text>
            <StarIcon mr={2} />
          </Flex>
        </ListItem>
      ))}
    </List>
  );
};

export default ActiveProjects;
