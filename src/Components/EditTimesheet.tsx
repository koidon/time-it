import React from "react";
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  VStack,
} from "@chakra-ui/react";
interface Props {
  buttonBackgroundColor?: string;
  buttonWidth?: string;
  buttonColor?: string;
  buttonFontSize?: string;
  buttonName: string;
  menuDeleteName: string;
  menuClearName: string;
  handleDeleteAllRows: () => void;
  handleClearAllText: () => void;
}

const EditTimesheet = (props: Props) => {
  return (
    <Menu>
      <MenuButton as={Button} bg="#4472C4" color="#FCFDFF" w="100%">
        {props.buttonName}
      </MenuButton>
      <MenuList>
        <VStack>
          <MenuItem
            borderRadius={5}
            w="70%"
            textAlign="center"
            color="#F5F9FE"
            bg="#FF5F5F"
            onClick={() => props.handleDeleteAllRows()}
          >
            {props.menuDeleteName}
          </MenuItem>
          <MenuItem
            borderRadius={5}
            w="70%"
            textAlign="center"
            color="#F5F9FE"
            bg="#FF5F5F"
            onClick={() => props.handleClearAllText()}
          >
            {props.menuClearName}
          </MenuItem>
        </VStack>
      </MenuList>
    </Menu>
  );
};

export default EditTimesheet;
