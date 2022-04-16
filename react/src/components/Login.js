import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { verifyUser } from "../data/repository";
import styles from '../css/LoginRegister.module.css';
import sanitize from 'sanitize-html';

export default function Login(props) {
    const history = useHistory();
    const [fields, setFields] = useState({ username: "", password: "" });
    const [errorMessage, setErrorMessage] = useState(null);

    // Generic change handler.
    const handleInputChange = (event) => {
        setFields({ ...fields, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = {};
        data["username"] = sanitize(fields.username);
        data["password"] = sanitize(fields.password);

        const user = await verifyUser(data);

        if(user === null) {
            // Login failed, reset password field to blank and set error message.
            setFields({ ...fields, password: "" });
            setErrorMessage("Username and / or password is invalid, please try again.");
            return;
        }

        // Set user state.
        props.loginUser(user);

        // Navigate to the profile page.
        history.push("/profile");
    };

    return (
        <div className={`${styles.wrapper} ${styles.fadeInDown}`} style={{marginTop: "120px"}}>
            <div className={styles.formContent}>
                <h2 className={styles.h2}>LOGIN</h2>
                <hr />
                <div className={`${styles.fadeIn} ${styles.first}`} style={{marginBottom: "15px"}}>
                    <img style={{height: "75px"}} src={'https://a1-react-assets.s3.amazonaws.com/login-icon.png'} id="icon" alt="User Icon" />
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input type="text" name="username" id="username" className={`${styles.fadeIn} ${styles.second}`}
                               value={fields.username} onChange={handleInputChange} placeholder="Username"/>
                    </div>
                    <div className="mb-3">
                        <input type="password" name="password" id="password" className={`${styles.fadeIn} ${styles.third}`}
                               value={fields.password} onChange={handleInputChange} placeholder="Password"/>
                    </div>
                    <div className="mb-3">
                        <input type="submit" className={styles.btnclass} value="Login" />
                    </div>
                    {errorMessage !== null &&
                        <div className="form-group" style={{marginBottom:"20px", marginTop:"-35px"}}>
                            <span className="text-danger">{errorMessage}</span>
                        </div>
                    }
                </form>
            </div>
        </div>
    );
}