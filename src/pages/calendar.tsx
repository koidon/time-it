import { type NextPage } from "next";
import Head from "next/head";

import { Box, Grid, GridItem, Show } from "@chakra-ui/react";
import NavBar from "~/Components/NavBar";
import SideBar from "~/Components/SideBar";
import HamburgerMenu from "~/Components/HambugerMenu";
import React from "react";
import dayjs from "dayjs";
import {
  Calendar,
  type CalendarProps,
  dayjsLocalizer,
} from "react-big-calendar";

import timezone from "dayjs/plugin/timezone";
dayjs.extend(timezone);

const djLocalizer = dayjsLocalizer(dayjs);

const Home: NextPage = (props: Omit<CalendarProps, "localizer">) => {
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
            base: `"nav nav" 
                   "hamburger main"`,
            lg: `"nav nav" 
                 "aside main"`,
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
          <Show below="lg">
            <GridItem area="hamburger">
              <HamburgerMenu />
            </GridItem>
          </Show>
          <GridItem area="main">
            <Box h="50rem">
              <Calendar
                {...props}
                localizer={djLocalizer}
                startAccessor="start"
                endAccessor="end"
              />
            </Box>
          </GridItem>
        </Grid>
      </main>
    </>
  );
};

export default Home;
