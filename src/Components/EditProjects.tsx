import React from "react";
import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  HStack,
  ListItem,
  List,
  Text,
} from "@chakra-ui/react";
import { api } from "~/utils/api";

const EditProjects = () => {
  const { data: projects, refetch: refetchData } =
    api.project.getCreatedProjects.useQuery();

  const deleteProject = api.project.projectDelete.useMutation({
    onSuccess: () => {
      void refetchData();
    },
  });

  const handleDeleteProject = (projectId: string) => {
    deleteProject.mutate({
      id: projectId,
    });
  };

  return (
    <AccordionItem>
      <h2>
        <AccordionButton onClick={() => void refetchData()}>
          <Box as="span" flex="1" textAlign="left">
            Edit projects
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4} h="auto">
        <List>
          {projects?.map((project) => (
            <ListItem paddingY="15px" key={project.id}>
              <HStack gap={5} alignItems="center">
                <Text w={100}>{project.projectName}</Text>
                <Button onClick={() => handleDeleteProject(project.id)}>
                  Delete
                </Button>
              </HStack>
            </ListItem>
          ))}
        </List>
      </AccordionPanel>
    </AccordionItem>
  );
};

export default EditProjects;
