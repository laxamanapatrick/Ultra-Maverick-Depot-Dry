import React, { useState } from "react";
import {
  Badge,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Input,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import {
  Pagination,
  usePagination,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
  PaginationContainer,
  PaginationPageGroup,
} from "@ajna/pagination";
import { ToastComponent } from "../../../components/Toast";
import PageScrollReusable from "../../../components/PageScroll-Reusable";
import apiClient from "../../../services/apiClient";
import AllocationPreview from "./Allocation-Preview";

export const ListofforAllocation = ({
  itemCode,
  pagesCount,
  currentPage,
  setCurrentPage,
  orderData,
  setOrderData,
  setItemCode,
  fetchForAllocationPagination,
  fetchOrdersByItemCode,
  fetchNotification,
}) => {
  const toast = useToast();

  const handlePageChange = (nextPage) => {
    setCurrentPage(nextPage);
  };

  const {
    isOpen: isAllocationPreviewOpen,
    onClose: closeAllocationPreview,
    onOpen: openAllocationPreview,
  } = useDisclosure();

  const [allocatedData, setAllocatedData] = useState([]);

  const allocateHandler = async () => {
    const submitArray = orderData?.map((item) => {
      return {
        itemCode: itemCode,
        customerName: item.farm,
        orderNo: item.id.toString(),
      };
    });
    try {
      const res = await apiClient
        .put(`Ordering/Allocate`, submitArray)
        .then((res) => {
          ToastComponent(
            "Success",
            `Orders for Item Code ${itemCode} has been allocated.`,
            "success",
            toast
          );
          setAllocatedData(res?.data);
          openAllocationPreview();
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Flex w="full" p={7} flexDirection="column">
      <Flex w="full" justifyContent="space-between">
        <VStack alignItems="start">
          <HStack>
            <Badge bgColor="secondary" color="white" px={3}>
              Item Code:{" "}
            </Badge>
            <Text fontSize="sm">{itemCode && itemCode}</Text>
          </HStack>
          <HStack>
            <Badge bgColor="secondary" color="white" px={3}>
              Stock on hand:{" "}
            </Badge>
            {/* <Input borderColor='black' readOnly color={orderData[0]?.stockOnHand === 0 ? 'red' : ''} value={orderData[0]?.stockOnHand}/> */}
            <Text borderBottom='1px' borderColor='black' color={orderData[0]?.stockOnHand === 0 ? 'red' : ''}>{orderData[0]?.stockOnHand}</Text>
          </HStack>
        </VStack>

        <Flex w="auto" alignItems="center">
          <Pagination
            pagesCount={pagesCount}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          >
            <PaginationContainer>
              <PaginationPrevious
                border="1px"
                fontSize="xs"
                px={2}
                _hover={{ bg: "accent", color: "white" }}
              >
                {"< Previous"}
              </PaginationPrevious>
              <Text mx={1} bgColor="secondary" color="white" px={2} pt={1.5}>
                {currentPage}
              </Text>
              <PaginationNext
                border="1px"
                fontSize="xs"
                px={4}
                _hover={{ bg: "accent", color: "white" }}
              >
                {"Next >"}
              </PaginationNext>
            </PaginationContainer>
          </Pagination>
        </Flex>
      </Flex>

      <VStack w="full" spacing={0} justifyContent="center" mt={10}>
        {/* <Text w='full' textAlign='start' fontSize='sm' fontWeight='semibold'>{pageTotal && pageTotal} Remaining Orders</Text> */}
        <Text
          w="full"
          fontWeight="semibold"
          fontSize="xl"
          bgColor="secondary"
          color="white"
          textAlign="center"
        >
          List of Orders
        </Text>
        <PageScrollReusable minHeight="150px" maxHeight="640px">
          <Table size="sm" variant="simple">
            <Thead bgColor="secondary">
              <Tr>
                <Th color="white">Order ID</Th>
                <Th color="white">Order Date</Th>
                <Th color="white">Date Needed</Th>
                <Th color="white">Customer Code</Th>
                <Th color="white">Customer Name</Th>
                <Th color="white">Item Description</Th>
                <Th color="white">Category</Th>
                <Th color="white">Quantity Order</Th>
              </Tr>
            </Thead>
            <Tbody>
              {orderData?.map((item, i) => (
                <Tr key={i}>
                  <Td>{item.id}</Td>
                  <Td>{item.orderDate}</Td>
                  <Td>{item.dateNeeded}</Td>
                  <Td>{item.farmCode}</Td>
                  <Td>{item.farm}</Td>
                  <Td>{item.itemDescription}</Td>
                  <Td>{item.category}</Td>
                  <Td>{item.quantityOrder}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </PageScrollReusable>
        {orderData[0]?.stockOnHand === 0 ? (
          <Text color="danger">{`${
            itemCode && itemCode
          } currently has no stocks available.`}</Text>
        ) : (
          <ButtonGroup size="sm" justifyContent="end" w="full" py={2} px={2}>
            {/* <Text fontSize='xs'>Selected Item(s): {checkedItems?.length}</Text> */}
            <Button
              onClick={allocateHandler}
              title={"Proceed to preparation schedule"}
              disabled={!itemCode}
              px={3}
              colorScheme="blue"
            >
              Allocate
            </Button>
            {/* <Button px={3} colorScheme="red">
            Cancel and proceed for scheduling
          </Button> */}
          </ButtonGroup>
        )}
      </VStack>

      {isAllocationPreviewOpen && (
        <AllocationPreview
          isOpen={isAllocationPreviewOpen}
          onClose={closeAllocationPreview}
          itemCode={itemCode}
          soh={orderData[0]?.stockOnHand}
          allocatedData={allocatedData}
          fetchForAllocationPagination={fetchForAllocationPagination}
          fetchOrdersByItemCode={fetchOrdersByItemCode}
          setOrderData={setOrderData}
          setItemCode={setItemCode}
          fetchNotification={fetchNotification}
        />
      )}
    </Flex>
  );
};
