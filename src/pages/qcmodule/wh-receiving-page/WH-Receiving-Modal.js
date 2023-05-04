import {
  Button,
  Input,
  Select,
  Stack,
  Text,
  useToast,
  VStack,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  PopoverFooter,
  ButtonGroup,
  Flex,
} from "@chakra-ui/react";
import React, { useEffect, useState, useCallback } from "react";
import apiClient from "../../../services/apiClient";
import PageScrollQCModal from "../../../components/PageScrollQCModal";
import { ToastComponent } from "../../../components/Toast";

export const ModalComponent = ({
  fetchWHReceiving,
  modalData,
  isOpen,
  onClose,
  fetchNotification,
}) => {
  const [reasons, setReasons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [submitReason, setSubmitReason] = useState("");
  const [submitRemarks, setSubmitRemarks] = useState("");

  const toast = useToast();

  const fetchReasonsApi = async () => {
    const res = await apiClient.get("Reason/GetAllActiveReason");
    return res.data;
  };

  const fetchReason = async () => {
    fetchReasonsApi().then((res) => {
      setReasons(res);
    });
  };

  useEffect(() => {
    fetchReason();
  }, [setReasons]);

  const reasonHandler = (data) => {
    setSubmitReason(data);
  };

  const remarksHandler = (data) => {
    setSubmitRemarks(data);
  };

  const submitHandler = () => {
    const submitData = {
      id: modalData.id,
      reason: submitReason,
      cancelRemarks: submitRemarks,
    };

    try {
      setIsLoading(true);
      const res = apiClient
        .put(`Warehouse/CancelPartialReceivingInQc/${modalData.id}`, submitData)
        .then((res) => {
          ToastComponent("Success!", "Cancelled", "success", toast);
          fetchWHReceiving();
          fetchNotification();
          onClose(onClose);
        })
        .catch((err) => {
          setIsLoading(false);
          ToastComponent("Error!", "Cancellation Failed", "error", toast);
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <VStack>
            <Text>Cancellation</Text>
          </VStack>
        </ModalHeader>
        <ModalCloseButton onClick={onClose} />
        <ModalBody>
          <Flex
            flexDirection="column"
            w="full"
            justifyContent="center"
            alignItems="center"
          >
            <FormLabel w='full'>
              Reason
              {reasons.length > 0 ? (
                <Select
                  onChange={(e) => reasonHandler(e.target.value)}
                  bgColor="#ffffe0"
                  placeholder="Select Reason"
                >
                  {reasons?.map((reason) => (
                    <option key={reason.id} value={reason.reasonName}>
                      {reason.reasonName}
                    </option>
                  ))}
                </Select>
              ) : (
                "Loading"
              )}
            </FormLabel>

            <FormLabel w='full'>
              Other Remarks
              <Input
                onChange={(e) => remarksHandler(e.target.value)}
                bgColor="#ffffe0"
              />
            </FormLabel>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <ButtonGroup size="sm">
            <Button
              onClick={() => submitHandler()}
              disabled={!submitReason || !submitRemarks}
              _hover={{ bgColor: "accent", color: "white" }}
              colorScheme="blue"
            >
              Submit
            </Button>
            <Button colorScheme="gray" onClick={onClose}>
              Close
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
