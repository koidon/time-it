import React from "react";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { api } from "~/utils/api";

interface Project {
  id: string;
  projectName: string;
}

interface Props {
  buttonName: string;
  onSelectProject: (project: Project) => void;
}

const ProjectChooserMenu = ({ onSelectProject, buttonName }: Props) => {
  const { data: projectData } = api.project.getAssignedProjects.useQuery();

  return (
    <Menu>
      <MenuButton as={Button}>{buttonName}</MenuButton>
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
