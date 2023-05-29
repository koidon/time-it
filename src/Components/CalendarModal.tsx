import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import ProjectChooserMenu from "~/Components/ProjectChooserMenu";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";
import { round } from "~/utils/round-number";
import dayjs from "dayjs";

interface Props {
  hours: number;
  date: Date;
  currentWeek: Date;
  isOpen: boolean;
  onClose: () => void;
}

const CalendarModal = ({
  hours,
  date,
  currentWeek,
  isOpen,
  onClose,
}: Props) => {
  const [selectedProject, setSelectedProject] = useState("Choose project");
  const { data: timeSheetSegment, refetch: refetchData } =
    api.timeSheetSegment.getAll.useQuery();

  const createWorkSegment = api.workSegmentRouter.workSegmentCreate.useMutation(
    {
      onSuccess: () => {
        void refetchData();
      },
      onError: () => {
        toast.error("Time entry can't be bigger than 24 or less than 0.");
      },
    }
  );

  const handleOnSelectProject = (project: string) => {
    const key = date.toLocaleDateString("en-SE");

    // Find the timeSheetSegment with the matching project name and current week
    const selectedTimeSheetSegment = timeSheetSegment?.find(
      (segment) =>
        segment.projectName === project &&
        segment.currentWeek === currentWeek.toLocaleDateString("en-SE")
    );

    if (selectedTimeSheetSegment) {
      // Find the workSegment with the matching date inside the selectedTimeSheetSegment
      const selectedWorkSegment = selectedTimeSheetSegment.workSegments.find(
        (workSegment) => workSegment.date === key
      );

      if (selectedWorkSegment) {
        const { id, timeSheetSegmentId } = selectedWorkSegment;

        createWorkSegment.mutate({
          id: id,
          timeSheetSegmentId: timeSheetSegmentId ?? "",
          hoursWorked: selectedWorkSegment.hoursWorked + round(hours, 0.5),
          date: key,
          week: dayjs(key).week().toString(),
        });
      } else {
        const { id } = selectedTimeSheetSegment;

        createWorkSegment.mutate({
          id: "",
          timeSheetSegmentId: id,
          hoursWorked: round(hours, 0.5),
          date: key,
          week: dayjs(key).week().toString(),
        });
      }
    }

    setSelectedProject(project);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Choose the project you want to log time to</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <ProjectChooserMenu
              buttonName={selectedProject}
              onSelectProject={(project) =>
                handleOnSelectProject(project.projectName)
              }
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CalendarModal;
