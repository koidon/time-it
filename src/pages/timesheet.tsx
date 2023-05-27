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
  Flex,
  Text,
  Center,
} from "@chakra-ui/react";
import NavBar from "~/Components/NavBar";
import SideBar from "~/Components/SideBar";
import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";
import { round } from "~/utils/round-number";
import ProjectChooserMenu from "~/Components/ProjectChooserMenu";
import HamburgerMenu from "~/Components/HambugerMenu";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";

dayjs.extend(weekOfYear);

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

interface WorkSegment {
  id: string;
  hoursWorked: number;
  timeSheetSegmentId: string | null;
}

const Timesheet = () => {
  const user = useUser();
  const [startDate, setStartDate] = useState(getFirstDayOfWeek(new Date()));
  const isFutureStartDate = useMemo(() => startDate > new Date(), [startDate]);

  const { data: timeSheetSegment, refetch: refetchData } =
    api.timeSheetSegment.getAll.useQuery();

  const createWorkSegment = api.workSegmentRouter.workSegmentCreate.useMutation(
    {
      onSuccess: () => {
        void refetchData();
      },
      onError: () => {
        toast.error("Time entry can't be bigger then 24 or less then 0.");
      },
    }
  );

  const deleteWorkSegment = api.workSegmentRouter.workSegmentDelete.useMutation(
    {
      onSuccess: () => {
        void refetchData();
      },
    }
  );

  const createTimeSheetSegment =
    api.timeSheetSegment.timeSheetSegmentCreate.useMutation({
      onSuccess: () => {
        void refetchData();
      },
    });

  const deleteTimeSheetSegment =
    api.timeSheetSegment.timeSheetSegmentDelete.useMutation({
      onSuccess: () => {
        void refetchData();
      },
    });

  const transformedObject = timeSheetSegment?.map(
    ({ id, currentWeek, projectName, workSegments }) => {
      const projectData: { [key: string]: WorkSegment } = workSegments.reduce(
        (
          projectResult: { [key: string]: WorkSegment },
          { id, date, hoursWorked, timeSheetSegmentId }
        ) => {
          const formattedDate = new Date(date).toLocaleDateString("en-SE");

          if (!projectResult[formattedDate]) {
            projectResult[formattedDate] = {
              id,
              hoursWorked,
              timeSheetSegmentId,
            };
          }

          return projectResult;
        },
        {}
      );

      return {
        id,
        projectName,
        currentWeek,
        workSegments: projectData,
      };
    }
  );

  const filteredObj = transformedObject?.filter(
    (project) => project.currentWeek === startDate.toLocaleDateString("en-SE")
  );

  const handlePreviousWeek = () => {
    setStartDate((currDate) => dateOffset(currDate, -7));
  };

  const handleNextWeek = () => {
    setStartDate((currDate) => dateOffset(currDate, 7));
  };

  const getValue = (index: number, date: Date) => {
    const key = date?.toLocaleDateString("en-SE");

    return filteredObj?.[index]?.workSegments[key]?.hoursWorked ?? "";
  };

  const setValue = (index: number, date: Date, value: string) => {
    const key = date.toLocaleDateString("en-SE");
    if (
      value.length === 0 &&
      filteredObj?.[index]?.workSegments[key]?.id !== undefined
    )
      deleteWorkSegment.mutate({
        id: filteredObj?.[index]?.workSegments[key]?.id ?? "",
      });

    value.length !== 0 &&
      createWorkSegment.mutate({
        id: filteredObj?.[index]?.workSegments[key]?.id ?? "",
        timeSheetSegmentId: filteredObj?.[index]?.id ?? "",
        hoursWorked: round(parseFloat(value), 0.5),
        date: key,
      });
  };

  const handleAddRow = (projectName: string) => {
    createTimeSheetSegment.mutate({
      projectName: projectName,
      currentWeek: startDate.toLocaleDateString("en-SE"),
    });
  };

  const handleDeleteRow = (index: number) => {
    deleteTimeSheetSegment.mutate({
      id: filteredObj?.[index]?.id ?? "",
    });
  };

  const getTotal = (index: number, dates: Date[]) => {
    return dates.reduce((total, date) => {
      const val = parseFloat(getValue(index, date).toString()) || 0;
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
          {!!user.isSignedIn && (
            <GridItem area="main" ml={5}>
              <Flex
                justifyContent="space-between"
                w={[375, 480, 768, 992, 1000, 1200]}
              >
                <Center>
                  <Text bg="#EDEDED" p={1} borderRadius={5} mr={5}>
                    V. {dayjs(startDate).week()}
                  </Text>
                  <Text bg="#EDEDED" p={1} borderRadius={5}>
                    {dayjs(startDate).format("MMMM YYYY")}
                  </Text>
                </Center>
                <Box>
                  <Button size="sm" mr={5} onClick={handlePreviousWeek}>
                    {<ArrowBackIcon />}
                  </Button>
                  <Button size="sm" onClick={handleNextWeek}>
                    {<ArrowForwardIcon />}
                  </Button>
                </Box>
              </Flex>
              <Box w={[375, 480, 768, 992, 1000, 1200]}>
                <TableContainer borderRadius={5} mt={5}>
                  <Table size="sm" className="table-tiny" bg="#F8F8F8">
                    <Thead>
                      <Tr>
                        <Th borderRadius={5} p={4} bg="#A9C1EC">
                          <Text textAlign="center" fontWeight="extrabold">
                            PROJECT
                          </Text>
                        </Th>
                        {weekDates.map((day) => (
                          <Th p={4} key={day.toISOString()}>
                            {day
                              .toLocaleDateString("en-SE", weekDayFormat)
                              .includes("Sat") ||
                            day
                              .toLocaleDateString("en-SE", weekDayFormat)
                              .includes("Sun") ? (
                              <Text color="#FF5F5F">
                                {day.toLocaleDateString("en-SE", weekDayFormat)}
                              </Text>
                            ) : (
                              day.toLocaleDateString("en-SE", weekDayFormat)
                            )}
                          </Th>
                        ))}
                        <Th borderRadius={5} p={4} bg="#A9C1EC">
                          <Text
                            pl={5}
                            pr={5}
                            textAlign="center"
                            fontWeight="extrabold"
                          >
                            TOTAL
                          </Text>
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredObj?.map((item, index) => (
                        <Tr key={index}>
                          <Td>{item.projectName}</Td>
                          {weekDates.map((date, index) =>
                            index === 5 || index === 6 ? (
                              <Td
                                bg="rgba(241, 139, 139, 0.1)"
                                key={date.toISOString()}
                                w={20}
                              >
                                <Input
                                  bg="#FFFFFF"
                                  borderRadius={5}
                                  p={5}
                                  w={20}
                                  size="sm"
                                  type="number"
                                  defaultValue={getValue(index, date)}
                                  onBlur={(e) =>
                                    setValue(index, date, e.target.value)
                                  }
                                  disabled={isFutureStartDate}
                                />
                              </Td>
                            ) : (
                              <Td key={date.toISOString()}>
                                <Input
                                  bg="#FFFFFF"
                                  borderRadius={5}
                                  p={5}
                                  w={20}
                                  size="sm"
                                  type="number"
                                  defaultValue={getValue(index, date)}
                                  onBlur={(e) =>
                                    setValue(index, date, e.target.value)
                                  }
                                  disabled={isFutureStartDate}
                                />
                              </Td>
                            )
                          )}
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
                          <Th key={day.toISOString()}>
                            {day.toLocaleDateString("en-SE", weekDayFormat)}
                          </Th>
                        ))}
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
                <ProjectChooserMenu
                  buttonName="Add project"
                  onSelectProject={(project) =>
                    handleAddRow(project.projectName)
                  }
                />
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
