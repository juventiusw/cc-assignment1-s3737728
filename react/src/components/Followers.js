import React from "react";
import { useHistory } from  "react-router-dom";
import styles from '../css/Profile.module.css';
import { findUserByUsername, setSelectedUser } from "../data/repository";

export default function Followers(props) {
    const history = useHistory();

    async function gotoUserProfile(user) {
        const data = await findUserByUsername(user.username);
        props.setSelectedUser(data);
        setSelectedUser(data);
        history.push("/userprofile");
    }

    return (
        <div className={styles.frame}>
            <div className="container mb-2">
                <h2 className="pt-5 text-dark">Followers</h2>
                <hr />
                {props.user.followers.length === 0 ?
                    <span>There are no users.</span>
                    :
                    props.user.followers.map((x) => {
                        return x.username !== props.user.username &&
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
                    })}
            </div>
        </div>
    );

}