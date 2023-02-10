import React from "react";
import { Flex } from "@chakra-ui/react";
import { MdConstruction } from "react-icons/md";

export const DisablePreparation = () => {
  return (
    <Flex
      w="100%"
      height="100%"
      justifyContent="center"
      alignItems="center"
      position="fixed"
      backgroundColor="rgba(52, 52, 52, 0.8)"
      mt='80px'
      flexDirection='column'
    >
      <Flex>
        <MdConstruction fontSize='400px' color='white' />
      </Flex>
      <Flex color="white" mb='80px' fontSize='xl'>Someone is currently preparing this order.</Flex>
    </Flex>
  );
};
