import React from "react";
import { Button, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { AccessDeniedDisplay } from "../assets/Lottie-Animations";

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <>
      <Flex flexDirection="column" alignItems="center">
        <AccessDeniedDisplay text='You do not have permission to access this module' />
        <Button w="auto" mt={5} zIndex={9999} onClick={() => navigate("/")}>
          Return to homepage
        </Button>
      </Flex>
    </>
  );
};

export default AccessDenied;
