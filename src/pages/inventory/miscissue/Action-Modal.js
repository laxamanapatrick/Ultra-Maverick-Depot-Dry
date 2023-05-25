import React, { useEffect, useRef, useState } from "react";
import { BsPatchQuestionFill } from "react-icons/bs";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormLabel,
  HStack,
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
import apiClient from "../../../services/apiClient";
import { ToastComponent } from "../../../components/Toast";
import { decodeUser } from "../../../services/decode-user";
// import COA from "../../coa-modal/COA";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";

const currentUser = decodeUser();

export const AddConfirmation = ({
  isOpen,
  onClose,
  closeAddModal,
  details,
  //   setDetails,
  rawMatsInfo,
  setRawMatsInfo,
  //   customerRef,
  warehouseId,
  //   setSelectorId,
  setWarehouseId,
  fetchActiveMiscIssues,
  customerData,
  remarks,
  //   setRemarks,
  //   remarksRef,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  const submitHandler = () => {
    setIsLoading(true);
    try {
      const addSubmit = {
        warehouseId: warehouseId,
        itemCode: rawMatsInfo.itemCode,
        itemDescription: rawMatsInfo.itemDescription,
        uom: rawMatsInfo.uom,
        customer: rawMatsInfo.customer,
        customerCode: customerData.customerCode,
        expirationDate: rawMatsInfo.expirationDate,
        quantity: rawMatsInfo.quantity,
        remarks: remarks,
        details: details,
        preparedBy: currentUser.fullName,
      };
      const res = apiClient
        .post(`Miscellaneous/AddNewMiscellaneousIssueDetails`, addSubmit)
        .then((res) => {
          ToastComponent("Success", "Item added", "success", toast);
          setRawMatsInfo({
            itemCode: "",
            itemDescription: "",
            customer: rawMatsInfo.customer,
            uom: "",
            expirationDate: "",
            quantity: "",
          });
          setWarehouseId("");
          setIsLoading(false);
          fetchActiveMiscIssues();
          onClose();
          closeAddModal();
        })
        .catch((err) => {
          ToastComponent("Error", "Item was not added", "error", toast);
        });
    } catch (error) {}

    // setRawMatsInfo({
    //     itemCode: '',
    //     itemDescription: '',
    //     customer: rawMatsInfo.customer,
    //     uom: '',
    //     expirationDate: '',
    //     quantity: ''
    // })
    // // customerRef.current.value = ''
    // setSelectorId('')
    // // setDetails('')
    // setIsLoading(false)
    // onClose()
    // closeAddModal()
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
              onClick={submitHandler}
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
    companyId: yup.number().required().typeError("Company Name is required"),
    departmentId: yup
      .number()
      .required()
      .typeError("Department Category is required"),
    locationId: yup.number().required().typeError("Location Name is required"),
    accountTitles: yup.string().required("Account Name is required"),
  }),
});

export const SaveConfirmation = ({
  isOpen,
  onClose,
  totalQuantity,
  details,
  customerData,
  setTotalQuantity,
  miscData,
  fetchActiveMiscIssues,
  isLoading,
  setIsLoading,
  customerRef,
  setDetails,
  setRawMatsInfo,
  setHideButton,
  remarks,
  setRemarks,
  remarksRef,
  transactionDate,
}) => {
  const toast = useToast();

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
      setIsCoaSet(false);
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
        // companyId : company?.find((x) => x.name === customerData?.companyName)
        // ?.id
        // departmentId: department?.find(
        //   (x) => x.name === customerData?.departmentName
        // )?.id,
        // locationId: location?.find((x) => x.name === customerData?.locationName)
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
          company?.find((x) => x.name === customerData?.companyName)?.id
        );
      }
      if (
        watch("formData.companyId") &&
        !watch("formData.departmentId") &&
        !watch("formData.locationId")
      ) {
        setValue(
          "formData.departmentId",
          department?.find((x) => x.name === customerData?.departmentName)?.id
        );
      }
      if (
        watch("formData.companyId") &&
        watch("formData.departmentId") &&
        !watch("formData.locationId")
      ) {
        setValue(
          "formData.locationId",
          location?.find((x) => x.name === customerData?.locationName)?.id
        );
        setIsCoaSet(true);
      }
    }
  }, [customerData, company, department, location]);

  const closeHandler = () => {
    // reset();
    // setValue("formData.accountTitles", "")
    setIsLoading(false);
    setHideButton(false);
    onClose();
    setValue(
      "formData",
      {
        companyId: company?.find((x) => x.name === customerData?.companyName)
          ?.id,
        departmentId: department?.find(
          (x) => x.name === customerData?.departmentName
        )?.id,
        locationId: location?.find((x) => x.name === customerData?.locationName)
          ?.id,
        accountTitles: "",
        addedBy: currentUser.userName,
      },
      { shouldValidate: true }
    );
  };

  const saveSubmitHandler = (data) => {
    if (totalQuantity > 0) {
      setIsLoading(true);
      try {
        const res = apiClient
          .post(`Miscellaneous/AddNewMiscellaneousIssue`, {
            customerCode: customerData.customerCode,
            customer: customerData.customer,
            totalQuantity: totalQuantity,
            preparedBy: currentUser.fullName,
            remarks: remarks,
            details: details,
            transactionDate: transactionDate,
            companyCode: company?.find((x) => x.id === data.formData.companyId)
              ?.code,
            companyName: company?.find((x) => x.id === data.formData.companyId)
              ?.name,
            departmentName: department?.find(
              (x) => x.id === data.formData.departmentId
            )?.name,
            locationName: location?.find(
              (x) => x.id === data.formData.locationId
            )?.name,
            accountTitles: data.formData.accountTitles,
            addedBy: currentUser.fullName,
          })
          .then((res) => {
            const issuePKey = res.data.id;

            //SECOND Update IF MAY ID
            if (issuePKey) {
              const arrayofId = miscData?.map((item) => {
                return {
                  issuePKey: issuePKey,
                  id: item.id,
                };
              });
              try {
                const res = apiClient
                  .put(`Miscellaneous/UpdateMiscellaneousIssuePKey`, arrayofId)
                  .then((res) => {
                    fetchActiveMiscIssues();
                    ToastComponent(
                      "Success",
                      "Information saved",
                      "success",
                      toast
                    );
                    onClose();
                    setTotalQuantity("");
                    customerRef.current.value = "";
                    remarksRef.current.value = "";
                    setDetails("");
                    setRawMatsInfo({
                      itemCode: "",
                      itemDescription: "",
                      supplier: "",
                      uom: "",
                      expirationDate: "",
                      quantity: "",
                    });
                    setIsLoading(false);
                    setHideButton(false);
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
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => {}} isCentered size="2xl">
        <ModalOverlay />
        <form onSubmit={handleSubmit(saveSubmitHandler)}>
          <ModalContent>
            <ModalHeader textAlign="center">Charge Of Accounts</ModalHeader>
            <ModalCloseButton onClick={closeHandler} />
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
                          (x) => x.name === customerData?.companyName
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
                        (x) => x.name === customerData?.departmentName
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
                        (x) => x.name === customerData?.locationName
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
                  !watch("formData.accountTitles") ||
                  !watch("formData.companyId") ||
                  !watch("formData.departmentId") ||
                  !watch("formData.locationId")
                }
              >
                Submit
              </Button>
              <Button
                size="sm"
                colorScheme="red"
                onClick={closeHandler}
                isLoading={isLoading}
                disabled={isLoading}
              >
                Close
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
  setSelectorId,
  fetchActiveMiscIssues,
  fetchExpiryDates,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const cancelSubmitHandler = () => {
    setIsLoading(true);
    try {
      const res = apiClient
        .put(`Miscellaneous/CancelItemCodeInMiscellaneousIssue`, [
          { id: selectorId },
        ])
        .then((res) => {
          ToastComponent(
            "Success",
            "Item has been cancelled",
            "success",
            toast
          );
          fetchActiveMiscIssues();
          fetchExpiryDates();
          setIsLoading(false);
          setSelectorId("");
          onClose();
        })
        .catch((err) => {
          ToastComponent("Error", "Item was not cancelled", "error", toast);
          setIsLoading(false);
        });
    } catch (error) {}
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

export const AllCancelConfirmation = ({
  isOpen,
  onClose,
  miscData,
  setSelectorId,
  fetchActiveMiscIssues,
  setHideButton,
  fetchExpiryDates,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const allCancelSubmitHandler = () => {
    setIsLoading(true);
    const allId = miscData.map((item) => {
      return {
        id: item.id,
      };
    });
    try {
      const res = apiClient
        .put(`Miscellaneous/CancelItemCodeInMiscellaneousIssue`, allId)
        .then((res) => {
          ToastComponent(
            "Success",
            "Items has been cancelled",
            "success",
            toast
          );
          fetchActiveMiscIssues();
          fetchExpiryDates();
          setSelectorId("");
          setHideButton(false);
          setIsLoading(false);
          onClose();
        })
        .catch((err) => {
          ToastComponent("Error", "Item was not cancelled", "error", toast);
          setIsLoading(false);
        });
    } catch (error) {}
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
            Are you sure you want to cancel all items in the list?
          </Text>
        </ModalBody>

        <ModalFooter>
          <ButtonGroup>
            <Button
              onClick={allCancelSubmitHandler}
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

//Old submit
// const firstSubmit = {
//     customerCode: customerData.customerCode,
//     customer: customerData.customer,
//     totalQuantity: totalQuantity,
//     remarks: listDataTempo[0]?.description,
//     preparedBy: currentUser?.userName
// }
// if (totalQuantity > 0) {
//     setIsLoading(true)
//     try {
//         const res = apiClient.post(`Miscellaneous/AddNewMiscellaneousIssue`, firstSubmit)
//             .then(res => {
//                 const id = res.data.id

//                 //SECOND POST IF MAY ID
//                 if (id) {
//                     const submitArray = listDataTempo.map(item => {
//                         return {
//                             IssuePKey: id,
//                             warehouseId: warehouseId,
//                             itemCode: item.itemCode,
//                             itemDescription: item.itemDescription,
//                             uom: item.uom,
//                             customer: item.supplier,
//                             expirationdate: item.expirationDate,
//                             quantity: item.quantity,
//                             remarks: item.description,
//                             preparedBy: currentUser.fullName
//                         }
//                     })
//                     try {
//                         const res = apiClient.post(`Miscellaneous/AddNewMiscellaneousIssueDetails`, submitArray)
//                         ToastComponent("Success", "Information saved", "success", toast)
//                         setListDataTempo([])
//                         setIsLoading(false)
//                         onClose()
//                     } catch (error) {
//                         console.log(error)
//                     }
//                     console.log(submitArray)
//                 }

//             })
//             .catch(err => {
//                 ToastComponent("Error", "Information was not saved", "error", toast)
//                 setIsLoading(false)
//             })
//     } catch (error) {
//     }
// }
