import React from "react";
import {
  Box,
  Button,
  Grid,
  GridItem,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Textarea,
  Text,
  Flex,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

const CreateApplication = () => {
  const causes = [
    "Paid leave",
    "Unpaid Leave",
    "Parental Leave",
    "Education",
    "Vacation",
    "Other",
  ];

  return (
    <Box m={90} ml={250} mr={250}>
      <Grid
        templateAreas={{
          base: `"date" "cause" "comment" "apply"`,
          lg: `"date cause" 
                 "comment comment" "apply"`,
        }}
        gap="30px"
      >
        <GridItem area="date">
          <Flex alignItems="center" justifyContent="center">
            <Input type="date" placeholder="Date" />
          </Flex>
        </GridItem>
        <GridItem area="cause">
          <Flex alignItems="center" justifyContent="center">
            <Menu>
              <MenuButton w="100%" as={Button} rightIcon={<ChevronDownIcon />}>
                <Text textAlign="left">Cause</Text>
              </MenuButton>
              <MenuList>
                <MenuItem>{causes[0]}</MenuItem>
                <MenuItem>{causes[1]}</MenuItem>
                <MenuItem>{causes[2]}</MenuItem>
                <MenuItem>{causes[3]}</MenuItem>
                <MenuItem>{causes[4]}</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </GridItem>
        <GridItem area="comment">
          <Flex alignItems="center" justifyContent="center">
            <Textarea placeholder="Comment" />
          </Flex>
        </GridItem>
        <GridItem area="apply">
          <Flex alignItems="center" justifyContent="center">
            <Button type="submit" w={200} bg="#4472C4">
              Apply
            </Button>
          </Flex>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default CreateApplication;
