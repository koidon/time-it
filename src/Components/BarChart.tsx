import React from "react";
import { ResponsiveBar } from "@nivo/bar";
import { api } from "~/utils/api";

interface Props {
  layout: "horizontal" | "vertical" | undefined;
}

const weekDayFormat: Intl.DateTimeFormatOptions = {
  weekday: "short",
  month: "long",
  day: "numeric",
};

const dateOffset = (date: Date, offset: number) => {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + offset);
  return newDate;
};

const getFirstDayOfWeek = (date: Date) => {
  const day = (date.getDay() + 6) % 7; // Monday is the first day of week
  return dateOffset(date, -day);
};

const BarChart = ({ layout }: Props) => {
  const { data: timeSheetSegments, isLoading } =
    api.timeSheetSegment.getAll.useQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const startDate = getFirstDayOfWeek(new Date()); // Assuming the input is sorted by currentWeek

  const weekDays = Array.from({ length: 7 }, (_, i) =>
    dateOffset(startDate, i)
  );

  const results = weekDays.map((day) => {
    const currentDate = new Date(startDate.getTime());
    const totalHours =
      timeSheetSegments?.reduce((sum, obj) => {
        const workSegments = obj.workSegments || [];
        const hoursWorked = workSegments
          .filter((segment) => {
            const segmentDate = new Date(segment.date);
            return currentDate.getDate() === segmentDate.getDate();
          })
          .reduce((segmentSum, segment) => segmentSum + segment.hoursWorked, 0);
        return sum + hoursWorked;
      }, 0) ?? 0;
    startDate.setDate(startDate.getDate() + 1); // Increment the current date to the next day
    return {
      date: day.toLocaleDateString("en-SE", weekDayFormat),
      value: totalHours,
    };
  });

  // Display the results
  return (
    <ResponsiveBar
      data={results}
      layout={layout}
      keys={["value"]}
      indexBy="date"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      colors="#4472C4"
      borderColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
      }}
      enableLabel={true}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
    />
  );
};

export default BarChart;
