import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { findUser, findUserByUsername, createUser, setUser } from "../data/repository";
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
        event.preventDefault();

        // Validate form and if invalid do not contact API.
        const { trimmedFields, isValid } = await handleValidation();
        if(!isValid)
            return;

        // Create user id
        let flag = true;
        let userID = '';
        while(flag) {
            const randomNumber = Math.floor(Math.random() * 999999) + 100000;
            userID = 'u' + randomNumber;
            flag = false;
            if(await findUser(userID) !== null) {
                flag = true;
            }
        }
        trimmedFields["userid"] = userID;

        console.log(trimmedFields["userid"]);

        //Get current date
        const today = new Date();
        var date = today.getFullYear()+'-'+('0' + (today.getMonth()+1)).slice(-2)+'-'+('0' + today.getDate()).slice(-2);
        trimmedFields["datejoined"] = date;

        // Create user.
        const user = await createUser(trimmedFields);
        user["followers"] = [];
        user["following"] = [];

        // Set user state.
        props.loginUser(user);

        // The login is also persistent as it is stored in local storage.
        setUser(user);

        // Navigate to the profile page.
        history.push("/profile");
    };

    const handleValidation = async () => {
        const trimmedFields = trimFields();
        const currentErrors = { };

        let field = trimmedFields["fullname"];
        if(field.length === 0)
            currentErrors["fullname"] = "Full name is required.";
        else if(field.length > 50)
            currentErrors["fullname"] = "Full name length cannot be greater than 50.";

        field = trimmedFields["username"];
        if(field.length === 0)
            currentErrors["username"] = "Username is required.";
        else if(field.length > 25)
            currentErrors["username"] = "Username length cannot be greater than 25.";
        else if (String(field).indexOf(' ') >= 0)
            currentErrors["username"] = "Username is not allowed to have whitespaces";
        else if(await findUserByUsername(trimmedFields.username) !== null)
            currentErrors["username"] = "Username is already registered.";

        field = trimmedFields["email"];
        if(field.length === 0)
            currentErrors["email"] = "Email is required.";
        else if(field.length > 50)
            currentErrors["email"] = "Email length cannot be greater than 50.";
        else if (!/\S+@\S+\.\S+/.test(field))
            currentErrors["email"] = 'Email address is invalid.';

        field = trimmedFields["password"];
        if(field.length === 0)
            currentErrors["password"] = "Password is required.";
        else if(field.length < 6)
            currentErrors["password"] = "Password must contain at least 6 characters.";

        setErrors(currentErrors);

        return { trimmedFields, isValid: Object.keys(currentErrors).length === 0 };
    };

    const trimFields = () => {
        const trimmedFields = { };
        Object.keys(fields).map(key => trimmedFields[key] = sanitize(fields[key].trim()));
        setFields(trimmedFields);

        return trimmedFields;
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