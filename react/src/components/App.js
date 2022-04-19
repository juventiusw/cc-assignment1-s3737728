import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import '../css/App.css';
import Navbar from "./Navbar";
import Header from './Header';
import Home from './Home';
import Footer from './Footer';
import Register from "./Register";
import Login from "./Login";
import MyProfile from "./MyProfile";
import EditProfile from "./EditProfile";
import Forum from "./Forum";
import UserList from "./UserList";
import UserProfile from "./UserProfile";
import Followers from "./Followers";
import OtherFollowers from "./OtherFollowers";
import Following from "./Following";
import OtherFollowing from "./OtherFollowing";
import { getUser, getSelectedUser, removeUser, removeSelectedUser } from "../data/repository";

export default function App() {
  const [user, setUser] = useState(getUser);
  const [selectedUser, setSelectedUser] = useState(getSelectedUser());

  const loginUser = (user) => {
    setUser(user);
  };

  const logoutUser = () => {
    removeUser();
    removeSelectedUser();
    setUser(null);
    setSelectedUser(null);
  };

  return (
    <div className="d-flex flex-column min-vh-100" id="top">
      <Router>
        <Navbar user={user} logoutUser={logoutUser} />
        <main role="main">
          <div>
            <Switch>
              <Route path="/login">
                <Login loginUser={loginUser} />
              </Route>
              <Route path="/register">
                <Register loginUser={loginUser} />
              </Route>
              <Route path="/profile">
                <MyProfile user={user} logoutUser={logoutUser} />
              </Route>
              <Route path="/editprofile">
                <EditProfile user={user} setUser={setUser} />
              </Route>
              <Route path="/forum">
                <Forum user={user} />
              </Route>
              <Route path="/userlist">
                <UserList user={user} setSelectedUser={setSelectedUser} />
              </Route>
              <Route path="/userprofile">
                <UserProfile user={user} selectedUser={selectedUser} setUser={setUser} setSelectedUser={setSelectedUser} />
              </Route>
              <Route path="/followers">
                <Followers user={user} setSelectedUser={setSelectedUser} />
              </Route>
              <Route path="/otherfollowers">
                <OtherFollowers selectedUser={selectedUser} user={user} setSelectedUser={setSelectedUser} />
              </Route>
              <Route path="/following">
                <Following user={user} setSelectedUser={setSelectedUser} />
              </Route>
              <Route path="/otherfollowing">
                <OtherFollowing selectedUser={selectedUser} user={user} setSelectedUser={setSelectedUser} />
              </Route>
              <Route path="/">
                <Header />
                <Home />
              </Route>
            </Switch>
          </div>
        </main>
        <Footer />
      </Router>
    </div>
  );
}
