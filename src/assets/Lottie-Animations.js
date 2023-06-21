import React from "react";
import Lottie from "lottie-react";
import loadingSearchFiles from "./loading-search-files.json";
import loadingBox from "./loading-box.json"
import { Box, Heading } from "@chakra-ui/react";

export const LoadingSearchFilesPopup = ({ text }) => {
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      zIndex="9999"
      display="flex"
      justifyContent="center"
      alignItems="center"
      backgroundColor="primary"
      opacity="0.979"
      flexDirection="column"
    >
      <Lottie
        animationData={loadingSearchFiles}
        style={{ padding: 0, margin: 0 }}
      />
      {text && (
        <Heading fontSize="lg" color="white" mt={2}>
          {text ? text : ""}
        </Heading>
      )}
    </Box>
  );
};

export const LoadingDefault = ({ text }) => {
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      zIndex="9999"
      display="flex"
      justifyContent="center"
      alignItems="center"
      backgroundColor="primary"
      opacity="0.979"
      flexDirection="column"
    >
      <Lottie
        animationData={loadingBox}
        style={{ padding: 0, margin: 0 }}
      />
      {text && (
        <Heading fontSize="lg" color="white" mt={2}>
          {text ? text : ""}
        </Heading>
      )}
    </Box>
  );
};
