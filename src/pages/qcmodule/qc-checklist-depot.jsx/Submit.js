import React from "react";
import { Button, ButtonGroup } from "@chakra-ui/react";

const SubmitButton = ({
  onClose,
  fetchPo,
  fetchNotification,
  submitReceiving,
  rejectionInformation,
  documentationChecklist,
  foodHandlingDetails,
  conformanceDetails,
  otherConformanceDetails,
  deliveryDetails,
  hygieneDetails
}) => {
  const handleSubmit = () => {
    console.log(
      ["Receiving", submitReceiving],
      ["Rejection", rejectionInformation],
      ["Documentation", documentationChecklist],
      ["Food Handling", foodHandlingDetails],
      ["Conformance", conformanceDetails],
      ["Other Conformance", otherConformanceDetails],
      ["Delivery Condition", deliveryDetails],
      ["Hygiene Details", hygieneDetails]
    );
  };
  return (
    <ButtonGroup size="md">
      <Button colorScheme="blue" onClick={handleSubmit}>
        Yes
      </Button>
      <Button colorScheme="red" onClick={onClose}>
        No
      </Button>
    </ButtonGroup>
  );
};

export default SubmitButton;
