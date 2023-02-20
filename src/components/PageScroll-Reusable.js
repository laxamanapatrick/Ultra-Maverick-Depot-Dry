import React from "react";
import { Box, Flex, VStack } from "@chakra-ui/react";

const PageScrollReusable = ({ children, width, minHeight, maxHeight }) => {
  return (
    <Box
      overflowY="auto"
      overflowX="auto"
      m={0.5}
      w={width ? width : "full"}
      minHeight={minHeight ? minHeight : "auto"}
      maxHeight={maxHeight ? maxHeight : "auto"}
      sx={{
        "&::-webkit-scrollbar": {
          height: "5px",
          width: "5px",
          borderRadius: "1px",
          backgroundColor: `rgba(0, 0, 0, 0.05)`,
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "accent",
        },
      }}
    >
      {children}
    </Box>
  );
};

export default PageScrollReusable;
