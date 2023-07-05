import React, { useEffect, useState } from "react";
import {
  Box,
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
  useToast,
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
import PageScrollReusable from "../../components/PageScroll-Reusable";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import moment from "moment/moment";
import apiClient from "../../services/apiClient";
import { GiChoice } from "react-icons/gi";
import Swal from "sweetalert2";
import { ToastComponent } from "../../components/Toast";

const fetchAccountTitlesOnUMApi = async (pageNumber, pageSize, status) => {
  const res = await apiClient.get(
    `AccountTitle/GetAllAccountTitleAsyncPagination/${status}?PageNumber=${pageNumber}&PageSize=${pageSize}`
  );
  return res.data;
};

const AccountTtitles = () => {
  const toast = useToast();
  const [accountUM, setAccountUM] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageTotal, setPageTotal] = useState(undefined);
  const [status, setStatus] = useState(true);
  const [keyword, setKeyword] = useState("");

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

  const fetchAccountTitlesOnUM = () => {
    fetchAccountTitlesOnUMApi(currentPage, pageSize, status).then((res) => {
      setIsLoading(false);
      setAccountUM(res?.accountTitles);
      setPageTotal(res.totalCount);
    });
  };

  useEffect(() => {
    fetchAccountTitlesOnUM();

    return () => {
      setAccountUM([]);
    };
  }, [status, pageSize, currentPage]);

  // FETCH Account API on FISTO
  const [account, setAccount] = useState([]);
  const fetchAccountApi = async () => {
    try {
      const res = await axios.get(
        "http://10.10.2.76:8000/api/dropdown/account-title?status=1&paginate=0",
        {
          headers: {
            Authorization: "Bearer " + process.env.REACT_APP_FISTO_TOKEN,
          },
        }
      );
      setAccount(res.data.result.account_titles);
    } catch (error) {}
  };

  useEffect(() => {
    fetchAccountApi();

    return () => {
      setAccount([]);
    };
  }, []);

  const handlePageChange = (nextPage) => {
    setCurrentPage(nextPage);
  };

  const handlePageSizeChange = (e) => {
    const pageSize = Number(e.target.value);
    setPageSize(pageSize);
  };

  const formattedSyncBody = account?.map((item) => {
    return {
      accountTitleId: item.id,
      accountTitleCode: item.code,
      accountTitleName: item.name,
      createdAt: moment(new Date()).format("yyyy-MM-DD"),
      updatedAt: moment(new Date()).format("yyyy-MM-DD"),
      // isActive: true,
    };
  });

  const handleSync = async () => {
    try {
      await apiClient.post(
        `AccountTitle/AddNewAccountTitle`,
        formattedSyncBody
      );
    } catch (error) {
      console.log(error);
    }
  };

  const changeStatusHandler = (id, status) => {
    if (id) {
      Swal.fire({
        title: `Change Account Title status`,
        text: `Are you sure you want to set this account title ${
          status ? "inactive" : "active"
        }?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then((res) => {
        if (res.isConfirmed) {
          apiClient
            .patch(`AccountTitle/UpdateAccountTitleStatus`, {
              accountTitleId: id,
              isActive: !status,
            })
            .then((res) => {
              fetchAccountTitlesOnUM();
              ToastComponent("Success", res?.data, "success", toast);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    }
  };

  return (
    <>
      <VStack minHeight="70vh" maxHeight="83vh" w="full" p={5}>
        <Text
          border="1px"
          borderStyle="dashed"
          mt={0.2}
          fontSize="sm"
          w="full"
          textAlign="center"
        >
          Account Titles Syncing
        </Text>
        <Flex w="full" flexDirection="column">
          <Flex mb={2} justifyContent="space-between">
            <HStack>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<FaSearch color="gray.300" />}
                />
                <Input
                  type="text"
                  placeholder="Search: Keyword here"
                  onChange={(e) => setKeyword(e.target.value)}
                  focusBorderColor="accent"
                />
              </InputGroup>
            </HStack>

            <HStack>
              <Text>STATUS: </Text>
              <Select onChange={(e) => setStatus(e.target.value)}>
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </Select>
            </HStack>
          </Flex>
          <PageScrollReusable maxHeight="70vh">
            <Table size="sm">
              <Thead bgColor="secondary" position="sticky" top={0} zIndex={1}>
                <Tr>
                  <Th color="white">Account Title ID</Th>
                  <Th color="white">Account Title Code</Th>
                  <Th color="white">Account Title Name</Th>
                  <Th color="white">Change Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {accountUM
                  ?.filter((val) => {
                    const newKeyword = new RegExp(`${keyword.toLowerCase()}`);
                    return (
                      val.accountTitleCode
                        ?.toLowerCase()
                        .match(newKeyword, "*") ||
                      val.accountTitleName
                        ?.toLowerCase()
                        .match(newKeyword, "*") ||
                      val.accountTitleId
                        ?.toString()
                        ?.toLowerCase()
                        .match(newKeyword, "*")
                    );
                  })
                  ?.map((item, i) => (
                    <Tr key={i}>
                      <Td>{item.accountTitleId}</Td>
                      <Td>{item.accountTitleCode}</Td>
                      <Td>{item.accountTitleName}</Td>
                      <Td>
                        <Button
                          p={0}
                          background="none"
                          color="secondary"
                          onClick={() =>
                            changeStatusHandler(
                              item.accountTitleId,
                              item.isActive
                            )
                          }
                        >
                          <GiChoice />
                        </Button>
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </PageScrollReusable>
        </Flex>
        <Flex justifyContent="space-between" width="full">
          <Button mx={2} size="sm" colorScheme="blue" onClick={handleSync}>
            Sync
          </Button>
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
                    <option value={Number(10)}>10</option>
                    <option value={Number(25)}>25</option>
                    <option value={Number(50)}>50</option>
                  </Select>
                </HStack>
              </PaginationContainer>
            </Pagination>
          </Stack>
        </Flex>
      </VStack>
    </>
  );
};

export default AccountTtitles;
