import React from "react";
import { ResponsivePie } from "@nivo/pie";
import { api } from "~/utils/api";

const PieChart = () => {
  const { data: timeSheetSegments } = api.timeSheetSegment.getAll.useQuery();

  const totalHoursByProject: Record<string, number> = {};

  timeSheetSegments?.forEach((item) => {
    const projectName = item.projectName;
    const hoursWorked = item.workSegments.reduce(
      (acc, segment) => acc + segment.hoursWorked,
      0
    );

    if (totalHoursByProject.hasOwnProperty(projectName)) {
      totalHoursByProject[projectName] += hoursWorked;
    } else {
      totalHoursByProject[projectName] = hoursWorked;
    }
  });

  // Convert the totalHoursByProject object into an array of objects
  const projectHoursArray = Object.entries(totalHoursByProject).map(
    ([projectName, hours]) => ({
      id: projectName,
      label: projectName,
      value: hours,
      color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
    })
  );

  // Sort the projectHoursArray in descending order based on hours worked
  projectHoursArray.sort((a, b) => b.value - a.value);

  // Get the top 5 projects with the most hours worked
  const top5Projects = projectHoursArray.slice(0, 5);

  console.log(top5Projects);

  return (
    <>
      <ResponsivePie
        data={top5Projects}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        activeOuterRadiusOffset={8}
        borderWidth={1}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsRadiusOffset={0.55}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
          from: "color",
          modifiers: [["darker", 1.8]],
        }}
        defs={[
          {
            id: "dots",
            type: "patternDots",
            background: "inherit",
            color: "rgba(255, 255, 255, 0.3)",
            size: 4,
            padding: 1,
            stagger: true,
          },
          {
            id: "lines",
            type: "patternLines",
            background: "inherit",
            color: "rgba(255, 255, 255, 0.3)",
            rotation: -45,
            lineWidth: 6,
            spacing: 10,
          },
        ]}
        fill={[
          {
            match: {
              id: "ruby",
            },
            id: "dots",
          },
          {
            match: {
              id: "c",
            },
            id: "dots",
          },
          {
            match: {
              id: "go",
            },
            id: "dots",
          },
          {
            match: {
              id: "python",
            },
            id: "dots",
          },
          {
            match: {
              id: "scala",
            },
            id: "lines",
          },
          {
            match: {
              id: "lisp",
            },
            id: "lines",
          },
          {
            match: {
              id: "elixir",
            },
            id: "lines",
          },
          {
            match: {
              id: "javascript",
            },
            id: "lines",
          },
        ]}
        legends={[
          {
            anchor: "bottom",
            direction: "row",
            justify: false,
            translateX: 0,
            translateY: 56,
            itemsSpacing: 0,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: "#999",
            itemDirection: "left-to-right",
            itemOpacity: 1,
            symbolSize: 18,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: "#000",
                },
              },
            ],
          },
        ]}
      />
    </>
  );
};

export default PieChart;
