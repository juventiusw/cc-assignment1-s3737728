import axios from "axios";

// --- Constants ----------------------------------------------------------------------------------
const USER_KEY = "user";
const SELUSER_KEY = "seluser";
// const LOCALHOST = "http://localhost:4000"; // USE THIS WHEN DEVELOPING LOCALLY
const GATEWAY = "https://d13dp2cyque0mj.cloudfront.net"; // USE THIS WHEN APP IS DEPLOYED
const API_HOST = GATEWAY;

// --- User ---------------------------------------------------------------------------------------
async function verifyUser(data) {
    const response = await axios.post(API_HOST + "/api/users/login", data);
    const user = response.data;

    // The login is also persistent as it is stored in local storage.
    if(user !== null)
        setUser(user);

    return user;
}

async function findUser(id) {
    const response = await axios.get(API_HOST + `/api/users/select/${id}`);

    return response.data;
}

async function findUserByUsername(username) {
    const response = await axios.get(API_HOST + `/api/users/selectusername/${username}`);

    return response.data;
}

async function createUser(user) {
    const response = await axios.post(API_HOST + "/api/users", user);

    return response.data;
}

async function deleteUser(data) {
    let response = null;
    await axios.post(API_HOST + "/api/users/delete", data).then((res) => {
        response = res.data.status;
        console.log(res.data.message);
    });

    return response;
}

async function uploadProfileImage(formData) {
    let response = null;
    await axios({
        method: "POST",
        url: API_HOST + "/api/uploadprofileimage",
        data: formData,
    }).then((res) => {
        console.log(res.data.message);
        if(res.data.image) {
            response = res.data.image;
        }
    });
    return response;
}

async function deleteImage(data) {
    await axios.post(API_HOST + "/api/deleteimage", data).then((res) => {
        console.log(res.data.message);
    });

    return null;
}

async function updateUser(user) {
    const response = await axios.post(API_HOST + "/api/users/updateprofile", user);

    return response.data;
}

// --- Post ---------------------------------------------------------------------------------------
async function getPostData(userid) {
    const response = await axios.get(API_HOST + `/api/posts/userposts/${userid}`);

    return response.data;
}

// --- Reply --------------------------------------------------------------------------------------
async function getReplyIDs(postid) {
    const response = await axios.post(API_HOST + "/api/replies/userreplies", postid);

    return response.data;
}

// --- Helper functions to interact with local storage --------------------------------------------
function setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function setSelectedUser(user) {
    localStorage.setItem(SELUSER_KEY, JSON.stringify(user));
}

function getUser() {
    return JSON.parse(localStorage.getItem(USER_KEY));
}

function getSelectedUser() {
    return JSON.parse(localStorage.getItem(SELUSER_KEY));
}

function removeUser() {
    localStorage.removeItem(USER_KEY);
}

function removeSelectedUser() {
    localStorage.removeItem(SELUSER_KEY);
}

export {
    verifyUser, findUser, findUserByUsername, setUser,
    setSelectedUser, createUser, deleteUser, getUser, updateUser,
    uploadProfileImage, deleteImage, getPostData, getReplyIDs,
    getSelectedUser, removeUser, removeSelectedUser
}