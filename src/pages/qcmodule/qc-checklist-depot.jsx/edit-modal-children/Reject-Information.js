import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Select,
  Button,
  Text,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  AccordionItem,
} from "@chakra-ui/react";
import apiClient from "../../../../services/apiClient";

const fetchReasonsApi = async () => {
  const res = await apiClient.get("Reason/GetAllActiveReason");
  return res.data;
};

const RejectInformation = ({setRejectionInformation, setTotalReject}) => {
  const [rows, setRows] = useState([{ rejectQty: "", reason: "" }]);
  const [totalQty, setTotalQty] = useState(0);

  const [reasons, setReasons] = useState([]);

  const fetchReason = async () => {
    fetchReasonsApi().then((res) => {
      setReasons(res);
    });
  };

  useEffect(() => {
    fetchReason();

    return () => {
      setReasons([]);
    };
  }, []);

  const handleAddRow = () => {
    setRows([...rows, { rejectQty: "", reason: "" }]);
  };

  const handleDeleteRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  const handleInputChange = (event, index) => {
    const { name, value } = event.target;
    const newRows = [...rows];
    newRows[index][name] = value;
    setRows(newRows);
  };

  const calculateTotalQty = () => {
    let sum = 0;
    rows.forEach((row) => {
      sum += Number(row.rejectQty);
    });
    setTotalQty(sum);
    setTotalReject(sum)
  };

  useEffect(() => {
    calculateTotalQty();
    setRejectionInformation(rows.filter(row => row.rejectQty && row.reason))
  }, [rows]);

  const canAddRow = rows.every((row) => row.rejectQty && row.reason);

  return (
    <>
        <Accordion w="full" allowMultiple defaultIndex={[0]}>
          <AccordionItem>
            <AccordionButton>
              <Text
                fontSize="sm"
                textAlign="center"
                bgColor="secondary"
                color="white"
                w="full"
              >
                Rejection Information
                <AccordionIcon />
              </Text>
            </AccordionButton>
            <AccordionPanel>
            <Box w="80%">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Reject Quantity</Th>
                    <Th>Reason</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {rows.map((row, index) => (
                    <Tr key={index}>
                      <Td>
                        <Input
                          type="number"
                          name="rejectQty"
                          value={row.rejectQty}
                          onChange={(e) => handleInputChange(e, index)}
                          required
                        />
                      </Td>
                      <Td>
                        {reasons.length > 0 ? (
                          <Select
                            w="auto"
                            name="reason"
                            value={row.reason}
                            placeholder="Please Select a Remark"
                            onChange={(e) => handleInputChange(e, index)}
                            required
                          >
                            {reasons?.map((reason) => (
                              <option key={reason.id} value={reason.reasonName}>
                                {reason.reasonName}
                              </option>
                            ))}
                          </Select>
                        ) : (
                          "Loading"
                        )}
                      </Td>
                      <Td>
                        {index === rows.length - 1 ? (
                          <Button
                            colorScheme="blue"
                            size="sm"
                            onClick={handleAddRow}
                            isDisabled={!canAddRow}
                            title={
                              !canAddRow
                                ? "Please provide a quantity and reason of rejection"
                                : ""
                            }
                          >
                            Add Another Reject
                          </Button>
                        ) : (
                          rows.length > 1 && (
                            <Button
                              colorScheme="red"
                              size="sm"
                              ml={2}
                              onClick={() => handleDeleteRow(index)}
                            >
                              Delete this row
                            </Button>
                          )
                        )}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <Box mt={4}>
        <Text fontWeight="bold">Total Reject Quantity: {totalQty}</Text>
      </Box>
    </>
  );
};

export default RejectInformation;
