import React, { useState } from "react";
import {
  Badge,
  Button,
  Flex,
  HStack,
  Input,
  Skeleton,
  Spinner,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { HiRefresh } from "react-icons/hi";
import PageScrollReusable from "../../../components/PageScroll-Reusable";
import { ErrorModal } from "./Error-Modal";
import { ConfirmModal } from "./Confirm-Modal";
import DatePicker from "react-datepicker";
import moment from "moment";

export const ListofOrders = ({
  genusOrders,
  fetchingData,
  setFromDate,
  setToDate,
  fromDate,
  toDate,
  fetchNotification,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const [keyword, setKeyword] = useState("");
  const [errorData, setErrorData] = useState([]);

  const {
    isOpen: isError,
    onOpen: openError,
    onClose: closeError,
  } = useDisclosure();
  const {
    isOpen: isConfirm,
    onOpen: openConfirm,
    onClose: closeConfirm,
  } = useDisclosure();

  // const resultArray = genusOrders?.genus_orders?.map(item => {
  const resultArray = genusOrders?.map((item) => {
    return {
      transactId: item?.id,
      customerName: item?.fox,
      customerPosition: item?.name,
      // farmType: item?.order_details?.farm_name,
      farmCode: item?.fox,
      farmName: item?.name,
      // orderNo: item?.order_details?.orderNo,
      // batchNo: item?.order_details?.batchNo,
      orderDate: item?.dateOrdered,
      dateNeeded: item?.dateNeeded,
      // timeNeeded: item?.order_details?.timeNeeded,
      // transactionType: item?.order_details?.type,
      itemCode: item?.productcode,
      itemDescription: item?.products,
      uom: item?.uom,
      quantityOrdered: item?.qty,
      category: item?.meattype,
    };
  });

  const dateVar = new Date();
  const startDate = moment(dateVar.setDate(dateVar.getDate() - 5)).format(
    "yyyy-MM-DD"
  );

  return (
    <Flex w="full" p={5} flexDirection="column">
      <Flex justifyContent="center">
        <Badge>Date</Badge>
      </Flex>
      <Flex justifyContent="center">
        <HStack spacing={2} w="40%">
          <Badge>From:</Badge>
          <Input
            type="date"
            bgColor="#fff8dc"
            min={startDate}
            defaultValue={moment(new Date()).format("yyyy-MM-DD")}
            onChange={(date) => setFromDate(date.target.value)}
          />
          {/* <DatePicker
            onChange={(date) => setFromDate(date)}
            selected={fromDate}
            minDate={startDate}
            shouldCloseOnSelect
            dateFormat="yyyy-MM-dd"
          /> */}
          <Badge>To:</Badge>
          <Input
            type="date"
            bgColor="#fff8dc"
            defaultValue={moment(new Date()).format("yyyy-MM-DD")}
            min={fromDate}
            onChange={(date) => setToDate(date.target.value)}
          />
          {/* <DatePicker
            onChange={(date) => setToDate(date)}
            selected={toDate}
            minDate={fromDate}
            shouldCloseOnSelect
            dateFormat="yyyy-MM-dd"
          /> */}
        </HStack>
      </Flex>

      {fromDate && toDate ? (
        <>
          <Flex w="full" p={2} justifyContent="space-between">
            <HStack>
              <Text fontSize="sm">SEARCH:</Text>
              {fetchingData ? (
                <Spinner />
              ) : (
                <Input
                  placeholder="ex. Customer Name"
                  onChange={(e) => setKeyword(e.target.value)}
                  disabled={isLoading}
                />
              )}
            </HStack>
            {fetchingData || isLoading ? (
              <Spinner cursor="pointer" onClick={() => setIsLoading(false)} />
            ) : (
              <Button size='sm' colorScheme='blue' cursor="pointer" onClick={() => openConfirm()}>Sync</Button>
            )}
          </Flex>

          <VStack spacing={0} w="full">
            <Text
              py={2}
              w="full"
              fontSize="lg"
              bgColor="secondary"
              color="white"
              textAlign="center"
            >
              List of Orders
            </Text>
            <PageScrollReusable minHeight="200px" maxHeight="650px">
              {fetchingData ? (
                <Stack width="full">
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                </Stack>
              ) : (
                <Table size="sm">
                  <Thead bgColor="secondary">
                    <Tr>
                      <Th color="white">Line</Th>
                      <Th color="white">Order Date</Th>
                      <Th color="white">Date Needed</Th>
                      <Th color="white">Customer Code</Th>
                      <Th color="white">Customer Name</Th>
                      <Th color="white">Area</Th>
                      <Th color="white">Route</Th>
                      <Th color="white">Item Code</Th>
                      <Th color="white">Item Description</Th>
                      <Th color="white">Category</Th>
                      <Th color="white">UOM</Th>
                      <Th color="white">Quantity Order</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {
                      // genusOrders?.genus_orders
                      genusOrders
                        ?.filter((val) => {
                          const newKeyword = new RegExp(
                            `${keyword.toLowerCase()}`
                          );
                          return val.name?.toLowerCase().match(newKeyword, "*");
                        })
                        ?.map((order, i) => (
                          <Tr key={i}>
                            <Td>{i + 1}</Td>
                            <Td>{order.dateOrdered}</Td>
                            <Td>{order.dateNeeded}</Td>
                            <Td>{order.fox}</Td>
                            <Td>{order.area}</Td>
                            <Td>{order.route}</Td>
                            <Td>{order.name}</Td>
                            <Td>{order.productcode}</Td>
                            <Td>{order.products}</Td>
                            <Td>{order.meattype}</Td>
                            <Td>{order.uom}</Td>
                            <Td>{order.qty}</Td>
                          </Tr>
                        ))
                    }
                  </Tbody>
                </Table>
              )}
            </PageScrollReusable>
          </VStack>
        </>
      ) : (
        ""
      )}
      {fromDate && toDate ? (
        <Text mt={3} fontSize="xs">
          Number of records: {fetchingData ? 'loading orders' : genusOrders?.length}
        </Text>
      ) : (
        ""
      )}
      {isError && (
        <ErrorModal
          isOpen={isError}
          onClose={closeError}
          errorData={errorData}
          openConfirm={openConfirm}
          isLoading={isLoading}
          fetchNotification={fetchNotification}
        />
      )}
      {isConfirm && (
        <ConfirmModal
          isOpen={isConfirm}
          onClose={closeConfirm}
          resultArray={resultArray}
          setIsLoading={setIsLoading}
          setErrorData={setErrorData}
          openError={openError}
          isLoading={isLoading}
          fetchNotification={fetchNotification}
        />
      )}
    </Flex>
  );
};
