import React from "react";
import { useHistory } from  "react-router-dom";
import styles from '../css/Profile.module.css';
import { deleteUser, deleteImage, getPostData } from "../data/repository";

export default function MyProfile(props) {
    const history = useHistory();

    function gotoEditProfile() {
        history.push("/editprofile");
    }

    async function handleDeleteAccount() {
        const answer = window.confirm("Confirm to delete your account.");
        if(answer) {
            const postdata = await getPostData(props.user.userid);
            const postids = [];
            const postimgs = [];
            for(const x of postdata) {
                postids.push(x.postid);
                if(x.postImage) {
                    postimgs.push(x.postImage);
                }
            }
            const data = {
                id: props.user.userid,
                postid: postids,
            }
            const isDeleted = await deleteUser(data);

            if(isDeleted) {
                // Delete user profpic
                if(props.user.profpic) {
                    const justname = props.user.profpic.split('https://a1-react-assets-uploads.s3.amazonaws.com/').pop();
                    console.log(justname);
                    await deleteImage({ filename: justname });
                }
                // Delete the image of the posts that have been deleted
                for(const img of postimgs) {
                    const justname = img.split('https://a1-react-assets-uploads.s3.amazonaws.com/').pop();
                    console.log(justname);
                    await deleteImage({ filename: justname });
                }
            }

            // Logout
            history.push("/login");
            props.logoutUser();
        }
    }

    function gotoFollowers() {
        history.push("/followers");
    }

    function gotoFollowing() {
        history.push("/following");
    }

    return (
        <div className={styles.frame}>
            <div className={`container justify-content-center d-flex align-center ${styles.fadeInDown}`}>
                <div className={styles.scaled}>
                    <div className={styles.profile}>
                        <div className={styles.image}>
                            <div className={styles.circle1}></div>
                            <div className={styles.circle2}></div>
                            {props.user.profpic ?
                                <img src={props.user.profpic} width="70" height="70" alt=""/>
                                :
                                <img src="https://a1-react-assets.s3.amazonaws.com/blank-profile.png" width="70" height="70" alt=""/>
                            }
                        </div>
                        <div className={styles.name}>{props.user.fullname}</div>
                        <div className={styles.username}>{props.user.email}</div>
                        <div className={styles.actions}>
                            <button className={styles.btn} onClick={gotoEditProfile}>Edit Profile</button>
                            <button className={styles.btn} onClick={handleDeleteAccount}>Delete Account</button>
                        </div>
                    </div>
                    <div className={styles.stats}>
                        <div className={styles.box} style={{cursor: "pointer"}} onClick={gotoFollowers}>
                            <span className={styles.value}>{props.user.followers.length}</span>
                            <span className={styles.parameter}>Followers</span>
                        </div>
                        <div className={styles.box} style={{cursor: "pointer"}} onClick={gotoFollowing}>
                            <span className={styles.value}>{props.user.following.length}</span>
                            <span className={styles.parameter}>Following</span>
                        </div>
                        <div className={styles.box}>
                            <span className={styles.value}>{props.user.datejoined}</span>
                            <span className={styles.parameter}>Date Joined</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
