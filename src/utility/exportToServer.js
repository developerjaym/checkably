export default async function exportToServer(data) {
    const response = await fetch(import.meta.env.VITE_SHARE_BACKEND_URL, {
        method: "POST",
        headers: {
            accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    const jsonResponse = await response.json();
    return jsonResponse.id;
}