import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  HStack,
  Input,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import PageScrollReusable from "../../../components/PageScroll-Reusable";
import { ApproveModal, RejectModal, ViewModal } from "./Action-Modals";
import {
  Pagination,
  usePagination,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
  PaginationContainer,
  PaginationPageGroup,
} from "@ajna/pagination";
import moment from "moment";

export const ForApprovalMoveOrder = ({
  setCurrentPage,
  setPageSize,
  setSearch,
  pagesCount,
  currentPage,
  pageSize,
  forApprovalData,
  fetchForApprovalMO,
  orderId,
  setOrderId,
  viewData,
  fetchNotification,
  orderNos,
  setOrderNos,
}) => {
  const [totalQuantity, setTotalQuantity] = useState("");

  const {
    isOpen: isView,
    onClose: closeView,
    onOpen: openView,
  } = useDisclosure();
  const {
    isOpen: isApprove,
    onClose: closeApprove,
    onOpen: openApprove,
  } = useDisclosure();
  const {
    isOpen: isReject,
    onClose: closeReject,
    onOpen: openReject,
  } = useDisclosure();

  const allOrders = forApprovalData?.moveorder?.map((item) => item.orderNo);

  const [checkedItems, setCheckedItems] = useState([]);
  const parentCheckHandler = (e) => {
    if (e.target.checked) {
      setCheckedItems(allOrders);
    } else {
      setCheckedItems([]);
    }
  };

  const childCheckHandler = (e) => {
    if (e.target.checked) {
      setCheckedItems([...checkedItems, parseInt(e.target.value)]);
    } else {
      const data = checkedItems?.filter(
        (item) => item !== parseInt(e.target.value)
      );
      setCheckedItems(data);
    }
  };

  useEffect(() => {
    setOrderNos(checkedItems);

    return () => {
      setOrderNos([]);
    };
  }, [checkedItems]);

  const handlePageChange = (nextPage) => {
    setCurrentPage(nextPage);
  };

  const handlePageSizeChange = (e) => {
    const pageSize = Number(e.target.value);
    setPageSize(pageSize);
  };

  const searchHandler = (inputValue) => {
    setSearch(inputValue);
  };

  const viewHandler = (id) => {
    if (id) {
      setOrderId(id);
    } else {
      setOrderId("");
    }
    openView();
  };

    // const approveHandler = (data) => {
    //   if (data) {
    //     setOrderId(data.orderNo);
    //     setTotalQuantity(data.quantity);
    //   } else {
    //     setOrderId("");
    //     setTotalQuantity("");
    //   }
    //   openApprove();
    // };

    const handleApprove = () => {
        if(orderNos?.length > 0) {
            openApprove()
        }
    }

  const rejectHandler = (id) => {
    if (id) {
      setOrderId(id);
    } else {
      setOrderId("");
    }
    openReject();
  };

  const TableHead = [
    <Th>
      <Checkbox
        onChange={parentCheckHandler}
        isChecked={allOrders?.length === checkedItems?.length}
        disabled={!allOrders?.length > 0}
        color="white"
      >
        Line
      </Checkbox>
    </Th>,
    "Order ID",
    "Customer Code",
    "Customer Name",
    // "Category",
    "Total Quantity Order",
    "Prepared Date",
    // "Date Needed",
    "View",
    "Approve",
    "Reject",
  ];

  return (
    <Flex w="full" flexDirection="column" p={5}>
      <Flex justifyContent="space-between">
        <Select onChange={handlePageSizeChange} w="7%" variant="filled">
          <option value={Number(10)}>10</option>
          <option value={Number(20)}>20</option>
          <option value={Number(30)}>30</option>
          <option value={Number(50)}>50</option>
        </Select>
        <HStack w="17%">
          <Text>Search:</Text>
          <Input
            placeholder="Order Id"
            onChange={(e) => searchHandler(e.target.value)}
          />
        </HStack>
      </Flex>

      <Flex mt={5} flexDirection="column">
        <PageScrollReusable minHeight="120px" maxHeight="500px">
          <Table size="sm">
            <Thead bgColor="secondary">
              <Tr>
                <Th>
                  <Checkbox
                    onChange={parentCheckHandler}
                    isChecked={allOrders?.length === checkedItems?.length}
                    disabled={!allOrders?.length > 0}
                    color="white"
                  >
                    Line
                  </Checkbox>
                </Th>
                <Th color="white">Order ID</Th>
                <Th color="white">Customer Code</Th>
                <Th color="white">Customer Name</Th>
                <Th color="white">Total Quantity Order</Th>
                <Th color="white">Prepared Date</Th>
                <Th color="white">View</Th>
                <Th color="white">Reject</Th>
              </Tr>
            </Thead>
            <Tbody>
              {forApprovalData?.moveorder?.map((item, i) => (
                <Tr key={i}>
                  <Td>
                    <Checkbox
                      onChange={childCheckHandler}
                      isChecked={checkedItems.includes(item.orderNo)}
                      value={item.orderNo}
                      color="black"
                    >
                      {i + 1}
                    </Checkbox>
                  </Td>
                  <Td>{item.orderNo}</Td>
                  <Td>{item.farmCode}</Td>
                  <Td>{item.farmName}</Td>
                  {/* <Td>{item.category}</Td> */}
                  <Td>{item.quantity}</Td>
                  <Td>{moment(item.preparedDate).format("MM/DD/yyyy")}</Td>
                  {/* <Td>{item.dateNeeded}</Td> */}
                  <Td>
                    <Button
                      size="xs"
                      colorScheme="green"
                      px={4}
                      onClick={() => viewHandler(item.orderNo)}
                    >
                      View
                    </Button>
                  </Td>
                  {/* <Td>
                    <Button
                      size="xs"
                      colorScheme="blue"
                      onClick={() => approveHandler(item)}
                    >
                      Approve
                    </Button>
                  </Td> */}
                  <Td>
                    <Button
                      size="xs"
                      colorScheme="red"
                      px={3}
                      onClick={() => rejectHandler(item.orderNo)}
                    >
                      Reject
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </PageScrollReusable>
        <Box w="full" display="flex" justifyContent="end">
          <Button
            onClick={handleApprove}
            size="sm"
            colorScheme="blue"
            disabled={orderNos?.length === 0}
          >
            {orderNos?.length > 1 ? "Approve All" : "Approve"}
          </Button>
        </Box>
      </Flex>

      <Flex justifyContent="space-between" mt={7}>
        <Text fontSize="xs">
          {forApprovalData?.moveorder?.length > 0
            ? `Showing ${forApprovalData?.moveorder?.length} entries`
            : "No entries available"}
        </Text>
        <Flex>
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

      {isView && (
        <ViewModal
          isOpen={isView}
          onClose={closeView}
          id={orderId}
          viewData={viewData}
        />
      )}
      {isApprove && (
        <ApproveModal
          isOpen={isApprove}
          onClose={closeApprove}
          orderNo={orderId}
          fetchForApprovalMO={fetchForApprovalMO}
          printData={viewData}
          fetchNotification={fetchNotification}
          totalQuantity={totalQuantity}
          orderNos={orderNos}
          setOrderNos={setOrderNos}
        />
      )}
      {isReject && (
        <RejectModal
          isOpen={isReject}
          onClose={closeReject}
          id={orderId}
          fetchForApprovalMO={fetchForApprovalMO}
          fetchNotification={fetchNotification}
        />
      )}
    </Flex>
  );
};
