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
  useToast,
} from "@chakra-ui/react";
import { decodeUser } from "../../../services/decode-user";
import { ToastComponent } from "../../../components/Toast";

const fetchReasonsApi = async () => {
  const res = await apiClient.get("Reason/GetAllActiveReason");
  return res.data;
};

const RejectInformation = ({
  actualQuantityDelivered,
  setRejectionInformation,
  setTotalReject,
}) => {
  const toast = useToast();
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

    // Reset rejectQty if the selected reason is empty
    if (name === "reason" && value === "") {
      newRows[index].rejectQty = "";
    }

    // Disable the rejectQty input if no reason is selected
    if (name === "reason") {
      newRows[index].rejectQtyDisabled = value === "";
      // Disable the input for all subsequent rows if no reason is selected
      for (let i = index + 1; i < newRows.length; i++) {
        newRows[i].rejectQtyDisabled = true;
      }
    } else if (newRows[index].rejectQtyDisabled) {
      // Enable the input for the current row if a reason is selected
      newRows[index].rejectQtyDisabled = false;
    }

    // Reset the rejectQty input if the value entered is greater than actualQuantityDelivered
    if (
      name === "rejectQty" &&
      Number(value) > Number(actualQuantityDelivered) &&
      totalQty !== 0 // Check if totalQty is not 0
    ) {
      ToastComponent(
        "Warning",
        "Your quantity is higher than your Actual Delivered",
        "warning",
        toast
      );
      newRows[index][name] = "";
    }

    //Reset if total reject quanity exceed actualQuantityDelivered
    if (name === "rejectQty" && Number(value) + totalQty > Number(actualQuantityDelivered)) {
      ToastComponent(
        "Warning",
        "Your total reject quantity will be higher than your Actual Delivered",
        "warning",
        toast
      );
      newRows[index][name] = "";
    }

    setRows(newRows);
  };

  const calculateTotalQty = () => {
    let sum = 0;
    rows.forEach((row) => {
      sum += Number(row.rejectQty);
    });
    setTotalQty(sum);
    setTotalReject(sum);
  };

  useEffect(() => {
    calculateTotalQty();
    setRejectionInformation(rows.filter((row) => row.rejectQty && row.reason));
  }, [rows]);

  const canAddRow =
    rows.every((row) => row.rejectQty && row.reason) &&
    Number(totalQty) < Number(actualQuantityDelivered);

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
                    <Th>Reason</Th>
                    <Th>Reject Quantity</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {rows.map((row, index) => (
                    <Tr key={index}>
                      <Td>
                        {reasons.length > 0 ? (
                          <Select
                            w="auto"
                            name="reason"
                            value={row.reason}
                            placeholder="Please Select a Remark First"
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
                        <Input
                          type="number"
                          name="rejectQty"
                          value={row.rejectQty}
                          onChange={(e) => handleInputChange(e, index)}
                          required
                          disabled={row.rejectQtyDisabled}
                          title={
                            row.rejectQtyDisabled
                              ? "Please select a remark first."
                              : ""
                          }
                        />
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
