export const documentationData = [
  { id: 1, details: "With minimum updated necessary documents" },
  { id: 2, details: "Certificate of Analysis" },
  { id: 3, details: "Certificate of Product Registration" },
  { id: 4, details: "Food Grade Certificate" },
  { id: 5, details: "Meat Inspection Certificate" },
  { id: 6, details: "Purchase Order" },
  { id: 7, details: "Material Safety Data Sheet" },
  { id: 8, details: "Migration Test" },
  { id: 9, details: "Veterinary Health Certificate" },
  { id: 10, details: "Shipping Permit" },
];

export const foodHandlingData = [
  {
    id: 1,
    type: "checkbox",
    label: "Color",
    options: [
      { id: 1, label: "With Standard Color" },
      { id: 2, label: "With Pale Color" },
      { id: 3, label: "With Darker Color" },
      { id: 4, label: "With greening discoloration" },
      { id: 5, label: "With black, brown or unusual discoloration" },
      { id: 6, label: "NA" },
    ],
  },
  {
    id: 2,
    label: "Odor",
    type: "checkbox",
    options: [
      { id: 1, label: "No off odor" },
      { id: 2, label: "With slight off / spoiled odor" },
      { id: 3, label: "With intense off / spoiled odor" },
      { id: 4, label: "With unusual odor" },
      { id: 5, label: "NA" },
    ],
  },

  {
    id: 3,
    label: "Appearance",
    type: "checkbox",
    options: [
      { id: 1, label: "With standard appearance" },
      { id: 2, label: "Coarse" },
      { id: 3, label: "Fine" },
      { id: 4, label: "Watery / Runny" },
      { id: 5, label: "Viscous / Thick" },
      { id: 6, label: "Durable" },
      { id: 7, label: "Elastic" },
      { id: 8, label: "Think" },
      { id: 9, label: "Brittle" },
      { id: 10, label: "Turbid" },
      { id: 11, label: "Torn or with holes in the packaging" },
      { id: 12, label: "Thawed out" },
      { id: 13, label: "Wet" },
      { id: 14, label: "Dry" },
      { id: 15, label: "Spoiled" },
      { id: 16, label: "Soggy" },
      { id: 17, label: "Firm" },
      { id: 18, label: "Soft" },
      { id: 19, label: "With slime formation" },
      { id: 20, label: "Exposed" },
      { id: 21, label: "Loose packaging" },
      { id: 22, label: "Bulged packaging" },
      { id: 23, label: "Faded print / label of packaging" },
      { id: 24, label: "Blurred print / label of packaging" },
      { id: 25, label: "Multiple print / label of packaging" },
      {
        id: 26,
        label: "No / faded expiration date / manufacturing or product labels",
      },
      {
        id: 27,
        label:
          "Incomplete or incorrect expiration / manufacturing date or product labels",
      },
      {
        id: 28,
        label: "With clean, correct, complete and readable product labels",
      },
      { id: 29, label: "NA" },
    ],
  },
  {
    id: 4,
    label: "Texture",
    type: "checkbox",
    options: [
      { id: 1, label: "Within standard texture" },
      { id: 2, label: "Rough" },
      { id: 3, label: "Smooth" },
      { id: 4, label: "Watery / Runny" },
      { id: 5, label: "Viscous / Thick" },
      { id: 6, label: "Coarse" },
      { id: 7, label: "Fine" },
      { id: 8, label: "Durable" },
      { id: 9, label: "Elastic" },
      { id: 10, label: "Thin" },
      { id: 11, label: "Brittle" },
      { id: 12, label: "Soggy" },
      { id: 13, label: "Firm" },
      { id: 14, label: "Soft" },
      { id: 15, label: "With slime formation" },
      { id: 16, label: "NA" },
    ],
  },
  {
    id: 5,
    label: "Absence Of Contaminants",
    type: "checkbox",
    options: [
      { id: 1, label: "No contaminant" },
      { id: 2, label: "Hair/s" },
      { id: 3, label: "Sand" },
      { id: 4, label: "Stone/s" },
      { id: 5, label: "Metal Fragments" },
      { id: 6, label: "Paper/s" },
      { id: 7, label: "Soft / brittle / hard plastic materials" },
      { id: 8, label: "Wood chip/s" },
      { id: 9, label: "Chemical/s debris" },
      { id: 10, label: "Food debris" },
      { id: 11, label: "Pest or insects" },
      { id: 12, label: "Pest of insect body parts or feces" },
    ],
  },
  {
    id: 6,
    label: "Product Condition",
    type: "checkbox",
    options: [
      { id: 1, label: "Chilled" },
      { id: 2, label: "Frozen" },
      { id: 3, label: "Semi Frozen" },
      { id: 4, label: "Thawed Out" },
      { id: 5, label: "Expired" },
      { id: 6, label: "Near Expiry" },
      { id: 7, label: "Condemned / Spoiled" },
      { id: 8, label: "With onset spoilage" },
    ],
  },
  {
    id: 7,
    label: "FIFO / FEFO / COMPLIANT",
    type: "radio",
  },
];

export const conformanceData = [
  { id: 1, details: "Width", type: "input" },
  { id: 2, details: "Height", type: "input" },
  { id: 3, details: "Length", type: "input" },
  { id: 4, details: "Thickness", type: "input" },
  { id: 5, details: "Diameter", type: "input" },
  { id: 6, details: "Radius", type: "input" },
  {
    id: 7,
    details: "Internal / Surface Temperature (if cold products)",
    type: "input",
  },
];

export const otherConformanceData = [
  { id: 1, details: "No rust, torn / detached parts, etc." },
  { id: 2, details: "Delivered in freeze / refeer van" },
  {
    id: 3,
    details:
      "Properly packed in clean plastic packaging materials / containers / crates / sack / boxes etc.",
  },
  { id: 4, details: "Durable / elastic (if platic / packaging material)" },
  { id: 5, details: "No holes and / or tears" },
  {
    id: 6,
    details: "With clear, correct and readable product information and label",
  },
  {
    id: 7,
    details:
      "Stored / delivered in clean and in good conditioned container (crates and/or pallets)",
  },
  {
    id: 8,
    details: "Each product type is segragated to avoid cross contamination",
  },
  {
    id: 9,
    details:
      "Absence of unnecessary things/ products inside the delivery truck that may contaminate the products",
  },
  { id: 10, details: "No dirt, food debris, pest and signs of pest, etc." },
];
