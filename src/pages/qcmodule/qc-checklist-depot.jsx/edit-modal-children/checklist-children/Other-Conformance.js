import React, { useContext, useEffect, useState } from "react";
import {
  Box,
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
import { otherConformanceData } from "./checklistsData";
import { ReceivingContext } from "../../../../../context/ReceivingContext";

const OtherConformance = () => {
  const { setOtherConformanceDetails, remarksParent, setRemarksParent } = useContext(ReceivingContext);

  const [checklistValues, setChecklistValues] = useState(
    Object.fromEntries(otherConformanceData.map((item) => [item.id, false]))
  );

  const generateSubmittedData = (values) => {
    const submittedData = [];
    otherConformanceData.forEach((item) => {
      if (item.details === name || values[item.details] != null) {
        const camelCaseItemDetails = item.details
          // .toLowerCase()
          // .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
        submittedData.push({
          [camelCaseItemDetails]: values[item.details] || false,
        });
      }
    });
    return submittedData;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const selectedValue = value === "true";
    setChecklistValues({
      ...checklistValues,
      [name]: selectedValue,
    });
    const submittedData = generateSubmittedData({
      ...checklistValues,
      [name]: selectedValue,
    });
    setOtherConformanceDetails(submittedData);
  };

  const isPreviousSelected = (index) => {
    if (index === 0) {
      return false;
    }
    for (let i = 0; i < index; i++) {
      if (checklistValues[otherConformanceData[i].details] == null) {
        return true;
      }
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
        Other Conformance Parameters on Product Condition/s
      </Text>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Details</Th>
            <Th>Parameters</Th>
          </Tr>
        </Thead>
        <Tbody>
          {otherConformanceData.map((item, index) => (
            <Tr key={index}>
              <Td>{item.details}</Td>
              <Td>
                <div
                  style={{ display: "flex", gap: "10px", position: "relative" }}
                >
                  <Radio
                    name={item.details}
                    value="true"
                    onChange={handleChange}
                    isChecked={checklistValues[item.details] === true}
                    isDisabled={isPreviousSelected(index)}
                    focusBorderColor="blue.500"
                  >
                    Yes
                  </Radio>
                  <Radio
                    name={item.details}
                    value="false"
                    onChange={handleChange}
                    isChecked={checklistValues[item.details] === false}
                    isDisabled={isPreviousSelected(index)}
                    focusBorderColor="blue.500"
                  >
                    No
                  </Radio>
                </div>
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
              otherConformanceRemarks: e.target.value,
              deliveryVehicleRemarks: remarksParent.deliveryVehicleRemarks,
              hygieneRemarks: remarksParent.hygieneRemarks,
            })
          }
        />
      </Box>
    </Box>
  );
};

export default OtherConformance;
