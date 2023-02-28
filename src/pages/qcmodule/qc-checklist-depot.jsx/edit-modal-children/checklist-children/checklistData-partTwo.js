import { type } from "@testing-library/user-event/dist/type";

export const deliveryConditionData = [
  {
    id: 1,
    details: "No off odor, detached/ disintegrated parts",
    type: "radio",
  },
  {
    id: 2,
    details:
      "No rust, retained dirt, food debris or any sign of pest/pest infestation",
    type: "radio",
  },
  {
    id: 3,
    details:
      "Cooling system is in good working condition and without leaks (if ref/ freezer van)",
    type: "radio",
  },
  {
    id: 4,
    details: "Plastic curtains are available, complete and in good condition",
    type: "radio",
  },
  { id: 5, details: "Delivery vehicle temperature", type: "input" },
  { id: 6, details: "Delivery vehicle's plate number", type: "input" },
  {id: 7, details: "Name of delivery personnel", type: "input"}
];

export const hygienePracticesData = [
  {
    id: 1,
    details: "Clean and trimmed fingernails. No nail polish and false nails",
    type: "radio",
  },
  {
    id: 2,
    details:
      "Wearing clean, complete and appropriate uniform and/or working attire",
    type: "radio",
  },
  {
    id: 3,
    details: "Proper  and short haircut",
    type: "radio",
  },
  {
    id: 4,
    details: "Delivery personnel is apparently healthy",
    type: "radio",
  },
  {
    id: 5,
    details: "Cleanly shaven face",
    type: "radio",
  },
  {
    id: 6,
    details: "Absence of loose items",
    type: "radio",
  },
  {
    id: 7,
    details: "Name of delivery personnel",
    type: "input",
  },
];

// export const evaluationData = [
//   { id: 1, details: "Fit for human consumption", hasRadio: false },
//   { id: 2, details: "ACCEPT", hasRadio: false },
//   { id: 3, details: "REJECT", hasRadio: false },
//   { id: 4, details: "Quantity Reject", hasRadio: true },
//   { id: 4, details: "Quantity Accept", hasRadio: true },
// ];

// export const inspectionData = [
//   { id: 1, details: "Monitored By:" },
//   { id: 2, details: "Verified By:" },
//   { id: 3, details: "Noted By:" },
// ];

// export const productDetailsData = [
//   { id: 1, details: "Product Name" },
//   { id: 2, details: "Supplier Name" },
//   {
//     id: 3,
//     details: "Product Details (Production/Manufacturing and/or Expiration Date",
//   },
//   { id: 4, details: "Product Specifications (type, SKU, etc." },
// ];

export const productTypeData = [
  { id: 1, details: "Ice" },
  { id: 2, details: "Fruits and Vegetables" },
  { id: 3, details: "Eggs" },
  { id: 4, details: "Dry Ingredients" },
  { id: 5, details: "Liquid Ingredients" },
  { id: 6, details: "Fish and Seafoods" },
  { id: 7, details: "Meats and Meat by Products" },
  { id: 8, details: "Packaging Materials" },
  { id: 9, details: "Cleaning and Sanitizing Chemicals" },
  { id: 10, details: "Other Food Contact Materials" },
];

// export const documentDetailsData = [
//   {
//     id: 1,
//     details:
//       "Document Control Number: QAP-CHK-22-022 rev 03-Effective date May 16, 2022",
//     readOnly: true,
//   },
//   { id: 2, details: "Intended Use: Central Depot", readOnly: true },
//   {
//     id: 3,
//     details:
//       "Document Owner / Author: TECHNICAL SERVICES AND QUALITY ASSURANCE DEPARTMENT",
//     readOnly: true,
//   },
//   {
//     id: 4,
//     details: "Document Name / Title: Incoming Materials Receiving Checklist",
//     readOnly: true,
//   },
//   { id: 5, details: "Evaluation Date: ", readOnly: false },
//   { id: 6, details: "Department-Unit: ", readOnly: false },
// ];
