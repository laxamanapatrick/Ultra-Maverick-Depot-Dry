import React from "react";
import moment from "moment";
import { HStack, Input, Text, VStack } from "@chakra-ui/react";
import { decodeUser } from "../../../../services/decode-user";

const ReceivingInformation = ({
  editData,
  submitReceiving,
  setSubmitReceiving,
}) => {
  const user = decodeUser();
  const textStyle = {
    fontSize: "sm",
    fontWeight: "semibold",
  };
  return (
    <>
      <Text
        fontSize="sm"
        textAlign="center"
        bgColor="secondary"
        color="white"
        w="full"
      >
        Receiving Information
      </Text>
      <VStack spacing={8} mx={0}>
        <HStack spacing={3}>
          <VStack spacing={0} alignItems="start">
            <Text sx={textStyle}>PO Number</Text>
            <Input readOnly h="35px" value={editData?.pO_Number} />
          </VStack>
          <VStack spacing={0} alignItems="start">
            <Text sx={textStyle}>PR Number</Text>
            <Input readOnly h="35px" value={editData?.pR_Number} />
          </VStack>
          <VStack spacing={0} alignItems="start">
            <Text sx={textStyle}>Quantity Ordered</Text>
            <Input readOnly h="35px" value={editData?.actualGood} />
          </VStack>
          <VStack spacing={0} alignItems="start">
            <Text sx={textStyle}>Remaining Needed</Text>
            <Input readOnly h="35px" value={editData?.actualRemaining} />
          </VStack>
        </HStack>
        <HStack spacing={3}>
          <VStack spacing={0} alignItems="start">
            <Text sx={textStyle}>Unit of Measurement</Text>
            <Input readOnly h="35px" value={editData?.uom} />
          </VStack>
          <VStack spacing={0} alignItems="start">
            <Text sx={textStyle}>PO Date</Text>
            <Input
              readOnly
              h="35px"
              value={moment(editData?.pO_Date).format("yyyy-MM-DD")}
            />
          </VStack>
          <VStack spacing={0} alignItems="start">
            <Text sx={textStyle}>PR Date</Text>
            <Input
              readOnly
              h="35px"
              value={moment(editData?.pR_Date).format("yyyy-MM-DD")}
            />
          </VStack>
          <VStack spacing={0} alignItems="start">
            <Text sx={textStyle}>Assigned Person</Text>
            <Input readOnly h="35px" value={user?.fullName} />
          </VStack>
        </HStack>

        {/* Required Fields */}
        <HStack spacing={3} w="full">
          <VStack spacing={0} alignItems="start">
            <Text sx={textStyle} color={submitReceiving.manufacturingDate ? '' : 'danger'}>Manufacturing Date</Text>
            <Input
              bgColor="#fff8dc"
              type="date"
              w="224px"
              h="35px"
              onChange={(e) =>
                setSubmitReceiving({
                  manufacturingDate: e.target.value,
                  expiryDate: submitReceiving.expiryDate,
                  expectedDelivery: submitReceiving.expectedDelivery,
                  actualQuantityDelivered: submitReceiving.actualQuantityDelivered,
                })
              }
            />
          </VStack>
          <VStack spacing={0} alignItems="start">
            <Text sx={textStyle} color={submitReceiving.expiryDate ? '' : 'danger'}>Expiry Date</Text>
            <Input
              bgColor="#fff8dc"
              type="date"
              w="224px"
              h="35px"
              onChange={(e) =>
                setSubmitReceiving({
                  manufacturingDate: submitReceiving.manufacturingDate,
                  expiryDate: e.target.value,
                  expectedDelivery: submitReceiving.expectedDelivery,
                  actualQuantityDelivered: submitReceiving.actualQuantityDelivered,
                })
              }
            />
          </VStack>
          <VStack spacing={0} alignItems="start">
            <Text sx={textStyle} color={submitReceiving.expectedDelivery ? '' : 'danger'}>Expected Delivery</Text>
            <Input
              bgColor="#fff8dc"
              type="number"
              h="35px"
              onChange={(e) =>
                setSubmitReceiving({
                  manufacturingDate: submitReceiving.manufacturingDate,
                  expiryDate: submitReceiving.expiryDate,
                  expectedDelivery: e.target.value,
                  actualQuantityDelivered: submitReceiving.actualQuantityDelivered,
                })
              }
            />
          </VStack>
          <VStack spacing={0} alignItems="start">
            <Text sx={textStyle} color={submitReceiving.actualQuantityDelivered ? '' : 'danger'}>Actual Quantity Delivered</Text>
            <Input
              bgColor="#fff8dc"
              type="number"
              h="35px"
              onChange={(e) =>
                setSubmitReceiving({
                  manufacturingDate: submitReceiving.manufacturingDate,
                  expiryDate: submitReceiving.expiryDate,
                  expectedDelivery: submitReceiving.expectedDelivery,
                  actualQuantityDelivered: e.target.value,
                })
              }
            />
          </VStack>
        </HStack>
      </VStack>
    </>
  );
};

export default ReceivingInformation;
