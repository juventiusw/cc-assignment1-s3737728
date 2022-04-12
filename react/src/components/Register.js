import React, { useState } from "react";
import { useHistory } from "react-router-dom";
// import { findUser, findUserByUsername, createUser, setUser } from "../data/repository";
import styles from '../css/LoginRegister.module.css';
import sanitize from 'sanitize-html';

export default function Register(props) {
    const history = useHistory();
    const [fields, setFields] = useState({
        fullname: "", username: "",  email: "", password: ""
    });
    const [errors, setErrors] = useState({ });

    // Generic change handler.
    const handleInputChange = (event) => {
        setFields({ ...fields, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {

    };

    return (
        <div className={`${styles.wrapper} ${styles.fadeInDown}`} style={{marginTop: "32px"}}>
            <div className={styles.formContent}>
                <h2 className={styles.h2}>REGISTER</h2>
                <hr />
                <form onSubmit={handleSubmit} className="pt-1" noValidate>
                    <div className="mb-3 mt-3">
                        <input type="text" name="fullname" id="fullname" className={`${styles.fadeIn} ${styles.first} ${styles.inputFocus}`} value={fields.fullname || ''} onChange={handleInputChange} placeholder="Full Name"/>
                        {errors.fullname && (
                            <p className={`${styles.errorMessage}`}>{errors.fullname}</p>
                        )}
                    </div>
                    <div className="mb-3">
                        <input type="text" name="username" id="username" className={`${styles.fadeIn} ${styles.second} ${styles.inputFocus}`} value={fields.username || ''} onChange={handleInputChange} placeholder="Username"/>
                        {errors.username && (
                            <p className={`${styles.errorMessage}`}>{errors.username}</p>
                        )}
                    </div>
                    <div className="mb-3">
                        <input autoComplete="off" type="email" name="email" id="email" className={`${styles.fadeIn} ${styles.third} ${styles.inputFocus}`} value={fields.email || ''} onChange={handleInputChange} placeholder="Email"/>
                        {errors.email && (
                            <p className={`${styles.errorMessage}`}>{errors.email}</p>
                        )}
                    </div>
                    <div className="mb-2">
                        <input type="password" name="password" id="password" className={`${styles.fadeIn} ${styles.fourth} ${styles.inputFocus}`} value={fields.password || ''} onChange={handleInputChange} placeholder="Password"/>
                        {errors.password && (
                            <p className={`${styles.errorMessage}`}>{errors.password}</p>
                        )}
                    </div>
                    <div className="mb-3 mt-5">
                        <input type="submit" className={styles.btnclass} value="Register" />
                    </div>
                </form>
            </div>
        </div>
    );
}