import React, { useRef } from "react";
import moment from "moment";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  HStack,
  Input,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { decodeUser } from "../../../../services/decode-user";
import { ToastComponent } from "../../../../components/Toast";

const ReceivingInformation = ({
  editData,
  submitReceiving,
  setSubmitReceiving,
}) => {
  const toast = useToast();
  const user = decodeUser();
  const newDate = new Date();
  const dateToday = moment(newDate).format("yyyy-MM-DD");
  const textStyle = {
    fontSize: "sm",
    fontWeight: "semibold",
  };

  const expiryDateHandler = (data) => {
    console.log(data);
    const day1 = new Date();
    const day2 = new Date(data);
    const daysDifference =
      (day2.getTime() - day1.getTime()) / (1000 * 3600 * 24);
    if (daysDifference <= 30) {
      ToastComponent("Warning", "Item is about to expire", "warning", toast);
    }
    setSubmitReceiving({
      manufacturingDate: submitReceiving.manufacturingDate,
      expiryDate: data,
      expectedDelivery: submitReceiving.expectedDelivery,
      actualQuantityDelivered: submitReceiving.actualQuantityDelivered,
    });
  };

  const actualQuantityDeliveredRef = useRef();
  const handleActualQuantityDelivered = (data) => {
    const allowablePercent = editData.quantityOrdered * 0.1;
    const allowableAmount = editData.actualRemaining + allowablePercent;
    if (Number(data) > allowableAmount) {
      setSubmitReceiving({
        manufacturingDate: submitReceiving.manufacturingDate,
        expiryDate: submitReceiving.expiryDate,
        expectedDelivery: submitReceiving.expectedDelivery,
        actualQuantityDelivered: "",
      });
      actualQuantityDeliveredRef.current.value = "";
      ToastComponent(
        "Warning!",
        "Amount is greater than allowable",
        "warning",
        toast
      );
    } else {
      setSubmitReceiving({
        manufacturingDate: submitReceiving.manufacturingDate,
        expiryDate: submitReceiving.expiryDate,
        expectedDelivery: submitReceiving.expectedDelivery,
        actualQuantityDelivered: data,
      });
    }
  };

  return (
    <>
      <Accordion w="full" allowMultiple defaultIndex={[0]}>
        <AccordionItem>
          <AccordionButton>
            <Text
              fontSize="sm"
              textAlign="center"
              bgColor="secondary"
              color="white"
              w="full"
            >
              Receiving Information
              <AccordionIcon />
            </Text>
          </AccordionButton>
          <AccordionPanel>
            {/* <Text
        fontSize="sm"
        textAlign="center"
        bgColor="secondary"
        color="white"
        w="full"
      ></Text> */}
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
                  <Input readOnly h="35px" value={editData?.quantityOrdered} />
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
              <HStack spacing={3}>
                <VStack spacing={0} alignItems="start">
                  <Text
                    sx={textStyle}
                    // color={submitReceiving.manufacturingDate ? "" : "danger"}
                  >
                    Manufacturing Date (if applicable)
                  </Text>
                  <Input
                    // bgColor="#fff8dc"
                    type="date"
                    w="215px"
                    h="35px"
                    max={dateToday}
                    onChange={(e) =>
                      setSubmitReceiving({
                        manufacturingDate: e.target.value,
                        expiryDate: submitReceiving.expiryDate,
                        expectedDelivery: submitReceiving.expectedDelivery,
                        actualQuantityDelivered:
                          submitReceiving.actualQuantityDelivered,
                      })
                    }
                  />
                </VStack>
                <VStack spacing={0} alignItems="start">
                  <Text
                    sx={textStyle}
                    color={
                      editData?.isExpirable
                        ? submitReceiving.expiryDate
                          ? ""
                          : "danger"
                        : ""
                    }
                  >
                    Expiry Date
                  </Text>
                  {editData?.isExpirable ? (
                    <Input
                      bgColor="#fff8dc"
                      type="date"
                      w="215px"
                      h="35px"
                      min={dateToday}
                      onChange={(e) => expiryDateHandler(e.target.value)}
                    />
                  ) : (
                    <Input
                      readOnly
                      w="215px"
                      h="35px"
                      value="Item is not expirable"
                      // onChange={(e) => expiryDateHandler(e.target.value)}
                    />
                  )}
                </VStack>
                <VStack spacing={0} alignItems="start">
                  <Text
                    sx={textStyle}
                    color={submitReceiving.expectedDelivery ? "" : "danger"}
                  >
                    Expected Delivery
                  </Text>
                  <Input
                    bgColor="#fff8dc"
                    type="number"
                    h="35px"
                    onChange={(e) =>
                      setSubmitReceiving({
                        manufacturingDate: submitReceiving.manufacturingDate,
                        expiryDate: submitReceiving.expiryDate,
                        expectedDelivery: e.target.value,
                        actualQuantityDelivered:
                          submitReceiving.actualQuantityDelivered,
                      })
                    }
                  />
                </VStack>
                <VStack spacing={0} alignItems="start">
                  <Text
                    sx={textStyle}
                    color={
                      submitReceiving.actualQuantityDelivered ? "" : "danger"
                    }
                  >
                    Actual Quantity Delivered
                  </Text>
                  <Input
                    bgColor="#fff8dc"
                    type="number"
                    h="35px"
                    ref={actualQuantityDeliveredRef}
                    onChange={(e) =>
                      handleActualQuantityDelivered(e.target.value)
                    }
                    // onChange={(e) =>
                    //   setSubmitReceiving({
                    //     manufacturingDate: submitReceiving.manufacturingDate,
                    //     expiryDate: submitReceiving.expiryDate,
                    //     expectedDelivery: submitReceiving.expectedDelivery,
                    //     actualQuantityDelivered: e.target.value,
                    //   })
                    // }
                  />
                </VStack>
              </HStack>
            </VStack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default ReceivingInformation;
