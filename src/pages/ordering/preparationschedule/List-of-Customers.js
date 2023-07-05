// New File for New UI

import React, { useState, useEffect } from "react";
import {
  Button,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  useDisclosure,
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
import apiClient from "../../../services/apiClient";
import { FaSearch } from "react-icons/fa";
import { LoadingRecords } from "../../../assets/Lottie-Animations";

const fetchCustomerWithOrdersApi = async (pageNumber, pageSize) => {
  const res = await apiClient.get(
    `Ordering/GetAllListOfOrdersPagination?PageNumber=${pageNumber}&PageSize=${pageSize}`
  );
  return res.data;
};

const ListofCustomers = ({
  farmName,
  setFarmName,
  setCheckedItems,
  orders,
  fetchOrders,
}) => {
  const [customers, setCustomers] = useState([]);
  const [pageTotal, setPageTotal] = useState(undefined);
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const outerLimit = 2;
  const innerLimit = 2;
  const {
    currentPage,
    setCurrentPage,
    pagesCount,
    pages,
    setPageSize,
    pageSize,
  } = usePagination({
    total: pageTotal,
    limits: {
      outer: outerLimit,
      inner: innerLimit,
    },
    initialState: { currentPage: 1, pageSize: 5 },
  });

  const fetchCustomerWithOrders = () => {
    fetchCustomerWithOrdersApi(currentPage, pageSize).then((res) => {
      setIsLoading(false);
      setCustomers(res);
      setPageTotal(res.totalCount);
    });
  };

  useEffect(() => {
    fetchCustomerWithOrders();

    return () => {
      setCustomers([]);
    };
  }, [currentPage, pageSize]);

  const handlePageChange = (nextPage) => {
    setCurrentPage(nextPage);
  };

  const handlePageSizeChange = (e) => {
    const pageSize = Number(e.target.value);
    setPageSize(pageSize);
    setCurrentPage(1);
  };

  // useEffect(() => {
  //   if (orders?.length === 0) {
  //     fetchOrders();
  //     setTimeout(() => {
  //       if (orders?.length === 0) {
  //         fetchCustomerWithOrders();
  //       }
  //     }, 500);
  //   }
  // }, [orders]);

  return (
    <Flex w="full" px={7} flexDirection="column">
      <HStack w="25%" mb={2} mt={5}>
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={<FaSearch color="gray.300" />}
          />
          <Input
            type="text"
            placeholder="Search: Customer Name"
            onChange={(e) => {
              setKeyword(e.target.value);
              setCheckedItems([]);
              setFarmName("");
            }}
            focusBorderColor="accent"
          />
        </InputGroup>
      </HStack>

      <VStack w="full" spacing={0} justifyContent="center">
        <Text
          w="full"
          fontWeight="semibold"
          fontSize="md"
          bgColor="secondary"
          color="white"
          textAlign="center"
        >
          List of Customers
        </Text>
        {isLoading ? (
          <LoadingRecords />
        ) : (
          <PageScrollReusable maxHeight="275px">
            <Table size="sm">
              <Thead bgColor="secondary" top={0} position="sticky" zIndex="1">
                <Tr>
                  <Th color="white">Line</Th>
                  <Th color="white">Customer Code</Th>
                  <Th color="white">Customer Name</Th>
                  <Th color="white">Customer Type</Th>
                  <Th color="white">Company</Th>
                  <Th color="white">Department</Th>
                  <Th color="white">Location</Th>
                  {/* <Th color="white">View Orders</Th> */}
                </Tr>
              </Thead>
              <Tbody>
                {customers?.orders
                  ?.filter((val) => {
                    const newKeyword = new RegExp(`${keyword.toLowerCase()}`);
                    return val.customerName
                      ?.toLowerCase()
                      .match(newKeyword, "*");
                  })
                  ?.map((item, i) => (
                    <Tr
                      key={i}
                      cursor="pointer"
                      bgColor={
                        farmName === item.customerName ? "table_accent" : ""
                      }
                      onClick={() => {
                        setFarmName(item.customerName);
                        fetchOrders()
                        setCheckedItems([]);
                      }}
                    >
                      <Td>{i + 1}</Td>
                      <Td>{item.customerCode}</Td>
                      <Td>{item.customerName}</Td>
                      <Td>{item.farmName}</Td>
                      <Td>{item.companyName}</Td>
                      <Td>{item.locationName}</Td>
                      <Td>{item.departmentName}</Td>
                      {/* <Td>
                    <Button size="xs" colorScheme="green">
                      View Orders
                    </Button>
                  </Td> */}
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </PageScrollReusable>
        )}
      </VStack>

      <Flex w="full" justifyContent="end">
        <Stack>
          <Pagination
            pagesCount={pagesCount}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          >
            <PaginationContainer>
              <PaginationPrevious
                bg="secondary"
                color="white"
                p={1}
                _hover={{ bg: "accent", color: "white" }}
              >
                {"<<"}
              </PaginationPrevious>
              <PaginationPageGroup ml={1} mr={1}>
                {pages.map((page) => (
                  <PaginationPage
                    _hover={{ bg: "accent", color: "white" }}
                    p={3}
                    bg="secondary"
                    color="white"
                    key={`pagination_page_${page}`}
                    page={page}
                  />
                ))}
              </PaginationPageGroup>
              <HStack>
                <PaginationNext
                  bg="secondary"
                  color="white"
                  p={1}
                  _hover={{ bg: "accent", color: "white" }}
                >
                  {">>"}
                </PaginationNext>
                <Select onChange={handlePageSizeChange} variant="filled">
                  <option value={Number(5)}>5</option>
                  <option value={Number(25)}>25</option>
                </Select>
              </HStack>
            </PaginationContainer>
          </Pagination>
        </Stack>
      </Flex>
    </Flex>
  );
};

export default ListofCustomers;
