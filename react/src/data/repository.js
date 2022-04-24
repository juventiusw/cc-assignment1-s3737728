import axios from "axios";

// --- Constants ----------------------------------------------------------------------------------
const USER_KEY = "user";
const SELUSER_KEY = "seluser";
const LOCALHOST = "http://localhost:4000"; // USE THIS WHEN DEVELOPING LOCALLY
const GATEWAY = "https://d13dp2cyque0mj.cloudfront.net"; // USE THIS WHEN DEPLOYING APP TO AWS
const API_HOST = LOCALHOST;

// --- User ---------------------------------------------------------------------------------------
async function verifyUser(data) {
    const response = await axios.post(API_HOST + "/api/users/login", data);
    const user = response.data;

    // The login is also persistent as it is stored in local storage.
    if(user !== null)
        setUser(user);

    return user;
}

async function getUsers() {
    const response = await axios.get(API_HOST + "/api/users");

    return response.data;
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

async function follow(data) {
    const response = await axios.post(API_HOST + "/api/users/follow", data);

    return response.data;
}

async function unfollow(data) {
    await axios.post(API_HOST + "/api/users/unfollow", data).then((res) => {
        console.log(res.data.message);
    })

    return null;
}

// --- Post ---------------------------------------------------------------------------------------
async function getPosts() {
    const response = await axios.get(API_HOST + "/api/posts/");
    console.log(response.data);
    return response.data;
}

async function createPost(post) {
    const response = await axios.post(API_HOST + "/api/posts", post);

    return response.data;
}

async function deletePost(postid) {
    await axios.post(API_HOST + `/api/posts/delete/${postid}`).then((res) => {
        console.log(res.data.message);
    });

    return null;
}

async function updatePost(post) {
    const response = await axios.put(API_HOST + "/api/posts/update", post);

    return response.data;
}

async function uploadPostImage(formData) {
    let response = null;
    await axios({
        method: "POST",
        url: API_HOST + "/api/uploadpostimage",
        data: formData,
    }).then((res) => {
        console.log(res.data.message);
        if(res.data.image) {
            response = res.data.image;
        }
    });
    return response;
}

async function likePost(data) {
    await axios.post(API_HOST + "/api/posts/like", data).then((res) => {
        console.log(res.data.message);
    });

    return null;
}

async function dislikePost(data) {
    await axios.post(API_HOST + "/api/posts/dislike", data).then((res) => {
        console.log(res.data.message);
    });

    return null;
}

async function deleteLikePost(data) {
    await axios.post(API_HOST + "/api/posts/deletelike", data).then((res) => {
        console.log(res.data.message);
    });

    return null;
}

async function getPostData(userid) {
    const response = await axios.get(API_HOST + `/api/posts/userposts/${userid}`);

    return response.data;
}

// --- Reply --------------------------------------------------------------------------------------
async function getReplies() {
    const response = await axios.get(API_HOST + "/api/replies/");

    return response.data;
}

async function createReply(reply) {
    const response = await axios.post(API_HOST + "/api/replies", reply);

    return response.data;
}

async function deleteReply(replyid) {
    await axios.post(API_HOST + `/api/replies/delete/${replyid}`).then((res) => {
        console.log(res.data.message);
    });

    return null;
}

async function updateReply(reply) {
    const response = await axios.put(API_HOST + "/api/replies/update", reply);

    return response.data;
}

async function likeReply(data) {
    await axios.post(API_HOST + "/api/replies/like", data).then((res) => {
        console.log(res.data.message);
    });

    return null;
}

async function dislikeReply(data) {
    await axios.post(API_HOST + "/api/replies/dislike", data).then((res) => {
        console.log(res.data.message);
    });

    return null;
}

async function deleteLikeReply(data) {
    await axios.post(API_HOST + "/api/replies/deletelike", data).then((res) => {
        console.log(res.data.message);
    });

    return null;
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
    verifyUser, getUsers, findUser, findUserByUsername, setUser,
    setSelectedUser, createUser, deleteUser, getUser, updateUser, follow,
    unfollow, getPosts, createPost, deletePost, updatePost, uploadPostImage,
    likePost, dislikePost, deleteLikePost, uploadProfileImage,
    deleteImage, getPostData, getReplies, createReply, deleteReply,
    updateReply, likeReply, dislikeReply, deleteLikeReply,
    getSelectedUser, removeUser, removeSelectedUser
}