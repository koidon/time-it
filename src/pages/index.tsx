import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { api } from "~/utils/api";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { Button, Flex, Grid, GridItem, HStack, Show } from "@chakra-ui/react";
import NavBar from "~/Components/NavBar";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>TimeIt</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Grid
          templateAreas={{
            base: `"nav" "main"`,
            lg: `"nav nav" "aside main"`,
          }}
          templateColumns={{ base: "1fr", lg: "200px 1fr" }}
        ></Grid>
        <GridItem area="nav">
          <NavBar />
        </GridItem>
        <Show above="lg">
          <GridItem area="aside">
            <Flex flexDir="column" w="10%">
              <Button variant="solid">Timesheet</Button>
              <Button variant="solid">Dashboard</Button>
              <Button variant="solid">Calendar</Button>
              <Button variant="solid">Reports</Button>
              <Button variant="solid">Absence</Button>
            </Flex>
          </GridItem>
        </Show>
      </main>
    </>
  );
};

export default Home;
