import React from "react";
import { Flex, Select, Text, VStack } from "@chakra-ui/react";

const ForTesting = () => {
  
  return (
    <>
      <VStack w="full" spacing={0} p={5} justifyContent="start">
        <Flex w='full' alignItems='center'>
          <Select w="auto" placeholder='All' _focus={{display:'border:none'}}>
            <option style={{color:'black'}}>For Testing</option>
            <option style={{color:'black'}}>Returned</option>
            <option style={{color:'black'}}>Failed</option>
          </Select>
          <Text w='80%' textAlign='center' color='secondary'>Laboratory Testing Preview</Text>
        </Flex>
        <Flex border="1px" borderColor="secondary" w="full" h="80.8vh">
          ee
        </Flex>
      </VStack>
    </>
  );
};

export default ForTesting;
