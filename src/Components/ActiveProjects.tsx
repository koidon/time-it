import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { Box, Flex, List, ListItem, Text } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import ProjectCustomizer from "~/Components/ProjectCustomizer";

interface ProjectColors {
  [key: string]: string;
}

const ActiveProjects = () => {
  const { data: projectData } = api.project.getAssignedProjects.useQuery();
  const [projectColors, setProjectColors] = useState<ProjectColors>({});

  useEffect(() => {
    const storedColors = localStorage.getItem("projectColors");
    if (storedColors) {
      const parsedColors = JSON.parse(storedColors) as ProjectColors;
      setProjectColors(parsedColors);
    }
  }, []);

  const handleColorSelection = (projectId: string, color: string) => {
    const updatedColors: ProjectColors = {
      ...projectColors,
      [projectId]: color,
    };
    setProjectColors(updatedColors);
    localStorage.setItem("projectColors", JSON.stringify(updatedColors));
  };

  return (
    <List bg="#D2DFF3" mt={2}>
      <Text fontFamily="Inter" fontWeight="700" fontSize="24px" ml={2}>
        Active projects
      </Text>
      {projectData?.map((project) => (
        <ListItem
          key={project.id}
          bg={projectColors[project.id] || "#4472C4"}
          borderRadius="8px"
          mb={2}
          ml={2}
          mr={2}
          h={8}
        >
          <Flex align="center" justify="space-between" h={8}>
            <Text pl={2}>{project.projectName}</Text>
            <Box>
              <StarIcon mr={2} />
              <ProjectCustomizer
                onSelectColor={(color) =>
                  handleColorSelection(project.id, color)
                }
              />
            </Box>
          </Flex>
        </ListItem>
      ))}
    </List>
  );
};

export default ActiveProjects;
