export default function flattenData(nestedData) {
    const flattened = [];
  
    function flattenRecursive(item, parent = null) {
      const flattenedItem = { ...item };
      delete flattenedItem.items;
      flattenedItem.parent = parent;
      flattened.push(flattenedItem);
  
      if (item.items && item.items.length > 0) {
        item.items.forEach(childItem => {
          flattenRecursive(childItem, item.id);
        });
      }
    }
  
    nestedData.forEach(item => {
      flattenRecursive(item);
    });
  
    return flattened;
  }
  