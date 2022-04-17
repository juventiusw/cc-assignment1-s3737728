import React from "react";
import { Link } from 'react-router-dom';

export default function Navbar(props) {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container collapse navbar-collapse" id="navbarSupportedContent">
                <Link className="navbar-brand" to="/">Travel Chalk</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <ul className="navbar-nav me-auto">
                    <li className="nav-item">
                        <Link className="nav-link" to="/">Home</Link>
                    </li>
                    {props.user !== null &&
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/profile">My Profile</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/forum">Discussion Board</Link>
                            </li>
                            <li>
                                <Link className="nav-link" to="/userlist">User List</Link>
                            </li>
                        </>
                    }
                </ul>
                <ul className="navbar-nav">
                    {props.user === null ?
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">Login</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/register">Register</Link>
                            </li>
                        </>
                        :
                        <>
                            <li className="nav-item">
                                <span className="nav-link text-light">Welcome, {props.user.username}</span>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/login" onClick={props.logoutUser}>Logout</Link>
                            </li>
                        </>
                    }
                </ul>
            </div>
        </nav>
    );
}