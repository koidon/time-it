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

const dateOffset = (date: Date, offset: number) => {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + offset);
  return newDate;
};

const getFirstDayOfWeek = (date: Date) => {
  const day = (date.getDay() + 6) % 7; // Monday is the first day of week
  return dateOffset(date, -day);
};

const weekDayFormat = { weekday: "short", month: "short", day: "numeric" };

const Timesheet = () => {
  const [startDate, setStartDate] = useState(getFirstDayOfWeek(new Date()));
  const isFutureStartDate = useMemo(() => startDate > new Date(), [startDate]);
  const [data, setData] = useState([
    { project: "Project 1", sheet: {} },
    { project: "Project 2", sheet: {} },
  ]);

  const handlePreviousWeek = () => {
    setStartDate((currDate) => dateOffset(currDate, -7));
  };

  const handleNextWeek = () => {
    setStartDate((currDate) => dateOffset(currDate, 7));
  };

  const getValue = (index: number, date: Date) => {
    const key = date.toLocaleDateString("en-US");
    return data[index].sheet[key] ?? "";
  };

  const setValue = (index: number, date: Date, value: string) => {
    const key = date.toLocaleDateString("en-US");
    setData((prevData) => {
      const newData = [...prevData];
      if (value === "") delete newData[index].sheet[key]; // remove key if empty
      else newData[index].sheet[key] = value;
      return newData;
    });
  };

  const handleAddRow = () => {
    setData([
      ...data,
      {
        project: `Project ${data.length + 1}`,
        sheet: {},
      },
    ]);
  };

  const handleDeleteRow = (index: number) => {
    setData((prevData) => {
      const updatedData = [...prevData];
      updatedData.splice(index, 1);
      return updatedData;
    });
  };

  const getTotal = (index: number, dates: []) => {
    return dates.reduce((total, date) => {
      const val = 1 * getValue(index, date);
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
          <GridItem area="main">
            <Box paddingLeft={2}>
              <Button onClick={handlePreviousWeek}>Previous Week</Button>
              {` ${weekDates[0].toLocaleDateString(
                "en-US"
              )} - ${weekDates[6].toLocaleDateString("en-US")} `}
              <Button onClick={handleNextWeek}>Next Week</Button>
              <TableContainer>
                <Table>
                  <Thead>
                    <Tr>
                      <Th>Project</Th>
                      {weekDates.map((day) => (
                        <Th key={day}>
                          {day.toLocaleDateString("en-US", weekDayFormat)}
                        </Th>
                      ))}
                      <Th>Total</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data.map((item, index) => (
                      <Tr key={index}>
                        <Td>{item.project}</Td>
                        {weekDates.map((date) => (
                          <Td key={date}>
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
                          <Button onClick={() => handleDeleteRow(index)}>
                            Delete
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                    <Tr>
                      <Td></Td>
                      {weekDates.map((day) => (
                        <Th key={day}>
                          {day.toLocaleDateString("en-US", weekDayFormat)}
                        </Th>
                      ))}
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
              <button onClick={handleAddRow}>Add New Project</button>
            </Box>
          </GridItem>
        </Grid>
      </main>
    </>
  );
};

export default Timesheet;