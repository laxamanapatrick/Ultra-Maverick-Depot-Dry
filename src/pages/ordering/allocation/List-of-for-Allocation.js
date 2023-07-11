import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
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
import { CancelModalConfirmation } from "../preparationschedule/Action-Modals";
import { decodeUser } from "../../../services/decode-user";
import { BsFillQuestionOctagonFill } from "react-icons/bs";

const currentUser = decodeUser();

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
  const [quantity, setQuantity] = useState("");

  const handlePageChange = (nextPage) => {
    setCurrentPage(nextPage);
    setQuantity("");
  };

  const {
    isOpen: isCancel,
    onClose: closeCancel,
    onOpen: openCancel,
  } = useDisclosure();

  const {
    isOpen: isAllocationPreviewOpen,
    onClose: closeAllocationPreview,
    onOpen: openAllocationPreview,
  } = useDisclosure();

  const [allocatedData, setAllocatedData] = useState([]);

  const allocateHandler = async () => {
    const allocations = orderData?.map((item) => {
      return {
        itemCode: itemCode,
        customerName: item.farm,
        orderNo: item.id.toString(),
      };
    });
    const soh = quantity ? quantity : orderData[0]?.stockOnHand;
    const submitData = { allocations, soh };
    try {
      const res = await apiClient
        .put(`Ordering/Allocate`, submitData)
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
            <Text
              borderBottom={orderData[0]?.stockOnHand === 0 ? "none" : "1px"}
              borderColor={orderData[0]?.stockOnHand === 0 ? "none" : "black"}
              color={orderData[0]?.stockOnHand === 0 ? "red" : ""}
            >
              {orderData[0]?.stockOnHand === 0
                ? `This item code currently has (${orderData[0]?.stockOnHand}) stocks available.`
                : orderData[0]?.stockOnHand}
            </Text>
          </HStack>
          <HStack>
            <Badge bgColor="secondary" color="white" px={3}>
              Quantity to Allocate:{" "}
            </Badge>
            {/* <Input borderColor='black' readOnly color={orderData[0]?.stockOnHand === 0 ? 'red' : ''} value={orderData[0]?.stockOnHand}/> */}
            <Input
              disabled={orderData[0]?.stockOnHand === 0}
              height="20px"
              w="22%"
              borderBottom="1px"
              borderColor="black"
              defaultValue={orderData[0]?.stockOnHand}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
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
          <ButtonGroup size="sm" justifyContent="end" w="full" py={2} px={2}>
            <Button px={3} colorScheme="red" onClick={openCancel}>
              Cancel this order
            </Button>
          </ButtonGroup>
        ) : (
          <ButtonGroup size="sm" justifyContent="end" w="full" py={2} px={2}>
            <Button
              onClick={allocateHandler}
              title={"Proceed to preparation schedule"}
              disabled={!itemCode}
              px={3}
              colorScheme="blue"
            >
              Allocate
            </Button>
          </ButtonGroup>
        )}
      </VStack>

      {isCancel && (
        <CancelNoStocks
          isOpen={isCancel}
          onClose={closeCancel}
          orderData={orderData}
          fetchNotification={fetchNotification}
          fetchForAllocationPagination={fetchForAllocationPagination}
        />
      )}

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

export const CancelNoStocks = ({
  isOpen,
  onClose,
  orderData,
  fetchNotification,
  fetchForAllocationPagination,
}) => {
  const [cancelRemarks, setCancelRemarks] = useState("");
  const [reasons, setReasons] = useState([]);
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

  const remarksHandler = (data) => {
    if (data) {
      setCancelRemarks(data);
    } else {
      setCancelRemarks("");
    }
  };

  const cancelHandler = () => {
    const submitArray = orderData?.map((item) => {
      return {
        id: item.id,
        remarks: cancelRemarks,
        isCancelBy: currentUser.fullName,
      };
    });
    console.log(submitArray);
    setIsLoading(true);
    try {
      const res = apiClient
        .put(`Ordering/CancelOrders`, submitArray)
        .then((res) => {
          ToastComponent(
            "Success",
            "Orders has been cancelled!",
            "success",
            toast
          );
          fetchNotification();
          setIsLoading(false);
          onClose();
          fetchForAllocationPagination();
        })
        .catch((err) => {
          ToastComponent("Error", "Cancel failed!", "error", toast);
          setIsLoading(false);
        });
    } catch (error) {}
  };

  return (
    <Modal isCentered size="xl" isOpen={isOpen} onClose={() => {}}>
      <ModalContent>
        <ModalHeader>
          <Flex justifyContent="center" mt={10}>
            <BsFillQuestionOctagonFill fontSize="50px" />
          </Flex>
        </ModalHeader>
        <ModalCloseButton onClick={onClose} />
        <ModalBody>
          <VStack justifyContent="center" mb={8}>
            <Text>Are you sure you want to cancel this order?</Text>
            {reasons.length > 0 ? (
              <Select
                onChange={(e) => remarksHandler(e.target.value)}
                placeholder="Please select a reason"
                w="65%"
                bgColor="#fff8dc"
              >
                {reasons?.map((item, i) => (
                  <option key={i} value={item.reasonName}>
                    {item.reasonName}
                  </option>
                ))}
              </Select>
            ) : (
              "loading"
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            onClick={() => cancelHandler()}
            disabled={!cancelRemarks}
            isLoading={isLoading}
            colorScheme="blue"
            mr={3}
            _hover={{ bgColor: "accent" }}
          >
            Yes
          </Button>
          <Button
            colorScheme="red"
            onClick={onClose}
            disabled={isLoading}
            isLoading={isLoading}
          >
            No
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
