import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormLabel,
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
} from "@chakra-ui/react";
import { BsPatchQuestionFill } from "react-icons/bs";
import apiClient from "../../../services/apiClient";
import { ToastComponent } from "../../../components/Toast";
import { decodeUser } from "../../../services/decode-user";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";

const currentUser = decodeUser();

export const AddConfirmation = ({
  isOpen,
  onClose,
  closeAddModal,
  details,
  setDetails,
  rawMatsInfo,
  setRawMatsInfo,
  listDataTempo,
  setListDataTempo,
  supplierRef,
  setSelectorId,
  remarks,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const addItemHandler = () => {
    setIsLoading(true);
    const addToArray = {
      itemCode: rawMatsInfo.itemCode,
      itemDescription: rawMatsInfo.itemDescription,
      supplier: rawMatsInfo.supplier,
      uom: rawMatsInfo.uom,
      expirationDate: rawMatsInfo.expirationDate,
      quantity: rawMatsInfo.quantity,
      description: details,
      remarks: remarks,
    };
    setListDataTempo((current) => [...current, addToArray]);
    setRawMatsInfo({
      itemCode: "",
      itemDescription: "",
      supplier: rawMatsInfo.supplier,
      uom: "",
      expirationDate: "",
      quantity: "",
    });
    // supplierRef.current.value = ''
    setSelectorId("");
    // setDetails('')
    setIsLoading(false);
    onClose();
    closeAddModal();
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="xl">
      <ModalContent bgColor="secondary" color="white" pt={10} pb={5}>
        <ModalHeader>
          <Flex justifyContent="center">
            <BsPatchQuestionFill fontSize="50px" />
          </Flex>
        </ModalHeader>
        <ModalCloseButton onClick={onClose} />

        <ModalBody mb={5}>
          <Text textAlign="center" fontSize="lg">
            Are you sure you want to add this information?
          </Text>
        </ModalBody>

        <ModalFooter>
          <ButtonGroup>
            <Button
              onClick={addItemHandler}
              isLoading={isLoading}
              colorScheme="blue"
            >
              Yes
            </Button>
            <Button onClick={onClose} isLoading={isLoading} colorScheme="red">
              No
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const schema = yup.object().shape({
  formData: yup.object().shape({
    companyCode: yup.string().required("Company Name is required"),
    companyName: yup.string().required("Company Name is required"),
    departmentCode: yup.string().required("Department Name is required"),
    departmentName: yup.string().required("Department Category is required"),
    locationCode: yup.string().required("Location Name is required"),
    locationName: yup.string().required("Location Name is required"),
    accountTitles: yup.string().required("Account Name is required"),
  }),
});

export const SaveConfirmation = ({
  isOpen,
  onClose,
  listDataTempo,
  setListDataTempo,
  supplierData,
  totalQuantity,
  supplierRef,
  setDetails,
  setRawMatsInfo,
  remarks,
  setRemarks,
  remarksRef,
  transactionDate,
  setTransactionDate,
  reason,
  setReason,
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
        companyCode: "",
        companyName: "",
        departmentCode: "",
        departmentName: "",
        locationCode: "",
        locationName: "",
        accountTitles: "",
        addedBy: currentUser.userName,
      },
    },
  });

  const [company, setCompany] = useState([]);
  const [department, setDepartment] = useState([]);
  const [location, setLocation] = useState([]);
  const [account, setAccount] = useState([]);
  // FETCH COMPANY API
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

  // FETCH DEPT API
  const fetchDepartmentApi = async (id) => {
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

  // FETCH Loc API
  const fetchLocationApi = async (id) => {
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
  }, []);

  useEffect(() => {
    fetchAccountApi();
  }, []);

  useEffect(() => {
    if (watch("formData.companyCode")) {
      departmentRef.current.value = "";
      locationRef.current.value = "";
      setValue("formData.departmentCode", "");
      setValue("formData.departmentName", "");
      setValue("formData.locationCode", "");
      setValue("formData.locationName", "");
      fetchDepartmentApi();
    }
  }, [watch("formData.companyCode")]);

  useEffect(() => {
    if (watch("formData.departmentCode")) {
      locationRef.current.value = "";
      setValue("formData.locationCode", "");
      setValue("formData.locationName", "");
      fetchLocationApi();
    }
  }, [watch("formData.departmentCode")]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const saveSubmitHandler = (data) => {
    const firstSubmit = {
      supplierCode: supplierData.supplierCode,
      supplier: supplierData.supplierName,
      totalQuantity: totalQuantity,
      details: listDataTempo[0]?.description,
      remarks: listDataTempo[0]?.remarks,
      // reason: reason,
      transactionDate: transactionDate,
      preparedBy: currentUser?.fullName,
      companyCode: data.formData.companyCode,
      companyName: data.formData.companyName,
      departmentCode: data.formData.departmentCode,
      departmentName: data.formData.departmentName,
      locationCode: data.formData.locationCode,
      locationName: data.formData.locationName,
      accountTitles: data.formData.accountTitles,
      addedBy: currentUser.fullName,
    };
    if (totalQuantity > 0) {
      setIsLoading(true);
      try {
        const res = apiClient
          .post(`Miscellaneous/AddNewMiscellaneousReceipt`, firstSubmit)
          .then((res) => {
            const id = res.data.id;

            //SECOND POST IF MAY ID
            if (id) {
              const submitArray = listDataTempo.map((item) => {
                return {
                  miscellaneousReceiptId: id,
                  itemCode: item.itemCode,
                  itemDescription: item.itemDescription,
                  uom: item.uom,
                  supplier: item.supplier,
                  expiration: item.expirationDate ? item.expirationDate : null,
                  actualGood: item.quantity,
                  details: item.description,
                  remarks: item.remarks,
                  receivedBy: currentUser.fullName,
                };
              });
              try {
                const res = apiClient
                  .post(
                    `Miscellaneous/AddNewMiscellaneousReceiptInWarehouse`,
                    submitArray
                  )
                  .then((res) => {
                    ToastComponent(
                      "Success",
                      "Information saved",
                      "success",
                      toast
                    );
                    setListDataTempo([]);
                    supplierRef.current.value = "";
                    remarksRef.current.value = "";
                    setDetails("");
                    setRemarks("")
                    setRawMatsInfo({
                      itemCode: "",
                      itemDescription: "",
                      supplier: "",
                      uom: "",
                      expirationDate: "",
                      quantity: "",
                    });
                    setIsLoading(false);
                    onClose();
                  });
              } catch (error) {
                console.log(error);
              }
            }
          })
          .catch((err) => {
            ToastComponent(
              "Error",
              "Information was not saved",
              "error",
              toast
            );
            setIsLoading(false);
          });
      } catch (error) {}
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => {}} isCentered size="2xl">
        <ModalOverlay />
        <form onSubmit={handleSubmit(saveSubmitHandler)}>
          <ModalContent>
            <ModalHeader textAlign="center">Charge Of Accounts</ModalHeader>
            <ModalCloseButton onClick={handleClose} />
            <ModalBody>
              <Stack spacing={2} p={6}>
                <Box>
                  <FormLabel fontSize="sm">Company</FormLabel>
                  <Select
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
                  </Text>
                </Box>

                <Box>
                  <FormLabel fontSize="sm">Department</FormLabel>
                  <Select
                    fontSize="sm"
                    placeholder="Select Department"
                    disabled={!watch("formData.companyCode")}
                    ref={departmentRef}
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
                  </Text>
                </Box>

                <Box>
                  <FormLabel fontSize="sm">Location</FormLabel>
                  <Select
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
                  </Text>
                </Box>
                <Box>
                  <FormLabel fontSize="sm">Account Title</FormLabel>
                  <Select
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
                disabled={isLoading}
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

export const CancelConfirmation = ({
  isOpen,
  onClose,
  selectorId,
  rowIndex,
  setListDataTempo,
  listDataTempo,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const cancelSubmitHandler = () => {
    setIsLoading(true);
    if (listDataTempo.length > 0) {
      const newArray = [...listDataTempo];
      if (rowIndex !== -1) {
        newArray.splice(rowIndex, 1);
        setListDataTempo(newArray);
        onClose();
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="xl">
      <ModalContent bgColor="secondary" color="white" pt={10} pb={5}>
        <ModalHeader>
          <Flex justifyContent="center">
            <BsPatchQuestionFill fontSize="50px" />
          </Flex>
        </ModalHeader>
        <ModalCloseButton onClick={onClose} />

        <ModalBody mb={5}>
          <Text textAlign="center" fontSize="lg">
            Are you sure you want to cancel this information?
          </Text>
        </ModalBody>

        <ModalFooter>
          <ButtonGroup>
            <Button
              onClick={cancelSubmitHandler}
              isLoading={isLoading}
              disabled={isLoading}
              colorScheme="blue"
            >
              Yes
            </Button>
            <Button onClick={onClose} isLoading={isLoading} colorScheme="red">
              No
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// Frontend Edit Process

export const EditModal = ({
  isOpen,
  onClose,
  selectorId,
  rowIndex,
  setListDataTempo,
  listDataTempo,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    isOpen: isEditConfirm,
    onClose: closeEditConfirm,
    onOpen: openEditConfirm,
  } = useDisclosure();

  const editHandler = () => {
    openEditConfirm();
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="4xl">
      <ModalContent>
        <ModalHeader></ModalHeader>
        <ModalCloseButton onClick={onClose} />

        <ModalBody></ModalBody>

        <ModalFooter>
          <ButtonGroup>
            <Button
              onClick={editHandler}
              isLoading={isLoading}
              disabled={isLoading}
              colorScheme="blue"
            >
              Update
            </Button>
            <Button onClick={onClose} isLoading={isLoading} colorScheme="red">
              No
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
      {isEditConfirm && (
        <EditConfirmation
          isOpen={isEditConfirm}
          onClose={closeEditConfirm}
          closeEditModal={onClose}
          selectorId={selectorId}
          rowIndex={rowIndex}
          setListDataTempo={setListDataTempo}
          listDataTempo={listDataTempo}
        />
      )}
    </Modal>
  );
};

export const EditConfirmation = ({
  isOpen,
  onClose,
  selectorId,
  rowIndex,
  setListDataTempo,
  listDataTempo,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="xl">
      <ModalContent bgColor="secondary" color="white" pt={10} pb={5}>
        <ModalHeader>
          <Flex justifyContent="center">
            <BsPatchQuestionFill fontSize="50px" />
          </Flex>
        </ModalHeader>
        <ModalCloseButton onClick={onClose} />

        <ModalBody mb={5}>
          <Text textAlign="center" fontSize="lg">
            Are you sure you want to update this information?
          </Text>
        </ModalBody>

        <ModalFooter>
          <ButtonGroup>
            {/* <Button onClick={saveSubmitHandler} isLoading={isLoading} disabled={isLoading} colorScheme='blue'>Yes</Button> */}
            {/* <Button onClick={onClose} isLoading={isLoading} colorScheme='red'>No</Button> */}
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
