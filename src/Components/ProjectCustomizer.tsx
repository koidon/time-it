import React from "react";
import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { BsFillCircleFill } from "react-icons/bs";
import { SlOptions } from "react-icons/sl";

interface Props {
  onSelectColor: (projectColor: string) => void;
}

const ProjectCustomizer = ({ onSelectColor }: Props) => {
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<SlOptions />}
        variant="outline"
      />
      <MenuList>
        <MenuItem
          onClick={() => onSelectColor("#4472C4")}
          icon={<BsFillCircleFill color="#4472C4" />}
          command="⌘T"
        >
          Blue
        </MenuItem>
        <MenuItem
          onClick={() => onSelectColor("#A5A5A5")}
          icon={<BsFillCircleFill color="#A5A5A5" />}
          command="⌘N"
        >
          Grey
        </MenuItem>
        <MenuItem
          onClick={() => onSelectColor("#F6B6B6")}
          icon={<BsFillCircleFill color="#F6B6B6" />}
          command="⌘⇧N"
        >
          Pink
        </MenuItem>
        <MenuItem
          onClick={() => onSelectColor("#CAFFB0")}
          icon={<BsFillCircleFill color="#CAFFB0" />}
          command="⌘O"
        >
          Green
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default ProjectCustomizer;
