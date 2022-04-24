import { useState, useEffect, useContext } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { getUser, updateUser, getUserExists, deleteProfpic, deleteImage } from "../data/repository";
import MessageContext from "../contexts/MessageContext";
import { trimFields } from "../utils";

export default function EditUser() {
    const [fields, setFields] = useState(null);
    const [currentUsername, setCurrentUsername] = useState(null);
    const [errors, setErrors] = useState({ });
    const { setMessage } = useContext(MessageContext);
    const history = useHistory();
    const { userid } = useParams();

    // Load User.
    useEffect(() => {
        async function loadUser() {
            const user = await getUser(userid);
            setFields(user);
            setCurrentUsername(user.username);
        }
        loadUser();
    }, [userid]);

    // Generic change handler.
    const handleInputChange = (event) => {
        setFields({ ...fields, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate form and if invalid do not contact API.
        const { trimmedFields, isValid } = await handleValidation();
        if(!isValid) {
            return;
        }

        // Update user.
        const user = await updateUser(trimmedFields);

        if(user) {
            // Show success message.
            setMessage(<><strong>{user.fullname}</strong> has been updated successfully.</>);
        }

        // Navigate to the owners page.
        history.push("/");
    };

    const handleValidation = async () => {
        const trimmedFields = trimFields(fields, setFields);
        const currentErrors = { };

        let key = "fullname";
        let field = trimmedFields[key];
        if(field.length === 0) {
            currentErrors[key] = 'Full Name is required';
        }else if(field.length > 50) {
            currentErrors[key] = "Full Name length cannot be greater than 50.";
        }
        key = "username";
        field = trimmedFields[key];
        if(field.length === 0) {
            currentErrors[key] = 'Username is required';
        }else if(field.length > 25) {
            currentErrors[key] = "Username length cannot be greater than 25.";
        }else if (await getUserExists(field) && field !== currentUsername) {
            currentErrors[key] = "Please pick a different username.";
        }else if (String(field).indexOf(' ') >= 0) {
            currentErrors[key] = "Username is not allowed to have whitespaces";
        }
        key= "email";
        field = trimmedFields[key];
        if (field.length === 0) {
            currentErrors[key] = 'Email address is required';
        }else if(field.length > 50) {
            currentErrors[key] = "Email length cannot be greater than 50.";
        } else if (!/\S+@\S+\.\S+/.test(field)) {
            currentErrors[key] = 'Email address is invalid';
        }
        setErrors(currentErrors);

        return { trimmedFields, isValid: Object.keys(currentErrors).length === 0 };
    };

    const handleDeleteProfpic = async () => {
        // Set Profile Picture to null in table
        const isDeleted = deleteProfpic(userid);

        // Delete picture in s3 bucket
        if(isDeleted) {
            const justname = fields.profpic.split('https://a1-react-assets-uploads.s3.amazonaws.com/').pop();
            await deleteImage({ filename: justname });
        }

        // Update Fields
        setFields({ ...fields, profpic: null });
    }

    if(fields === null)
        return null;

    return (
        <div className="row m-5">
            <div className="col-12 col-md-9">
                <form onSubmit={handleSubmit}>
                    <h2 className="my-5 text-white">Personal Details</h2>

                    <div className="row">
                        <div className="col-12 col-md-6">
                            <div className="form-group">
                                <label htmlFor="fullname" className="control-label text-white">Full Name</label>
                                <input name="fullname" id="fullname" className="form-control"
                                       value={fields.fullname} onChange={handleInputChange} />
                                {errors.fullname && <div className="text-danger">{errors.fullname}</div>}
                            </div>
                        </div>

                        <div className="col-12 col-md-6">
                            <div className="form-group">
                                <label htmlFor="username" className="control-label text-white">Username</label>
                                <input name="username" id="username" className="form-control"
                                       value={fields.username} onChange={handleInputChange} />
                                {errors.username && <div className="text-danger">{errors.username}</div>}
                            </div>
                        </div>

                        <div className="col-12 col-md-6 my-2">
                            <div className="form-group">
                                <label htmlFor="email" className="control-label text-white">Email</label>
                                <input name="email" id="email" className="form-control"
                                       value={fields.email} onChange={handleInputChange} />
                                {errors.email && <div className="text-danger">{errors.email}</div>}
                            </div>
                        </div>

                        <div className="col-12 col-md-6 my-2">
                            <div className="form-group">
                                <label htmlFor="profpic" className="control-label text-white">Delete Profile Picture?</label>
                                {fields.profpic ?
                                    <input type="button" className="btn btn-danger form-control font-weight-bold" name="profpic" id="profpic" value="Delete" onClick={handleDeleteProfpic} />
                                    :
                                    <input type="button" className="btn btn-danger form-control font-weight-bold" name="profpic" id="profpic" value="Delete" disabled />
                                }
                            </div>
                        </div>

                        <div className="col-12 mt-4">
                            <div className="form-group text-md-center">
                                <Link className="btn btn-secondary mr-5" style={{ width: "40%" }} to="/">Cancel</Link>
                                <button type="submit" className="btn btn-primary" style={{ width: "40%" }}>Update</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
