export default function blobify(data, type) {
  
    // Creating a Blob for having a csv file format 
    // and passing the data with type
    const blob = new Blob([data], { type });
  
    // Creating an object for downloading url
    return window.URL.createObjectURL(blob)
}