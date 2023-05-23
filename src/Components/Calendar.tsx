import dayjs from "dayjs";
import {
  Calendar as BigCalendar,
  type CalendarProps,
  dayjsLocalizer,
} from "react-big-calendar";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import isLeapYear from "dayjs/plugin/isLeapYear";
import "dayjs/locale/sv";
import { Box } from "@chakra-ui/react";
import React from "react";

dayjs.extend(isLeapYear);
dayjs.locale("sv");

const localizer = dayjsLocalizer(dayjs);

interface EventData {
  start: Date;
  end: Date;
  title: string;
}

interface CustomCalendarProps
  extends Omit<CalendarProps<EventData>, "localizer"> {
  onSelectEvent: (
    event: EventData,
    e: React.SyntheticEvent<HTMLElement, Event>
  ) => void;
}

const Calendar = ({ onSelectEvent, ...props }: CustomCalendarProps) => {
  const handleEventClick = (
    event: EventData,
    e: React.SyntheticEvent<HTMLElement, Event>
  ) => {
    onSelectEvent(event, e);
  };

  return (
    <Box h="50rem">
      <BigCalendar
        {...props}
        localizer={localizer}
        onSelectEvent={handleEventClick}
      />
    </Box>
  );
};

export default Calendar;
