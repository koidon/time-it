import { type NextPage } from "next";
import Head from "next/head";
import { Grid, GridItem, Show } from "@chakra-ui/react";
import NavBar from "~/Components/NavBar";
import SideBar from "~/Components/SideBar";
import HamburgerMenu from "~/Components/HambugerMenu";
import React, { useState } from "react";
import Calendar from "~/Components/Calendar";
import { api } from "~/utils/api";
import CalendarModal from "~/Components/CalendarModal";
import { useDisclosure } from "@chakra-ui/hooks";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@chakra-ui/react";

interface EventData {
  start: Date;
  end: Date;
  title: string;
}

const Home: NextPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: accessToken, isLoading: tokenIsLoading } =
    api.users.getAccessToken.useQuery();
  const [displayModal, setDisplayModal] = useState<boolean>(false);
  const [selectedEventHours, setSelectedEventHours] = useState<number>(0);
  const [selectedEventDate, setSelectedEventDate] = useState<Date>(
    new Date(2023, 23, 5)
  );
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());

  const handleEventClick = (clickedEvent: EventData) => {
    const diff = clickedEvent.end.getTime() - clickedEvent.start.getTime();
    const hours = diff / (1000 * 60 * 60);
    setSelectedEventHours(hours);
    setSelectedEventDate(clickedEvent.start); // Update selectedEventDate

    // Calculate the first date of the current week
    const firstDayOfWeek = new Date(clickedEvent.start);
    const currentDayOfWeek = clickedEvent.start.getDay();
    const difference = currentDayOfWeek - 1; // Adjust the difference to Monday (1)
    const firstDayOfWeekDate = clickedEvent.start.getDate() - difference;
    firstDayOfWeek.setDate(firstDayOfWeekDate);
    setCurrentWeek(firstDayOfWeek);

    setDisplayModal(true);
    onOpen();
  };

  const { data: events, isLoading } = useQuery<EventData[], Error>(
    ["events"],
    async () => {
      const response = await axios.get<{
        value: {
          start: { dateTime: string };
          end: { dateTime: string };
          subject: string;
        }[];
      }>(
        "https://graph.microsoft.com/v1.0/me/events?$select=subject,start,end",
        {
          headers: {
            Authorization: `Bearer ${accessToken?.[0]?.token ?? ""}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Process the response data
      return response.data.value.map((event) => ({
        start: new Date(event.start.dateTime),
        end: new Date(event.end.dateTime),
        title: event.subject,
      }));
    },
    {
      refetchInterval: 3000,
      enabled: !!accessToken,
      retry: false,
    }
  );

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
            {isLoading || (tokenIsLoading && <Spinner />)}
            <Calendar events={events ?? []} onSelectEvent={handleEventClick} />
            {displayModal && (
              <CalendarModal
                isOpen={isOpen}
                onClose={onClose}
                hours={selectedEventHours}
                date={selectedEventDate}
                currentWeek={currentWeek}
              />
            )}
          </GridItem>
        </Grid>
      </main>
    </>
  );
};

export default Home;
