import React from "react";
import {
  Box,
  Button,
  Grid,
  GridItem,
  Textarea,
  VStack,
  Text,
  Tooltip,
} from "@chakra-ui/react";

interface Props {
  flexHours: number;
}

const Corrections = (props: Props) => {
  return (
    <Grid
      templateAreas={{
        base: `"comments comments" 
                   "flex submit"`,
        lg: `"comments comments   flex" 
                 "comments comments  submit"`,
      }}
      mt={5}
      gap={10}
      templateColumns={{ lg: "73% 10%" }}
    >
      <GridItem area="comments">
        <Textarea h="100%" placeholder="Comments" borderRadius={10}></Textarea>
      </GridItem>
      <GridItem area="flex">
        <Tooltip hasArrow label="The total amount of flex you can take out">
          <Box bg="#A9C1EC" pb={30} textAlign="center" borderRadius={10}>
            <VStack>
              <Text>Flex balance</Text>
              <Text>{props.flexHours}</Text>
            </VStack>
          </Box>
        </Tooltip>
      </GridItem>
      <GridItem area="submit">
        <Button bg="#4472C4" color="#FFFFFF" w="100%">
          Submit
        </Button>
      </GridItem>
    </Grid>
  );
};

export default Corrections;
