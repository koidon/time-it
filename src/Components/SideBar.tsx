import React, { useState } from "react";
import { Flex, IconButton } from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import NavItem from "~/Components/NavItem";

const SideBar = () => {
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
          icon="dashboardIcon.svg"
          title="Dashboard"
          route="/"
          alt="Dashboard icon"
        />
        <NavItem
          navSize={navSize}
          icon="timesheetIcon.svg"
          title="Timesheet"
          route="/timesheet"
          alt="Timesheet icon"
        />
        <NavItem
          navSize={navSize}
          icon="calendarIcon.svg"
          title="Calendar"
          route="/calendar"
          alt="Calendar icon"
        />
        <NavItem
          navSize={navSize}
          icon="reportsIcon.svg"
          title="Reports"
          route="/reports"
          alt="Reports icon"
        />
        <NavItem
          navSize={navSize}
          icon="absenceIcon.svg"
          title="Absence"
          route="/absence"
          alt="Absence icon"
        />
      </Flex>
    </Flex>
  );
};

export default SideBar;
