import React from "react";
import {
  Box,
  Button,
  Grid,
  GridItem,
  Textarea,
  VStack,
  Text,
} from "@chakra-ui/react";

interface Props {
  flexHours: number;
}

const Corrections = (props: Props) => {
  return (
    <Grid
      templateAreas={{
        base: `"comments" 
                   "flex submit"`,
        lg: `"comments comments   flex" 
                 "comments comments  submit"`,
      }}
      m={5}
      ml={0}
      mr={0}
      gap={10}
      templateColumns={{ base: "1fr", lg: "73% 10% 10%" }}
      w={[375, 480, 768, 992, 1000, 1200]}
    >
      <GridItem area="comments">
        <Textarea h="100%" placeholder="Comments" borderRadius={10}></Textarea>
      </GridItem>
      <GridItem area="flex">
        <Box bg="#A9C1EC" pb={30} textAlign="center" borderRadius={10}>
          <VStack>
            <Text>Flex balance</Text>
            <Text>{props.flexHours}</Text>
          </VStack>
        </Box>
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
