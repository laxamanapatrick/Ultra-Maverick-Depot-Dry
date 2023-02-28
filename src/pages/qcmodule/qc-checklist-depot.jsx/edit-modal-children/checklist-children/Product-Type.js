import React, { useContext } from "react";
import { Box, HStack, Select, Text } from "@chakra-ui/react";
import { productTypeData } from "./checklistData-partTwo";
import { ReceivingContext } from "../../../../../context/ReceivingContext";

const ProductType = () => {
  const { setProductType } = useContext(ReceivingContext);

  return (
    <>
      <Box w="98%" border="1px solid gray" borderRadius="5px">
        <Text
          w="full"
          mb={2}
          fontSize="sm"
          textAlign="start"
          bgColor="secondary"
          color="white"
        >
          7. Product / Commodity Type
        </Text>
        <HStack m={5}>
          <Text w="50%">Detail</Text>
          <Select
            placeholder="Please select a Product Type"
            bgColor="#fff8dc"
            onChange={(e) => setProductType(e.target.value)}
          >
            {productTypeData?.map((item) => (
              <option key={item.id} value={item.details}>
                {item.details}
              </option>
            ))}
          </Select>
        </HStack>
      </Box>
    </>
  );
};

export default ProductType;
