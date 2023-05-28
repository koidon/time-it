import React from "react";
import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  VStack,
} from "@chakra-ui/react";
import { SlOptions } from "react-icons/sl";
interface Props {
  menuDeleteName: string;
  menuClearName: string;
  handleDeleteRow: () => void;
  handleClearText: () => void;
}

const EditTimesheet = (props: Props) => {
  return (
    <Menu placement="right">
      <MenuButton
        as={IconButton}
        aria-label="Edit project"
        icon={<SlOptions />}
        bg="none"
      />
      <MenuList>
        <VStack>
          <MenuItem
            borderRadius={5}
            w="70%"
            textAlign="center"
            color="#F5F9FE"
            bg="#FF5F5F"
            onClick={() => props.handleDeleteRow()}
          >
            {props.menuDeleteName}
          </MenuItem>
          <MenuItem
            borderRadius={5}
            w="70%"
            textAlign="center"
            color="#F5F9FE"
            bg="#FF5F5F"
            onClick={() => props.handleClearText()}
          >
            {props.menuClearName}
          </MenuItem>
        </VStack>
      </MenuList>
    </Menu>
  );
};

export default EditTimesheet;
