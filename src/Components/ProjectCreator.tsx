import React, { useState } from "react";
import AsyncSelect from "react-select/async";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Input,
  Button,
} from "@chakra-ui/react";
import type { User } from "@clerk/backend";
import type { MultiValue } from "react-select";
import { api } from "~/utils/api";

interface Props {
  users: User[];
}

interface Option {
  label: string;
  value: string;
}

interface Employee {
  userId: string;
}

const ProjectCreator = ({ users }: Props) => {
  const [input, setInput] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<Employee[]>([]);

  const createProject = api.project.projectCreate.useMutation();

  const options = users?.map((user) => ({
    label: user.username
      ? user.username
      : `${user.firstName ?? ""} ${user.lastName ?? ""}`,
    value: user.id,
  }));

  const handleChange = (selectedOption: MultiValue<Option>) => {
    const newArray = selectedOption.map(({ value: userId }) => ({
      userId,
    }));
    setSelectedOptions(newArray);
  };

  const handleSubmit = () => {
    createProject.mutate({
      projectName: input,
      employees: selectedOptions,
    });
  };

  const loadOptions = (
    searchValue: string,
    callback: (options: Option[]) => void
  ) => {
    const filteredOptions = options?.filter((option) =>
      option.label.toLowerCase().includes(searchValue.toLowerCase())
    );
    callback(filteredOptions);
  };

  return (
    <Accordion>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box as="span" flex="1" textAlign="left">
              Create Project
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4} h="auto">
          <Box h="calc(100vh)">
            <Input
              placeholder="Enter name for new project"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <AsyncSelect
              loadOptions={loadOptions}
              defaultOptions
              placeholder="Add employess to project"
              isMulti
              cacheOptions
              onChange={handleChange}
            />
            <Button onClick={handleSubmit}>Submit</Button>
          </Box>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default ProjectCreator;
