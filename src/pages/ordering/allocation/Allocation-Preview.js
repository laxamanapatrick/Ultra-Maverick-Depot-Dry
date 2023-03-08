import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Input,
  Text,
  toast,
  useToast,
} from "@chakra-ui/react";
import { FiEdit } from "react-icons/fi";
import PageScrollReusable from "../../../components/PageScroll-Reusable";
import { ToastComponent } from "../../../components/Toast";

const AllocationPreview = ({
  isOpen,
  onClose,
  allocatedData,
  itemCode,
  soh,
}) => {
  const toast = useToast();
  const [editedData, setEditedData] = useState(allocatedData);

  const handleEditQuantity = (index, value) => {
    const newData = [...editedData];
    let totalAllocated = 0;
    newData[index].allocatedQuantity = value;
    // Calculate the total allocated quantity
    for (const item of newData) {
      totalAllocated += Number(item.allocatedQuantity);
    }

    // Adjust the other quantities if the total allocated quantity exceeds the SOH
    if (totalAllocated > Number(soh)) {
      ToastComponent(
        "Warning",
        "You are providing a value which exceeds the stocks remaining",
        "warning",
        toast
      );
      newData[index].allocatedQuantity = "";
    }

    setEditedData(newData);
  };

  const saveHandler = () => {
    console.log(editedData);
  };

  const hasEmptyField = editedData?.some((item) => {
    for (const property in item) {
      if (item[property] === "") {
        return true;
      }
    }
    return false;
  });

  const [totalAllocatedQuantity, setTotalAllocatedQuantity] = useState("")

  useEffect(() => {
    const newData = [...editedData];
    if (newData) {
      let totalAllocated = 0;
      for (const item of newData) {
        totalAllocated += Number(item.allocatedQuantity);
      }
      setTotalAllocatedQuantity(totalAllocated)
    }
  }, [editedData]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="4xl">
        <ModalContent>
          <ModalHeader textAlign="center">
            Allocated Preview for Item Code: {itemCode && itemCode}
          </ModalHeader>
          {/* <ModalCloseButton color='white' pt={3} /> */}
          <ModalBody>
            <PageScrollReusable>
              <Table>
                <Thead bgColor="primary">
                  <Tr>
                    <Th color="white">Order ID</Th>
                    <Th color="white">Customer Name</Th>
                    <Th color="white" fontWeight="bold">
                      Allocated Quantity
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {editedData?.map((item, index) => (
                    <Tr key={index}>
                      <Td>{item.orderNo}</Td>
                      <Td>{item.customerName}</Td>
                      <Td>
                        <Input
                          w="50%"
                          borderColor="blackAlpha.900"
                          value={item.allocatedQuantity}
                          onChange={(e) =>
                            handleEditQuantity(
                              index,
                              e.target.value > item.quantity
                                ? item.quantity
                                : e.target.value < 0
                                ? 0
                                : e.target.value
                            )
                          }
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </PageScrollReusable>
            <Text fontSize="xs" color="green">
              Allocated Quantities are editable
            </Text>
            <Text fontSize="xs">
              {` Current Stocks Available: ${soh && soh}`}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              mr={3}
              colorScheme="blue"
              title={
                hasEmptyField
                  ? "An empty field as been provided, please provide a 0 value if you do not wish to provide a quantity for the specific customer"
                  : Number(totalAllocatedQuantity) !== Number(soh)
                  ? "All allocations must be equal to remaining stocks"
                  : ""
              }
              disabled={hasEmptyField || Number(totalAllocatedQuantity) !== Number(soh)}
              onClick={saveHandler}
            >
              Proceed
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AllocationPreview;
