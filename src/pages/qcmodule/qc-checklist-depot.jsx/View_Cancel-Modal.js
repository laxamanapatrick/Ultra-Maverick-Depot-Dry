import React, { useState, useEffect } from "react";
import {
  Button,
  ButtonGroup,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  useToast,
  VStack, 
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  Td,
} from "@chakra-ui/react";
import { ToastComponent } from "../../../components/Toast";
import moment from "moment";
import apiClient from "../../../services/apiClient";
import PageScrollReusable from "../../../components/PageScroll-Reusable";

export const CancelModalComponent = ({
  isOpen,
  onClose,
  poId,
  fetchPo,
  fetchNotification,
}) => {
  const [reasons, setReasons] = useState([]);
  const [reasonData, setReasonData] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  const fetchReasonsApi = async () => {
    const res = await apiClient.get(`Reason/GetAllActiveReason`);
    return res.data;
  };

  const fetchReasons = () => {
    fetchReasonsApi().then((res) => {
      setReasons(res);
    });
  };

  useEffect(() => {
    fetchReasons();

    return () => {
      setReasons([]);
    };
  }, []);

  const reasonHandler = (data) => {
    if (data) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }

    setReasonData(data);
  };

  const submitCancellation = () => {
    const submitData = {
      id: poId,
      reason: reasonData,
    };

    try {
      setIsLoading(true);
      const res = apiClient
        .put(`Receiving/CancelPO/${poId}`, submitData)
        .then((res) => {
          ToastComponent("Success!", "PO Cancelled", "success", toast);
          fetchPo();
          fetchNotification();
          onClose();
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          ToastComponent("Error", err.response.data, "error", toast);
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Flex>
      <Modal size="xl" isOpen={isOpen} onClose={() => {}} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex justifyContent="center">
              <Text>Cancel Raw Materials</Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton onClick={onClose} />
          <Flex
            borderColor="gray.100"
            borderWidth="5px"
            borderX="none"
            borderTop="none"
          ></Flex>
          <ModalBody>
            <Flex justifyContent="center" my={7}>
              <VStack spacing={5}>
                <Text>Are you sure you want to cancel this raw material?</Text>

                {reasons.length > 0 ? (
                  <Select
                    onChange={(e) => reasonHandler(e.target.value)}
                    placeholder="Select Reason"
                  >
                    {reasons.map((reason) => (
                      <option key={reason.id} value={reason.reasonName}>
                        {reason.reasonName}
                      </option>
                    ))}
                  </Select>
                ) : (
                  "loading"
                )}
              </VStack>
            </Flex>
          </ModalBody>
          <Flex
            borderColor="gray.100"
            borderWidth="5px"
            borderX="none"
            borderTop="none"
          ></Flex>
          <ModalFooter>
            <ButtonGroup size="md">
              <Button
                colorScheme="blue"
                _hover={{ bgColor: "accent" }}
                isLoading={isLoading}
                isDisabled={isDisabled}
                onClick={() => submitCancellation()}
              >
                Yes
              </Button>
              <Button
                colorScheme="red"
                _hover={{ bgColor: "danger" }}
                onClick={onClose}
              >
                No
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export const ViewModalComponent = ({ isOpen, onClose, viewingData }) => {
  return (
    <Flex>
      <Modal size="5xl" isOpen={isOpen} onClose={() => {}} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex justifyContent="center">
              <Text>PO Summary</Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton onClick={onClose} />

          <ModalBody>
            <PageScrollReusable>
              {!viewingData ? (
                <Stack width="full">
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                </Stack>
              ) : (
                <Table variant="striped" size="sm">
                  <Thead>
                    <Tr bgColor="secondary">
                      <Th color="white">PO No.</Th>
                      <Th color="white">Approved Date</Th>
                      <Th color="white">PR No.</Th>
                      <Th color="white">PR Date</Th>
                    </Tr>
                  </Thead>

                  <Tbody>
                    <Tr key={viewingData.id}>
                      <Td>{viewingData.pO_Number}</Td>
                      <Td>
                        {moment(viewingData.pO_Date).format("MM/DD/YYYY")}
                      </Td>
                      <Td>{viewingData.pR_Number}</Td>
                      <Td>
                        {moment(viewingData.pR_Date).format("MM/DD/YYYY")}
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              )}
            </PageScrollReusable>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};
