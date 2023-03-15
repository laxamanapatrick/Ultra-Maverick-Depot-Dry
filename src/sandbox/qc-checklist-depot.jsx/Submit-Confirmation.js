import React from "react";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Button,
  Stack,
  VStack,
  Text,
  ButtonGroup,
  useToast,
} from "@chakra-ui/react";
import { RiQuestionLine } from "react-icons/ri";
import moment from "moment";
import { decodeUser } from "../../services/decode-user"
import apiClient from "../../services/apiClient";
import { ToastComponent } from "../../components/Toast";

const SubmitConfirmation = ({
  isConfirmation,
  closeEditModal,
  closeConfirmation,
  fetchPo,
  fetchNotification,
  editData,
  submitReceiving,
  totalReject,
  rejectionInformation,
  documentationChecklist,
  foodHandlingDetails,
  conformanceDetails,
  otherConformanceDetails,
  deliveryDetails,
  hygieneDetails,
  productType,
}) => {
  const user = decodeUser();
  const toast = useToast();

  const checklistArray = [
    foodHandlingDetails[1]["Color"]?.map((item) => {
      return {
        pO_ReceivingId: editData.id,
        checlist_Type: "Color",
        value: item,
      };
    }),
    foodHandlingDetails[2]["Odor"]?.map((item) => {
      return {
        pO_ReceivingId: editData.id,
        checlist_Type: "Odor",
        value: item,
      };
    }),
    foodHandlingDetails[3]["Appearance"]?.map((item) => {
      return {
        pO_ReceivingId: editData.id,
        checlist_Type: "Appearance",
        value: item,
      };
    }),
    foodHandlingDetails[4]["Texture"]?.map((item) => {
      return {
        pO_ReceivingId: editData.id,
        checlist_Type: "Texture",
        value: item,
      };
    }),
    foodHandlingDetails[5]["Absence Of Contaminants"]?.map((item) => {
      return {
        pO_ReceivingId: editData.id,
        checlist_Type: "Absence Of Contaminants",
        value: item,
      };
    }),
    foodHandlingDetails[6]["Product Condition"]?.map((item) => {
      return {
        pO_ReceivingId: editData.id,
        checlist_Type: "Product Condition",
        value: item,
      };
    }),
  ];

  const submitChecklist = checklistArray?.map((item, index) => {
    return { ...item };
  });

  const submitData = {
    pO_Receiving: {
      pO_Summary_Id: editData.id,
      manufacturing_Date: submitReceiving.manufacturingDate,
      expected_Delivery: submitReceiving.expectedDelivery,
      expiry_Date: submitReceiving.expiryDate,
      actual_Delivered: submitReceiving.actualQuantityDelivered,
      itemCode: editData.itemCode,
      totalReject: totalReject,
      qC_ReceiveDate: moment(new Date()).format("yyyy-MM-DD"),
      qcBy: user?.fullName
    },
    checklistForCompliants: [
      {
        pO_ReceivingId: editData.id,
        checklist_Type: "Documentation Requirements",
        value: "Certificate of Analysis",
        isCompliant: documentationChecklist[0].certificateOfAnalysis,
      },
      {
        pO_ReceivingId: editData.id,
        checklist_Type: "Documentation Requirements",
        value: "Certificate of Product Registration",
        isCompliant: documentationChecklist[1].certificateOfProductRegistration,
      },
      {
        pO_ReceivingId: editData.id,
        checklist_Type: "Documentation Requirements",
        value: "Food Grade Certificate",
        isCompliant: documentationChecklist[2].foodGradeCertificate,
      },
      {
        pO_ReceivingId: editData.id,
        checklist_Type: "Documentation Requirements",
        value: "Meat Inspection Certificate",
        isCompliant: documentationChecklist[3].meatInspectionCertificate,
      },
      {
        pO_ReceivingId: editData.id,
        checklist_Type: "Documentation Requirements",
        value: "Purchase Order",
        isCompliant: documentationChecklist[4].purchaseOrder,
      },
      {
        pO_ReceivingId: editData.id,
        checklist_Type: "Documentation Requirements",
        value: "Material Safety Data Sheet",
        isCompliant: documentationChecklist[5].materialSafetyDataSheet,
      },
      {
        pO_ReceivingId: editData.id,
        checklist_Type: "Documentation Requirements",
        value: "Migration Test",
        isCompliant: documentationChecklist[6].migrationTest,
      },
      {
        pO_ReceivingId: editData.id,
        checklist_Type: "Documentation Requirements",
        value: "Veterinary Health Certificate",
        isCompliant: documentationChecklist[7].veterinaryHealthCertificate,
      },
      {
        pO_ReceivingId: editData.id,
        checklist_Type: "Documentation Requirements",
        value: "Shipping Permit",
        isCompliant: documentationChecklist[8].shippingPermit,
      },
      {
        pO_ReceivingId: editData.id,
        checklist_Type: "OTHER CONFORMANCE PARAMETERS ON PRODUCT CONDITION/S",
        value: "No rust, torn/detached parts, etc",
        isCompliant: otherConformanceDetails[0]["noRustTornDetachedPartsEtc."],
      },
      {
        pO_ReceivingId: editData.id,
        checklist_Type: "OTHER CONFORMANCE PARAMETERS ON PRODUCT CONDITION/S",
        value: "Delivered in freezer/refeer van",
        isCompliant: otherConformanceDetails[1].deliveredInFreezeRefeerVan,
      },
      {
        pO_ReceivingId: editData.id,
        checklist_Type: "OTHER CONFORMANCE PARAMETERS ON PRODUCT CONDITION/S",
        value:
          "Properly packed in clean plastic packaging materials/ containers/crates/ sack/boxes etc",
        isCompliant:
          otherConformanceDetails[2][
            "properlyPackedInCleanPlasticPackagingMaterialsContainersCratesSackBoxesEtc."
          ],
      },
      {
        pO_ReceivingId: editData.id,
        checklist_Type: "OTHER CONFORMANCE PARAMETERS ON PRODUCT CONDITION/S",
        value: "Durable / elastic (if plastic/ packaging material)",
        isCompliant:
          otherConformanceDetails[3][
            "durableElasticIfPlaticPackagingMaterial)"
          ],
      },
      {
        pO_ReceivingId: editData.id,
        checklist_Type: "OTHER CONFORMANCE PARAMETERS ON PRODUCT CONDITION/S",
        value: "No holes and/or tears",
        isCompliant: otherConformanceDetails[4].noHolesAndOrTears,
      },
      {
        pO_ReceivingId: editData.id,
        checklist_Type: "OTHER CONFORMANCE PARAMETERS ON PRODUCT CONDITION/S",
        value: "With clear, correct and readable product information and label",
        isCompliant:
          otherConformanceDetails[5]
            .withClearCorrectAndReadableProductInformationAndLabel,
      },
      {
        pO_ReceivingId: editData.id,
        checklist_Type: "OTHER CONFORMANCE PARAMETERS ON PRODUCT CONDITION/S",
        value: "No spillages / leaks/wet portions",
        isCompliant: otherConformanceDetails[6].noSpillagesLeaksWetPortions,
      },
      {
        pO_ReceivingId: editData.id,
        checklist_Type: "OTHER CONFORMANCE PARAMETERS ON PRODUCT CONDITION/S",
        value:
          "Stored/ delivered in clean and in good conditioned container (crates and/or pallets)",
        isCompliant:
          otherConformanceDetails[7][
            "storedDeliveredInCleanAndInGoodConditionedContainerCratesAndOrPallets)"
          ],
      },
      {
        pO_ReceivingId: editData.id,
        checklist_Type: "OTHER CONFORMANCE PARAMETERS ON PRODUCT CONDITION/S",
        value: "Each product type is segregated to avoid cross contamination",
        isCompliant:
          otherConformanceDetails[8]
            .eachProductTypeIsSegragatedToAvoidCrossContamination,
      },
      {
        pO_ReceivingId: editData.id,
        checklist_Type: "OTHER CONFORMANCE PARAMETERS ON PRODUCT CONDITION/S",
        value:
          "Absence of unnecessary things/ products inside the delivery truck that may contaminate the products",
        isCompliant:
          otherConformanceDetails[9]
            .absenceOfUnnecessaryThingsProductsInsideTheDeliveryTruckThatMayContaminateTheProducts,
      },
      {
        pO_ReceivingId: editData.id,
        checklist_Type: "OTHER CONFORMANCE PARAMETERS ON PRODUCT CONDITION/S",
        value: "No dirt, food debris, pest and signs of pest, etc.",
        isCompliant:
          otherConformanceDetails[10]["noDirtFoodDebrisPestAndSignsOfPestEtc."],
      },
      {
        pO_ReceivingId: editData.id,
        checklist_Type: "DELIVERY VEHICLE CONDITION",
        value: "No off odor, detached/ disintegrated parts.",
        isCompliant: deliveryDetails[0]["noOffOdorDetachedDisintegratedParts"],
      },
      {
        pO_ReceivingId: editData.id,
        checklist_Type: "DELIVERY VEHICLE CONDITION",
        value:
          "No rust, retained dirt, food debris or any sign of pest/pest infestation",
        isCompliant:
          deliveryDetails[1][
            "noRustRetainedDirtFoodDebrisOrAnySignOfPestPestInfestation"
          ],
      },
      {
        pO_ReceivingId: editData.id,
        checklist_Type: "DELIVERY VEHICLE CONDITION",
        value:
          "Cooling system is in good working condition and without leaks (if ref/ freezer van)",
        isCompliant:
          deliveryDetails[2][
            "coolingSystemIsInGoodWorkingConditionAndWithoutLeaksIfRefFreezerVan)"
          ],
      },
      {
        pO_ReceivingId: editData.id,
        checklist_Type: "DELIVERY VEHICLE CONDITION",
        value: "Plastic curtains are available, complete and in good condition",
        isCompliant:
          deliveryDetails[3]
            .plasticCurtainsAreAvailableCompleteAndInGoodCondition,
      },
      {
        pO_ReceivingId: editData.id,
        checklist_Type: "HYGIENE PRACTICES",
        value: "Clean and trimmed fingernails. No nail polish and false nails",
        isCompliant:
          hygieneDetails[0].cleanAndTrimmedFingernailsNoNailPolishAndFalseNails,
      },
      {
        pO_ReceivingId: editData.id,
        checklist_Type: "HYGIENE PRACTICES",
        value:
          "Wearing clean, complete and appropriate uniform and/or working attire",
        isCompliant:
          hygieneDetails[1]
            .wearingCleanCompleteAndAppropriateUniformAndOrWorkingAttire,
      },
      {
        pO_ReceivingId: editData.id,
        checklist_Type: "HYGIENE PRACTICES",
        value: "Proper  and short haircut",
        isCompliant: hygieneDetails[2].properAndShortHaircut,
      },
      {
        pO_ReceivingId: editData.id,
        checklist_Type: "HYGIENE PRACTICES",
        value: "Delivery personnel is apparently healthy",
        isCompliant: hygieneDetails[3].deliveryPersonnelIsApparentlyHealthy,
      },
      {
        pO_ReceivingId: editData.id,
        checklist_Type: "HYGIENE PRACTICES",
        value: "Cleanly shaven face",
        isCompliant: hygieneDetails[4].cleanlyShavenFace,
      },
      {
        pO_ReceivingId: editData.id,
        checklist_Type: "HYGIENE PRACTICES",
        value: "Absence of loose items",
        isCompliant: hygieneDetails[5].absenceOfLooseItems,
      },
    ],
    checklistsString: submitChecklist,
    // [
    // foodHandlingDetails[1]["Color"]?.map((item) => {
    //   return {
    //     pO_ReceivingId: editData.id,
    //     checlist_Type: "Color",
    //     value: item,
    //   };
    // })
    // ,
    // foodHandlingDetails[2]["Odor"]?.map((item) => {
    //   return {
    //     pO_ReceivingId: editData.id,
    //     checlist_Type: "Odor",
    //     value: item,
    //   };
    // }),
    //   {
    //     pO_ReceivingId: editData.id,
    //     checlist_Type: "Color",
    //     value: foodHandlingDetails[1]["Color"],
    //     // value: 'Blue'
    //     // ?.map(item => {
    //     //     return {
    //     //         value: item
    //     //     }
    //     // })
    //   },
    //   {
    //     pO_ReceivingId: editData.id,
    //     checlist_Type: "Odor",
    //     value: foodHandlingDetails[2]["Odor"],
    //   },
    //   {
    //     pO_ReceivingId: editData.id,
    //     checlist_Type: "Appearance",
    //     value: foodHandlingDetails[3]["Appearance"],
    //   },
    //   {
    //     pO_ReceivingId: editData.id,
    //     checlist_Type: "Texture",
    //     value: foodHandlingDetails[4]["Texture"],
    //   },
    //   {
    //     pO_ReceivingId: editData.id,
    //     checlist_Type: "Absence Of Contaminants",
    //     value: foodHandlingDetails[5]["Absence Of Contaminants"],
    //   },
    //   {
    //     pO_ReceivingId: editData.id,
    //     checlist_Type: "Product Condition",
    //     value: foodHandlingDetails[6]["Product Condition"],
    //   },
    //   {
    //     pO_ReceivingId: editData.id,
    //     checlist_Type: "Product / Commodity Type",
    //     value: [productType],
    //   },
    // ],
    checkListInput: [
      {
        pO_ReceivingId: editData.id,
        checlist_Type: "CONFORMANCE TO SET STANDARD SPECIFICATIONS",
        parameter: "Width",
        value: conformanceDetails.width,
      },
      {
        pO_ReceivingId: editData.id,
        checlist_Type: "CONFORMANCE TO SET STANDARD SPECIFICATIONS",
        parameter: "HEIGHT",
        value: conformanceDetails.height,
      },
      {
        pO_ReceivingId: editData.id,
        checlist_Type: "CONFORMANCE TO SET STANDARD SPECIFICATIONS",
        parameter: "LENGTH",
        value: conformanceDetails.length,
      },
      {
        pO_ReceivingId: editData.id,
        checlist_Type: "CONFORMANCE TO SET STANDARD SPECIFICATIONS",
        parameter: "THICKNESS",
        value: conformanceDetails.thickness,
      },
      {
        pO_ReceivingId: editData.id,
        checlist_Type: "CONFORMANCE TO SET STANDARD SPECIFICATIONS",
        parameter: "DIAMETER",
        value: conformanceDetails.diameter,
      },
      {
        pO_ReceivingId: editData.id,
        checlist_Type: "CONFORMANCE TO SET STANDARD SPECIFICATIONS",
        parameter: "RADIUS",
        value: conformanceDetails.radius,
      },
      {
        pO_ReceivingId: editData.id,
        checlist_Type: "CONFORMANCE TO SET STANDARD SPECIFICATIONS",
        parameter: "INTERNAL / SURFACE TEMPERATURE (if cold products)",
        value:
          conformanceDetails[
            "internal / surface temperature (if cold products)"
          ],
      },
      {
        pO_ReceivingId: editData.id,
        checlist_Type: "DELIVERY VEHICLE CONDITION",
        parameter:
          "Delivery vehicle temperature (if product is delivered using freezer/reefer van)",
        value: deliveryDetails[4].deliveryVehicleTemperature,
      },
      {
        pO_ReceivingId: editData.id,
        checlist_Type: "DELIVERY VEHICLE CONDITION",
        parameter: "Delivery vehicle's plate number",
        value: deliveryDetails[5].deliveryVehicleSPlateNumber,
      },
      {
        pO_ReceivingId: editData.id,
        checlist_Type: "DELIVERY VEHICLE CONDITION",
        parameter: "Name of delivery personnel",
        value: deliveryDetails[6].nameOfDeliveryPersonnel,
      },
    ],
  };

  const handleSubmit = async () => {
    try {
      const res = await apiClient
        .post(`Receiving/AddNewReceivingInformationInPO`, submitData)
        .then((res) => {
          ToastComponent(
            "Success",
            `PO Number ${editData.pO_Number} has been submitted`,
            "success",
            toast
          );
          fetchPo();
          fetchNotification();
          closeConfirmation();
          console.log(res)
        

          const receivingIdWithoutUseContext = res.data.id;
          const secondSubmit = rejectionInformation.map((data) => {
            return {
              pO_ReceivingId: receivingIdWithoutUseContext,
              quantity: Number(data.rejectQty),
              remarks: data.reason,
            };
          });
          if (totalReject > 0) {
            console.log(secondSubmit);  
            try {
              const res = apiClient.put(
                `Receiving/RejectRawMaterialsByReceivingId`,
                secondSubmit
              );
            } catch (err) {
              console.log(err);
            }
          }
          closeEditModal();

        })
        .catch((err) => {
          ToastComponent(
            "Error",
            `Something went wrong, please try again.`,
            "error",
            toast
          );
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Modal isOpen={isConfirmation} onClose={() => {}} isCentered size="2xl">
        <ModalContent bgColor="primary">
          <ModalHeader></ModalHeader>
          <ModalCloseButton color="white" onClick={closeConfirmation} />
          <ModalBody>
            <VStack>
              <Stack alignItems="center">
                <RiQuestionLine color="white" fontSize="100px" />
                <Text fontSize="sm" color="white">
                  You won't be able to make any revisions.
                </Text>
              </Stack>
              <Text fontSize="lg" color="white">
                Are you sure you want to proceed?
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup size="md">
              <Button colorScheme="blue" onClick={handleSubmit}>
                Yes
              </Button>
              <Button colorScheme="red" onClick={closeConfirmation}>
                No
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SubmitConfirmation;
