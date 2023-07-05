import React from "react";
import { Box, Heading } from "@chakra-ui/react";
import Lottie from "lottie-react";
import loadingSearchFiles from "./loading-search-files.json";
import loadingBox from "./loading-box.json";
import pageNotFound from "./page-not-found.json";
import accessDenied from "./access-denied.json";
import loadingData from "./loading-data.json";
import noDataFound from "./no-data.json";

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
      <Lottie animationData={loadingBox} style={{ padding: 0, margin: 0 }} />
      {text && (
        <Heading fontSize="lg" color="white" mt={2}>
          {text ? text : ""}
        </Heading>
      )}
    </Box>
  );
};

export const PageNotFound = ({ text }) => {
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      display="flex"
      justifyContent="center"
      alignItems="center"
      backgroundColor="primary"
      opacity="0.979"
      flexDirection="column"
    >
      <Lottie animationData={pageNotFound} style={{ padding: 0, margin: 0 }} />
      {text && (
        <Heading fontSize="lg" color="white" mt={2}>
          {text ? text : ""}
        </Heading>
      )}
    </Box>
  );
};

export const AccessDeniedDisplay = ({ text }) => {
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      display="flex"
      justifyContent="center"
      alignItems="center"
      backgroundColor="primary"
      opacity="0.979"
      flexDirection="column"
    >
      <Lottie animationData={accessDenied} style={{ padding: 0, margin: 0 }} />
      {text && (
        <Heading fontSize="lg" color="gray.300" mt={2}>
          {text ? text : ""}
        </Heading>
      )}
    </Box>
  );
};

export const LoadingRecords = ({ text }) => {
  return (
    <Box
      sx={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        opacity: 0.95,
        flexDirection: "column",
      }}
    >
      <Lottie animationData={loadingData} style={{ padding: 0, margin: 0 }} />
      {text && (
        <Heading fontSize="lg" color="gray.300" mt={2}>
          {text ? text : ""}
        </Heading>
      )}
    </Box>
  );
};

export const NoDataFound = ({ text }) => {
  return (
    <Box
      sx={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        opacity: 0.95,
        flexDirection: "column",
      }}
    >
      <Lottie animationData={noDataFound} style={{ padding: 0, margin: 0 }} />
      {text && (
        <Heading fontSize="lg" color="gray.300" mt={2}>
          {text ? text : ""}
        </Heading>
      )}
    </Box>
  );
};
