import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Portal,
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
  VStack,
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
    sampleTypeName: yup.string().required("Sample Type Name is required"),
  }),
});

const fetchSampleTypeApi = async (pageNumber, pageSize, status, search) => {
  const res = await apiClient.get(
    `LabTestMasterList/GetAllSampleTypePaginationOrig/${status}?PageNumber=${pageNumber}&PageSize=${pageSize}&search=${search}`
  );
  return res.data;
};

const SampleType = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState(true);
  const [search, setSearch] = useState("");
  const [codeDisable, setCodeDisable] = useState(false);

  const [sampleTypes, setSampleTypes] = useState([]);

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
        sampleTypeName: "",
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

  const fetchSampleType = () => {
    fetchSampleTypeApi(currentPage, pageSize, status, search).then((res) => {
      setIsLoading(false);
      setSampleTypes(res);
      setPageTotal(res.totalCount);
    });
  };

  useEffect(() => {
    fetchSampleType();

    return () => {
      setSampleTypes([]);
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
        title: `Change Sample Type status`,
        text: `Are you sure you want to set this sample type ${
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
            .put(`LabTestMasterList/UpdateSampleTypeStatus`, {
              id: id,
              isActive: !status,
              modifiedBy: currentUser.fullName,
            })
            .then((res) => {
              ToastComponent("Success", res?.data, "success", toast);
              fetchSampleType()
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
      sampleTypeName: data.sampleTypeName,
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
              placeholder="Search: Parameter here"
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
                <Th color="white">Sample Type Name</Th>
                {/* <Th color="white">Date Added</Th> */}
                <Th color="white">Modified By</Th>
                <Th color="white">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {sampleTypes?.sampleTypes
                ?.map((sampleType) => (
                  <Tr key={sampleType.id}>
                    <Td>{sampleType.id}</Td>
                    <Td>{sampleType.sampleTypeName}</Td>
                    <Td>{sampleType.modifiedBy}</Td>
                    {/* <Td>{sampleType.dateAdded}</Td> */}
                    <Td>
                      <Flex>
                        <HStack>
                          <Button
                            p={0}
                            background="none"
                            color="secondary"
                            onClick={() => editHandler(sampleType)}
                          >
                            <RiEditBoxFill />
                          </Button>
                          <Button
                            p={0}
                            background="none"
                            color="secondary"
                            onClick={() =>
                              changeStatusHandler(
                                sampleType.id,
                                sampleType.isActive
                              )
                            }
                          >
                            <GiChoice />
                          </Button>
                          {/* <Popover>
                            <PopoverTrigger>
                              <Button p={0} background="none">
                                <GiChoice />
                              </Button>
                            </PopoverTrigger>
                            <Portal>
                              <PopoverContent>
                                <PopoverArrow />
                                <PopoverCloseButton />
                                <PopoverBody>
                                  <VStack>
                                    {sampleType.isActive === true ? (
                                      <Text>
                                        Are you sure you want to set this Sample
                                        Type inactive?
                                      </Text>
                                    ) : (
                                      <Text>
                                        Are you sure you want to set this Sample
                                        Type active?
                                      </Text>
                                    )}
                                    <Button
                                      bgColor="secondary"
                                      color="white"
                                      _hover={{ bgColor: "accent" }}
                                      onClick={() =>
                                        changeStatusHandler(
                                          sampleType.id,
                                          sampleType.isActive
                                        )
                                      }
                                    >
                                      Yes
                                    </Button>
                                  </VStack>
                                </PopoverBody>
                              </PopoverContent>
                            </Portal>
                          </Popover> */}
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
          <Text color="white">New Sample Type Here</Text>
        </Button>

        {isDrawerOpen && (
          <DrawerComponent
            isOpen={isDrawerOpen}
            onClose={closeDrawer}
            register={register}
            errors={errors}
            isValid={isValid}
            handleSubmit={handleSubmit}
            fetchSampleType={fetchSampleType}
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

export default SampleType;

const DrawerComponent = ({
  isOpen,
  onClose,
  register,
  errors,
  isValid,
  handleSubmit,
  fetchSampleType,
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
          .post("LabTestMasterlist/AddNewSampleType", data.formData)
          .then((res) => {
            ToastComponent(
              "Success",
              "New sample type created",
              "success",
              toast
            );
            setisLoading(false);
            fetchSampleType();
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
            `LabTestMasterlist/UpdateSampleType`,
            data.formData
          )
          .then((res) => {
            ToastComponent("Success", "Sample Type Updated", "success", toast);
            setisLoading(false);
            fetchSampleType();
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
                ? "Edit Sample Type Form"
                : "Add Sample Type Form"}
            </DrawerHeader>
            <DrawerBody>
              <Stack spacing="7px">
                <Box>
                  <FormLabel>Sample Type Name:</FormLabel>
                  <Input
                    placeholder="Please enter Description Name"
                    {...register("formData.sampleTypeName")}
                  />
                  <Text color="danger" fontSize="xs">
                    {errors.formData?.sampleTypeName?.message}
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
