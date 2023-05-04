import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  useToast,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  ButtonGroup,
  Flex,
  FormLabel,
  Input,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  Box,
} from "@chakra-ui/react";
import apiClient from "../../../services/apiClient";
import { decodeUser } from "../../../services/decode-user";
import { ToastComponent } from "../../../components/Toast";
// import { useReactToPrint } from "react-to-print";
// import moment from "moment";

const currentUser = decodeUser();

const ApproveModal = ({
  receivingId,
  setReceivingId,
  setPoSummaryId,
  fetchRMNearlyExpire,
  isOpen,
  onClose,
  closeInspectModal,
  fetchNotification,
  viewData,
  otherData,
  handlePrint
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

//   const printRef = useRef();
//   const handlePrint = useReactToPrint({
//     content: () => printRef.current,
//   });

  const submitHandler = () => {
    try {
      setIsLoading(true);
      const res = apiClient
        .put(`Receiving/ApproveNearlyExpire/${receivingId}`, {
          id: receivingId,
          expiryApproveBy: currentUser.fullName,
        })
        .then((res) => {
          handlePrint();
          ToastComponent(
            "Success!",
            "Nearly Expired Raw Material Approved",
            "success",
            toast
          );
          setReceivingId("");
          fetchRMNearlyExpire();
          fetchNotification();
          onClose();
          closeInspectModal();
        })
        .catch((err) => {
          setIsLoading(false);
          ToastComponent("Error!", err.response.data, "error", toast);
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} size="2xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <VStack>
            <Text>Approve</Text>
          </VStack>
        </ModalHeader>
        <ModalCloseButton onClick={onClose} />

        <ModalBody>
          <Flex justifyContent="center">
            <Text>
              Are you sure you want to approve this raw material for warehouse
              receiving?
            </Text>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <ButtonGroup size="sm">
            <Button
              onClick={() => submitHandler()}
              isLoading={isLoading}
              // disabled={!Boolean(submitReason && submitRemarks)}
              colorScheme="blue"
              _hover={{ bgColor: "accent", color: "white" }}
            >
              Yes
            </Button>
            <Button
              onClick={onClose}
              // disabled={!Boolean(submitReason && submitRemarks)}
              colorScheme="red"
              _hover={{ bgColor: "accent", color: "white" }}
            >
              No
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
     
    </Modal>
  );
};

export default ApproveModal;


// {/* <Box w="full" display="none">
// <Stack spacing={8} ref={printRef}>
//   <>
//     {/* Raw mats info */}
//     <Flex
//       justifyContent="center"
//       p={1}
//       color="white"
//       bgColor="secondary"
//     >
//       <Text>RAW MATERIALS INFORMATION</Text>
//     </Flex>

//     <Flex justifyContent="space-between">
//       <FormLabel w="40%">
//         Item Code
//         <Input
//           value={otherData?.itemCode}
//           readOnly={true}
//           _disabled={{ color: "black" }}
//           disabled={true}
//           bgColor="gray.300"
//         />
//       </FormLabel>

//       <FormLabel w="40%">
//         Item Description
//         <Input
//           value={otherData?.itemDescription}
//           readOnly={true}
//           _disabled={{ color: "black" }}
//           disabled={true}
//           bgColor="gray.300"
//         />
//       </FormLabel>
//     </Flex>
//     <Flex justifyContent="space-between">
//       <FormLabel w="40%">
//         UOM
//         <Input
//           value={otherData?.uom}
//           readOnly={true}
//           _disabled={{ color: "black" }}
//           disabled={true}
//           bgColor="gray.300"
//         />
//       </FormLabel>

//       <FormLabel w="40%">
//         Supplier
//         <Input
//           value={otherData?.supplier}
//           readOnly={true}
//           _disabled={{ color: "black" }}
//           disabled={true}
//           bgColor="gray.300"
//         />
//       </FormLabel>
//     </Flex>
//   </>
//   <>
//     {/* Receiving Info */}
//     <Flex
//       justifyContent="center"
//       p={1}
//       color="white"
//       bgColor="secondary"
//     >
//       <Text>RECEIVING INFORMATION</Text>
//     </Flex>

//     <Flex justifyContent="space-between">
//       <FormLabel w="40%">
//         PO NO.
//         <Input
//           value={otherData?.pO_Number}
//           readOnly={true}
//           _disabled={{ color: "black" }}
//           disabled={true}
//           bgColor="gray.300"
//         />
//       </FormLabel>

//       <FormLabel w="40%">
//         PO Date
//         <Input
//           value={otherData?.pO_Date}
//           readOnly={true}
//           _disabled={{ color: "black" }}
//           disabled={true}
//           bgColor="gray.300"
//         />
//       </FormLabel>
//     </Flex>
//     <Flex justifyContent="space-between">
//       <FormLabel w="40%">
//         PR No.
//         <Input
//           value={otherData?.pR_Number}
//           readOnly={true}
//           _disabled={{ color: "black" }}
//           disabled={true}
//           bgColor="gray.300"
//         />
//       </FormLabel>

//       <FormLabel w="40%">
//         PR Date
//         <Input
//           value={otherData?.pR_Date}
//           readOnly={true}
//           _disabled={{ color: "black" }}
//           disabled={true}
//           bgColor="gray.300"
//         />
//       </FormLabel>
//     </Flex>
//     <Flex justifyContent="space-between">
//       <FormLabel w="40%">
//         Quantity Ordered
//         <Input
//           value={otherData?.quantityOrdered}
//           readOnly={true}
//           _disabled={{ color: "black" }}
//           disabled={true}
//           bgColor="gray.300"
//         />
//       </FormLabel>

//       <FormLabel w="40%">
//         Date of Checking
//         <Input
//           value={otherData?.dateOfChecking}
//           readOnly={true}
//           _disabled={{ color: "black" }}
//           disabled={true}
//           bgColor="gray.300"
//         />
//       </FormLabel>
//     </Flex>
//     <Flex justifyContent="space-between">
//       <FormLabel w="40%">
//         Manufacturing Date
//         <Input
//           value={
//             !viewData?.manufacturing_Date
//               ? "No data found"
//               : viewData?.manufacturing_Date === null
//               ? "NA"
//               : moment(viewData?.manufacturing_Date).format(
//                   "yyyy-MM-DD"
//                 )
//           }
//           readOnly={true}
//           _disabled={{ color: "black" }}
//           disabled={true}
//           bgColor="gray.300"
//         />
//       </FormLabel>

//       <FormLabel w="40%">
//         Expiry Date
//         <Input
//           value={
//             !viewData?.expiry_Date
//               ? "No data found"
//               : viewData?.expiry_Date === null
//               ? "Not Expirable"
//               : moment(viewData?.expiry_Date).format("yyyy-MM-DD")
//           }
//           readOnly={true}
//           _disabled={{ color: "black" }}
//           disabled={true}
//           bgColor="gray.300"
//         />
//       </FormLabel>
//     </Flex>
//     <Flex justifyContent="space-between">
//       <FormLabel w="40%">
//         Expected Delivery
//         <Input
//           value={viewData?.expected_Delivery}
//           readOnly={true}
//           _disabled={{ color: "black" }}
//           disabled={true}
//           bgColor="gray.300"
//         />
//       </FormLabel>

//       <FormLabel w="40%">
//         Quantity Actual Delivered
//         <Input
//           value={viewData?.actual_Delivered}
//           readOnly={true}
//           _disabled={{ color: "black" }}
//           disabled={true}
//           bgColor="gray.300"
//         />
//       </FormLabel>
//     </Flex>

//     <Flex justifyContent="space-between">
//       <FormLabel w="40%">
//         QC By:
//         <Input
//           value={viewData?.qcBy}
//           readOnly={true}
//           _disabled={{ color: "black" }}
//           disabled={true}
//           bgColor="gray.300"
//         />
//       </FormLabel>

//       <FormLabel w="40%">
//         Monitored By:
//         <Input
//           value={viewData?.monitoredBy}
//           readOnly={true}
//           _disabled={{ color: "black" }}
//           disabled={true}
//           bgColor="gray.300"
//         />
//       </FormLabel>
//     </Flex>

//     <Flex justifyContent="space-between">
//       <FormLabel w="40%">
//         QC Received Date:
//         <Input
//           value={moment(viewData?.qC_ReceiveDate).format("yyyy-MM-DD")}
//           readOnly={true}
//           _disabled={{ color: "black" }}
//           disabled={true}
//           bgColor="gray.300"
//         />
//       </FormLabel>
//     </Flex>
//   </>
//   {/* <Flex justifyContent="space-between">
//         <FormLabel w="40%">
//           No. Qty Actual Good Needed
//           <Input
//             value={viewData?.expected_Delivery}
//             readOnly={true}
//             _disabled={{ color: "black" }}
//             disabled={true}
//             bgColor="gray.300"
//           />
//         </FormLabel>

//         <FormLabel w="40%">
//           Batch No.
//           <Input
//             value={`None`}
//             readOnly={true}
//             _disabled={{ color: "black" }}
//             disabled={true}
//             bgColor="gray.300"
//           />
//         </FormLabel>
//       </Flex> */}

//   <>
//     {/* Checklists Info */}
//     <Flex
//       justifyContent="center"
//       p={1}
//       color="white"
//       bgColor="secondary"
//     >
//       <Text>CHECKLISTS INFORMATION</Text>
//     </Flex>

//     {viewData?.checklists?.map((item, i) => (
//       <>
//         <Table>
//           <Thead key={i} bgColor="secondary">
//             <Tr>
//               <Th color="white">{item.checklist_Type}</Th>
//             </Tr>
//           </Thead>
//           <Tbody>
//             {item?.values?.map((value, i) => (
//               <Tr key={i}>
//                 <Td>{value}</Td>
//               </Tr>
//             ))}
//           </Tbody>
//         </Table>
//       </>
//     ))}
//   </>
// </Stack>
// </Box> */}