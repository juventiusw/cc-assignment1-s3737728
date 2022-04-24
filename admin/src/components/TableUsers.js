import { useState, useEffect } from "react";
import { getUsers, getPostData, getReplyData } from "../data/repository";
import User from "./User";

export default function TableUsers() {
    const [users, setUsers] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load users.
    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        const currentUsers = await getUsers();
        for(const user of currentUsers) {
            user.posts = await getPostData(user.userid);
            user.replies = await getReplyData(user.userid);
        }
        setUsers(currentUsers);
        setIsLoading(false);
    };

    return (
        <div>
            {isLoading ?
                <span className="text-muted">Loading users...</span>
                :
                users.length === 0 ?
                    <span className="text-muted">There are no users.</span>
                    :
                    <table className="table table-hover">
                        <thead>
                        <tr className="text-light">
                            <th>Username</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Date Joined</th>
                            <th>Post</th>
                            <th>Reply</th>
                            <th></th>
                            <th>Actions</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map(user =>
                            <User key={user.userid} loadUsers={loadUsers} user={user} users={users} setUsers={setUsers} />
                        )}
                        </tbody>
                    </table>
            }
        </div>
    );
}