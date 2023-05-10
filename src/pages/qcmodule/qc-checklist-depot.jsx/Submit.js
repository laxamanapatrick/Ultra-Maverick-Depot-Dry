import React from "react";
import {
  Button,
  ButtonGroup,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  VStack,
  Text,
  Stack,
  Flex,
} from "@chakra-ui/react";
import { RiErrorWarningLine } from "react-icons/ri";
import SubmitConfirmation from "./Submit-Confirmation";

const SubmitButton = ({
  onClose,
  fetchPo,
  fetchNotification,
  editData,
  submitReceiving,
  rejectionInformation,
  totalReject,
  documentationChecklist,
  foodHandlingDetails,
  conformanceDetails,
  otherConformanceDetails,
  deliveryDetails,
  hygieneDetails,
  productType,
  remarksParent
}) => {
  //Receiving Information
  function checkEmptyReceiving(fields) {
    return (
      // fields.manufacturingDate === "" ||
      fields.expiryDate === "" || 
      fields.expectedDelivery === "" ||
      fields.actualQuantityDelivered === "" ||
      fields.monitoredBy === ""
    );
  }
  const hasEmptyReceiving = checkEmptyReceiving(submitReceiving);

  //Documentation Checklist
  function validateDocumentationLength(variable) {
    if (variable?.length != 9) {
      return true;
    } else {
      return false;
    }
  }
  const hasEmptyChecklist = validateDocumentationLength(documentationChecklist);

  //Food Handling
  const hasEmptyCheckbox =
    foodHandlingDetails &&
    !Object.values(foodHandlingDetails).every((value, index) => {
      if (index === 6 && typeof value === "boolean") {
        return true;
      }
      return (
        Object.keys(value).length !== 0 &&
        Object.entries(value).every((item) => {
          const [key, value] = item;
          return value.length !== 0;
        })
      );
    });

  //Conformance Details
  // const hasConformanceCount =
  //   conformanceDetails && Object.keys(conformanceDetails).length !== 7;
  // const hasConformanceEmpty =
  //   conformanceDetails &&
  //   Object.keys(conformanceDetails).some(
  //     (key) => conformanceDetails[key].trim() === ""
  //   );
  // const hasEmptyConformance = hasConformanceCount || hasConformanceEmpty;

  //Other Conformance Details
  function validateOtherConformanceLength(variable) {
    if (variable?.length != 11) {
      return true;
    } else {
      return false;
    }
  }
  const hasEmptyOtherConformance = validateOtherConformanceLength(
    otherConformanceDetails
  );

  //Delivery Vehicle Condition
  function validateDeliveryLength(variable) {
    if (variable?.length != 4) {
      return true;
    } else {
      return false;
    }
  }
  const hasDeliveryCount = validateDeliveryLength(deliveryDetails);
  // const hasDeliveryEmpty = deliveryDetails?.some((item) => {
  //   for (const property in item) {
  //     if (item[property] === "") {
  //       return true;
  //     }
  //   }
  //   return false;
  // });
  const hasEmptyDelivery = hasDeliveryCount 
  // || hasDeliveryEmpty;

  //Hygiene Practices
  function validateHygieneLength(variable) {
    if (variable?.length != 6) {
      return true;
    } else {
      return false;
    }
  }
  const hasHygieneCount = validateHygieneLength(hygieneDetails);
  const hasHygieneEmpty = hygieneDetails?.some((item) => {
    for (const property in item) {
      if (item[property] === "") {
        return true;
      }
    }
    return false;
  });
  const hasEmptyHygiene = hasHygieneCount || hasHygieneEmpty;

  //Product Type
  const hasEmptyProductType = !productType;

  //Final Validation for button
  const hasEmptyField =
    hasEmptyReceiving ||
    hasEmptyChecklist ||
    hasEmptyCheckbox ||
    // hasEmptyConformance ||
    hasEmptyOtherConformance ||
    hasEmptyDelivery ||
    hasEmptyHygiene ||
    hasEmptyProductType;

  // const checkValidation = () => {
  //   console.log("Receiving Has Empty", hasEmptyReceiving);
  //   console.log("Documentation Checklist", hasEmptyChecklist);
  //   console.log("Food Handling Checkboxes", hasEmptyCheckbox);
  //   console.log("Conformance Count", hasEmptyConformance);
  //   console.log("Other Conformance", hasEmptyOtherConformance);
  //   console.log("Delivery Vehicle", hasEmptyDelivery);
  //   console.log("Hygiene Practices", hasEmptyHygiene);
  //   console.log("Product Type", hasEmptyProductType);
  //   console.log("Final Boolean", hasEmptyField);
  // };

  const {
    isOpen: isConfirmation,
    onClose: closeConfirmation,
    onOpen: openConfirmation,
  } = useDisclosure();
  const {
    isOpen: isCancel,
    onClose: closeCancel,
    onOpen: openCancel,
  } = useDisclosure();

  return (
    <ButtonGroup size="md">
      <Button
        colorScheme="blue"
        title={
          hasEmptyField
            ? "All blank fields must be filled before proceeding"
            : ""
        }
        disabled={hasEmptyField}
        onClick={openConfirmation}
      >
        Proceed
      </Button>
      <Button colorScheme="red" onClick={openCancel}>
        Cancel
      </Button>

      {isConfirmation && (
        <SubmitConfirmation
          isConfirmation={isConfirmation}
          closeEditModal={onClose}
          closeConfirmation={closeConfirmation}
          fetchPo={fetchPo}
          fetchNotification={fetchNotification}
          editData={editData}
          submitReceiving={submitReceiving}
          rejectionInformation={rejectionInformation}
          totalReject={totalReject}
          documentationChecklist={documentationChecklist}
          foodHandlingDetails={foodHandlingDetails}
          conformanceDetails={conformanceDetails}
          otherConformanceDetails={otherConformanceDetails}
          deliveryDetails={deliveryDetails}
          hygieneDetails={hygieneDetails}
          productType={productType}
          remarksParent={remarksParent}
        />
      )}

      {isCancel && (
        <CancelModal
          isOpen={isCancel}
          onClose={closeCancel}
          closeEditModal={onClose}
        />
      )}
    </ButtonGroup>
  );
};

export default SubmitButton;

const CancelModal = ({ isOpen, onClose, closeEditModal }) => {
  const closeHandler = () => {
    onClose();
    closeEditModal();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => {}} isCentered size="2xl">
        <ModalContent bgColor="primary">
          <ModalHeader></ModalHeader>
          <ModalCloseButton color="white" onClick={onClose} />
          <ModalBody>
            <VStack>
              <Stack alignItems="center">
                <RiErrorWarningLine color='yellow' fontSize='100px' />
                <Text fontSize="sm" color="white">
                  Your progress won't be saved.
                </Text>
              </Stack>
              <Text fontSize="lg" color="white">
                Are you sure you want to cancel?
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup size="md">
              <Button colorScheme='blue' onClick={closeHandler}>Yes</Button>
              <Button colorScheme='red' onClick={onClose}>No</Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
