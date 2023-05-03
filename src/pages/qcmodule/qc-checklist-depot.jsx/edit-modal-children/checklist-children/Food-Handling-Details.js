import { useContext, useEffect, useState } from "react";
import {
  Checkbox,
  Flex,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Radio,
  RadioGroup,
  Box,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { foodHandlingData } from "./checklistsData";
import { ReceivingContext } from "../../../../../context/ReceivingContext";

const FoodHandlingDetails = () => {

  const { setFoodHandlingDetails, remarksParent, setRemarksParent } = useContext(ReceivingContext);

  const [state, setState] = useState(() => {
    const initialState = {};
    foodHandlingData.forEach(({ id, label }) => {
      initialState[id] = {};
    });
    return initialState;
  });

  const handleRadioChange = (e, id) => {
    const { value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [id]: value === "true" ? true : false,
    }));
  };

  const handleCheckboxChange = (e, id) => {
    const { name, value, checked } = e.target;
    setState((prevState) => ({
      ...prevState,
      [id]: {
        ...(prevState[id] || {}),
        [name]: checked
          ? [...(prevState[id]?.[name] || []), value]
          : prevState[id][name].filter((option) => option !== value),
      },
    }));
  };

  useEffect(() => {
    setFoodHandlingDetails(state)
  
    return () => {
      setFoodHandlingDetails([])
    }
  }, [state])
  
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
        Food Handling Details
      </Text>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Category</Th>
            <Th>Option</Th>
          </Tr>
        </Thead>
        <Tbody>
          {foodHandlingData?.map(({ id, label, options, type }) => (
            <Tr key={id}>
              <Td w="55%">{label}</Td>
              <Td>
                {type === "checkbox" ? (
                  <Flex direction="column">
                    {options?.map(({ id: optionId, label: optionLabel }) => (
                      <Checkbox
                        key={optionId}
                        name={label}
                        value={optionLabel}
                        isChecked={state[id]?.[name] && state[id][name].includes(optionLabel)}
                        onChange={(e) => handleCheckboxChange(e, id)}
                      >
                        {optionLabel}
                      </Checkbox>
                    ))}
                  </Flex>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      position: "relative",
                    }}
                  >
                    <Radio
                      name={label}
                      value="true"
                      isChecked={state[id] === true}
                      onChange={(e) => handleRadioChange(e, id)}
                    >
                      Yes
                    </Radio>
                    <Radio
                      name={label}
                      value="false"
                      isChecked={state[id] === false}
                      onChange={(e) => handleRadioChange(e, id)}
                    >
                      No
                    </Radio>
                  </div>
                )}
              </Td>
            </Tr>
          )).sort((a, b) => a.id - b.id)}
        </Tbody>
      </Table>
      <Box m={2}>
        <Textarea
          placeholder="Additional Remarks here"
          borderColor="blackAlpha.400"
          onChange={(e) =>
            setRemarksParent({
              documentationRemarks: remarksParent.documentationRemarks,
              foodHandlingRemarks: e.target.value,
              otherConformanceRemarks: remarksParent.otherConformanceRemarks,
              deliveryVehicleRemarks: remarksParent.deliveryVehicleRemarks,
              hygieneRemarks: remarksParent.hygieneRemarks,
            })
          }
        />
      </Box>
    </Box>
  );
};

export default FoodHandlingDetails;
