import React, { useState, useEffect } from 'react';
import { useHistory } from  "react-router-dom";
import { setUser, findUserByUsername, updateUser, uploadProfileImage, deleteImage } from "../data/repository";
import styles from '../css/Profile.module.css';
import sanitize from 'sanitize-html';
import imageCompression from "browser-image-compression";

export default function EditProfile(props) {
    const history = useHistory();
    const [values, setValues] = useState(props.user);
    const [errors, setErrors] = useState({});
    const [tempImage, setTempImage] = useState();
    const [imageFile, setImageFile] = useState();
    const [imageError, setImageError] = useState(null);

    useEffect(() => {
        setValuesNullToEmpty(values);
        // eslint-disable-next-line
    }, []);

    const handleImageChange = (event) => {
        if(event.target.value !== "") {
            let imgext = String(event.target.value).split('.').pop().toLowerCase();
            let x = checkExtension(imgext);
            if(x) {
                setImageError(null);
                const file = event.target.files[0];
                setImageFile(file);
                const options = {
                    maxSizeMB: 0.1,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true
                }
                imageCompression(file, options).then(compressedBlob => {
                    compressedBlob.lastModifiedDate = new Date();
                    const convertedBlobFile = new File([compressedBlob], file.name, { type: file.type, lastModified: Date.now()});
                    getBase64(convertedBlobFile, (result) => {
                        setTempImage(result);
                    })
                }).catch(e => {
                    console.log(e);
                });
            }else {
                setImageError("Not an Image...");
            }
        }
    }

    function getBase64(file, callback) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            callback(reader.result);
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }

    function checkExtension(imgext) {
        const extlist = ['gif','png','jpg','jpeg'];
        for(const ext of extlist) {
            if(imgext === ext) {
                return true;
            }
        }
        return false;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Validate form and if invalid do not contact API.
        const { isValid } = await validate();
        if(!isValid) {
            return;
        }

        let trimmedValues = setValuesEmptyToNull();
        trimmedValues.followers = values.followers;
        trimmedValues.following = values.following;

        if(imageFile) {
            // Delete the user's previous profile picture
            if(props.user.profpic != null) {
                const justname = props.user.profpic.split('https://a1-react-assets-uploads.s3.amazonaws.com/').pop();
                console.log(justname);
                const data = {
                    filename: justname
                };
                await deleteImage(data);
            }
            // Upload Image to local folder
            const formData = new FormData();
            formData.append('file', imageFile);
            const image = await uploadProfileImage(formData);
            trimmedValues["profpic"] = image;
        }

        // Update user.
        const updatedUser = await updateUser(trimmedValues);

        //update logged-in user data in local storage 'user' key
        setUser(trimmedValues);

        //Update user state.
        props.setUser(updatedUser);

        // Navigate to the profile page.
        history.push("/profile");
    }

    const handleChange = (event) => {
        setValues(values => ({ ...values, [event.target.name]: event.target.value }));
    }

    function gotoMyProfile() {
        history.push("/profile");
    }

    const validate = async () => {
        const trimmedValues = trimValues();
        const errorMessages = { };

        let value = trimmedValues["fullname"];
        if(value.length === 0) {
            errorMessages["fullname"] = 'Full Name is required';
        }else if(value.length > 50) {
            errorMessages["fullname"] = "Full Name length cannot be greater than 50.";
        }
        value = trimmedValues["username"];
        if(value.length === 0) {
            errorMessages["username"] = 'Username is required';
        }else if(value.length > 25) {
            errorMessages["username"] = "Username length cannot be greater than 25.";
        }else if (await findUserByUsername(value) !== null && value !== props.user.username) {
            errorMessages["username"] = "Username is taken, please pick a different username.";
        }else if (String(value).indexOf(' ') >= 0) {
            errorMessages["username"] = "Username is not allowed to have whitespaces";
        }
        value = trimmedValues["email"];
        if (value.length === 0) {
            errorMessages.email = 'Email address is required';
        }else if(value.length > 50) {
            errorMessages["email"] = "Email length cannot be greater than 50.";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
            errorMessages.email = 'Email address is invalid';
        }
        setErrors(errorMessages);

        return { isValid: Object.keys(errorMessages).length === 0 };
    };

    // Ensure null is not used when setting fields.
    const setValuesNullToEmpty = (currentValues) => {
        // Make a copy of currentValues so the original parameter is not modified.
        currentValues = { ...currentValues };

        for(const [key, value] of Object.entries(currentValues)) {
            currentValues[key] = value !== null ? value : "";
        }

        setValues(currentValues);
    };

    // Empty fields are converted to null.
    const setValuesEmptyToNull = () => {
        const trimmedValues = { };

        for(const [key, value] of Object.entries(values)) {
            let field = value;
            // If the trimmed field is empty make it null.
            if(field.length === 0) {
                field = null;
            }
            trimmedValues[key] = field;
        }

        setValuesNullToEmpty(trimmedValues);

        return trimmedValues;
    };

    const trimValues = () => {
        const trimmedValues = { };
        Object.keys(values).map(key => {
            if (typeof values[key] === "string") {
                return trimmedValues[key] = sanitize(values[key].trim());
            }else {
                return trimmedValues[key] = values[key];
            }
        });
        setValues(trimmedValues);

        return trimmedValues;
    };

    return(
        <div className={styles.frame}>
            <div className={`container justify-content-center d-flex align-center ${styles.fadeInDown}`}>
                <div className={`${styles.formContent}`}>
                    <h2 className={styles.h2}>Edit Profile</h2>
                    <hr />
                    <form className="pt-1" noValidate >
                        <div className={`${styles.editImage} ${styles.fadeIn} ${styles.first}`}>
                            <div className={styles.circle01}></div>
                            <div className={styles.circle02}></div>
                            <label htmlFor="imageInput" className={styles.labelImage}>
                                {tempImage ?
                                    <img src={tempImage} className="border border-light rounded-circle" width="100" height="100" style={{ cursor: "pointer", position: "absolute" }} alt="" />
                                    : values.profpic ?
                                        <img src={values.profpic} className="border border-light rounded-circle" width="100" height="100" style={{ cursor: "pointer", position: "absolute" }} alt="" />
                                        :
                                        <img src="https://a1-react-assets.s3.amazonaws.com/blank-profile.png" className="border border-light rounded-circle" width="100" height="100" style={{ cursor: "pointer", position: "absolute" }} alt="" />
                                }
                            </label>
                            <input id="imageInput" type="file" style={{ display: "none" }} onChange={handleImageChange} ></input>
                        </div>
                        {imageError !== null &&
                            <div className="text-center text-danger">{imageError}</div>
                        }
                        <div className="mb-3 mt-3">
                            <input type="text" name="fullname" id="fullname" className={`${styles.fadeIn} ${styles.second} ${styles.inputFocus}`} value={values.fullname} onChange={handleChange} placeholder="Full Name"/>
                            {errors.fullname && (
                                <p className={`${styles.errorMessage}`}>{errors.fullname}</p>
                            )}
                        </div>
                        <div className="mb-3">
                            <input type="text" name="username" id="username" className={`${styles.fadeIn} ${styles.third} ${styles.inputFocus}`} value={values.username} onChange={handleChange} placeholder="Username"/>
                            {errors.username && (
                                <p className={`${styles.errorMessage}`}>{errors.username}</p>
                            )}
                        </div>
                        <div className="mb-3">
                            <input autoComplete="off" type="email" name="email" id="email" className={`${styles.fadeIn} ${styles.fourth} ${styles.inputFocus}`} value={values.email} onChange={handleChange} placeholder="Email"/>
                            {errors.email && (
                                <p className={`${styles.errorMessage}`}>{errors.email}</p>
                            )}
                        </div>
                        <div className="mb-3 mt-5">
                            <button className={styles.updatebtn} onClick={handleSubmit}>Save Update</button>
                            <button className={styles.updatebtn} onClick={gotoMyProfile}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}