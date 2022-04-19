import React, { useEffect, useState } from "react";
import { useHistory } from  "react-router-dom";
import styles from '../css/Profile.module.css';
import { getUsers, setSelectedUser } from "../data/repository";

export default function UserList(props) {
    const history = useHistory();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadUsers() {
            const currentUsers = await getUsers();
            setUsers(currentUsers);
            setIsLoading(false);
        }

        loadUsers();
    }, []);

    function gotoUserProfile(user) {
        props.setSelectedUser(user);
        setSelectedUser(user);
        history.push("/userprofile")
    }

    return (
        <div className={styles.frame}>
            <div className="container mb-2">
                <h2 className="pt-5 text-dark">List of Users</h2>
                <hr />
                {isLoading ?
                    <span>Loading Users...</span>
                    :
                    users.length === 0 ?
                        <span>There are no users.</span>
                        :
                        users.map((x) => {
                            return x.userid !== props.user.userid &&
                                <div key={x.userid} className="p-3 pb-2">
                                    <div className="row">
                                        <div className="col-1" style={{ height: "60px" }}>
                                            {x.profpic ?
                                                <img src={x.profpic} alt="" className="rounded-circle border border-dark" height="60" width="60" style={{ marginTop: "-8px" }} />
                                                :
                                                <img src="https://a1-react-assets.s3.amazonaws.com/blank-profile.png" alt="" className="rounded-circle border border-dark" height="60" width="60" style={{ marginTop: "-8px" }} />
                                            }
                                        </div>
                                        <div className="col" style={{ marginLeft: "-30px" }}>
                                            <div className="fw-bold text-dark" onClick={() => gotoUserProfile(x)} style={{ cursor: "pointer" }}>{x.username}</div>
                                            <div>{x.fullname}</div>
                                        </div>
                                    </div>
                                </div>
                        })
                }
            </div>
        </div>
    );
}