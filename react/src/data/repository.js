import axios from "axios";

// --- Constants ----------------------------------------------------------------------------------
//const localhost = "http://localhost:4000";
const cloudfront = "https://d19w8d22e3i0ra.cloudfront.net";
const API_HOST = cloudfront; // only set to localhost when Express and React are running in local machine.

async function getData() {
    const response = await axios.get(API_HOST + "/api");
    console.log(response.data);
    return response.data.message;
}

export {
    getData
}