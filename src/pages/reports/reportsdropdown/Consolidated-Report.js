import React, { useEffect, useState } from "react";
import {
  Flex,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import apiClient from "../../../services/apiClient";
import PageScrollReusable from "../../../components/PageScroll-Reusable";
import moment from "moment";

const fetchConsolidatedReportApi = async (dateFrom, dateTo) => {
  const res = await apiClient.get(
    `Report/ConsolidatedReport?dateFrom=${dateFrom}&dateTo=${dateTo}`
  );
  return res.data;
};

export const ConsolidatedReport = ({
  dateFrom,
  dateTo,
  sample,
  setSheetData,
}) => {
  const [buttonChanger, setButtonChanger] = useState(true);

  const [consolidatedData, setConsolidatedData] = useState([]);

  const fetchConsolidatedReport = () => {
    fetchConsolidatedReportApi(dateFrom, dateTo).then((res) => {
      setConsolidatedData(res);
      setSheetData(
        res?.map((item, i) => {
          return {
            "Line Number": i + 1,
            "Transaction ID": item.id,
            "Warehouse ID": item.warehouseId,
            "Item Code": item.itemCode,
            "Item Description": item.itemDescription,
            Quantity: item.quantity,
            "Transaction Type": item.transactionType,
            "Transaction Date": moment(item.transactionDate).format(
              "yyyy-MM-DD"
            ),
            Company: item.companyName ? item.companyName : "NA",
            Department: item.departmentName ? item.departmentName : "NA",
            Location: item.locationName ? item.locationName : "NA",
            "Account Title": item.accountTitle ? item.accountTitle : "NA",
          };
        })
      );
    });
  };

  useEffect(() => {
    fetchConsolidatedReport();

    return () => {
      setConsolidatedData([]);
    };
  }, [dateFrom, dateTo]);

  return (
    <Flex w="full" flexDirection="column">
      <Flex border="1px">
        <PageScrollReusable minHeight="735px" maxHeight="740px">
          <Table size="sm">
            <Thead bgColor="secondary" position="sticky" top={0} zIndex={1}>
              <Tr>
                <Th color="white">Transaction ID</Th>
                <Th color="white">Warehouse ID</Th>
                <Th color="white">Item Code</Th>
                <Th color="white">Item Description</Th>
                <Th color="white">Quantity</Th>
                <Th color="white">Transaction Type</Th>
                <Th color="white">Transaction Date</Th>
                <Th color="white">Company</Th>
                <Th color="white">Department</Th>
                <Th color="white">Location</Th>
                <Th color="white">Account Title</Th>
              </Tr>
            </Thead>
            <Tbody>
              {consolidatedData?.map((item, i) => (
                <Tr key={i}>
                  <Td>{item.id}</Td>
                  <Td>{item.warehouseId}</Td>
                  <Td>{item.itemCode}</Td>
                  <Td>{item.itemDescription}</Td>
                  <Td>{item.quantity}</Td>
                  <Td>{item.transactionType}</Td>
                  <Td>{moment(item.transactionDate).format("yyyy-MM-DD")}</Td>
                  <Td>{item.companyName ? item.companyName : "NA"}</Td>
                  <Td>{item.departmentName ? item.departmentName : "NA"}</Td>
                  <Td>{item.locationName ? item.locationName : "NA"}</Td>
                  <Td>{item.accountTitle ? item.accountTitle : "NA"}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </PageScrollReusable>
      </Flex>

      {/* <Flex justifyContent='end' mt={2}>
            <Button size='xs' colorScheme='teal' onClick={() => setButtonChanger(!buttonChanger)}>
                {buttonChanger ? `>>>>` : `<<<<`}
            </Button>
        </Flex> */}
    </Flex>
  );
};
