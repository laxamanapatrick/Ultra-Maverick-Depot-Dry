import React, { useEffect, useRef, useState } from "react";
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
import { useForm, Controller } from "react-hook-form";
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
import axios from "axios";

const currentUser = decodeUser();

const schema = yup.object().shape({
  formData: yup.object().shape({
    id: yup.string(),
    customerCode: yup.string().required("Customer Code is required"),
    customerName: yup.string().required("Customer Name is required"),
    farmTypeId: yup.string().required("Farm Type is required"),
    companyId: yup.number().required().typeError("Company Name is required"),
    departmentId: yup
      .number()
      .required()
      .typeError("Department Category is required"),
    locationId: yup.number().required().typeError("Location Name is required"),
    mobileNumber: yup.string().required("Required"),
    leadMan: yup.string().required("Leadman is required"),
    address: yup.string().required("Address is required"),
  }),
});

const fetchCustomerApi = async (pageNumber, pageSize, status, search) => {
  const res = await apiClient.get(
    `Customer/GetAllCustomerWithPaginationOrig/${status}?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search}`
  );
  return res.data;
};

const CustomerManagementPage = () => {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState(true);
  const [search, setSearch] = useState("");

  const [codeDisable, setCodeDisable] = useState(false);

  const toast = useToast();

  const [company, setCompany] = useState([]);
  const [department, setDepartment] = useState([]);
  const [location, setLocation] = useState([]);

  const [pageTotal, setPageTotal] = useState(undefined);
  const {
    isOpen: isDrawerOpen,
    onOpen: openDrawer,
    onClose: closeDrawer,
  } = useDisclosure();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      formData: {
        id: "",
        customerCode: "",
        customerName: "",
        farmTypeId: "",
        companyId: "",
        departmentId: "",
        locationId: "",
        mobileNumber: "",
        leadMan: "",
        address: "",
        addedBy: currentUser.fullName,
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

  const fetchCustomer = () => {
    fetchCustomerApi(currentPage, pageSize, status, search).then((res) => {
      setIsLoading(false);
      setCustomers(res);
      setPageTotal(res.totalCount);
    });
  };

  // // FETCH COMPANY API
  const fetchCompanyApi = async () => {
    try {
      const res = await axios.get(
        "http://10.10.2.76:8000/api/dropdown/company?api_for=vladimir&status=1&paginate=0",
        {
          headers: {
            Authorization: "Bearer " + process.env.REACT_APP_FISTO_TOKEN,
          },
        }
      );
      setCompany(res.data.result.companies);
    } catch (error) {}
  };

  // // FETCH DEPT API
  const fetchDepartmentApi = async (id = "") => {
    try {
      const res = await axios.get(
        "http://10.10.2.76:8000/api/dropdown/department?status=1&paginate=0&company_id=" +
          id,
        {
          headers: {
            Authorization: "Bearer " + process.env.REACT_APP_FISTO_TOKEN,
          },
        }
      );
      setDepartment(res.data.result.departments);
    } catch (error) {}
  };

  // // FETCH Loc API
  const fetchLocationApi = async (id = "") => {
    try {
      const res = await axios.get(
        "http://10.10.2.76:8000/api/dropdown/location?status=1&paginate=0&department_id=" +
          id,
        {
          headers: {
            Authorization: "Bearer " + process.env.REACT_APP_FISTO_TOKEN,
          },
        }
      );
      setLocation(res.data.result.locations);
    } catch (error) {}
  };

  useEffect(() => {
    fetchCustomer();
  }, [status, pageSize, currentPage, search]);

  useEffect(() => {
    fetchCompanyApi();
    fetchDepartmentApi();
    fetchLocationApi();

    return () => {
      setCompany([]);
      setDepartment([]);
      setLocation([]);
      // setIsCoaSet(false);
    };
  }, []);

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
    let routeLabel;
    if (status) {
      routeLabel = "InActiveCustomer";
    } else {
      routeLabel = "ActivateCustomer";
    }

    apiClient
      .put(`Customer/${routeLabel}/${id}`, { id: id })
      .then((res) => {
        ToastComponent("Success", "Customer Updated", "success", toast);
        fetchCustomer();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const searchHandler = (inputValue) => {
    setSearch(inputValue);
  };

  const editHandler = (cus) => {
    openDrawer();
    setValue("formData", {
      id: cus.id,
      customerCode: cus.customerCode,
      customerName: cus.customerName,
      farmTypeId: cus.farmTypeId,
      companyId: company?.find((x) => x.name === cus.companyName)?.id,
      departmentId: department?.find((x) => x.name === cus.departmentName)?.id,
      locationId: location?.find((x) => x.name === cus.locationName)?.id,
      mobileNumber: cus.mobileNumber,
      leadMan: cus.leadMan,
      address: cus.address,
      modifiedBy: currentUser.fullName,
    });
    setCodeDisable(true);
  };

  const newCustomerHandler = () => {
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
              placeholder="Search: Customer Name"
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
                <Th color="white">Customer Code</Th>
                <Th color="white">Customer Name</Th>
                <Th color="white">Type</Th>
                <Th color="white">Company</Th>
                <Th color="white">Department</Th>
                <Th color="white">Location</Th>
                <Th color="white">Mobile Number</Th>
                <Th color="white">Leadman</Th>
                <Th color="white">Address</Th>
                <Th color="white">Date Added</Th>
                <Th color="white">Added By</Th>
                <Th color="white">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {customers.customer?.sort((a, b) => b.id - a.id)?.map((cus) => (
                <Tr key={cus.id}>
                  <Td>{cus.id}</Td>
                  <Td>{cus.customerCode}</Td>
                  <Td>{cus.customerName}</Td>
                  <Td>{cus.farmType}</Td>
                  <Td>{cus.companyName}</Td>
                  <Td>{cus.departmentName}</Td>
                  <Td>{cus.locationName}</Td>
                  <Td>{cus.mobileNumber}</Td>
                  <Td>{cus.leadMan}</Td>
                  <Td>{cus.address}</Td>
                  <Td>{cus.dateAdded}</Td>
                  <Td>{cus.addedBy}</Td>
                  <Td>
                    <Flex>
                      <HStack>
                        <Button
                          p={0}
                          background="none"
                          color="secondary"
                          onClick={() => editHandler(cus)}
                        >
                          <RiEditBoxFill />
                        </Button>
                        <Popover>
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
                                  {cus.isActive === true ? (
                                    <Text>
                                      Are you sure you want to set this customer
                                      inactive?
                                    </Text>
                                  ) : (
                                    <Text>
                                      Are you sure you want to set this customer
                                      active?
                                    </Text>
                                  )}
                                  <Button
                                    bgColor="secondary"
                                    color="white"
                                    _hover={{ bgColor: "accent" }}
                                    onClick={() =>
                                      changeStatusHandler(cus.id, cus.isActive)
                                    }
                                  >
                                    Yes
                                  </Button>
                                </VStack>
                              </PopoverBody>
                            </PopoverContent>
                          </Portal>
                        </Popover>
                      </HStack>
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </PageScroll>

      <Flex justifyContent="space-between" mt={5}>
        <Button
          leftIcon={<FcAddDatabase color="white" />}
          bgColor="secondary"
          onClick={newCustomerHandler}
          _hover={{ bgColor: "accent" }}
        >
          <Text color="white">New Customer</Text>
        </Button>

        {isDrawerOpen && (
          <DrawerComponent
            isOpen={isDrawerOpen}
            onClose={closeDrawer}
            register={register}
            errors={errors}
            isValid={isValid}
            watch={watch}
            setValue={setValue}
            handleSubmit={handleSubmit}
            fetchCustomer={fetchCustomer}
            control={control}
            codeDisable={codeDisable}
            company={company}
            department={department}
            location={location}
            fetchDepartmentApi={fetchDepartmentApi}
            fetchLocationApi={fetchLocationApi}
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

export default CustomerManagementPage;

const DrawerComponent = ({
  isOpen,
  onClose,
  register,
  errors,
  isValid,
  watch,
  setValue,
  handleSubmit,
  fetchCustomer,
  control,
  codeDisable,
  company,
  department,
  location,
  fetchDepartmentApi,
  fetchLocationApi,
}) => {
  const [farms, setFarms] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const toast = useToast();

  const submitHandler = (data) => {
    try {
      if (data.formData.id === "") {
        delete data.formData["id"];
        setisLoading(true);
        const res = apiClient
          .post("Customer/AddNewCustomer", {
            customerCode: data.formData.customerCode,
            customerName: data.formData.customerName,
            farmTypeId: data.formData.farmTypeId,
            companyCode: company?.find((x) => x.id === data.formData.companyId)
              ?.name,
            companyName: company?.find((x) => x.id === data.formData.companyId)
              ?.name,
            departmentName: department?.find(
              (x) => x.id === data.formData.departmentId
            )?.name,
            locationName: location?.find(
              (x) => x.id === data.formData.locationId
            )?.name,
            mobileNumber: data.formData.mobileNumber,
            leadMan: data.formData.leadMan,
            address: data.formData.address,
            addedBy: currentUser?.fullName,
          })
          .then((res) => {
            ToastComponent("Success", "New customer created", "success", toast);
            setisLoading(false);
            fetchCustomer();
            onClose(onClose);
          })
          .catch((err) => {
            setisLoading(false);
            ToastComponent("Error", err.response.data, "error", toast);
            data.formData.id = ""; // add property id to objects for if condition
          });
      } else {
        const res = apiClient
          .put(`Customer/UpdateCustomer/${data.formData.id}`, {
            id: data.formData.id,
            customerCode: data.formData.customerCode,
            customerName: data.formData.customerName,
            farmTypeId: data.formData.farmTypeId,
            companyCode: company?.find((x) => x.id === data.formData.companyId)
              ?.name,
            companyName: company?.find((x) => x.id === data.formData.companyId)
              ?.name,
            departmentName: department?.find(
              (x) => x.id === data.formData.departmentId
            )?.name,
            locationName: location?.find(
              (x) => x.id === data.formData.locationId
            )?.name,
            mobileNumber: data.formData.mobileNumber,
            leadMan: data.formData.leadMan,
            address: data.formData.address,
            addedBy: currentUser?.fullName,
          })
          .then((res) => {
            ToastComponent("Success", "Customer Updated", "success", toast);
            setisLoading(false);
            fetchCustomer();
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
    } catch (err) {
      console.log(err.request);
    }
  };

  const fetchFarms = async () => {
    try {
      const res = await apiClient.get("Customer/GetAllActiveFarms");
      setFarms(res.data);
    } catch (error) {}
  };

  useEffect(() => {
    try {
      fetchFarms();
    } catch (error) {}
  }, []);

  return (
    <Flex>
      <Drawer isOpen={isOpen} placement="center" onClose={onClose}>
        <DrawerOverlay />
        <form onSubmit={handleSubmit(submitHandler)}>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth="1px">Customer Form</DrawerHeader>
            <DrawerBody>
              <Stack spacing="7px">
                <Box>
                  <FormLabel>Customer Code:</FormLabel>
                  <Input
                    disabled={codeDisable}
                    readOnly={codeDisable}
                    _disabled={{ color: "black" }}
                    bgColor={codeDisable && "gray.300"}
                    placeholder="Please enter Customer Code"
                    {...register("formData.customerCode")}
                  />
                  <Text color="danger" fontSize="xs">
                    {errors.formData?.customerCode?.message}
                  </Text>
                </Box>

                <Box>
                  <FormLabel>Customer Name:</FormLabel>
                  <Input
                    placeholder="Please enter Customer Name"
                    {...register("formData.customerName")}
                  />
                  <Text color="danger" fontSize="xs">
                    {errors.formData?.customerName?.message}
                  </Text>
                </Box>

                <Box>
                  <Stack>
                    <Text fontWeight="semibold">Type:</Text>
                    {farms.length > 0 ? (
                      <Select
                        {...register("formData.farmTypeId")}
                        placeholder="Select Customer Type"
                      >
                        {farms.map((farm) => (
                          <option key={farm.id} value={farm.id}>
                            {farm.farmName}
                          </option>
                        ))}
                      </Select>
                    ) : (
                      "loading"
                    )}

                    <Text color="danger" fontSize="xs">
                      {errors.formData?.farmTypeId?.message}
                    </Text>
                  </Stack>
                </Box>

                <Box>
                  <FormLabel fontSize="sm">Company</FormLabel>

                  <HStack w="full">
                    <Select
                      {...register("formData.companyId")}
                      placeholder="Select Company"
                      fontSize="sm"
                      onChange={(e) => {
                        setValue("formData.departmentId", "");
                        setValue("formData.locationId", "");
                        fetchDepartmentApi(e.target.value);
                      }}
                    >
                      {company?.map((item) => {
                        return (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        );
                      })}
                    </Select>
                  </HStack>

                  <Text color="red" fontSize="xs">
                    {errors.formData?.companyId?.message}
                  </Text>
                </Box>

                <Box>
                  <FormLabel fontSize="sm">Department</FormLabel>
                  <Select
                    {...register("formData.departmentId")}
                    placeholder="Select Department"
                    fontSize="sm"
                    onChange={(e) => {
                      setValue("formData.locationId", "");
                      fetchLocationApi(e.target.value);
                    }}
                  >
                    {department?.map((dept) => {
                      return (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      );
                    })}
                  </Select>

                  <Text color="red" fontSize="xs">
                    {errors.formData?.departmentId?.message}
                  </Text>
                </Box>

                <Box>
                  <FormLabel fontSize="sm">Location</FormLabel>
                  <Select
                    {...register("formData.locationId")}
                    placeholder="Select Location"
                    fontSize="sm"
                  >
                    {location?.map((item) => {
                      return (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      );
                    })}
                  </Select>

                  <Text color="red" fontSize="xs">
                    {errors.formData?.locationId?.message}
                  </Text>
                </Box>

                <Box>
                  <FormLabel>Mobile Number:</FormLabel>
                  <Input
                    type="number"
                    placeholder="Please enter Mobile Number"
                    {...register("formData.mobileNumber")}
                  />
                  <Text color="danger" fontSize="xs">
                    {errors.formData?.mobileNumber?.message}
                  </Text>
                </Box>

                <Box>
                  <FormLabel>Leadman:</FormLabel>
                  <Input
                    placeholder="Please enter Leadman"
                    {...register("formData.leadMan")}
                  />
                  <Text color="danger" fontSize="xs">
                    {errors.formData?.leadMan?.message}
                  </Text>
                </Box>

                <Box>
                  <FormLabel>Address:</FormLabel>
                  <Input
                    placeholder="Please enter Address"
                    {...register("formData.address")}
                  />
                  <Text color="danger" fontSize="xs">
                    {errors.formData?.address?.message}
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
                disabled={
                  !isValid
                }
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
