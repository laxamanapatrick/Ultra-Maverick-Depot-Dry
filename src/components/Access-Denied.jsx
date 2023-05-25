import { Button } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <>
      <div style={{flexDirection: 'column', justifyContent:'center'}}>
        <h1>
          Access Denied, you do not have permission to access this module.
        </h1>
        <Button onClick={() => navigate("/")}>Return to homepage</Button>
      </div>
    </>
  );
};

export default AccessDenied;
