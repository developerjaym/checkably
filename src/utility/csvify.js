export default function csvify (tree) {
    // make headers
    // convert node to row
    //  convert child nodes to rows
    // join rows

    const csvRows = [];
    const headers = ["Checkably", cellify(tree.description)];
    csvRows.push(headers.join(','));
    csvRows.push(...nodeToRows(tree, 0));
    return csvRows.join('\n')
}

function nodeToRows(node, depth = 0) {
  const csvRows = []
  csvRows.push(rowify(node, depth));
  node.items.forEach(item => csvRows.push(...nodeToRows(item, depth + 1)))
  return csvRows;
}

function rowify(datum, depth = 0) {
  return [...new Array(depth).fill(' '), datum.checked ? '"✓"' : '▢', cellify(datum.title)].join(',')
}

function cellify(cellString) {
  return `"${cellString.replaceAll('"', '""')}"`
}