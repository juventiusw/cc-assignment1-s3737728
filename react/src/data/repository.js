import axios from "axios";

// --- Constants ----------------------------------------------------------------------------------
// const localhost = "http://localhost:4000";
const ENDPOINT = "https://qsyasq50kk.execute-api.us-east-1.amazonaws.com/dev";
const API_HOST = ENDPOINT; // assign ENDPOINT to API_HOST when deploying to s3

async function getData() {
    const response = await axios.get(API_HOST + "/api");
    console.log(response.data);
    return response.data.message;
}

export {
    getData
}