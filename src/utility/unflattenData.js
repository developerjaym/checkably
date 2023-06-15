export default function unflattenData(flattenedData) {
    const map = {};
    const result = [];
  
    flattenedData.forEach((item) => {
      item.items = [];
      map[item.id] = item;
    });
  
    flattenedData.forEach((item) => {
      if (item.parent) {
        const parent = map[item.parent];
        parent.items.push(item);
      } else {
        result.push(item);
      }
    });
  
    return result;
  }