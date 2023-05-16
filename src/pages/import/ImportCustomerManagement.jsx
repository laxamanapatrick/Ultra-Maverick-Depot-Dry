import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
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
} from "@chakra-ui/react";
import PageScrollImport from "../../components/PageScrollImport";
import * as XLSX from "xlsx";
import apiClient from "../../services/apiClient";
import { ToastComponent } from "../../components/Toast";
import DateConverter from "../../components/DateConverter";
import moment from "moment";
import { decodeUser } from "../../services/decode-user";

const currentUser = decodeUser();

const fetchCustomerTypeApi = async () => {
  const res = await apiClient.get(`Customer/GetAllActiveFarms`);
  return res.data;
};

const ImportCustomerManagement = () => {
  const [customerTypeData, setCustomerTypeData] = useState([]);
  const [workbook, setWorkbook] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [sheetOptions, setSheetOptions] = useState([]);
  const toast = useToast();

  const fileClear = useRef();

  const fetchCustomerType = () => {
    fetchCustomerTypeApi().then((res) => {
      setCustomerTypeData(res);
    });
  };

  useEffect(() => {
    fetchCustomerType();

    return () => {
      setCustomerTypeData([]);
    };
  }, []);

  const fileRenderer = (jsonData) => {
    jsonData.forEach((row) => {
      Object.keys(row).forEach((key) => {
        let newKey = key.trim().toLowerCase().replace(/ /g, "_");
        if (key !== newKey) {
          row[newKey] = row[key];
          delete row[key];
        }
      });
    });
    setExcelData(jsonData);
  };

  const fileHandler = async (e) => {
    // (jsonData.item_code.length() && jsonData.item_description.length() && jsonData.item_category.length() && jsonData.uom.length() && jsonData.buffer_level.length())

    const file = e[0];
    const data = await file.arrayBuffer();
    const workbook = XLSX.readFile(data);

    setWorkbook(workbook);
    setSheetOptions(workbook.SheetNames);

    const initialWorkSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(initialWorkSheet);

    fileRenderer(jsonData);
    if (e) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  };

  const sheetNumberHandlder = (data = 0) => {
    const worksheet = workbook.Sheets[workbook.SheetNames[data]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    fileRenderer(jsonData);
    if (data) {
      setIsDisabled(false);
    }
  };

  const resultArray = excelData.map((item) => {
    return {
      customerCode: item.customer_code,
      customerName: item.customer_name,
      farmTypeId: item.customer_type,
      companyCode: item.company_code,
      companyName: item.company__name,
      departmentName: item.department_name,
      locationName: item.location_name,
      mobileNumber: item.mobile_number,
      leadMan: item.leadman,
      address: item.address,
    };
  });

  const functionCustomerType = (farmName) => {
    const customerTypeId = customerTypeData?.find(
      (item) => item.farmName === farmName
    );
    return customerTypeId?.id;
  };

  const submitFile = () => {
    if (resultArray.length > 0) {
      setisLoading(true);
      const submitData = resultArray.map((item) => ({
        customerCode: item.customerCode.toString(),
        customerName: item.customerName,
        farmTypeId: functionCustomerType(item.farmTypeId),
        companyCode: item.companyCode.toString(),
        companyName: item.companyName,
        departmentName: item.departmentName,
        locationName: item.locationName,
        mobileNumber: item.mobileNumber.toString(),
        leadMan: item.leadMan,
        address: item.address,
        addedBy: currentUser.fullName,
      }));
      console.log(submitData)
      try {
        const res = apiClient
          .post("Import/AddNewCustomerManual", submitData)
          .then((res) => {
            ToastComponent("Success!", "Customers Imported", "success", toast);
            setisLoading(false);
            setIsDisabled(true);
            fileClear.current.value = "";
            setExcelData([]);
          })
          .catch((err) => {
            setisLoading(false);
            ToastComponent("Error", err.response.data, "error", toast);
          });
      } catch (err) {}
    } else {
      ToastComponent(
        "Error!",
        "No data provided, please check your import",
        "error",
        toast
      );
    }
  };

  return (
    <Flex w="full">
      <Flex
        h="780px"
        ml="2%"
        mt="2%"
        w="96%"
        bgColor="white"
        flexDirection="column"
        border="2px"
        borderWidth="5px"
        borderColor="secondary"
        justifyContent="space-between"
      >
        <Flex>
          <PageScrollImport>
            {/* {
              !resultArray.bufferLevel ? (
                <Flex>
                  <Text>Some data are missing. Please import the correct xlsx file for raw materials</Text>
                </Flex>
              ) : ( */}
            <Table variant="striped" size="sm">
              <Thead bgColor="secondary">
                <Tr>
                  <Th color="white">Customer Code</Th>
                  <Th color="white">Customer Name</Th>
                  <Th color="white">Customer Type</Th>
                  <Th color="white">Company Code</Th>
                  <Th color="white">Company Name</Th>
                  <Th color="white">Department Name</Th>
                  <Th color="white">Location Name</Th>
                  <Th color="white">Mobile Number</Th>
                  <Th color="white">Leadman</Th>
                  <Th color="white">Address</Th>
                </Tr>
              </Thead>
              <Tbody>
                {resultArray?.map((ed, i) => (
                  <Tr key={i}>
                    <Td>
                      {ed.customerCode ? (
                        ed.customerCode
                      ) : (
                        <Text fontWeight="semibold" color="danger">
                          Data missing. Please make sure correct excel file for
                          raw materials is uploaded.
                        </Text>
                      )}
                    </Td>
                    <Td>
                      {ed.customerName ? (
                        ed.customerName
                      ) : (
                        <Text fontWeight="semibold" color="danger">
                          Data missing. Please make sure correct excel file for
                          raw materials is uploaded.
                        </Text>
                      )}
                    </Td>
                    <Td>
                      {ed.farmTypeId ? (
                        ed.farmTypeId
                      ) : (
                        <Text fontWeight="semibold" color="danger">
                          Data missing. Please make sure correct excel file for
                          raw materias . is uploaded.
                        </Text>
                      )}
                    </Td>
                    <Td>
                      {ed.companyCode ? (
                        ed.companyCode
                      ) : (
                        <Text fontWeight="semibold" color="danger">
                          Data missing. Please make sure correct excel file for
                          raw materials is uploaded.
                        </Text>
                      )}
                    </Td>
                    <Td>
                      {ed.companyName ? (
                        ed.companyName
                      ) : (
                        <Text fontWeight="semibold" color="danger">
                          Data missing. Please make sure correct excel file for
                          raw materials is uploaded.
                        </Text>
                      )}
                    </Td>
                    <Td>
                      {ed.departmentName ? (
                        ed.departmentName
                      ) : (
                        <Text fontWeight="semibold" color="danger">
                          Data missing. Please make sure correct excel file for
                          raw materials is uploaded.
                        </Text>
                      )}
                    </Td>
                    <Td>
                      {ed.locationName ? (
                        ed.locationName
                      ) : (
                        <Text fontWeight="semibold" color="danger">
                          Data missing. Please make sure correct excel file for
                          raw materials is uploaded.
                        </Text>
                      )}
                    </Td>
                    <Td>
                      {ed.mobileNumber ? (
                        ed.mobileNumber
                      ) : (
                        <Text fontWeight="semibold" color="danger">
                          Data missing. Please make sure correct excel file for
                          raw materials is uploaded.
                        </Text>
                      )}
                    </Td>
                    <Td>
                      {ed.leadMan ? (
                        ed.leadMan
                      ) : (
                        <Text fontWeight="semibold" color="danger">
                          Data missing. Please make sure correct excel file for
                          raw materials is uploaded.
                        </Text>
                      )}
                    </Td>
                    <Td>
                      {ed.address ? (
                        ed.address
                      ) : (
                        <Text fontWeight="semibold" color="danger">
                          Data missing. Please make sure correct excel file for
                          raw materials is uploaded.
                        </Text>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            {/* )
            } */}
          </PageScrollImport>
        </Flex>

        <Box p={2} bgColor="secondary">
          <Flex justifyContent="space-between">
            <Flex w="50%" justifyContent="start">
              <Input
                ref={fileClear}
                ml={1}
                w="47%"
                type="file"
                p={1}
                mr={0.2}
                bgColor="white"
                onChange={(e) => fileHandler(e.target.files)}
              />

              <Select
                onChange={(e) => sheetNumberHandlder(e.target.selectedIndex)}
                w="31%"
                ml={2}
                bgColor="white"
              >
                {sheetOptions?.map((sh, i) => (
                  <option key={i}>{sh}</option>
                ))}
              </Select>
            </Flex>

            <HStack>
              <Button
                onClick={() => submitFile(resultArray)}
                type="submit"
                isLoading={isLoading}
                isDisabled={isDisabled}
                _hover={{ color: "white", bgColor: "accent" }}
              >
                Import
              </Button>
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
};

export default ImportCustomerManagement;
