import flattenData from "./flattenData.js";
export default function csvify (tree) {
    /**
     * {
    id: "f9e6974f-6fdf-46b3-abc3-aed64c2d0e7a",
    checked: false,
    title: "Cruise Packing List",
    description: "Everything you need to pack for a tropical cruise.",
    tags: ["VACATION", "PACKING", "CRUISE"],
    isRoot: true,
    isTemplate: true,
    items: null,
  },
     */
    // flatten
    // make headers
    // make rows
    // join rows
    const flatData = flattenData(tree)

    const csvRows = [];
    const headers = ["CHECKED", "TITLE"];
    csvRows.push(headers.join(','));
    flatData.map(row => ([row.checked ? '"✓"' : '', cellify(row.title)].join(','))).forEach((row) => csvRows.push(row))
    return csvRows.join('\n')
}

function cellify(cellString) {
  return `"${cellString.replaceAll('"', '""')}"`
}