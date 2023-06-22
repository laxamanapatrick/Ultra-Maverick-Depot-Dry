import React from "react";
import { PageNotFound } from "../assets/Lottie-Animations";
import { Button, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Flex flexDirection="column" alignItems="center">
      <PageNotFound />
      <Button w="auto" mt={5} zIndex={9999} onClick={() => navigate("/")}>
        Return to home
      </Button>
    </Flex>
  );
};

export default NotFoundPage;
