import React, { useEffect, useState } from "react";
import { useHistory } from  "react-router-dom";
import { follow, unfollow, setUser, setSelectedUser } from "../data/repository";
import styles from '../css/Profile.module.css';

export default function UserProfile(props) {
    const [selectedUserState, setSelectedUserState] = useState(props.selectedUser);
    const history = useHistory();

    useEffect(() => {
        setSelectedUser(selectedUserState);
    }, [selectedUserState]);

    async function handleFollow() {
        const send = {
            followerid: props.user.userid,
            followerFullname: props.user.fullname,
            followerUsername: props.user.username,
            followeeid: selectedUserState.userid,
            followeeFullname: selectedUserState.fullname,
            followeeUsername: selectedUserState.username
        }
        // Follow
        const receive = await follow(send);

        // Update State
        let updatedUser = props.user;
        let updatedFollowers = selectedUserState.followers;
        const followingData = {
            fullname: selectedUserState.fullname,
            username: selectedUserState.username,
            profpic: selectedUserState.profpic,
            follows: receive
        }
        updatedUser.following.push(followingData);
        const followersData = {
            follows: receive,
            fullname: props.user.fullname,
            profpic: props.user.profpic,
            username: props.user.username
        }
        updatedFollowers.push(followersData);

        setSelectedUserState({...selectedUserState, followers: updatedFollowers });
        setUser(updatedUser);

        // Update global state
        props.setUser({...props.user, following: updatedUser.following });
        props.setSelectedUser({...props.selectedUser, followers: updatedFollowers });
    }

    async function handleUnfollow() {
        const send = {
            followerid: props.user.userid,
            followeeid: selectedUserState.userid
        }
        // Unfollow
        await unfollow(send);

        // Update State
        let updatedUser = props.user;
        let updatedFollowers = selectedUserState.followers;
        updatedUser.following = updatedUser.following.filter((x) => {
            return x.username !== selectedUserState.username;
        });
        updatedFollowers = updatedFollowers.filter((x) => {
            return x.username !== props.user.username;
        });

        setSelectedUserState({...selectedUserState, followers: updatedFollowers });
        setUser(updatedUser);

        // Update global state
        props.setUser({...props.user, following: updatedUser.following });
        props.setSelectedUser({...props.selectedUser, followers: updatedFollowers });
    }

    function gotoOtherFollowers() {
        history.push("/otherfollowers");
    }

    function gotoOtherFollowing() {
        history.push("/otherfollowing");
    }

    return (
        <div className={styles.frame}>
            <div className={`container justify-content-center d-flex align-center ${styles.fadeInDown}`}>
                <div className={styles.scaled}>
                    <div className={styles.profile}>
                        <div className={styles.image}>
                            <div className={styles.circle1}></div>
                            <div className={styles.circle2}></div>
                            {selectedUserState.profpic ?
                                <img src={selectedUserState.profpic} width="70" height="70" alt=""/>
                                :
                                <img src="https://a1-react-assets.s3.amazonaws.com/blank-profile.png" width="70" height="70" alt=""/>
                            }
                        </div>
                        <div className={styles.name}>{selectedUserState.fullname}</div>
                        <div className={styles.username}>{selectedUserState.email}</div>
                        <div className={`pt-3 ${styles.actions}`}>
                            {selectedUserState.followers.filter(x => x.username === props.user.username).length === 1 ?
                                <>
                                    <button className={styles.btn} onClick={handleUnfollow}>Unfollow</button>
                                </>
                                :
                                <button className={styles.btn} onClick={handleFollow}>Follow</button>
                            }
                        </div>
                    </div>
                    <div className={styles.stats}>
                        <div className={styles.box} style={{cursor: "pointer"}} onClick={gotoOtherFollowers}>
                            <span className={styles.value}>{selectedUserState.followers.length}</span>
                            <span className={styles.parameter}>Followers</span>
                        </div>
                        <div className={styles.box} style={{cursor: "pointer"}} onClick={gotoOtherFollowing}>
                            <span className={styles.value}>{selectedUserState.following.length}</span>
                            <span className={styles.parameter}>Following</span>
                        </div>
                        <div className={styles.box}>
                            <span className={styles.value}>{selectedUserState.datejoined}</span>
                            <span className={styles.parameter}>Date Joined</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}