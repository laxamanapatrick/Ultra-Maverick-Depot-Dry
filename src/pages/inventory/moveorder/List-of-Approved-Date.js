import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Flex,
  HStack,
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
import PageScrollReusable from "../../../components/PageScroll-Reusable";
import { VscCircleLargeFilled } from "react-icons/vsc";
import { GoArrowSmallRight } from "react-icons/go";
import { FaSort } from "react-icons/fa";
import moment from "moment";
import { CancelApprovedDate } from "./Action-Modals";
import { DisablePreparation } from "./Preparation-User-Control";
import { ToastComponent } from "../../../components/Toast";
import Swal from "sweetalert2";

export const ListofApprovedDate = ({
  preparingUser,
  me,
  isBeingPrepared,
  preparingStatus,
  setPreparingStatus,
  MoveOrderId,
  userFullname,
  setRequest,
  unsetRequest,
  startSetConnection,
  connectionTwo,
  farmName,
  moveData,
  pagesCount,
  currentPage,
  fetchApprovedMoveOrders,
  fetchMoveOrder,
  fetchOrderList,
  lengthIndicator,
  setCurrentPage,
  setItemCode,
  setWarehouseId,
  setHighlighterId,
  setOrderId,
  orderId,
  setDeliveryStatus,
  setBatchNumber,
  buttonChanger,
  preparedLength,
  pageDisable,
  orderListData,
  preparedData,
}) => {
  const toast = useToast();

  const handlePageChange = (nextPage) => {
    setCurrentPage(nextPage);
    setItemCode("");
    setWarehouseId("");
    // setHighlighterId('')
    setOrderId("");
  };

  const handleId = (data) => {
    setItemCode("");
    setHighlighterId("");
    setDeliveryStatus("");
    if (data) {
      setOrderId(data);
    } else {
      setOrderId("");
    }
  };

  // const TableHead = [
  //     "Line", "Order ID", "Customer Code", "Customer Name", "Category", "Total Quantity Order", "Order Date",
  //     "Date Needed",
  //     "Prepared Date",
  //     "Status"
  // ]

  // Return to Page 1 once length === 0
  useEffect(() => {
    if (lengthIndicator === 0) {
      setCurrentPage(1);
      fetchApprovedMoveOrders();
    }
  }, [lengthIndicator]);

  //Auto select index 0
  useEffect(() => {
    setOrderId(moveData[0]?.id);
  }, [moveData]);

  //Sort by date start line
  const [order, setOrder] = useState("asc");
  function descendingComparator(a, b) {
    if (
      moment(b?.preparedDate).format("yyyy-MM-DD") <
      moment(a?.preparedDate).format("yyyy-MM-DD")
    ) {
      return -1;
    }
    if (
      moment(b?.preparedDate).format("yyyy-MM-DD") >
      moment(a?.preparedDate).format("yyyy-MM-DD")
    ) {
      return 1;
    }
    return 0;
  }
  function getComparator(order) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b)
      : (a, b) => -descendingComparator(a, b);
  }
  //Sort by date end line

  const {
    isOpen: isCancel,
    onOpen: openCancel,
    onClose: closeCancel,
  } = useDisclosure();
  const cancelHandler = (id) => {
    if (preparedLength > 0) {
      ToastComponent(
        "Warning",
        "This customer's order currently has prepared items, please cancel all preapred items first.",
        "warning",
        toast
      );
      return;
    }
    if (id) {
      setOrderId(id);
      openCancel();
    }
  };

  useEffect(() => {
    if (pageDisable) {
      ToastComponent(
        "Warning",
        "You cannot leave this page until you finish your progress, please select a delivery status and save.",
        "warning",
        toast
      );
    }
  }, [pageDisable]);

  const startPreparationHandler = () => {
    if (preparedLength > 0) {
      Swal.fire({
        title: "Items prepared are present.",
        text: "Continue preparing items for this order?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then((res) => {
        if (res.isConfirmed) {
          startSetConnection();
          fetchOrderList();
          setPreparingStatus(true);
          setRequest();
        }
      });
    } else {
      startSetConnection();
      fetchOrderList();
      setPreparingStatus(true);
      setRequest();
    }
  };

  const stopPreparationHandler = () => {
    startSetConnection();
    setPreparingStatus(false);
    unsetRequest(MoveOrderId, userFullname);
  };

  return (
    <Flex w="full" flexDirection="column">
      <Flex w="full" justifyContent="space-between">
        <HStack>
          <Badge bgColor="secondary" color="white" px={3}>
            Customer:{" "}
          </Badge>
          <Text fontSize="sm">{farmName && farmName}</Text>
        </HStack>

        {!preparingStatus ? (
          <Button
            onClick={startPreparationHandler}
            size="sm"
            colorScheme="green"
            disabled={isBeingPrepared || preparingUser}
            title={
              isBeingPrepared ? "Someone is already preaparing this order" : ""
            }
          >
            Start Preparing
          </Button>
        ) : (
          <Button onClick={stopPreparationHandler} size="sm" colorScheme="red">
            Stop Preparing
          </Button>
        )}

        <Flex>
          <Pagination
            pagesCount={pagesCount}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          >
            <PaginationContainer>
              <PaginationPrevious
                disabled={pageDisable || preparingStatus}
                // title={
                //   pageDisable
                //     ? "You must finish your progress and save a delivery status"
                //     : pageDisable ? "You cannot leave this order unless you stop its preparation" : ""
                // }
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
                disabled={pageDisable || preparingStatus}
                // title={
                //   pageDisable
                //     ? "You must finish your progress and save a delivery status"
                //     : pageDisable ? "You cannot leave this order unless you stop its preparation" : ""
                // }
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

      {buttonChanger && preparedData?.length !== 0 ? (
        <VStack spacing={1}>
          <HStack w="full" justifyContent="start">
            <Badge bgColor="secondary" color="white" px={3}>
              Delivery Status:{" "}
            </Badge>
            <Select
              onChange={(e) => setDeliveryStatus(e.target.value)}
              placeholder=" "
              w="15%"
              size="xs"
              bgColor="#fff8dc"
            >
              <option>Pick-Up</option>
              <option>For Delivery</option>
            </Select>
          </HStack>
          {/* <HStack w='full' justifyContent='start'>
                            <Badge bgColor='secondary' color='white' px={4}>Batch Number: </Badge>
                            <Select
                                onChange={(e) => setBatchNumber(e.target.value)}
                                placeholder=' '
                                w='15%' size='xs' bgColor='#fff8dc'
                            >
                                <option>{`${moment(new Date()).format('YYYY')} - 1`}</option>
                                <option>{`${moment(new Date()).format('YYYY')} - 2`}</option>
                                <option>{`${moment(new Date()).format('YYYY')} - 3`}</option>
                                <option>{`${moment(new Date()).format('YYYY')} - 4`}</option>
                                <option>{`${moment(new Date()).format('YYYY')} - 5`}</option>
                                <option>{`${moment(new Date()).format('YYYY')} - 6`}</option>
                                <option>{`${moment(new Date()).format('YYYY')} - 7`}</option>
                            </Select>
                        </HStack> */}
        </VStack>
      ) : (
        ""
      )}
      <VStack w="full" spacing={0} justifyContent="center" mt={6}>
        <Text
          w="full"
          fontWeight="semibold"
          fontSize="md"
          bgColor="secondary"
          color="white"
          textAlign="center"
        >
          List of Approved Date
        </Text>
        <PageScrollReusable minHeight="200px" maxHeight="210px">
          <Table size="sm" variant="simple">
            <Thead bgColor="secondary">
              <Tr>
                <Th color="white">Line</Th>
                <Th color="white">Order ID</Th>
                <Th color="white">Customer Code</Th>
                <Th color="white">Customer Name</Th>
                {/* <Th color="white">Category</Th> */}
                <Th color="white">Total Quantity Order</Th>
                <Th color="white">
                  <HStack>
                    <Text>Prepared Date</Text>
                    <Button
                      cursor="pointer"
                      onClick={() => {
                        setOrder(order === "asc" ? "desc" : "asc");
                      }}
                      p={0}
                      m={0}
                      background="none"
                      _hover={{ background: "none" }}
                    >
                      <FaSort />
                    </Button>
                  </HStack>
                </Th>
                <Th color="white">Cancel</Th>
              </Tr>
            </Thead>
            <Tbody>
              {moveData?.sort(getComparator(order))?.map((order, i) => (
                <Tr
                  key={i}
                  title={order.isReject ? order.remarks : ""}
                  onClick={() => handleId(order.id)}
                  bgColor={orderId === order.id ? "table_accent" : "none"}
                  _hover={
                    order.isReject
                      ? { bgColor: "gray.200" }
                      : { bgColor: "none" }
                  }
                  cursor="pointer"
                >
                  {orderId === order.id ? (
                    <Td>
                      <GoArrowSmallRight fontSize="27px" />
                    </Td>
                  ) : (
                    <Td>{i + 1}</Td>
                  )}
                  <Td>{order.id}</Td>
                  <Td>{order.farmCode}</Td>
                  <Td>{order.farmName}</Td>
                  {/* <Td>{order.category}</Td> */}
                  <Td>{order.quantityOrder}</Td>
                  <Td>{moment(order.preparedDateTime).format("MM/DD/yyyy")}</Td>
                  <Td>
                    <Button
                      size="xs"
                      colorScheme="red"
                      onClick={() => cancelHandler(order.id)}
                      // disabled={preparedLength > 0}
                      title={
                        preparedLength > 0
                          ? "Please cancel all prepared items first"
                          : ""
                      }
                    >
                      Cancel
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </PageScrollReusable>
      </VStack>

      {isCancel && (
        <CancelApprovedDate
          isOpen={isCancel}
          onClose={closeCancel}
          id={orderId}
          setOrderId={setOrderId}
          fetchApprovedMoveOrders={fetchApprovedMoveOrders}
          fetchMoveOrder={fetchMoveOrder}
        />
      )}
    </Flex>
  );
};
