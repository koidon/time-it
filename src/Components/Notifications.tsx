import React, { useState } from "react";
import {
  Box,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { BellIcon, CloseIcon } from "@chakra-ui/icons";

const Notifications = () => {
  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      label: "Have you remembered to fill the timesheet for the current week?",
    },
    { id: 2, label: "you have been assigned to a new project" },
    { id: 3, label: "Your absence request has been approved" },
  ]);

  const handleDeleteMenuItem = (itemId: number) => {
    setMenuItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };
  return (
    <Menu closeOnSelect={false} matchWidth={true} offset={[-200, 0]}>
      <MenuButton
        as={IconButton}
        bg="none"
        border="none"
        aria-label="Notifications"
        icon={<BellIcon boxSize={50} color="#0070AD" />}
        variant=""
      />
      <MenuList w="70%">
        {menuItems.map((item) => (
          <MenuItem
            borderLeft="10px solid"
            borderColor="#0070AD"
            key={item.id}
            bg="#A9C1EC"
            mb={1}
            borderRadius={5}
          >
            <Box>
              <Text>{item.label}</Text>
              <CloseIcon onClick={() => handleDeleteMenuItem(item.id)} />
            </Box>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default Notifications;
