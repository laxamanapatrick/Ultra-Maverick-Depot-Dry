import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Input,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { conformanceData } from "./checklistsData";
import { ReceivingContext } from "../../../../../context/ReceivingContext";

const Conformance = () => {
  const { setConformanceDetails } = useContext(ReceivingContext);
  const [formValues, setFormValues] = useState({});

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  useEffect(() => {
    setConformanceDetails(formValues)
  
    return () => {
      setConformanceDetails([])
    }
  }, [formValues])

  return (
    <Box w="98%" border="1px solid gray" borderRadius="5px">
      <Text
        w="full"
        mb={2}
        fontSize="sm"
        textAlign="start"
        bgColor="secondary"
        color="white"
      >
        3. Conformance to set standard specifications
      </Text>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Title</Th>
            <Th>Remarks</Th>
          </Tr>
        </Thead>
        <Tbody>
          {conformanceData.map((data) => (
            <Tr key={data.id}>
              <Td>{data.details}</Td>
              <Td>
                <div
                  style={{ display: "flex", gap: "10px", position: "relative" }}
                >
                  <Input
                    type={data.type}
                    name={data.details.toLowerCase()}
                    onChange={handleInputChange}
                  />
                </div>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Conformance;
