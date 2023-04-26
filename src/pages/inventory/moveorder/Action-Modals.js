import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Text,
  toast,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { RiQuestionnaireLine } from "react-icons/ri";
import apiClient from "../../../services/apiClient";
import { ToastComponent } from "../../../components/Toast";
import { decodeUser } from "../../../services/decode-user";
// import COA from "../../coa-modal/COA";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";

const currentUser = decodeUser();

//Add Button

export const AddQuantityConfirmation = ({
  isOpen,
  onClose,
  id,
  orderNo,
  itemCode,
  quantityOrdered,
  fetchOrderList,
  fetchPreparedItems,
  setQuantity,
  expirationDate,
  setHighlighterId,
  warehouseId,
  setWarehouseId,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = () => {
    const submitData = {
      warehouseId: warehouseId,
      orderNoPkey: id,
      orderNo: orderNo,
      itemCode: itemCode,
      quantityOrdered: Number(quantityOrdered),
      expirationDate: !expirationDate ? null : expirationDate,
      preparedBy: currentUser.fullName,
    };
    setIsLoading(true);
    try {
      const res = apiClient
        .post(`Ordering/PrepareItemsForMoveOrder`, submitData)
        .then((res) => {
          ToastComponent(
            "Success",
            "Quantity has been prepared.",
            "success",
            toast
          );
          setQuantity("");
          setHighlighterId("");
          setWarehouseId("");
          onClose();
          fetchOrderList();
          fetchPreparedItems();
        })
        .catch((err) => {
          ToastComponent("Error", "Add Failed", "error", toast);
          setIsLoading(false);
        });
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => {}} size="xl" isCentered>
        <ModalContent>
          <ModalHeader>
            <Flex justifyContent="center">
              <RiQuestionnaireLine fontSize="35px" />
            </Flex>
          </ModalHeader>
          <ModalCloseButton onClick={onClose} />

          <ModalBody>
            <VStack justifyContent="center">
              <Text>Are you sure you want to add this quantity?</Text>
              <Text>{`[ Order No. ${orderNo} ] [ Item Code ${itemCode} ] [ Quantity Ordered ${quantityOrdered} ]`}</Text>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <ButtonGroup size="sm" mt={3}>
              <Button
                onClick={submitHandler}
                isLoading={isLoading}
                disabled={isLoading}
                colorScheme="blue"
                px={4}
              >
                Yes
              </Button>
              <Button
                onClick={onClose}
                isLoading={isLoading}
                disabled={isLoading}
                colorScheme="red"
                px={4}
              >
                No
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

//Cancel Prepared

export const CancelConfirmation = ({
  isOpen,
  onClose,
  id,
  fetchPreparedItems,
  fetchOrderList,
  setCancelId,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = () => {
    setIsLoading(true);
    try {
      const res = apiClient
        .put(`Ordering/CancelPreparedItems`, { id: id })
        .then((res) => {
          ToastComponent(
            "Success",
            "Successfully cancelled prepared item",
            "success",
            toast
          );
          setCancelId("");
          fetchPreparedItems();
          fetchOrderList();
          setIsLoading(false);
          onClose();
        })
        .catch((err) => {
          ToastComponent("Error", "Cancel failed", "error", toast);
          setIsLoading(false);
        });
    } catch (error) {}
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => {}} size="xl" isCentered>
        <ModalContent>
          <ModalHeader>
            <Flex justifyContent="center">
              <RiQuestionnaireLine fontSize="35px" />
            </Flex>
          </ModalHeader>
          <ModalCloseButton onClick={onClose} />

          <ModalBody>
            <VStack justifyContent="center">
              <Text>Are you sure you want to cancel this prepared item?</Text>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <ButtonGroup size="sm" mt={3}>
              <Button
                onClick={submitHandler}
                isLoading={isLoading}
                disabled={isLoading}
                colorScheme="blue"
                px={4}
              >
                Yes
              </Button>
              <Button
                onClick={onClose}
                isLoading={isLoading}
                disabled={isLoading}
                colorScheme="red"
                px={4}
              >
                No
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

//Cancel Approved Date
export const CancelApprovedDate = ({
  isOpen,
  onClose,
  id,
  setOrderId,
  fetchApprovedMoveOrders,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = () => {
    setIsLoading(true);
    try {
      const res = apiClient
        .put(`Ordering/CancelOrdersInMoveOrder`, { orderNoPkey: id })
        .then((res) => {
          ToastComponent(
            "Success",
            "Successfully cancelled approved date",
            "success",
            toast
          );
          setOrderId("");
          fetchApprovedMoveOrders();
          setIsLoading(false);
          onClose();
        })
        .catch((err) => {
          ToastComponent("Error", "Cancel failed", "error", toast);
          setIsLoading(false);
        });
    } catch (error) {}
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => {}} size="xl" isCentered>
        <ModalContent>
          <ModalHeader>
            <Flex justifyContent="center">
              <RiQuestionnaireLine fontSize="35px" />
            </Flex>
          </ModalHeader>
          <ModalCloseButton onClick={onClose} />

          <ModalBody>
            <VStack justifyContent="center">
              <Text>
                Are you sure you want to cancel this approved date for
                re-scheduling?
              </Text>
            </VStack>
          </ModalBody>

          <ModalFooter mt={10}>
            <ButtonGroup size="sm" mt={3}>
              <Button
                onClick={submitHandler}
                isLoading={isLoading}
                disabled={isLoading}
                colorScheme="blue"
                px={4}
              >
                Yes
              </Button>
              <Button
                onClick={onClose}
                isLoading={isLoading}
                disabled={isLoading}
                colorScheme="red"
                px={4}
              >
                No
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

//Save Button

export const SaveButton = ({
  deliveryStatus,
  batchNumber,
  orderListData,
  fetchApprovedMoveOrders,
  fetchOrderList,
  setOrderId,
  setHighlighterId,
  setItemCode,
  setDeliveryStatus,
  setButtonChanger,
  setCurrentPage,
  currentPage,
  fetchNotification,
  unsetRequest,
  userId,
  unsetOrderId,
  setPageDisable,
  setPreparingStatus,
  setFarmName,
  setOrderListData,
  moveData,
}) => {
  const {
    isOpen: isPlateNumber,
    onClose: closePlateNumber,
    onOpen: openPlateNumber,
  } = useDisclosure();

  return (
    <Flex w="full" justifyContent="end">
      <Button
        onClick={() => openPlateNumber()}
        disabled={
          !deliveryStatus
          // || !batchNumber
        }
        title={
          deliveryStatus
            ? `Save with delivery status "${deliveryStatus}" `
            : "Please select a delivery status."
        }
        size="sm"
        colorScheme="blue"
        px={6}
      >
        Save
      </Button>
      {
        <DeliveryStatusConfirmation
          isOpen={isPlateNumber}
          onClose={closePlateNumber}
          deliveryStatus={deliveryStatus}
          batchNumber={batchNumber}
          orderListData={orderListData}
          fetchApprovedMoveOrders={fetchApprovedMoveOrders}
          fetchOrderList={fetchOrderList}
          setOrderId={setOrderId}
          setHighlighterId={setHighlighterId}
          setItemCode={setItemCode}
          setDeliveryStatus={setDeliveryStatus}
          setButtonChanger={setButtonChanger}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          fetchNotification={fetchNotification}
          unsetRequest={unsetRequest}
          userId={userId}
          unsetOrderId={unsetOrderId}
          setPageDisable={setPageDisable}
          setPreparingStatus={setPreparingStatus}
          setFarmName={setFarmName}
          setOrderListData={setOrderListData}
          moveData={moveData}
        />
      }
    </Flex>
  );
};

const schema = yup.object().shape({
  formData: yup.object().shape({
    // companyCode: yup.string().required("Company Name is required"),
    // companyName: yup.string().required("Company Name is required"),
    // departmentCode: yup.string().required("Department Name is required"),
    // departmentName: yup.string().required("Department Category is required"),
    // locationCode: yup.string().required("Location Name is required"),
    // locationName: yup.string().required("Location Name is required"),
    accountTitles: yup.string().required("Account Name is required"),
  }),
});

export const DeliveryStatusConfirmation = ({
  isOpen,
  onClose,
  deliveryStatus,
  // batchNumber,
  orderListData,
  fetchApprovedMoveOrders,
  fetchOrderList,
  setOrderId,
  setHighlighterId,
  setItemCode,
  setDeliveryStatus,
  setButtonChanger,
  setCurrentPage,
  currentPage,
  fetchNotification,
  unsetRequest,
  userId,
  unsetOrderId,
  setPageDisable,
  setPreparingStatus,
  setFarmName,
  setOrderListData,
  moveData,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const departmentRef = useRef();
  const locationRef = useRef();

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
        companyCode: moveData[0]?.companyCode,
        companyName: moveData[0]?.companyName,
        // departmentCode: "",
        departmentName: moveData[0]?.departmentName,
        // locationCode: "",
        locationName: moveData[0]?.locationName,
        accountTitles: "",
        addedBy: currentUser.userName,
      },
    },
  });

  // const [company, setCompany] = useState([]);
  // const [department, setDepartment] = useState([]);
  // const [location, setLocation] = useState([]);
  const [account, setAccount] = useState([]);
  // // FETCH COMPANY API
  // const fetchCompanyApi = async () => {
  //   try {
  //     const res = await axios.get(
  //       "http://10.10.2.76:8000/api/dropdown/company?api_for=vladimir&status=1&paginate=0",
  //       {
  //         headers: {
  //           Authorization: "Bearer " + process.env.REACT_APP_FISTO_TOKEN,
  //         },
  //       }
  //     );
  //     setCompany(res.data.result.companies);
  //   } catch (error) {}
  // };

  // // FETCH DEPT API
  // const fetchDepartmentApi = async (id) => {
  //   try {
  //     const res = await axios.get(
  //       "http://10.10.2.76:8000/api/dropdown/department?status=1&paginate=0&company_id=" +
  //         id,
  //       {
  //         headers: {
  //           Authorization: "Bearer " + process.env.REACT_APP_FISTO_TOKEN,
  //         },
  //       }
  //     );
  //     setDepartment(res.data.result.departments);
  //   } catch (error) {}
  // };

  // // FETCH Loc API
  // const fetchLocationApi = async (id) => {
  //   try {
  //     const res = await axios.get(
  //       "http://10.10.2.76:8000/api/dropdown/location?status=1&paginate=0&company_id=" +
  //         id,
  //       {
  //         headers: {
  //           Authorization: "Bearer " + process.env.REACT_APP_FISTO_TOKEN,
  //         },
  //       }
  //     );
  //     setLocation(res.data.result.locations);
  //   } catch (error) {}
  // };

  // FETCH ACcount API
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

  // useEffect(() => {
  //   fetchCompanyApi();
  // }, []);

  useEffect(() => {
    fetchAccountApi();
  }, []);

  // useEffect(() => {
  //   if (watch("formData.companyCode")) {
  //     departmentRef.current.value = "";
  //     locationRef.current.value = "";
  //     setValue("formData.departmentCode", "");
  //     setValue("formData.departmentName", "");
  //     setValue("formData.locationCode", "");
  //     setValue("formData.locationName", "");
  //     fetchDepartmentApi();
  //   }
  // }, [watch("formData.companyCode")]);

  // useEffect(() => {
  //   if (watch("formData.departmentCode")) {
  //     locationRef.current.value = "";
  //     setValue("formData.locationCode", "");
  //     setValue("formData.locationName", "");
  //     fetchLocationApi();
  //   }
  // }, [watch("formData.departmentCode")]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const submitHandler = (data) => {
    const submitArray = orderListData?.map((item) => {
      return {
        id: item.id,
        deliveryStatus: deliveryStatus,
        companyCode: data.formData.companyCode,
        companyName: data.formData.companyName,
        // departmentCode: data.formData.departmentCode,
        departmentName: data.formData.departmentName,
        // locationCode: data.formData.locationCode,
        locationName: data.formData.locationName,
        accountTitles: data.formData.accountTitles,
        addedBy: currentUser.fullName,
        // batchNo: ""
      };
    });
    setIsLoading(true);
    try {
      const res = apiClient
        .put(`Ordering/AddDeliveryStatus`, submitArray)
        .then((res) => {
          ToastComponent(
            "Success",
            "Items prepared successfully.",
            "success",
            toast
          );
          fetchNotification();
          setOrderId("");
          setHighlighterId("");
          setItemCode("");
          setFarmName("");
          setDeliveryStatus("");
          setOrderListData([]);
          setCurrentPage(currentPage);
          setPageDisable(false);
          setButtonChanger(false);
          setPreparingStatus(false);
          setIsLoading(false);
          unsetRequest(unsetOrderId, userId);
          fetchApprovedMoveOrders();
          fetchOrderList();
          onClose();
        })
        .catch((err) => {
          ToastComponent("Error", "Save failed.", "error", toast);
          setIsLoading(false);
        });
    } catch (error) {}
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => {}} isCentered size="2xl">
        <ModalOverlay />
        <form onSubmit={handleSubmit(submitHandler)}>
          <ModalContent>
            <ModalHeader textAlign="center">Charge Of Accounts</ModalHeader>
            <ModalCloseButton onClick={handleClose} />
            <ModalBody>
              <Stack spacing={2} p={6}>
                <Box>
                  <FormLabel fontSize="sm">Company</FormLabel>
                  <Input readOnly {...register("formData.companyName")} bgColor="gray.200" />
                  {/* <Select
                    fontSize="sm"
                    onChange={(e) => {
                      setValue(
                        "formData.companyCode",
                        company.find(
                          (item) => item.id?.toString() === e.target.value
                        )?.code
                      );
                      setValue(
                        "formData.companyName",
                        company.find(
                          (item) => item.id?.toString() === e.target.value
                        )?.name
                      );
                      fetchDepartmentApi(e.target.value);
                    }}
                    placeholder="Select Company"
                    // {...register("formData.company")}
                  >
                    {company?.map((item) => {
                      return (
                        <option key={item.id} value={item.id}>
                          {item.code} - {item.name}
                        </option>
                      );
                    })}
                  </Select>
                  <Text color="red" fontSize="xs">
                    {errors.formData?.companyName?.message}
                  </Text> */}
                </Box>

                <Box>
                  <FormLabel fontSize="sm">Department</FormLabel>
                  <Input readOnly {...register("formData.departmentName")} bgColor="gray.200" />
                  {/* <Select
                    fontSize="sm"
                    placeholder="Select Department"
                    ref={departmentRef}
                    disabled={!watch("formData.companyCode")}
                    onChange={(e) => {
                      setValue(
                        "formData.departmentCode",
                        department.find(
                          (dept) => dept.id?.toString() === e.target.value
                        )?.id
                      );
                      setValue(
                        "formData.departmentName",
                        department.find(
                          (dept) => dept.id?.toString() === e.target.value
                        )?.name
                      );
                      fetchLocationApi(e.target.value);
                    }}
                  >
                    {department?.map((dept) => {
                      return (
                        <option key={dept.id} value={dept.id}>
                          {dept.id} - {dept.name}
                        </option>
                      );
                    })}
                  </Select>
                  <Text color="red" fontSize="xs">
                    {errors.formData?.departmentName?.message}
                  </Text> */}
                </Box>

                <Box>
                  <FormLabel fontSize="sm">Location</FormLabel>
                  <Input readOnly {...register("formData.locationName")} bgColor="gray.200" />
                  {/* <Select
                    fontSize="sm"
                    placeholder="Select Location"
                    disabled={!watch("formData.departmentCode")}
                    ref={locationRef}
                    onChange={(e) => {
                      setValue(
                        "formData.locationCode",
                        location.find(
                          (item) => item.id?.toString() === e.target.value
                        )?.id
                      );
                      setValue(
                        "formData.locationName",
                        location.find(
                          (item) => item.id?.toString() === e.target.value
                        )?.name
                      );
                      // fetchLocationApi(e.target.value);
                    }}
                  >
                    {location?.map((item) => {
                      return (
                        <option key={item.id} value={item.id}>
                          {item.id} - {item.name}
                        </option>
                      );
                    })}
                  </Select>
                  <Text color="red" fontSize="xs">
                    {errors.formData?.locationName?.message}
                  </Text> */}
                </Box>
                <Box>
                  <FormLabel fontSize="sm">Account Title</FormLabel>
                  <Select
                    bgColor="#fff8dc"
                    fontSize="sm"
                    onChange={(e) => {
                      // setValue(
                      //   "formData.accountCode",
                      //   account.find(
                      //     (acc) => acc.id?.toString() === e.target.value
                      //   )?.code
                      // );
                      setValue(
                        "formData.accountTitles",
                        account.find(
                          (acc) => acc.id?.toString() === e.target.value
                        )?.name
                      );
                      // fetchAccountApi(e.target.value);
                    }}
                    placeholder="Select Account"
                    // {...register("formData.company")}
                  >
                    {account?.map((item) => {
                      return (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      );
                    })}
                  </Select>
                  <Text color="red" fontSize="xs">
                    {errors.formData?.accountTitles?.message}
                  </Text>
                </Box>
              </Stack>
            </ModalBody>
            <ModalFooter gap={2}>
              <Button
                size="sm"
                colorScheme="blue"
                type="submit"
                isLoading={isLoading}
                disabled={isLoading || !watch("formData.accountTitles")}
              >
                Yes
              </Button>
              <Button
                size="sm"
                colorScheme="red"
                onClick={handleClose}
                isLoading={isLoading}
                disabled={isLoading}
              >
                No
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};
