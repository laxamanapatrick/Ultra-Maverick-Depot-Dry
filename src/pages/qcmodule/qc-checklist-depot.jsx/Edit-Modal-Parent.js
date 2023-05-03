import React, { useState } from "react";
import {
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  VStack,
} from "@chakra-ui/react";
import moment from "moment";
import PageScrollReusable from "../../../components/PageScroll-Reusable";
import { decodeUser } from "../../../services/decode-user";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { ToastComponent } from "../../../components/Toast";
import { ReceivingContext } from "../../../context/ReceivingContext";
import ProductInformation from "./edit-modal-children/Product-Information";
import ReceivingInformation from "./edit-modal-children/Receiving-Information";
import RejectInformation from "./edit-modal-children/Reject-Information";
import ChecklistParent from "./edit-modal-children/Checklist-Parent";
import { documentationData } from "./edit-modal-children/checklist-children/checklistsData";
import SubmitButton from "./Submit";

const currentUser = decodeUser();

export const EditModalComponent = ({
  editData,
  isOpen,
  onClose,
  fetchPo,
  fetchNotification,
}) => {
  // Submit Data states
  const [submitReceiving, setSubmitReceiving] = useState({
    manufacturingDate: null,
    expiryDate: editData?.isExpirable ? "" : null,
    expectedDelivery: "",
    actualQuantityDelivered: "",
    monitoredBy: ''
  });
  const [rejectionInformation, setRejectionInformation] = useState(null);
  const [totalReject, setTotalReject] = useState(0);
  const [documentationChecklist, setDocumentationChecklist] = useState(null);
  const [foodHandlingDetails, setFoodHandlingDetails] = useState(null);
  const [conformanceDetails, setConformanceDetails] = useState(null);
  const [otherConformanceDetails, setOtherConformanceDetails] = useState(null);
  const [deliveryDetails, setDeliveryDetails] = useState(null);
  const [hygieneDetails, setHygieneDetails] = useState(null);
  const [productType, setProductType] = useState(null);

  const [remarksParent, setRemarksParent] = useState({
    documentationRemarks: "",
    foodHandlingRemarks: "",
    otherConformanceRemarks: "",
    deliveryVehicleRemarks: "",
    hygieneRemarks: ""
  })

  return (
    <ReceivingContext.Provider
      value={{
        setDocumentationChecklist,
        setFoodHandlingDetails,
        setConformanceDetails,
        setOtherConformanceDetails,
        setDeliveryDetails,
        setHygieneDetails,
        setProductType,
        submitReceiving,
        setSubmitReceiving,
        remarksParent,
        setRemarksParent
      }}
    >
      <Flex>
        <Modal size="5xl" isOpen={isOpen} onClose={() => {}} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader bgColor="primary" color="white">
              <Text fontSize="md">QC Receiving Checklist</Text>
              {/* <ModalCloseButton mt={1} onClick={onClose} /> */}
            </ModalHeader>

            <ModalBody>
              <PageScrollReusable maxHeight="71vh">
                <VStack spacing={3} w="full">
                  <ProductInformation editData={editData} />
                  <ReceivingInformation
                    editData={editData}
                    submitReceiving={submitReceiving}
                    setSubmitReceiving={setSubmitReceiving}
                  />
                  <RejectInformation
                    actualQuantityDelivered={
                      submitReceiving.actualQuantityDelivered
                    }
                    setRejectionInformation={setRejectionInformation}
                    setTotalReject={setTotalReject}
                  />
                  <ChecklistParent />
                </VStack>
              </PageScrollReusable>
            </ModalBody>

            <ModalFooter borderTop="1px">
              <SubmitButton
                onClose={onClose}
                fetchPo={fetchPo}
                fetchNotification={fetchNotification}
                editData={editData}
                submitReceiving={submitReceiving}
                rejectionInformation={rejectionInformation}
                totalReject={totalReject}
                documentationChecklist={documentationChecklist}
                foodHandlingDetails={foodHandlingDetails}
                conformanceDetails={conformanceDetails}
                otherConformanceDetails={otherConformanceDetails}
                deliveryDetails={deliveryDetails}
                hygieneDetails={hygieneDetails}
                productType={productType}
                remarksParent={remarksParent}
              />
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
    </ReceivingContext.Provider>
  );
};
