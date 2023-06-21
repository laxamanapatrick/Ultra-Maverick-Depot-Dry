// Customer Name Basis

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

// export const ConfirmFiltteredModal = ({
//   isOpen,
//   onClose,
//   resultArray,
//   openErrorModal,
//   closeErrorModal,
//   isLoading,
//   fetchNotification,
// }) => {
//   const toast = useToast();

//   const syncHandler = () => {
//     try {
//       // setIsLoading(true)
//       const res = apiClient
//         .post(
//           `Ordering/AddNewOrders`,
//           resultArray.map((item) => ({
//             transactId: item?.transactId,
//             customerName: item?.customerName,
//             customerPosition: item?.customerPosition,
//             // farmType: item?.farmType,
//             farmCode: item?.farmCode,
//             farmName: item?.farmName,
//             orderNo: item?.orderNo,
//             // batchNo: item?.batchNo.toString(),
//             orderDate: moment(item?.dateOrdered).format("yyyy-MM-DD"),
//             dateNeeded: moment(item?.dateNeeded).format("yyyy-MM-DD"),
//             // timeNeeded: item?.dateNeeded,
//             // transactionType: item?.transactionType,
//             itemCode: item?.itemCode,
//             itemDescription: item?.itemDescription,
//             uom: item?.uom,
//             quantityOrdered: item?.quantityOrdered,
//             category: item?.category,
//           }))
//         )
//         .then((res) => {
//           ToastComponent("Success", "Orders Synced!", "success", toast);
//           // fetchNotification();
//           // setIsLoading(false)
//           onClose();
//           closeErrorModal();
//         })
//         .catch((err) => {
//           // ToastComponent("Error", "Orders were not Synced!", "error", toast);
//           onClose();
//           // fetchNotification();
//           closeErrorModal()
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
//         <ModalCloseButton onClick={onClose} />

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
//           <Button ml={2} colorScheme="red" onClick={onClose}>
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
import { LoadingDefault } from "../../../assets/Lottie-Animations";

export const ConfirmFiltteredModal = ({
  isOpen,
  onClose,
  resultArray,
  openErrorModal,
  closeErrorModal,
  // isLoading,
  fetchNotification,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
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
      customerId: customers?.find((x) => x.customerName === item?.farmName)?.id,
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
    try {
      setIsLoading(true);
      const res = await apiClient.post(`Ordering/AddNewOrder`, submitData);
      ToastComponent("Success", "Orders Synced!", "success", toast);
      setIsLoading(false);
      onClose();
      closeErrorModal();
    } catch (err) {
      setIsLoading(false);
      console.log(err)
      onClose();
      closeErrorModal();
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
              isLoading={isLoading}
              ml={2}
              colorScheme="red"
              onClick={onClose}
            >
              No
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {isLoading && <LoadingDefault text="Syncing Orders" />}
    </>
  );
};
