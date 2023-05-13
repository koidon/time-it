import React, { useState } from "react";
import { Flex, IconButton } from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import NavItem from "~/Components/NavItem";
import absenceIcon from "/public/absenceIcon.png";
import calendarIcon from "/public/absenceIcon.png";
import dashboardIcon from "/public/dashboardIcon.png";
import reportsIcon from "/public/reportsIcon.png";
import timesheetIcon from "/public/timesheetIcon.png";
import projectsIcon from "/public/projectsIcon.png";
import { useUser } from "@clerk/nextjs";

const SideBar = () => {
  interface PublicMetadata {
    [key: string]: boolean;
  }

  interface User {
    // Define other properties if needed
    publicMetadata?: PublicMetadata;
  }

  const { user } = useUser() as { user?: User };

  const [navSize, setNavSize] = useState("large");
  return (
    <Flex
      pos="sticky"
      left="5"
      h="95vh"
      marginTop="2.5vh"
      boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
      borderRadius={navSize == "small" ? "15px" : "30px"}
      w={navSize == "small" ? "75px" : "200px"}
      flexDir="column"
      justifyContent="space-between"
    >
      <Flex
        p="5%"
        flexDir="column"
        w="100%"
        alignItems={navSize == "small" ? "center" : "flex:start"}
        as="nav"
      >
        <IconButton
          aria-label="hamburger"
          background=""
          w="10%"
          mt={5}
          _hover={{ background: "none" }}
          icon={<FiMenu />}
          onClick={() => {
            navSize == "small" ? setNavSize("large") : setNavSize("small");
          }}
        />
        <NavItem
          navSize={navSize}
          icon={dashboardIcon}
          title="Dashboard"
          route="/"
          alt="Dashboard icon"
        />
        <NavItem
          navSize={navSize}
          icon={timesheetIcon}
          title="Timesheet"
          route="/timesheet"
          alt="Timesheet icon"
        />
        <NavItem
          navSize={navSize}
          icon={calendarIcon}
          title="Calendar"
          route="/calendar"
          alt="Calendar icon"
        />
        <NavItem
          navSize={navSize}
          icon={reportsIcon}
          title="Reports"
          route="/reports"
          alt="Reports icon"
        />
        <NavItem
          navSize={navSize}
          icon={absenceIcon}
          title="Absence"
          route="/absence"
          alt="Absence icon"
        />
        {user?.publicMetadata?.["isProjectLeader"] && (
          <NavItem
            navSize={navSize}
            icon={projectsIcon}
            title="Projects"
            route="/projects"
            alt="Absence icon"
          />
        )}
      </Flex>
    </Flex>
  );
};

export default SideBar;
