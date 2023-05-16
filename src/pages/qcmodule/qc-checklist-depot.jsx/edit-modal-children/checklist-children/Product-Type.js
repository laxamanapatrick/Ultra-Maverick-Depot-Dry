import React, { useContext, useEffect, useState } from "react";
import { Box, HStack, Input, Select, Text } from "@chakra-ui/react";
// import { productTypeData } from "./checklistData-partTwo";
import { ReceivingContext } from "../../../../../context/ReceivingContext";
import apiClient from '../../../../../services/apiClient'

const fetchProductTypeApi = async () => {
  const res = await apiClient.get(
    `ProductType/GetAllPaginationByStatus/true?search=&PageNumber=1&PageSize=1999`
  );
  return res.data;
};

const ProductType = () => {
  const { setProductType, submitReceiving, setSubmitReceiving } =
    useContext(ReceivingContext);

  const [produtTypes, setProdutTypes] = useState([]);

  const fetchProductTypes = () => {
    fetchProductTypeApi().then((res) => {
      setProdutTypes(res);
    });
  };

  useEffect(() => {
    fetchProductTypes();

    return () => {
      setProdutTypes([]);
    };
  }, []);

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
          Product / Commodity Type
        </Text>
        <HStack m={5}>
          <Text w="50%">Detail</Text>
          <Select
            placeholder="Please select a Product Type"
            bgColor="#fff8dc"
            onChange={(e) => setProductType(e.target.value)}
          >
            {produtTypes?.product?.map((item) => (
              <option key={item.id} value={item.productTypeName}>
                {item.productTypeName}
              </option>
            ))}
          </Select>
        </HStack>
        <HStack m={5}>
          <Text w="50%">Monitored By</Text>
          <Input
            w="98%"
            bgColor="#fff8dc"
            onChange={(e) =>
              setSubmitReceiving({
                manufacturingDate: submitReceiving.manufacturingDate,
                expiryDate: submitReceiving.expiryDate,
                expectedDelivery: submitReceiving.expectedDelivery,
                actualQuantityDelivered:
                  submitReceiving.actualQuantityDelivered,
                monitoredBy: e.target.value,
              })
            }
          />
        </HStack>
      </Box>
    </>
  );
};

export default ProductType;
