import React from "react"
import moment from "moment"
import { HStack, Input, Text, VStack } from "@chakra-ui/react"

const ProductInformation = ({ editData }) => {
  const textStyle = {
    fontSize: "sm",
    fontWeight: "semibold",
  }
  return (
    <>
    <Text fontSize='sm' textAlign='center' bgColor='secondary' color='white' w='full'>Raw Materials Information</Text>
      <VStack spacing={8} mx={0}>
        <HStack spacing={3}>
          <VStack spacing={0} alignItems="start">
            <Text sx={textStyle}>Transaction ID</Text>
            <Input readOnly h="35px" value="No included in get request yet" />
          </VStack>
          <VStack spacing={0} alignItems="start">
            <Text sx={textStyle}>Item Code</Text>
            <Input readOnly h="35px" value={editData?.itemCode} />
          </VStack>
          <VStack spacing={0} alignItems="start">
            <Text sx={textStyle}>Item Class</Text>
            <Input readOnly h="35px" value="No masterlist yet" />
          </VStack>
          <VStack spacing={0} alignItems="start">
            <Text sx={textStyle}>Major Category</Text>
            <Input readOnly h="35px" value="No masterlist yet" />
          </VStack>
        </HStack>
        <HStack spacing={3}>
          <VStack spacing={0} alignItems="start">
            <Text sx={textStyle}>Receiving Date</Text>
            <Input
              readOnly
              h="35px"
              value={moment(new Date()).format("yyyy-MM-DD")}
            />
          </VStack>
          <VStack spacing={0} alignItems="start">
            <Text sx={textStyle}>Item Description</Text>
            <Input readOnly h="35px" value={editData?.itemDescription} />
          </VStack>
          <VStack spacing={0} alignItems="start">
            <Text sx={textStyle}>Item Type</Text>
            <Input readOnly h="35px" value="Item Category not in get" />
          </VStack>
          <VStack spacing={0} alignItems="start">
            <Text sx={textStyle}>Sub Category</Text>
            <Input readOnly h="35px" value="No masterlist yet" />
          </VStack>
        </HStack>
        <HStack spacing={3} justifyContent="start" w="full">
          <VStack spacing={0} alignItems="start">
            <Text sx={textStyle}>Supplier</Text>
            <Input readOnly h="35px" value={editData?.supplier} />
          </VStack>
          <VStack spacing={0} alignItems="start">
            <Text sx={textStyle}>Unit Price</Text>
            <Input readOnly h="35px" value="Not included in get request" />
          </VStack>
        </HStack>
      </VStack>
    </>
  )
}

export default ProductInformation
