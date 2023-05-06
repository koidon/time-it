import React, { useMemo, useState } from "react";
import Head from "next/head";

import {
  Box,
  Button,
  Grid,
  GridItem,
  Input,
  Show,
  Table,
  TableContainer,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import NavBar from "~/Components/NavBar";
import SideBar from "~/Components/SideBar";
import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";

const dateOffset = (date: Date, offset: number) => {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + offset);
  return newDate;
};

const getFirstDayOfWeek = (date: Date) => {
  const day = (date.getDay() + 6) % 7; // Monday is the first day of week
  return dateOffset(date, -day);
};

const weekDayFormat: Intl.DateTimeFormatOptions = {
  weekday: "short",
  month: "long",
  day: "numeric",
};

interface TimeEntry {
  [key: string]: number;
}

const Timesheet = () => {
  const user = useUser();

  const [startDate, setStartDate] = useState(getFirstDayOfWeek(new Date()));
  const isFutureStartDate = useMemo(() => startDate > new Date(), [startDate]);

  const { data: projectData, refetch: refetchData } =
    api.timesheet.getAll.useQuery();

  const createProject = api.timesheet.projectCreate.useMutation({
    onSuccess: () => {
      void refetchData();
    },
  });

  const createTimeEntry = api.timeEntries.timeEntryCreate.useMutation({
    onSuccess: () => {
      void refetchData();
    },
  });

  const deleteTimeEntry = api.timeEntries.timeEntryDelete.useMutation({
    onSuccess: () => {
      void refetchData();
    },
  });

  const formattedData = projectData?.map(({ project, time_entries }) => {
    const hoursPerDate = time_entries.reduce((acc, { hours_worked, date }) => {
      const formattedDate = new Date(date).toLocaleDateString("en-SE");
      acc[formattedDate] = (acc[formattedDate] || 0) + hours_worked;
      return acc;
    }, {} as TimeEntry);
    return {
      project,
      time_entries: hoursPerDate,
    };
  });

  console.log(formattedData);

  const handlePreviousWeek = () => {
    setStartDate((currDate) => dateOffset(currDate, -7));
  };

  const handleNextWeek = () => {
    setStartDate((currDate) => dateOffset(currDate, 7));
  };

  const getValue = (index: number, date: Date) => {
    const key = date.toLocaleDateString("en-SE");
    return formattedData?.[index]?.time_entries?.[key] ?? "";
  };

  const setValue = (index: number, date: Date, value: string) => {
    const key = date.toLocaleDateString("en-SE");

    if (value == "") {
      deleteTimeEntry.mutate({
        date: key,
        projectId: projectData?.[index]?.id ?? "",
      });
    } else {
      createTimeEntry.mutate({
        hours_worked: parseInt(value),
        date: key,
        projectId: projectData?.[index]?.id ?? "",
      });
    }
  };

  const handleAddRow = () => {
    createProject.mutate({
      project: `Project ${
        formattedData?.length ? formattedData.length + 1 : ""
      }`,
    });
  };

  /* const handleDeleteRow = (index: number) => {
    setTimeData((prevData) => {
      const updatedData = [...prevData];
      updatedData.splice(index, 1);
      return updatedData;
    });
  };*/

  const getTotal = (index: number, dates: Date[]) => {
    return dates.reduce((total, date) => {
      const val = parseInt(getValue(index, date).toString()) || 0;
      return total + val;
    }, 0);
  };

  const weekDates = Array.from({ length: 7 }, (_, i) =>
    dateOffset(startDate, i)
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
            base: `"nav" 
                   "main"`,
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
          {!!user.isSignedIn && (
            <GridItem area="main">
              <Box paddingLeft={2}>
                <Button onClick={handlePreviousWeek}>Previous Week</Button>
                {` ${
                  weekDates[0]?.toLocaleDateString("en-SE")
                    ? weekDates[0]?.toLocaleDateString("en-SE")
                    : ""
                } - ${
                  weekDates[6]?.toLocaleDateString("en-SE")
                    ? weekDates[6]?.toLocaleDateString("en-SE")
                    : ""
                } `}
                <Button onClick={handleNextWeek}>Next Week</Button>
                <TableContainer>
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>Project</Th>
                        {weekDates.map((day) => (
                          <Th key={day.toISOString()}>
                            {day.toLocaleDateString("en-SE", weekDayFormat)}
                          </Th>
                        ))}
                        <Th>Total</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {formattedData?.map((item, index) => (
                        <Tr key={index}>
                          <Td>{item.project}</Td>
                          {weekDates.map((date) => (
                            <Td key={date.toISOString()}>
                              <Input
                                size="sm"
                                type="number"
                                value={getValue(index, date)}
                                onChange={(e) =>
                                  setValue(index, date, e.target.value)
                                }
                                disabled={isFutureStartDate}
                              />
                            </Td>
                          ))}
                          <Td>{getTotal(index, weekDates)}</Td>
                          <Td>
                            {/* <Button onClick={() => handleDeleteRow(index)}>
                              Delete
                            </Button>*/}
                          </Td>
                        </Tr>
                      ))}
                      <Tr>
                        <Td></Td>
                        {weekDates.map((day) => (
                          <Th key={day.toISOString()}>
                            {day.toLocaleDateString("en-SE", weekDayFormat)}
                          </Th>
                        ))}
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
                <Button onClick={handleAddRow}>Add New Project</Button>
              </Box>
            </GridItem>
          )}
          {!user.isSignedIn && <h1>You must sign in</h1>}
        </Grid>
      </main>
    </>
  );
};

export default Timesheet;
