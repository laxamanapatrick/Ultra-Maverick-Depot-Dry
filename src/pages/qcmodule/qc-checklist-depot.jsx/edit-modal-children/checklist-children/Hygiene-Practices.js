import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Input,
  Radio,
  Table,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { hygienePracticesData } from "./checklistData-partTwo";
import { ReceivingContext } from "../../../../../context/ReceivingContext";

const HygienePractices = () => {
  const { setHygieneDetails, remarksParent, setRemarksParent } =
    useContext(ReceivingContext);

  const [checklistValues, setChecklistValues] = useState(
    Object.fromEntries(hygienePracticesData.map((item) => [item.id, ""]))
  );

  const generateSubmittedData = () => {
    const submittedData = [];
    hygienePracticesData.forEach((item) => {
      if (item.details in checklistValues || checklistValues[item.id] !== "") {
        let value;
        if (item.type === "radio") {
          value =
            item.id in checklistValues
              ? checklistValues[item.id]
              : checklistValues[item.details];
        } else {
          value = checklistValues[item.details];
        }
        const camelCaseItemDetails = item.details
          // .toLowerCase()
          // .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
        submittedData.push({
          [camelCaseItemDetails]: value,
        });
      }
    });
    return submittedData;
  };

  useEffect(() => {
    const submittedData = generateSubmittedData();
    setHygieneDetails(submittedData);
  }, [checklistValues, hygienePracticesData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    let selectedValue;
    if (event.target.type === "radio") {
      selectedValue = value === "true";
    } else {
      selectedValue = value;
    }
    setChecklistValues({
      ...checklistValues,
      [name]: selectedValue,
    });
  };

  const isPreviousSelected = (index) => {
    if (index <= 0) {
      return false;
    }

    const previousItem = hygienePracticesData[index - 1];
    const previousItemValue = checklistValues[previousItem.id];

    if (previousItem.type === "radio" && previousItemValue === "") {
      return true;
    }

    return false;
  };

  return (
    <Box w="98%" border="1px solid gray" borderRadius="5px">
      <Text
        w="full"
        mb={2}
        fontSize="sm"
        textAlign="start"
        bgColor="secondary"
        color="white"
      >
        Hygiene Practices
      </Text>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Details</Th>
            <Th>Parameters</Th>
          </Tr>
        </Thead>
        <Tbody>
          {hygienePracticesData.map((item, index) => (
            <Tr key={index}>
              <Td>{item.details}</Td>
              <Td>
                {item.type === "radio" ? (
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      position: "relative",
                    }}
                  >
                    <Radio
                      name={item.id}
                      value="true"
                      onChange={handleChange}
                      isChecked={checklistValues[item.id] === true}
                      isDisabled={isPreviousSelected(index)}
                      focusBorderColor="blue.500"
                    >
                      Yes
                    </Radio>
                    <Radio
                      name={item.id}
                      value="false"
                      onChange={handleChange}
                      isChecked={checklistValues[item.id] === false}
                      isDisabled={isPreviousSelected(index)}
                      focusBorderColor="blue.500"
                    >
                      No
                    </Radio>
                  </div>
                ) : (
                  <Input
                    name={item.details}
                    placeholder="Input Value"
                    onChange={handleChange}
                  />
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Box m={2}>
        <Textarea
          placeholder="Additional Remarks here"
          borderColor="blackAlpha.400"
          onChange={(e) =>
            setRemarksParent({
              documentationRemarks: remarksParent.documentationRemarks,
              foodHandlingRemarks: remarksParent.foodHandlingRemarks,
              otherConformanceRemarks: remarksParent.otherConformanceRemarks,
              deliveryVehicleRemarks: remarksParent.deliveryVehicleRemarks,
              hygieneRemarks: e.target.value,
            })
          }
        />
      </Box>
    </Box>
  );
};

export default HygienePractices;
