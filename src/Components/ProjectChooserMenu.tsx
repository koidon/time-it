import React from "react";
import {
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tooltip,
} from "@chakra-ui/react";
import { api } from "~/utils/api";
import { AddIcon } from "@chakra-ui/icons";

interface Project {
  id: string;
  projectName: string;
}

interface Props {
  buttonName: string;
  onSelectProject: (project: Project) => void;
  buttonType: "button" | "iconButton";
}

const ProjectChooserMenu = ({
  onSelectProject,
  buttonName,
  buttonType,
}: Props) => {
  const { data: projectData } = api.project.getAssignedProjects.useQuery();

  return (
    <Menu>
      {buttonType === "iconButton" && (
        <Tooltip
          hasArrow
          label="Add a project to the timesheet for the current week."
        >
          <MenuButton
            as={IconButton}
            aria-label={buttonName}
            icon={<AddIcon />}
            borderRadius="50%"
          />
        </Tooltip>
      )}
      {buttonType === "button" && (
        <MenuButton as={Button}>{buttonName}</MenuButton>
      )}
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
