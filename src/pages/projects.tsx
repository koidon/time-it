import { type NextPage } from "next";
import Head from "next/head";

import { Grid, GridItem, Show } from "@chakra-ui/react";
import NavBar from "~/Components/NavBar";
import SideBar from "~/Components/SideBar";
import ProjectCreator from "~/Components/ProjectCreator";
import { useUser } from "@clerk/nextjs";

interface PublicMetadata {
  [key: string]: boolean;
}

interface User {
  // Define other properties if needed
  publicMetadata?: PublicMetadata;
}

const Home: NextPage = () => {
  const { user } = useUser() as { user?: User };

  console.log(user);
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
        >
          <GridItem area="nav">
            <NavBar />
          </GridItem>
          <Show above="lg">
            <GridItem area="aside">
              <SideBar />
            </GridItem>
          </Show>
          <GridItem area="main">
            {user?.publicMetadata?.["isProjectLeader"] && <ProjectCreator />}
          </GridItem>
        </Grid>
      </main>
    </>
  );
};

export default Home;