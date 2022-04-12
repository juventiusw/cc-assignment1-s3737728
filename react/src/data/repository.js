import axios from "axios";

// --- Constants ----------------------------------------------------------------------------------
const localhost = "http://localhost:4000";
// const cloudfront = "https://d3k0blzet9rzk5.cloudfront.net";
const API_HOST = localhost; // assign cloudfront to API_HOST and delete localhost constant when deploying to s3

async function getData() {
    const response = await axios.get(API_HOST + "/api");
    console.log(response.data);
    return response.data.message;
}

export {
    getData
}