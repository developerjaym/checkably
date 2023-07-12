export default async function importFromServer(id) {
    const data = await fetch(`${import.meta.env.VITE_SHARE_BACKEND_URL}${id}`);
    if(!data.ok) {
        throw Error("Something went wrong")
    }
    const jsonData = await data.json();
    return jsonData.value;
}