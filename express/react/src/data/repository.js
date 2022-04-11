import axios from "axios";

// --- Constants ----------------------------------------------------------------------------------
const API_HOST = "http://localhost:4000";

async function getData() {
    const response = await axios.get(API_HOST + "/api");
    console.log(response.data);
    return response.data.message;
}

export {
    getData
}