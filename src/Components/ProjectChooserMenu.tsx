import React from "react";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { api } from "~/utils/api";
import type { Employee } from ".prisma/client";

interface Project {
  employees: Employee[];
  id: string;
  projectName: string;
}

interface Props {
  onSelectProject: (project: Project) => void;
}

const ProjectChooserMenu = ({ onSelectProject }: Props) => {
  const { data: projectData } = api.project.getAll.useQuery();

  return (
    <Menu>
      <MenuButton as={Button}>Add new Project</MenuButton>
      <MenuList>
        {projectData?.map((project) => (
          <MenuItem onClick={() => onSelectProject(project)} key={project.id}>
            {project.projectName}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default ProjectChooserMenu;
