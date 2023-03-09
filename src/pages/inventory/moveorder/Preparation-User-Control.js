import React from "react";
import { Flex } from "@chakra-ui/react";
import { MdConstruction } from "react-icons/md";
import { AiFillPlayCircle } from "react-icons/ai";

export const DisablePreparation = ({ preparingUser }) => {
  return (
    <Flex
      w="full"
      height="100%"
      justifyContent="center"
      alignItems="center"
      position="fixed"
      backgroundColor="rgba(52, 52, 52, 0.8)"
      mt="80px"
      flexDirection="column"
      zIndex="modal"
    >
      <Flex>
        {/* <MdConstruction fontSize="400px" color="white" /> */}
      </Flex>
      <Flex color="white" mb="80px" fontSize="xl">{`${
        preparingUser && preparingUser
      } is currently preparing this order.`}</Flex>
    </Flex>
  );
};

export const EnablePreparation = () => {
  return (
    <Flex
      w="full"
      height="100%"
      justifyContent="center"
      alignItems="center"
      position="fixed"
      backgroundColor="rgba(52, 52, 52, 0.8)"
      mt="80px"
      flexDirection="row"
      zIndex="modal"
    >
      <Flex>
        {/* <AiFillPlayCircle fontSize="400px" color="white" /> */}
      </Flex>
      <Flex color="white" mb="80px" fontSize="xl">
        This order is ready for preparation.
      </Flex>
    </Flex>
  );
};
