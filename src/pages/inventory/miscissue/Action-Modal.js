import React, { useEffect, useRef, useState } from "react";
import { BsPatchQuestionFill } from "react-icons/bs";
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
import apiClient from "../../../services/apiClient";
import { ToastComponent } from "../../../components/Toast";
import { decodeUser } from "../../../services/decode-user";
// import COA from "../../coa-modal/COA";
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
    companyCode: yup.string().required("Company Name is required"),
    companyName: yup.string().required("Company Name is required"),
    // departmentCode: yup.string().required("Department Name is required"),
    departmentName: yup.string().required("Department Category is required"),
    // locationCode: yup.string().required("Location Name is required"),
    locationName: yup.string().required("Location Name is required"),
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
        companyCode: customerData?.companyCode,
        companyName: customerData?.companyName,
        // departmentCode: "",
        departmentName: customerData?.departmentName,
        // locationCode: "",
        locationName: customerData?.locationName,
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
            companyCode: data.formData.companyCode,
            companyName: data.formData.companyName,
            // departmentCode: data.formData.departmentCode,
            departmentName: data.formData.departmentName,
            // locationCode: data.formData.locationCode,
            locationName: data.formData.locationName,
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

  const closeHandler = () => {
    reset();
    setIsLoading(false);
    setHideButton(false);
    onClose();
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
                  <Input
                    readOnly
                    {...register("formData.companyName")}
                    bgColor="gray.200"
                  />
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
                  <Input
                    readOnly
                    {...register("formData.departmentName")}
                    bgColor="gray.200"
                  />
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
                  <Input
                    readOnly
                    {...register("formData.locationName")}
                    bgColor="gray.200"
                  />
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
                onClick={closeHandler}
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
