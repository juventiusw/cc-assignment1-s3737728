import React from "react";
import { useHistory } from  "react-router-dom";
import styles from '../css/Profile.module.css';
import { findUserByUsername, setSelectedUser } from "../data/repository";

export default function OtherFollowing(props) {
    const history = useHistory();

    async function gotoUserProfile(user) {
        if(user.username !== props.user.username) {
            const data = await findUserByUsername(user.username);
            props.setSelectedUser(data);
            setSelectedUser(data);
            history.push("/userprofile");
        }else {
            history.push("/profile");
        }
    }

    return (
        <div className={styles.frame}>
            <div className="container mb-2">
                <h2 className="pt-5 text-dark">Following</h2>
                <hr />
                {props.selectedUser.following.length === 0 ?
                    <span>There are no users.</span>
                    :
                    props.selectedUser.following.map((x) =>
                        <div key={x.username} className="p-3 pb-2">
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
                    )}
            </div>
        </div>
    );

}