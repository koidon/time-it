import React, { useState } from "react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { Flex, IconButton, VStack } from "@chakra-ui/react";
import NavItem from "~/Components/NavItem";
import dashboardIcon from "../../public/dashboardIcon.png";
import timesheetIcon from "../../public/timesheetIcon.png";
import calendarIcon from "../../public/absenceIcon.png";
import reportsIcon from "../../public/reportsIcon.png";
import absenceIcon from "../../public/absenceIcon.png";
import projectsIcon from "../../public/projectsIcon.png";
import { useUser } from "@clerk/nextjs";

interface PublicMetadata {
  [key: string]: boolean;
}

interface User {
  // Define other properties if needed
  publicMetadata?: PublicMetadata;
}
const HamburgerMenu = () => {
  const { user } = useUser() as { user?: User };
  const [display, changeDisplay] = useState("none");

  return (
    <>
      <IconButton
        pos="fixed"
        top="0"
        left="0"
        zIndex={20}
        aria-label="Open Menu"
        icon={<HamburgerIcon />}
        onClick={() => changeDisplay("block")}
      />
      <VStack
        bgColor="gray.50"
        zIndex={20}
        h="100vh"
        pos="fixed"
        top="0"
        left="0"
        overflowY="auto"
        display={display}
      >
        <Flex>
          <IconButton
            mt={2}
            ml={2}
            aria-label="Close Menu"
            icon={<CloseIcon />}
            onClick={() => changeDisplay("none")}
          />
        </Flex>
        <NavItem
          icon={dashboardIcon}
          title="Dashboard"
          route="/"
          alt="Dashboard icon"
        />
        <NavItem
          icon={timesheetIcon}
          title="Timesheet"
          route="/timesheet"
          alt="Timesheet icon"
        />
        <NavItem
          icon={calendarIcon}
          title="Calendar"
          route="/calendar"
          alt="Calendar icon"
        />
        <NavItem
          icon={reportsIcon}
          title="Reports"
          route="/reports"
          alt="Reports icon"
        />
        <NavItem
          icon={absenceIcon}
          title="Absence"
          route="/absence"
          alt="Absence icon"
        />
        {user?.publicMetadata?.["isProjectLeader"] && (
          <NavItem
            icon={projectsIcon}
            title="Projects"
            route="/projects"
            alt="Absence icon"
          />
        )}
      </VStack>
    </>
  );
};

export default HamburgerMenu;
