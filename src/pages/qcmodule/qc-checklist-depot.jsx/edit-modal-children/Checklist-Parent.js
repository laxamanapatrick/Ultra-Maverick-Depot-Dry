import React from "react";
import { Text, VStack } from "@chakra-ui/react";
import DocumentationRequirements from "./checklist-children/Documentation-Requirements";
import FoodHandlingDetails from "./checklist-children/Food-Handling-Details";
import Conformance from "./checklist-children/Conformance";
import OtherConformance from "./checklist-children/Other-Conformance";
import DeliveryVehicleCondition from "./checklist-children/Delivery-Vehicle-Condition";
import HygienePractices from "./checklist-children/Hygiene-Practices";
import Evaluation from "./checklist-children/Evaluation";
import Inspection from "./checklist-children/Inspection";
import ProductDetails from "./checklist-children/Product-Details";
import ProductType from "./checklist-children/Product-Type";
import DocumentDetails from "./checklist-children/Document-Details";

const ChecklistParent = () => {
  return (
    <>
      <Text
        fontSize="sm"
        textAlign="center"
        bgColor="secondary"
        color="white"
        w="full"
      >
        Checklist Information
      </Text>
      <VStack w="full" spacing={8} mx={0}>
        <DocumentationRequirements />
        <FoodHandlingDetails />
        <Conformance />
        <OtherConformance />
        <DeliveryVehicleCondition />
        <HygienePractices />
        {/* <Evaluation />
        <Inspection />
        <ProductDetails /> */}
        <ProductType />
        {/* <DocumentDetails /> */}
      </VStack>
    </>
  );
};

export default ChecklistParent;
