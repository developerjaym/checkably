const itemLess = (root) => {
  const itemLessRoot = {...root};
  delete itemLessRoot.items;
  return itemLessRoot;
}
export default function flattenData (root) {
  const flatList = [];
  if(root.items.length) {
    flatList.push(
      ...root.items.map(subRoot => flattenData(subRoot)).flat()
      )
  }
  flatList.push(itemLess(root));
  return flatList;
}