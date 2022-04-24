import { useState, useEffect } from "react";
import { getUser, getPosts } from "../data/repository";
import Post from "./Post";

export default function ListPosts() {
    const [posts, setPosts] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load users.
    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        const currentPosts = await getPosts();
        for(const post of currentPosts) {
            const owner = await getUser(post.userid);
            if(owner.profpic) {
                post.profpic = owner.profpic;
            }
            post.fullname = owner.fullname;
            post.username = owner.username;
        }
        setPosts(currentPosts);
        setIsLoading(false);
    };

    return (
        <div>
            {isLoading ?
                <span className="text-muted">Loading posts...</span>
                :
                posts.length === 0 ?
                    <span className="text-muted">There are no posts.</span>
                    :
                    <>
                        <hr className="border" />
                        {posts.map(post =>
                            <div key={post.postid} className="my-5">
                                <Post loadPosts={loadPosts} post={post} setPosts={setPosts} />
                            </div>
                        )}
                    </>
            }
        </div>
    );
}