import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import '../css/App.css';
import Navbar from "./Navbar";
import Header from './Header';
import Home from './Home';
import Footer from './Footer';
import Register from "./Register";
import Login from "./Login";

export default function App() {
  const [user, setUser] = useState(null);


  return (
    <div className="d-flex flex-column min-vh-100" id="top">
      <Router>
        <Navbar user={user} logoutUser={null} />
        <main role="main">
          <div>
            <Switch>
              <Route path="/login">
                <Login />
              </Route>
              <Route path="/register">
                <Register />
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
