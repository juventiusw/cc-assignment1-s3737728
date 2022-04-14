import axios from "axios";

// --- Constants ----------------------------------------------------------------------------------
const USER_KEY = "user";
const SELUSER_KEY = "seluser";
const ENDPOINT = "http://localhost:4000";
const API_HOST = ENDPOINT;

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
    findUser, findUserByUsername, setUser,
    setSelectedUser, createUser, getUser,
    getSelectedUser, removeUser, removeSelectedUser
}