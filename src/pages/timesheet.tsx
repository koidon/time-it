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
  Tooltip,
  Heading,
} from "@chakra-ui/react";
import NavBar from "~/Components/NavBar";
import SideBar from "~/Components/SideBar";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";
import { round } from "~/utils/round-number";
import ProjectChooserMenu from "~/Components/ProjectChooserMenu";
import HamburgerMenu from "~/Components/HambugerMenu";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import EditTimesheet from "~/Components/EditTimesheet";
import EditTimeSheetSegment from "~/Components/EditTimeSheetSegment";
import Corrections from "~/Components/Corrections";

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
  const [startDate, setStartDate] = useState(getFirstDayOfWeek(new Date()));
  const isFutureStartDate = useMemo(() => startDate > new Date(), [startDate]);
  const [searchString, setSearchString] = useState("");

  const ctx = api.useContext();

  const { data: timeSheetSegment, refetch: refetchData } =
    api.timeSheetSegment.getAll.useQuery();

  const { data: workSegments } = api.workSegmentRouter.getAll.useQuery();

  const { data: flexHours } = api.workSegmentRouter.getAllFlexHours.useQuery();

  const createWorkSegment = api.workSegmentRouter.workSegmentCreate.useMutation(
    {
      onSuccess: () => {
        void ctx.timeSheetSegment.getAll.invalidate();
        void ctx.workSegmentRouter.getAll.invalidate();
        void ctx.workSegmentRouter.getAllFlexHours.invalidate();
      },
      onError: () => {
        toast.error("Time entry can't be bigger then 24 or less then 0.");
      },
    }
  );

  const deleteWorkSegment = api.workSegmentRouter.workSegmentDelete.useMutation(
    {
      onSuccess: () => {
        void ctx.timeSheetSegment.getAll.invalidate();
        void ctx.workSegmentRouter.getAll.invalidate();
        void ctx.workSegmentRouter.getAllFlexHours.invalidate();
      },
    }
  );

  const deleteAllWorkSegments =
    api.workSegmentRouter.workSegmentDeleteAll.useMutation({
      onSuccess: () => {
        void ctx.timeSheetSegment.getAll.invalidate();
      },
    });

  const deleteWorkSegmentRow =
    api.workSegmentRouter.workSegmentDeleteRow.useMutation({
      onSuccess: () => {
        void ctx.timeSheetSegment.getAll.invalidate();
      },
    });

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

  const deleteAllTimeSheetSegments =
    api.timeSheetSegment.timeSheetSegmentDeleteAll.useMutation({
      onSuccess: () => {
        void ctx.timeSheetSegment.getAll.invalidate();
      },
    });

  const createFlexHours = api.workSegmentRouter.flexHoursCreate.useMutation({
    onSuccess: () => {
      void ctx.workSegmentRouter.getAllFlexHours.invalidate();
    },
  });

  const deleteFlexHours = api.workSegmentRouter.flexHoursDelete.useMutation({
    onSuccess: () => {
      void ctx.workSegmentRouter.getAllFlexHours.invalidate();
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
    (project) =>
      project.projectName.toLowerCase().includes(searchString.toLowerCase()) &&
      project.currentWeek === startDate.toLocaleDateString("en-SE")
  );

  // Add an extra object for the "Flex" project
  const flexProject = {
    id: "flex-id", // Assign a unique ID for the Flex project
    projectName: "🕛 Flex",
    currentWeek: startDate.toLocaleDateString("en-SE"),
    workSegments: {},
  };

  // Add the flexProject to the filteredObj array
  if (!filteredObj?.some((project) => project.projectName === "Flex")) {
    filteredObj?.push(flexProject);
  }

  const handlePreviousWeek = () => {
    setStartDate((currDate) => dateOffset(currDate, -7));
  };

  const handleNextWeek = () => {
    setStartDate((currDate) => dateOffset(currDate, 7));
  };

  const getValue = (index: number, date: Date) => {
    const key = date.toLocaleDateString("en-SE");
    const projectName = filteredObj?.[index]?.projectName;
    const workSegments = filteredObj?.[index]?.workSegments;

    if (projectName === "🕛 Flex" && flexHours) {
      const flexSegment = flexHours.find((segment) => segment.date === key);
      return flexSegment?.flexHours ?? "";
    }

    if (workSegments) {
      return workSegments[key]?.hoursWorked ?? "";
    }

    return date >= startDate ? "" : "";
  };

  const setValue = (
    index: number,
    date: Date,
    projectName: string,
    value: string
  ) => {
    const key = date.toLocaleDateString("en-SE");
    const timeSheetSegmentId = filteredObj?.[index]?.id;
    const workSegmentId = filteredObj?.[index]?.workSegments[key]?.id;
    const currentFlex = flexHours?.find((segment) => segment.date === key);

    if (projectName === "🕛 Flex") {
      if (value.length === 0) {
        if (currentFlex !== undefined) {
          deleteFlexHours.mutate({
            id: currentFlex?.id,
          });
        }
      } else {
        createFlexHours.mutate({
          id: currentFlex?.id ?? "",
          flexHours: round(parseFloat(value), 0.5),
          date: key,
          week: dayjs(key).week().toString(),
        });
      }
      return;
    }

    if (value.length === 0) {
      // Delete the work segment if the value is empty
      if (workSegmentId !== undefined) {
        deleteWorkSegment.mutate({
          id: workSegmentId,
        });
      }
    } else {
      createWorkSegment.mutate({
        id: workSegmentId ?? "",
        timeSheetSegmentId: timeSheetSegmentId ?? "",
        hoursWorked: round(parseFloat(value), 0.5),
        date: key,
        week: dayjs(key).week().toString(),
      });
    }
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

  const handleClearText = (timeSheetSegmentId: string) => {
    deleteWorkSegmentRow.mutate({
      timeSheetSegmentId: timeSheetSegmentId,
    });
  };

  const handleDeleteAllRows = (currentWeek: string) => {
    deleteAllTimeSheetSegments.mutate({
      currentWeek: currentWeek,
    });
  };

  const handleClearAllText = () => {
    deleteAllWorkSegments.mutate({
      week: dayjs(startDate).week().toString(),
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

  const getTimeSheetTotal = () => {
    if (!filteredObj) return { total: 0, excess: 0 };

    let total = 0;
    let excess = 0;

    filteredObj.forEach((item, index) => {
      if (item.projectName !== "🕛 Flex") {
        const projectTotal = getTotal(index, weekDates);
        const remaining = 40 - total;
        if (projectTotal <= remaining) {
          total += projectTotal;
        } else {
          total += remaining;
          excess += projectTotal - remaining;
        }
      }
    });

    return { total, excess };
  };

  const result = getTimeSheetTotal();

  const getExcessTotal = () => {
    // Calculate total excess hours
    let totalExcess = 0;

    // Accumulate excess hours by week
    const excessHoursByWeek: Record<string, number> = {};

    // Group workSegments by week
    const workSegmentsByWeek: Record<string, number[]> = {};
    workSegments?.forEach((segment) => {
      const { week, hoursWorked } = segment;
      if (week in workSegmentsByWeek) {
        workSegmentsByWeek?.[week]?.push(hoursWorked);
      } else {
        workSegmentsByWeek[week] = [hoursWorked];
      }
    });

    // Calculate excess hours for each week
    Object.entries(workSegmentsByWeek).forEach(([week, hoursWorkedArray]) => {
      const totalHoursWorked = hoursWorkedArray.reduce(
        (acc, curr) => acc + curr,
        0
      );
      const excessHours = totalHoursWorked > 40 ? totalHoursWorked - 40 : 0;
      totalExcess += excessHours;
      excessHoursByWeek[week] = excessHours;
    });

    return totalExcess; // Return the calculated total excess hours
  };

  const calculateTotalFlex = () => {
    let totalFlexHours = 0;
    flexHours?.forEach((item) => {
      totalFlexHours += item.flexHours;
    });

    return getExcessTotal() - totalFlexHours;
  };

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
          <SignedIn>
            <GridItem area="main" justifySelf="center">
              <Center>
                <Heading size="lg" color="#0070AD">
                  Timesheet
                </Heading>
              </Center>
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
                  <Tooltip hasArrow label="Previous week">
                    <Button size="sm" mr={5} onClick={handlePreviousWeek}>
                      {<ArrowBackIcon />}
                    </Button>
                  </Tooltip>
                  <Tooltip hasArrow label="Next week">
                    <Button size="sm" onClick={handleNextWeek}>
                      {<ArrowForwardIcon />}
                    </Button>
                  </Tooltip>
                </Box>
              </Flex>
              <Box w={[375, 480, 768, 992, 1000, 1200]}>
                <TableContainer borderRadius={5} mt={5}>
                  <Table size="sm" className="table-tiny" bg="#F8F8F8">
                    <Thead>
                      <Tr>
                        <Th borderRadius={5} p={4} bg="#A9C1EC">
                          <Tooltip
                            hasArrow
                            label="Projects that you have added to your timesheet for the current week"
                          >
                            <Text
                              textAlign="center"
                              color="#000000"
                              fontSize="15px"
                            >
                              PROJECT
                            </Text>
                          </Tooltip>
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
                          <Tooltip
                            hasArrow
                            label="Total hours worked for the current week"
                          >
                            <Text
                              pl={5}
                              pr={5}
                              textAlign="center"
                              color="#000000"
                              fontSize="15px"
                            >
                              TOTAL
                            </Text>
                          </Tooltip>
                        </Th>
                        <Th borderRadius={5} borderLeftRadius={0} ml={5}>
                          <Box>
                            <EditTimesheet
                              buttonName="Edit All"
                              menuDeleteName="Delete All Projects"
                              menuClearName="Clear All Text"
                              handleDeleteAllRows={() =>
                                handleDeleteAllRows(
                                  startDate.toLocaleDateString("en-SE")
                                )
                              }
                              handleClearAllText={handleClearAllText}
                            />
                          </Box>
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredObj?.map((item, segmentIndex) => (
                        <Tr key={segmentIndex}>
                          <Td>{item.projectName}</Td>
                          {weekDates.map((date, dateIndex) =>
                            dateIndex === 5 || dateIndex === 6 ? (
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
                                  defaultValue={getValue(segmentIndex, date)}
                                  onBlur={(e) =>
                                    setValue(
                                      segmentIndex,
                                      date,
                                      item.projectName,
                                      e.target.value
                                    )
                                  }
                                  disabled={isFutureStartDate}
                                  key={getValue(segmentIndex, date)}
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
                                  defaultValue={getValue(segmentIndex, date)}
                                  onBlur={(e) =>
                                    setValue(
                                      segmentIndex,
                                      date,
                                      item.projectName,
                                      e.target.value
                                    )
                                  }
                                  disabled={isFutureStartDate}
                                  key={getValue(segmentIndex, date)}
                                />
                              </Td>
                            )
                          )}
                          <Td>
                            <Center>{getTotal(segmentIndex, weekDates)}</Center>
                          </Td>
                          <Td>
                            <Center>
                              <EditTimeSheetSegment
                                menuDeleteName="Delete Project"
                                menuClearName="Clear Text"
                                handleDeleteRow={() =>
                                  handleDeleteRow(segmentIndex)
                                }
                                handleClearText={() => handleClearText(item.id)}
                              />
                            </Center>
                          </Td>
                        </Tr>
                      ))}
                      {filteredObj && filteredObj?.length > 7 && (
                        <Tr>
                          <Td></Td>
                          {weekDates.map((day) => (
                            <Th key={day.toISOString()}>
                              {day.toLocaleDateString("en-SE", weekDayFormat)}
                            </Th>
                          ))}
                        </Tr>
                      )}

                      <Tr bg="#A9C1EC">
                        <Td p={3}>
                          <ProjectChooserMenu
                            buttonName="Add project"
                            onSelectProject={(project) =>
                              handleAddRow(project.projectName)
                            }
                            buttonType="iconButton"
                          />
                          <Input
                            ml={5}
                            bg="#FFFFFF"
                            placeholder="Search trough added projects"
                            value={searchString}
                            onChange={(e) => setSearchString(e.target.value)}
                          />
                        </Td>
                        <Th colSpan={7}></Th>
                        <Td>
                          <Box position="relative">
                            <Tooltip hasArrow label="Hours woked over 40">
                              <Box
                                position="absolute"
                                bg="#95E616"
                                display="inline-block"
                                pl={2}
                                pr={2}
                                borderRadius={4}
                                right={-5}
                                zIndex={1}
                              >
                                +{result.excess}
                              </Box>
                            </Tooltip>
                            <Tooltip
                              hasArrow
                              label="Total hours worked for the current week"
                            >
                              <Text
                                borderRadius="20%"
                                textAlign="center"
                                p={3}
                                bg="#FFFFFF"
                              >
                                {result.total}/40h
                              </Text>
                            </Tooltip>
                          </Box>
                        </Td>
                        <Td></Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
                <Corrections flexHours={calculateTotalFlex()} />
              </Box>
            </GridItem>
          </SignedIn>
          <SignedOut>
            <h1>You must sign in</h1>
          </SignedOut>
        </Grid>
      </main>
    </>
  );
};

export default Timesheet;
