import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Flex,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import moment from "moment/moment";
import { useReactToPrint } from "react-to-print";
import PageScrollQCModal from "../../components/PageScrollQCModal";
import apiClient from "../../services/apiClient";

const fetchViewDataApi = async (receivingId) => {
  const res = await apiClient.get(
    `Receiving/GetPoSummaryInformation?receivingId=${receivingId}`
  );
  return res.data;
};

const fetchOtherDataApi = async (receivingId) => {
  const res = await apiClient.get(
    `Receiving/GetDetailsForNearlyExpire?id=${receivingId}`
  );
  return res.data;
};

const PrintChecklistModal = ({ isOpen, onClose, receivingId }) => {
  const [viewData, setViewData] = useState([]);
  const [otherData, setOtherData] = useState([]);

  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const fetchViewData = () => {
    fetchViewDataApi(receivingId).then((res) => {
      setViewData(res.data);
    });
  };

  useEffect(() => {
    fetchViewData();

    return () => {
      setViewData([]);
    };
  }, [receivingId]);

  const fetchOtherData = () => {
    fetchOtherDataApi(receivingId).then((res) => {
      setOtherData(res[0]);
    });
  };

  useEffect(() => {
    fetchOtherData();

    return () => {
      setOtherData([]);
    };
  }, [receivingId]);

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="6xl">
      <ModalContent>
        <ModalHeader>
          <Flex justifyContent="center">
            <Text>PO Summary</Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton onClick={onClose} />
        <ModalBody mt={2}>
          <PageScrollQCModal>
            <Stack spacing={8} ref={printRef}>
              {/* Raw mats info */}
              <Flex
                justifyContent="center"
                p={1}
                color="white"
                bgColor="secondary"
              >
                <Text>RAW MATERIALS INFORMATION</Text>
              </Flex>

              <Flex justifyContent="space-between">
                <FormLabel w="40%">
                  Item Code
                  <Input
                    value={otherData?.itemCode}
                    readOnly={true}
                    _disabled={{ color: "black" }}
                    disabled={true}
                    bgColor="gray.300"
                  />
                </FormLabel>

                <FormLabel w="40%">
                  Item Description
                  <Input
                    value={otherData?.itemDescription}
                    readOnly={true}
                    _disabled={{ color: "black" }}
                    disabled={true}
                    bgColor="gray.300"
                  />
                </FormLabel>
              </Flex>
              <Flex justifyContent="space-between">
                <FormLabel w="40%">
                  UOM
                  <Input
                    value={otherData?.uom}
                    readOnly={true}
                    _disabled={{ color: "black" }}
                    disabled={true}
                    bgColor="gray.300"
                  />
                </FormLabel>

                <FormLabel w="40%">
                  Supplier
                  <Input
                    value={otherData?.supplier}
                    readOnly={true}
                    _disabled={{ color: "black" }}
                    disabled={true}
                    bgColor="gray.300"
                  />
                </FormLabel>
              </Flex>

              {/* Receiving Info */}
              <Flex
                justifyContent="center"
                p={1}
                color="white"
                bgColor="secondary"
              >
                <Text>RECEIVING INFORMATION</Text>
              </Flex>

              <Flex justifyContent="space-between">
                <FormLabel w="40%">
                  PO NO.
                  <Input
                    value={otherData?.pO_Number}
                    readOnly={true}
                    _disabled={{ color: "black" }}
                    disabled={true}
                    bgColor="gray.300"
                  />
                </FormLabel>

                <FormLabel w="40%">
                  PO Date
                  <Input
                    value={otherData?.pO_Date}
                    readOnly={true}
                    _disabled={{ color: "black" }}
                    disabled={true}
                    bgColor="gray.300"
                  />
                </FormLabel>
              </Flex>
              <Flex justifyContent="space-between">
                <FormLabel w="40%">
                  PR No.
                  <Input
                    value={otherData?.pR_Number}
                    readOnly={true}
                    _disabled={{ color: "black" }}
                    disabled={true}
                    bgColor="gray.300"
                  />
                </FormLabel>

                <FormLabel w="40%">
                  PR Date
                  <Input
                    value={otherData?.pR_Date}
                    readOnly={true}
                    _disabled={{ color: "black" }}
                    disabled={true}
                    bgColor="gray.300"
                  />
                </FormLabel>
              </Flex>
              <Flex justifyContent="space-between">
                <FormLabel w="40%">
                  Quantity Ordered
                  <Input
                    value={otherData?.quantityOrdered}
                    readOnly={true}
                    _disabled={{ color: "black" }}
                    disabled={true}
                    bgColor="gray.300"
                  />
                </FormLabel>

                <FormLabel w="40%">
                  Date of Checking
                  <Input
                    value={otherData?.dateOfChecking}
                    readOnly={true}
                    _disabled={{ color: "black" }}
                    disabled={true}
                    bgColor="gray.300"
                  />
                </FormLabel>
              </Flex>
              <Flex justifyContent="space-between">
                <FormLabel w="40%">
                  Manufacturing Date
                  <Input
                    value={
                      !viewData?.manufacturing_Date
                        ? "No data found"
                        : viewData?.manufacturing_Date === null
                        ? "NA"
                        : moment(viewData?.manufacturing_Date).format(
                            "yyyy-MM-DD"
                          )
                    }
                    readOnly={true}
                    _disabled={{ color: "black" }}
                    disabled={true}
                    bgColor="gray.300"
                  />
                </FormLabel>

                <FormLabel w="40%">
                  Expiry Date
                  <Input
                    value={
                      !viewData?.expiry_Date
                        ? "No data found"
                        : viewData?.expiry_Date === null
                        ? "Not Expirable"
                        : moment(viewData?.expiry_Date).format("yyyy-MM-DD")
                    }
                    readOnly={true}
                    _disabled={{ color: "black" }}
                    disabled={true}
                    bgColor="gray.300"
                  />
                </FormLabel>
              </Flex>
              <Flex justifyContent="space-between">
                <FormLabel w="40%">
                  Expected Delivery
                  <Input
                    value={viewData?.expected_Delivery}
                    readOnly={true}
                    _disabled={{ color: "black" }}
                    disabled={true}
                    bgColor="gray.300"
                  />
                </FormLabel>

                <FormLabel w="40%">
                  Quantity Actual Delivered
                  <Input
                    value={viewData?.actual_Delivered}
                    readOnly={true}
                    _disabled={{ color: "black" }}
                    disabled={true}
                    bgColor="gray.300"
                  />
                </FormLabel>
              </Flex>

              <Flex justifyContent="space-between">
                <FormLabel w="40%">
                  QC By:
                  <Input
                    value={viewData?.qcBy}
                    readOnly={true}
                    _disabled={{ color: "black" }}
                    disabled={true}
                    bgColor="gray.300"
                  />
                </FormLabel>

                <FormLabel w="40%">
                  Monitored By:
                  <Input
                    value={viewData?.monitoredBy}
                    readOnly={true}
                    _disabled={{ color: "black" }}
                    disabled={true}
                    bgColor="gray.300"
                  />
                </FormLabel>
              </Flex>

              <Flex justifyContent="space-between">
                <FormLabel w="40%">
                  QC Received Date:
                  <Input
                    value={moment(viewData?.qC_ReceiveDate).format(
                      "yyyy-MM-DD"
                    )}
                    readOnly={true}
                    _disabled={{ color: "black" }}
                    disabled={true}
                    bgColor="gray.300"
                  />
                </FormLabel>
              </Flex>
              {/* <Flex justifyContent="space-between">
                <FormLabel w="40%">
                  No. Qty Actual Good Needed
                  <Input
                    value={viewData?.expected_Delivery}
                    readOnly={true}
                    _disabled={{ color: "black" }}
                    disabled={true}
                    bgColor="gray.300"
                  />
                </FormLabel>

                <FormLabel w="40%">
                  Batch No.
                  <Input
                    value={`None`}
                    readOnly={true}
                    _disabled={{ color: "black" }}
                    disabled={true}
                    bgColor="gray.300"
                  />
                </FormLabel>
              </Flex> */}

              {/* Checklists Info */}
              <Flex
                justifyContent="center"
                p={1}
                color="white"
                bgColor="secondary"
              >
                <Text>CHECKLISTS INFORMATION</Text>
              </Flex>

              {viewData?.checklists?.map((item, i) => (
                <>
                  <Table>
                    <Thead key={i} bgColor="secondary">
                      <Tr>
                        <Th color="white">{item.checklist_Type}</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {item?.values?.map((value, i) => (
                        <Tr key={i}>
                          <Td>{value}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </>
              ))}
            </Stack>
          </PageScrollQCModal>
        </ModalBody>
        <ModalFooter mt={10} gap={2}>
          <Button colorScheme="blue" size="sm" onClick={handlePrint}>
            Print
          </Button>
          <Button colorScheme="gray" size="sm" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PrintChecklistModal;
