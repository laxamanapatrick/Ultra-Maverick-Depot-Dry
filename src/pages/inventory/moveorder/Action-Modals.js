import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormLabel,
  HStack,
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
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { RiQuestionnaireLine } from "react-icons/ri";
import apiClient from "../../../services/apiClient";
import { ToastComponent } from "../../../components/Toast";
import { decodeUser } from "../../../services/decode-user";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import moment from "moment";

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
  fetchMoveOrder,
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
          fetchMoveOrder();
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
  fetchMoveOrder,
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
          fetchMoveOrder={fetchMoveOrder}
        />
      }
    </Flex>
  );
};

const schema = yup.object().shape({
  formData: yup.object().shape({
    companyId: yup
      .number()
      .required("Company Name is required")
      .typeError("Company Name is required"),
    departmentId: yup
      .number()
      .required("Department Category is required")
      .typeError("Department Category is required"),
    locationId: yup
      .number()
      .required("Location Name is required")
      .typeError("Location Name is required"),
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
  fetchMoveOrder,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [company, setCompany] = useState([]);
  const [department, setDepartment] = useState([]);
  const [location, setLocation] = useState([]);
  const [account, setAccount] = useState([]);

  const [isCoaSet, setIsCoaSet] = useState(false);

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

  useEffect(() => {
    fetchCompanyApi();
    fetchDepartmentApi();
    fetchLocationApi();
    fetchAccountApi();

    return () => {
      setCompany([]);
      setDepartment([]);
      setLocation([]);
      setAccount([]);
    };
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    reset,
    watch,
    control,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      formData: {
        companyId: "",
        departmentId: "",
        locationId: "",
        // companyId: company?.find((x) => x.name === moveData[0]?.companyName)
        //   ?.id,
        // departmentId: department?.find(
        //   (x) => x.name === moveData[0]?.departmentName
        // )?.id,
        // locationId: location?.find((x) => x.name === moveData[0]?.locationName)
        //   ?.id,
        accountTitles: "",
        addedBy: currentUser.userName,
      },
    },
  });

  useEffect(() => {
    if (!isCoaSet) {
      if (!watch("formData.companyId")) {
        setValue(
          "formData.companyId",
          company?.find((x) => x.name === moveData[0]?.companyName)?.id
        );
      }
      if (
        watch("formData.companyId") &&
        !watch("formData.departmentId") &&
        !watch("formData.locationId")
      ) {
        setValue(
          "formData.departmentId",
          department?.find((x) => x.name === moveData[0]?.departmentName)?.id
        );
      }
      if (
        watch("formData.companyId") &&
        watch("formData.departmentId") &&
        !watch("formData.locationId")
      ) {
        setValue(
          "formData.locationId",
          location?.find((x) => x.name === moveData[0]?.locationName)?.id
        );
        setIsCoaSet(true);
      }
    }
  }, [moveData, company, department, location]);

  const handleClose = () => {
    // reset();
    // setValue("formData.accountTitles", "");
    onClose();
    setValue(
      "formData",
      {
        companyId: company?.find((x) => x.name === moveData[0]?.companyName)
          ?.id,
        departmentId: department?.find(
          (x) => x.name === moveData[0]?.departmentName
        )?.id,
        locationId: location?.find((x) => x.name === moveData[0]?.locationName)
          ?.id,
        accountTitles: "",
        addedBy: currentUser.userName,
      },
      { shouldValidate: true }
    );
  };

  const submitHandler = (data) => {
    const submitArrayBody = orderListData?.map((item) => {
      return {
        id: item.id,
        deliveryStatus: deliveryStatus,
        companyCode: company?.find((x) => x.id === data.formData.companyId)
          ?.code,
        companyName: company?.find((x) => x.id === data.formData.companyId)
          ?.name,
        departmentName: department?.find(
          (x) => x.id === data.formData.departmentId
        )?.name,
        locationName: location?.find((x) => x.id === data.formData.locationId)
          ?.name,
        accountTitles: data.formData.accountTitles,
        addedBy: currentUser.fullName,
      };
    });
    console.log(submitArrayBody);
    setIsLoading(true);
    try {
      const res = apiClient
        .put(`Ordering/AddDeliveryStatus`, submitArrayBody)
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
          fetchMoveOrder();
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
        <ModalOverlay zIndex={10} />
        <form onSubmit={handleSubmit(submitHandler)}>
          <ModalContent zIndex={20}>
            <ModalHeader textAlign="center">Charge Of Accounts</ModalHeader>
            <ModalCloseButton onClick={handleClose} />
            <ModalBody>
              <Stack spacing={2} p={6}>
                <Box>
                  <FormLabel fontSize="sm">Company</FormLabel>

                  <HStack w="full">
                    <Controller
                      control={control}
                      name="formData.companyId"
                      defaultValue={
                        company?.find(
                          (x) => x.name === moveData[0]?.companyName
                        )?.id
                      }
                      render={({ field }) => (
                        <Select
                          {...field}
                          value={field.value || ""}
                          placeholder="Select Company"
                          fontSize="sm"
                          onChange={(e) => {
                            field.onChange(e);
                            setValue("formData.departmentId", "");
                            setValue("formData.locationId", "");
                            fetchDepartmentApi(e.target.value);
                          }}
                        >
                          {company?.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                        </Select>
                      )}
                    />
                  </HStack>

                  <Text color="red" fontSize="xs">
                    {errors.formData?.companyId?.message}
                  </Text>
                </Box>

                <Box>
                  <FormLabel fontSize="sm">Department</FormLabel>
                  <Controller
                    control={control}
                    name="formData.departmentId"
                    defaultValue={
                      department?.find(
                        (x) => x.name === moveData[0]?.departmentName
                      )?.id
                    }
                    render={({ field }) => (
                      <Select
                        {...field}
                        value={field.value || ""}
                        placeholder="Select Department"
                        fontSize="sm"
                        onChange={(e) => {
                          field.onChange(e);
                          setValue("formData.locationId", "");
                          fetchLocationApi(e.target.value);
                        }}
                      >
                        {department?.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name}
                          </option>
                        ))}
                      </Select>
                    )}
                  />

                  <Text color="red" fontSize="xs">
                    {errors.formData?.departmentId?.message}
                  </Text>
                </Box>

                <Box>
                  <FormLabel fontSize="sm">Location</FormLabel>
                  <Controller
                    control={control}
                    name="formData.locationId"
                    defaultValue={
                      location?.find(
                        (x) => x.name === moveData[0]?.locationName
                      )?.id
                    }
                    render={({ field }) => (
                      <Select
                        {...field}
                        value={field.value || ""}
                        placeholder="Select Location"
                        fontSize="sm"
                      >
                        {location?.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </Select>
                    )}
                  />

                  <Text color="red" fontSize="xs">
                    {errors.formData?.locationId?.message}
                  </Text>
                </Box>
                <Box>
                  <FormLabel fontSize="sm">Account Title</FormLabel>
                  <Controller
                    control={control}
                    name="formData.accountTitles"
                    defaultValue=""
                    render={({ field }) => (
                      <Select
                        {...field}
                        value={field.value || ""}
                        placeholder="Select Account"
                        fontSize="sm"
                        bgColor="#fff8dc"
                        isSearchable
                      >
                        {account?.map((item) => (
                          <option key={item.id} value={item.name}>
                            {item.name}
                          </option>
                        ))}
                      </Select>
                    )}
                  />
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
                disabled={
                  isLoading ||
                  !isValid ||
                  !watch("formData.companyId") ||
                  !watch("formData.departmentId") ||
                  !watch("formData.locationId") ||
                  !watch("formData.accountTitles")
                }
              >
                Save
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

export const VoidConfirmation = ({ isOpen, onClose, customerId, orderId, fetchOrderList }) => {
  const toast = useToast();
  const [reasons, setReasons] = useState([]);
  const [reasonSubmit, setReasonSubmit] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  const submitHandler = () => {
    try {
      setIsLoading(true);
      const res = apiClient
        .post(`CancelledOrders/CancelOrder`, {
          cancellationDate: moment(new Date()).format("yyyy-MM-DD"),
          reason: reasonSubmit,
          orderId: orderId,
          customerId: customerId,
        })
        .then((res) => {
          setIsLoading(false);
          ToastComponent("Success", "Order has been voided", "success", toast);
          fetchOrderList()
          onClose()
        })
        .catch((err) => {
          setIsLoading(false);
          ToastComponent("Error", "Cancel failed", "error", toast);
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
              <Text>Are you sure you want to void this item?</Text>
              {reasons?.length > 0 ? (
                <Select
                  onChange={(e) => setReasonSubmit(e.target.value)}
                  w="70%"
                  bgColor="#fff8dc"
                  placeholder="Please select a reason"
                >
                  {reasons?.map((reason, i) => (
                    <option key={i} value={reason.reasonName}>
                      {reason.reasonName}
                    </option>
                  ))}
                </Select>
              ) : (
                "loading"
              )}
            </VStack>
          </ModalBody>

          <ModalFooter>
            <ButtonGroup size="sm" mt={3}>
              <Button
                onClick={submitHandler}
                isLoading={isLoading}
                disabled={isLoading || !reasonSubmit}
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

// old Modal Body
{
  /* <Stack spacing={2} p={6}>
<Box>
  <FormLabel fontSize="sm">Company</FormLabel>

  <HStack w="full">
    <Select
      {...register("formData.companyId")}
      defaultValue={
        company?.find(
          (x) => x.name === moveData[0]?.companyName
        )?.id
      }
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
    defaultValue={
      department?.find(
        (x) => x.name === moveData[0]?.departmentName
      )?.id
    }
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
    defaultValue={
      location?.find(
        (x) => x.name === moveData[0]?.locationName
      )?.id
    }
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
  <FormLabel fontSize="sm">Account Title</FormLabel>
  <Select
    {...register("formData.accountTitles")}
    placeholder="Select Account"
    fontSize="sm"
    bgColor="#fff8dc"
  >
    {account?.map((item) => {
      return (
        <option key={item.id} value={item.name}>
          {item.name}
        </option>
      );
    })}
  </Select>
  <Text color="red" fontSize="xs">
    {errors.formData?.accountTitles?.message}
  </Text>
</Box>
</Stack> */
}
