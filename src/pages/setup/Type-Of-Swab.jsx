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
  Skeleton,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormLabel,
} from "@chakra-ui/react";
import apiClient from "../../services/apiClient";
import { FcAddDatabase } from "react-icons/fc";
import { RiEditBoxFill } from "react-icons/ri";
import { GiChoice } from "react-icons/gi";
import { useDisclosure } from "@chakra-ui/react";
import { ToastComponent } from "../../components/Toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { decodeUser } from "../../services/decode-user";
import PageScroll from "../../components/PageScroll";
import {
  Pagination,
  usePagination,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
  PaginationContainer,
  PaginationPageGroup,
} from "@ajna/pagination";
import { FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";

const currentUser = decodeUser();

const schema = yup.object().shape({
  formData: yup.object().shape({
    id: yup.string(),
    typeofSwabName: yup.string().required("Type of Swab is required"),
  }),
});

const fetchTypeOfSwabApi = async (pageNumber, pageSize, status, search) => {
  const res = await apiClient.get(
    `LabTestMasterList/GetAllTypeOfSwabPaginationOrig/${status}?PageNumber=${pageNumber}&PageSize=${pageSize}&search=${search}`
  );
  return res.data;
};

const TypeOfSwab = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState(true);
  const [search, setSearch] = useState("");
  const [codeDisable, setCodeDisable] = useState(false);

  const [typeOfSwabs, setTypeOfSwabs] = useState([]);

  const toast = useToast();

  const [pageTotal, setPageTotal] = useState(undefined);
  const {
    isOpen: isDrawerOpen,
    onOpen: openDrawer,
    onClose: closeDrawer,
  } = useDisclosure();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      formData: {
        id: "",
        typeofSwabName: "",
        modifiedBy: currentUser.fullName,
      },
    },
  });

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

  const fetchTypeOfSwab = () => {
    fetchTypeOfSwabApi(currentPage, pageSize, status, search).then((res) => {
      setIsLoading(false);
      setTypeOfSwabs(res);
      setPageTotal(res.totalCount);
    });
  };

  useEffect(() => {
    fetchTypeOfSwab();

    return () => {
      setTypeOfSwabs([]);
    };
  }, [status, pageSize, currentPage, search]);

  const handlePageChange = (nextPage) => {
    setCurrentPage(nextPage);
  };

  const handlePageSizeChange = (e) => {
    const pageSize = Number(e.target.value);
    setPageSize(pageSize);
  };

  const statusHandler = (data) => {
    setStatus(data);
  };

  const changeStatusHandler = (id, status) => {
    if (id) {
      Swal.fire({
        title: `Change Type Of Swab status`,
        text: `Are you sure you want to set this type of swab ${
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
            .put(`LabTestMasterList/UpdateTypeOfSwabStatus`, {
              id: id,
              isActive: !status,
              modifiedBy: currentUser.fullName,
            })
            .then((res) => {
              console.log(res);
              fetchTypeOfSwab()
              ToastComponent("Success", res?.data, "success", toast);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    }
  };

  const searchHandler = (inputValue) => {
    setSearch(inputValue);
  };

  const editHandler = (data) => {
    openDrawer();
    setValue("formData", {
      id: data.id,
      typeofSwabName: data.typeofSwabName,
      modifiedBy: currentUser.fullName,
    });
    setCodeDisable(true);
  };

  const handleAdd = () => {
    setCodeDisable(false);
    openDrawer();
    reset();
  };

  return (
    <Flex p={5} w="full" flexDirection="column">
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
              onChange={(e) => searchHandler(e.target.value)}
              focusBorderColor="accent"
            />
          </InputGroup>
        </HStack>

        <HStack>
          <Text>STATUS: </Text>
          <Select onChange={(e) => statusHandler(e.target.value)}>
            <option value={true}>Active</option>
            <option value={false}>Inactive</option>
          </Select>
        </HStack>
      </Flex>

      <PageScroll>
        {isLoading ? (
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
                <Th color="white">ID</Th>
                <Th color="white">Type of Swab Name</Th>
                {/* <Th color="white">Date Added</Th> */}
                <Th color="white">Modified By</Th>
                <Th color="white">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {typeOfSwabs?.typeOfSwab
                ?.map((tos) => (
                  <Tr key={tos.id}>
                    <Td>{tos.id}</Td>
                    <Td>{tos.typeofSwabName}</Td>
                    {/* <Td>{tos.addedBy}</Td> */}
                    <Td>{tos.modifiedBy}</Td>
                    <Td>
                      <Flex>
                        <HStack>
                          <Button
                            p={0}
                            background="none"
                            color="secondary"
                            onClick={() => editHandler(tos)}
                          >
                            <RiEditBoxFill />
                          </Button>
                          <Button
                            p={0}
                            background="none"
                            color="secondary"
                            onClick={() =>
                              changeStatusHandler(
                                tos.id,
                                tos.isActive
                              )
                            }
                          >
                            <GiChoice />
                          </Button>
                        </HStack>
                      </Flex>
                    </Td>
                  </Tr>
                ))
                .reverse()}
            </Tbody>
          </Table>
        )}
      </PageScroll>

      <Flex justifyContent="space-between" mt={5}>
        <Button
          leftIcon={<FcAddDatabase color="white" />}
          bgColor="secondary"
          onClick={handleAdd}
          _hover={{ bgColor: "accent" }}
        >
          <Text color="white">New Type Of Swab Here</Text>
        </Button>

        {isDrawerOpen && (
          <DrawerComponent
            isOpen={isDrawerOpen}
            onClose={closeDrawer}
            register={register}
            errors={errors}
            isValid={isValid}
            handleSubmit={handleSubmit}
            fetchTypeOfSwab={fetchTypeOfSwab}
            watch={watch}
            codeDisable={codeDisable}
          />
        )}

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
    </Flex>
  );
};

export default TypeOfSwab;

const DrawerComponent = ({
  isOpen,
  onClose,
  register,
  errors,
  isValid,
  handleSubmit,
  fetchTypeOfSwab,
  watch,
  codeDisable,
}) => {
  const [isLoading, setisLoading] = useState(false);
  const toast = useToast();

  const submitHandler = (data) => {
    try {
      if (data.formData.id === "") {
        delete data.formData["id"];
        setisLoading(true);
        const res = apiClient
          .post("LabTestMasterlist/AddNewTypeOfSwab", data.formData)
          .then((res) => {
            ToastComponent(
              "Success",
              "New type of swab created",
              "success",
              toast
            );
            setisLoading(false);
            fetchTypeOfSwab();
            onClose(onClose);
          })
          .catch((err) => {
            setisLoading(false);
            ToastComponent("Error", err.response.data, "error", toast);
            data.formData.id = ""; // add property id to objects for if condition
          });
      } else {
        const res = apiClient
          .put(
            `LabTestMasterlist/UpdateTypeOfSwab`,
            data.formData
          )
          .then((res) => {
            ToastComponent("Success", "Type Of Swab Updated", "success", toast);
            setisLoading(false);
            fetchTypeOfSwab();
            onClose(onClose);
          })
          .catch((err) => {
            ToastComponent(
              "Update Failed",
              err.response.data,
              "warning",
              toast
            );
          });
      }
    } catch (err) {}
  };

  return (
    <Flex>
      <Drawer isOpen={isOpen} placement="center" onClose={onClose}>
        <DrawerOverlay />
        <form onSubmit={handleSubmit(submitHandler)}>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth="1px">
              {watch("formData.id")
                ? "Edit Type Of Swab Form"
                : "Add Type Of Swab Form"}
            </DrawerHeader>
            <DrawerBody>
              <Stack spacing="7px">
                <Box>
                  <FormLabel>Type Of Swab Name:</FormLabel>
                  <Input
                    placeholder="Please enter Sample Type Name"
                    {...register("formData.typeofSwabName")}
                  />
                  <Text color="danger" fontSize="xs">
                    {errors.formData?.typeofSwabName?.message}
                  </Text>
                </Box>
              </Stack>
            </DrawerBody>

            <DrawerFooter borderTopWidth="1px">
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                bgColor="secondary"
                color="white"
                _hover={{ bgColor: "accent" }}
                disabled={!isValid}
                isLoading={isLoading}
              >
                Submit
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </form>
      </Drawer>
    </Flex>
  );
};
