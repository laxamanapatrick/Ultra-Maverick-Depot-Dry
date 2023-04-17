import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  ButtonGroup,
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
} from "@chakra-ui/react";
import { decodeUser } from "../../services/decode-user";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const currentUser = decodeUser();

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

const COA = ({
  isOpen,
  onClose,
  submitTransaction,
  isLoading,
  transactionId,
  transactionType,
}) => {
  const [company, setCompany] = useState([]);
  const [department, setDepartment] = useState([]);
  const [location, setLocation] = useState([]);
  const [account, setAccount] = useState([]);

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
        transactionId: transactionId,
        transactionType: transactionType,
      },
    },
  });

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
        "http://10.10.2.76:8000/api/dropdown/location?status=1&paginate=0&company_id=" +
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

  const submitHandler = (data) => {
    submitTransaction();
    console.log(transactionId)
    if (transactionId) {
      console.log("Submit COA Data", data.formData);
      onClose()
    }
    // console.log('Transaction Type:', transactionType)
    // console.log('Transaction Id:', transactionId)
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

export default COA;
