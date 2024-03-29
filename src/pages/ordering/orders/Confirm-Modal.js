//Customer Name Basis

// import React from "react";
// import {
//   Button,
//   Flex,
//   Modal,
//   ModalBody,
//   ModalCloseButton,
//   ModalContent,
//   ModalFooter,
//   ModalHeader,
//   Text,
//   useToast,
//   VStack,
// } from "@chakra-ui/react";
// import { BsFillQuestionOctagonFill } from "react-icons/bs";
// import apiClient from "../../../services/apiClient";
// import { ToastComponent } from "../../../components/Toast";
// import moment from "moment";

// export const ConfirmModal = ({
//   isOpen,
//   onClose,
//   resultArray,
//   setIsLoading,
//   setErrorData,
//   openError,
//   isLoading,
//   fetchNotification,
// }) => {
//   const toast = useToast();

//   const syncHandler = () => {
//     try {
//       setIsLoading(true);
//       const res = apiClient
//         .post(
//           `Ordering/AddNewOrders`,
//           resultArray.map((item) => ({
//               transactId: item?.transactId,
//               customerName: item?.customerName,
//               customerPosition: item?.customerPosition,
//               // farmType: item?.farmType,
//               farmCode: item?.farmCode,
//               farmName: item?.farmName,
//               orderNo: item?.orderNo,
//               // batchNo: item?.batchNo.toString(),
//               orderDate: moment(item?.dateOrdered).format("yyyy-MM-DD"),
//               dateNeeded: moment(item?.dateNeeded).format("yyyy-MM-DD"),
//               // timeNeeded: item?.dateNeeded,
//               // transactionType: item?.transactionType,
//               itemCode: item?.itemCode,
//               itemDescription: item?.itemDescription,
//               uom: item?.uom,
//               quantityOrdered: item?.quantityOrdered,
//               category: item?.category,
//           }))
//         )
//         .then((res) => {
//           ToastComponent("Success", "Orders Synced!", "success", toast);
//           fetchNotification();
//           onClose();
//           setIsLoading(false);
//         })
//         .catch((err) => {
//           setIsLoading(false);
//           ToastComponent("Error", "Orders were not Synced!", "error", toast)
//           setErrorData(err.response.data);
//           if (err.response.data) {
//             onClose();
//             openError();
//           }
//         });
//     } catch (error) {}
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={() => {}} size="xl" isCentered>
//       <ModalContent>
//         <ModalHeader>
//           <Flex justifyContent="center">
//             <BsFillQuestionOctagonFill fontSize="50px" />
//           </Flex>
//         </ModalHeader>
//         <ModalCloseButton onClick={onClose} disabled={isLoading} />

//         <ModalBody>
//           <VStack justifyContent="center">
//             <Text>Are you sure you want sync these orders?</Text>
//           </VStack>
//         </ModalBody>

//         <ModalFooter>
//           <Button
//             isLoading={isLoading}
//             onClick={() => syncHandler()}
//             colorScheme="blue"
//           >
//             Yes
//           </Button>
//           <Button
//             ml={2}
//             colorScheme="red"
//             onClick={onClose}
//             isLoading={isLoading}
//           >
//             No
//           </Button>
//         </ModalFooter>
//       </ModalContent>
//     </Modal>
//   );
// };

// Customer ID Basis

import React, { useEffect, useState } from "react";
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { BsFillQuestionOctagonFill } from "react-icons/bs";
import apiClient from "../../../services/apiClient";
import { ToastComponent } from "../../../components/Toast";
import moment from "moment";
import { LoadingSearchFilesPopup } from "../../../assets/Lottie-Animations";

export const ConfirmModal = ({
  isOpen,
  onClose,
  resultArray,
  setIsLoading,
  setErrorData,
  openError,
  isLoading,
  fetchNotification,
}) => {
  const toast = useToast();
  const [customers, setCustomers] = useState([]);

  const fetchActiveCustomersApi = async () => {
    try {
      const res = await apiClient.get(`Customer/GetAllActiveCustomer`);
      setCustomers(res.data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchActiveCustomersApi();

    return () => {
      setCustomers([]);
    };
  }, []);

  const submitData = resultArray.map((item) => {
    return {
      transactId: item?.transactId,
      customerName: item?.customerName,
      customerPosition: item?.customerPosition,
      customerId: (
        customers?.find(
          (x) =>
            x.customerName?.toLowerCase() ===
            item?.customerPosition?.toLowerCase()
        ) || {
          id: null,
        }
      )?.id,
      farmCode: item?.farmCode,
      farmName: item?.farmName,
      orderNo: item?.orderNo,
      orderDate: moment(item?.dateOrdered).format("yyyy-MM-DD"),
      dateNeeded: moment(item?.dateNeeded).format("yyyy-MM-DD"),
      itemCode: item?.itemCode,
      itemDescription: item?.itemDescription,
      uom: item?.uom,
      quantityOrdered: item?.quantityOrdered,
      category: item?.category,
    };
  });

  const syncHandler = async () => {
    console.log(submitData);
    try {
      setIsLoading(true);

      const res = await apiClient.post(
        `Ordering/ValidateNewOrders`,
        submitData
      );

      ToastComponent("Success", "Orders Synced!", "success", toast);
      fetchNotification();
      onClose();
    } catch (err) {
      ToastComponent("Error", "Orders were not Synced!", "error", toast);
      setErrorData(err.response.data);

      if (err.response.data) {
        onClose();
        openError();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => {}} size="xl" isCentered>
        <ModalContent>
          <ModalHeader>
            <Flex justifyContent="center">
              <BsFillQuestionOctagonFill fontSize="50px" />
            </Flex>
          </ModalHeader>
          <ModalCloseButton onClick={onClose} disabled={isLoading} />

          <ModalBody>
            <VStack justifyContent="center">
              <Text>Are you sure you want sync these orders?</Text>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={isLoading}
              onClick={() => syncHandler()}
              colorScheme="blue"
            >
              Yes
            </Button>
            <Button
              ml={2}
              colorScheme="red"
              onClick={onClose}
              isLoading={isLoading}
            >
              No
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {isLoading && <LoadingSearchFilesPopup text="Validating Orders" />}
    </>
  );
};
