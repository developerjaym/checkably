const templates = [
  {
    id: "96ec6268-d1ac-4868-a000-bf35e51c49f1",
    title: "Cruise Packing List",
    description: "Everything you need to pack for a tropical cruise.",
    tags: ["vacation", "packing", "cruise"],
    checked: false,
    isRoot: true,
    isTemplate: true,
  },
  {
    id: "7c6aab59-e237-4f1e-b249-d7e224494aee",
    title: "Medications",
    checked: false,
    parent: "96ec6268-d1ac-4868-a000-bf35e51c49f1",
    isTemplate: true,
  },
  {
    id: "005ecd76-b0ba-4e15-bbd5-ee57f3177800",
    title: "Swim",
    checked: false,
    parent: "96ec6268-d1ac-4868-a000-bf35e51c49f1",
    isTemplate: true,
  },
  {
    id: "66ca411e-d8d2-406b-9be1-06d94e7cb94f",
    title: "Swimwears",
    checked: false,
    parent: "005ecd76-b0ba-4e15-bbd5-ee57f3177800",
    isTemplate: true,
  },
  {
    id: "112d7b0c-8b9e-45a2-8ecb-c25c63b3afcd",
    title: "Towels",
    checked: false,
    parent: "005ecd76-b0ba-4e15-bbd5-ee57f3177800",
    isTemplate: true,
  },
  {
    id: "955e37fd-443b-4569-bba3-5c6e57509614",
    title: "Toiletries",
    checked: false,
    parent: "96ec6268-d1ac-4868-a000-bf35e51c49f1",
    isTemplate: true,
  },
  {
    id: "ce59a34f-26bf-4022-a58a-60c9b6e266bb",
    title: "Toothbrushes",
    checked: false,
    parent: "955e37fd-443b-4569-bba3-5c6e57509614",
    isTemplate: true,
  },
  {
    id: "5aa13f8b-627e-48bb-9393-d607244bba5a",
    title: "Toothpastes",
    checked: false,
    parent: "955e37fd-443b-4569-bba3-5c6e57509614",
    isTemplate: true,
  },
  {
    id: "7150d199-cdc1-4bb4-bb67-e444a16d1092",
    title: "Toothpaste 1",
    checked: false,
    parent: "5aa13f8b-627e-48bb-9393-d607244bba5a",
    isTemplate: true,
  },
  {
    id: "0e1b7039-4ff0-4391-a8b5-2bb218a07f39",
    title: "Toothpaste 2",
    checked: false,
    parent: "5aa13f8b-627e-48bb-9393-d607244bba5a",
    isTemplate: true,
  },
  {
    id: "d35206c1-7f6f-49d5-a72b-a91a31ab2acd",
    title: "Toothpaste 3",
    checked: false,
    parent: "5aa13f8b-627e-48bb-9393-d607244bba5a",
    isTemplate: true,
  },
  {
    id: "57ed9b68-57bb-4ab0-bf5a-091126dab1e1",
    title: "Deodorants",
    checked: false,
    parent: "955e37fd-443b-4569-bba3-5c6e57509614",
    isTemplate: true,
  },
  {
    id: "1f0e267b-3fa7-4fb8-a8be-1acec5830e27",
    title: "Documents",
    checked: false,
    parent: "96ec6268-d1ac-4868-a000-bf35e51c49f1",
    isTemplate: true,
  },
  {
    id: "3c1b0420-372e-46f0-a2d3-8ce249b0cd00",
    title: "Passport 1",
    checked: false,
    parent: "1f0e267b-3fa7-4fb8-a8be-1acec5830e27",
    isTemplate: true,
  },
  {
    id: "286fe654-6982-45e0-9533-3169c1d54301",
    title: "Passport 2",
    checked: false,
    parent: "1f0e267b-3fa7-4fb8-a8be-1acec5830e27",
    isTemplate: true,
  },
  {
    id: "1179a0e6-c18a-411d-a13e-f7d99bf18f48",
    title: "Passport 3",
    checked: false,
    parent: "1f0e267b-3fa7-4fb8-a8be-1acec5830e27",
    isTemplate: true,
  },
  {
    id: "af8304ff-e6cb-4338-ae57-9cb3a4f572f0",
    title: "Passport 4",
    checked: false,
    parent: "1f0e267b-3fa7-4fb8-a8be-1acec5830e27",
    isTemplate: true,
  },
  {
    id: "36cf3af0-cebe-4a78-ba5e-f5ceec3c5636",
    title: "Grocery Shopping List",
    description: "Standard items needed from the grocery.",
    tags: ["grocery", "food", "shopping"],
    checked: false,
    isRoot: true,
    isTemplate: true,
  },
  {
    id: "bfb94f2a-9d2a-464a-b92f-2692568c07f5",
    title: "Dairy",
    checked: false,
    parent: "36cf3af0-cebe-4a78-ba5e-f5ceec3c5636",
    isTemplate: true,
  },
  {
    id: "3166b704-7ac6-4925-a8ae-ef6bb5ef14d8",
    title: "Cheese",
    checked: false,
    parent: "bfb94f2a-9d2a-464a-b92f-2692568c07f5",
    isTemplate: true,
  },
  {
    id: "06113abb-b87e-4465-ac7d-a3fd9fe437c2",
    title: "Milk",
    checked: false,
    parent: "bfb94f2a-9d2a-464a-b92f-2692568c07f5",
    isTemplate: true,
  },
  {
    id: "8298e2a1-dbb6-4eb5-917f-8edd6237f499",
    title: "Yogurt",
    checked: false,
    parent: "bfb94f2a-9d2a-464a-b92f-2692568c07f5",
    isTemplate: true,
  },
];

export default templates;