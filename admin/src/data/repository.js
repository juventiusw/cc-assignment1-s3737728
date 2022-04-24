import axios from "axios";

// --- Constants ----------------------------------------------------------------------------------
// const LOCALHOST = "http://localhost:4000"; // USE THIS WHEN DEVELOPING LOCALLY
const GATEWAY = "https://d13dp2cyque0mj.cloudfront.net"; // USE THIS WHEN DEPLOYING APP TO AWS
const API_HOST = GATEWAY;

// --- User ---------------------------------------------------------------------------------------
async function getUsers() {
    const response = await axios.get(API_HOST + "/api/users");

    return response.data;
}

async function getUser(id) {
    const response = await axios.get(API_HOST + `/api/users/select/${id}`);

    return response.data;
}

async function getUserExists(username) {
    const response = await axios.get(API_HOST + `/api/users/selectusername/${username}`);

    return response.data;
}

async function updateUser(user) {
    const response = await axios.post(API_HOST + "/api/users/updateprofile", user);

    return response.data;
}

async function blockUser(userid) {
    await axios.post(API_HOST + `/api/users/block/${userid}`).then((res) => {
        console.log(res.data.message);
    });

    return "success";
}

async function unblockUser(userid) {
    await axios.post(API_HOST + `/api/users/unblock/${userid}`).then((res) => {
        console.log(res.data.message);
    });

    return "success";
}

async function deleteUser(data) {
    let response = null;
    await axios.post(API_HOST + "/api/users/delete", data).then((res) => {
        response = res.data.status;
        console.log(res.data.message);
    });

    return response;
}

async function deleteImage(data) {
    await axios.post(API_HOST + "/api/deleteimage", data).then((res) => {
        console.log(res.data.message);
    });

    return null;
}

async function deleteProfpic(userid) {
    await axios.post(API_HOST + `/api/users/deleteprofpic/${userid}`).then((res) => {
        console.log(res.data.message);
    });

    return "success";
}

// --- Post ---------------------------------------------------------------------------------------
async function getPosts() {
    const response = await axios.get(API_HOST + "/api/posts/");
    console.log(response.data);
    return response.data;
}

async function getPostData(userid) {
    const response = await axios.get(API_HOST + `/api/posts/userposts/${userid}`);

    return response.data;
}

async function deletePost(postid) {
    await axios.post(API_HOST + `/api/posts/admindelete/${postid}`).then((res) => {
        console.log(res.data.message);
    });

    return "success";
}

// --- Reply ---------------------------------------------------------------------------------------
async function getReplyData(userid) {
    const response = await axios.get(API_HOST + `/api/replies/userreplies/${userid}`);

    return response.data;
}

export {
    getUsers, getUser, getUserExists, getPosts, getPostData, updateUser, blockUser, unblockUser, deleteUser, deleteImage, deleteProfpic, deletePost, getReplyData
}