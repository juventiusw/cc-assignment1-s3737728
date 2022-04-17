import React, { useState, useEffect } from "react";
import { findUser, deleteImage, getPosts, createPost, deletePost, updatePost, likePost, dislikePost, deleteLikePost, uploadPostImage, getReplies, createReply, deleteReply, updateReply, likeReply, dislikeReply, deleteLikeReply } from "../data/repository";
import styles from '../css/Forum.module.css';
import imageCompression from "browser-image-compression";

export default function Forum(props) {
    const [post, setPost] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [imageKey, setImageKey] = useState("");
    const [errorImgMessage, setErrorImgMessage] = useState(null);
    const [uploaded, setUploaded] = useState(false);
    const [fileUploading, setFileUploading] = useState(null);
    const [fileUploaded, setFileUploaded] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [show, setShow] = useState(null);
    const [posts, setPosts] = useState([]);
    const [isPostSelected, setIsPostSelected] = useState(null);
    const [editPostErrorMessage, setEditPostErrorMessage] = useState(null);
    const [editMyPost, setEditMyPost] = useState("");
    const [isReplying, setIsReplying] = useState(null);
    const [reply, setReply] = useState("");
    const [replies, setReplies] = useState([]);
    const [replyErrorMessage, setReplyErrorMessage] = useState(null);
    const [isReplySelected, setIsReplySelected] = useState(null);
    const [editReplyErrorMessage, setEditReplyErrorMessage] = useState(null);
    const [editMyReply, setEditMyReply] = useState("");

    // Load forum.
    useEffect(() => {
        async function loadForum() {
            const currentPosts = await getPosts();
            const currentReplies = await getReplies();
            for(const post of currentPosts) {
                const owner = await findUser(post.userid);
                post.profpic = owner.profpic;
                post.username = owner.username;
            }
            setPosts(currentPosts);
            for(const reply of currentReplies) {
                const owner = await findUser(reply.userid);
                reply.profpic = owner.profpic;
                reply.username = owner.username;
            }
            setReplies(currentReplies);
            setIsLoading(false);
        }

        loadForum();
    }, []);

    const handleImage = (event) => {
        let imgext = String(event.target.value).split('.').pop().toLowerCase();
        let x = checkExtension(imgext);
        if(x) {
            setUploaded(true);
            setErrorImgMessage(null);
            setFileUploading(styles.file_uploading);
            setTimeout(function(){
                setFileUploaded(styles.file_uploaded);
            }, 3000);
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
                setTimeout(function() {
                    getBase64(convertedBlobFile, (result) => {
                        setUploadedFile(result);
                    })
                    setShow(styles.show);
                }, 3500);
            }).catch(e => {
                console.log(e);
            });
        }else {
            setErrorImgMessage("Not an Image...");
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

    const cancelImage = () => {
        setShow(null);
        setUploadedFile(null);
        setImageFile(null);
        setFileUploading(null);
        setFileUploaded(null);
        setUploaded(false);
        setImageKey(Math.random().toString(36)); //reset file input
    }

    const handleInputChange = (event) => {
        setPost(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Trim the post text.
        const trimmedPost = post.trim();

        if(trimmedPost === "") {
            setErrorMessage("A post cannot be empty.");
            return;
        }else if(trimmedPost.length > 600) {
            setErrorMessage("A post cannot be more than 600 characters.");
            return;
        }

        // Create post.
        const newPost = { content: trimmedPost, userid: props.user.userid };

        if(imageFile !== null) {
            // Create post with image
            const formData = new FormData();
            formData.append('file', imageFile);
            const image = await uploadPostImage(formData);
            newPost.postImage = image;
        }

        const receivedPost = await createPost(newPost);

        // Fill in the rest of the required data to the new post
        newPost.postid = receivedPost.postid;
        newPost.profpic = props.user.profpic;
        newPost.username = props.user.username;
        newPost.likes = [];

        // Add post to locally stored posts.
        setPosts([...posts, newPost]);

        // Reset post content.
        setPost("");
        setErrorMessage("");

        // Reset image
        cancelImage();
    };

    const handleUpdatePost = async (event) => {
        event.preventDefault();

        // Trim the post text.
        const editMyPostTrimmed = editMyPost.trim();

        if(editMyPostTrimmed === "") {
            setEditPostErrorMessage("A post cannot be empty.");
            return;
        }else if(editMyPostTrimmed.length > 600) {
            setEditPostErrorMessage("A post cannot be more than 600 characters.");
            return;
        }

        //update the username of the posts that belongs to the current user
        const updatedPosts = [];
        for(const post of posts) {
            if(post.postid === isPostSelected) {
                post.content = editMyPostTrimmed;
                // Update post.
                await updatePost(post);
            }
            updatedPosts.push(post);
        }

        setPosts(updatedPosts);
        setEditPostErrorMessage("");
        setIsPostSelected(null);
    }

    const handlePostEditChange = (event) => {
        setEditMyPost(event.target.value);
    }

    async function handleDeletePost(selectedPost) {
        // Delete the post in the database
        await deletePost(selectedPost);

        // Get all posts other than the selected post
        const updatedPosts = [];
        for(const post of posts) {
            if(post.postid !== selectedPost) {
                updatedPosts.push(post);
            }else {
                // Delete the post's image as well if exists
                if(post.postImage != null) {
                    const data = {
                        filename: post.postImage
                    };
                    await deleteImage(data);
                }
            }
        }
        // Get all replies that are not associated with the selected post
        const updatedReplies = [];
        for(const reply of replies) {
            if(reply.postid !== selectedPost) {
                updatedReplies.push(reply);
            }
        }
        setReplies(updatedReplies);
        setPosts(updatedPosts);
    }

    const submitReply = async (event) => {
        event.preventDefault();

        // Trim the reply text.
        const replyTrimmed = reply.trim();

        if(replyTrimmed === "") {
            setReplyErrorMessage("A reply cannot be empty.");
            return;
        }else if(replyTrimmed.length > 600) {
            setReplyErrorMessage("A reply cannot be more than 600 characters.");
            return;
        }

        const newReply = { replyContent: replyTrimmed, userid: props.user.userid, postid: isReplying };

        const receivedReply = await createReply(newReply);

        // Fill in the rest of the required data to the new reply
        newReply.replyid = receivedReply.replyid;
        newReply.profpic = props.user.profpic;
        newReply.username = props.user.username;
        newReply.likes = [];

        // Add reply to locally stored replies.
        setReplies([...replies, newReply]);

        // Reset reply.
        setReply("");
        setReplyErrorMessage("");
        setIsReplying(null);

    }

    const handleReplyChange = (event) => {
        setReply(event.target.value);
    }

    const handleUpdateReply = async (event) => {
        event.preventDefault();

        const editMyReplyTrimmed = editMyReply.trim();

        if(editMyReplyTrimmed === "") {
            setEditReplyErrorMessage("A reply cannot be empty.");
            return;
        }else if(editMyReplyTrimmed.length > 600) {
            setEditReplyErrorMessage("A reply cannot be more than 600 characters.");
            return;
        }

        //update the username of the posts that belongs to the current user
        const updatedReplies = [];
        for(const reply of replies) {
            if(reply.replyid === isReplySelected) {
                reply.replyContent = editMyReply;
                // Update reply.
                await updateReply(reply);
            }
            updatedReplies.push(reply);
        }

        setReplies(updatedReplies);
        setEditReplyErrorMessage("");
        setIsReplySelected(null);
    }

    const handleReplyEditChange = (event) => {
        setEditMyReply(event.target.value);
    }

    async function handleDeleteReply(selectedReply) {
        // Delete the reply in the database
        await deleteReply(selectedReply);

        // Get all replies other than the selected reply
        const updatedReplies = [];
        for(const reply of replies) {
            if(reply.replyid !== selectedReply) {
                updatedReplies.push(reply);
            }
        }
        setReplies(updatedReplies);
    }

    function getPostLikeStatus(pid) {
        let status = null;
        posts.forEach((x) => {
            // if post id is match
            if(x.postid === pid) {
                // Check if the current user is liking this post
                if(x.likes.filter(y => y.like_posts.userid === props.user.userid && y.like_posts.choice).length === 1) {
                    status = true;
                    // Check if the current user is disliking this post
                }else if(x.likes.filter(y => y.like_posts.userid === props.user.userid && !y.like_posts.choice).length === 1){
                    status = false;
                    // Return null if the current user is not liking or disliking this post
                }else {
                    status = null;
                }
            }
        });
        return status;
    }

    async function handleLikePost(pid) {
        const status = getPostLikeStatus(pid);
        const data = {
            userid: props.user.userid,
            postid: pid,
            choice: true
        };
        // if the current user is not liking or disliking this post
        if(status === null) {
            // Submit like
            await likePost(data);
            // if the current user is liking this post
        }else if(status) {
            // Remove the like record
            await deleteLikePost(data);
            // if the current user is disliking this post
        }else {
            // Remove the dislike record
            await deleteLikePost(data);
            // Submit like
            await likePost(data);
        }

        const fulldata = {
            like_posts: data,
            username: props.user.username
        };

        // Update state
        const updatedPosts = [];
        for(const post of posts) {
            if(post.postid === pid) {
                if(status === null) {
                    post.likes.push(fulldata);
                }else if(status) {
                    post.likes = post.likes.filter((x) => {
                        return x.like_posts.userid !== props.user.userid;
                    })
                }else {
                    post.likes = post.likes.filter((x) => {
                        return x.like_posts.userid !== props.user.userid;
                    })
                    post.likes.push(fulldata);
                }
            }
            updatedPosts.push(post);
        }
        setPosts(updatedPosts);
    }

    async function handleDislikePost(pid) {
        const status = getPostLikeStatus(pid);
        let data = {
            userid: props.user.userid,
            postid: pid,
            choice: false
        };
        // if the current user is not liking or disliking this post
        if(status === null) {
            // Submit dislike
            await dislikePost(data);
            // if the current user is liking this post
        }else if(status) {
            // Remove the like record
            await deleteLikePost(data);
            // Submit dislike
            await dislikePost(data);
            // if the current user is disliking this post
        }else {
            // Remove the dislike record
            await deleteLikePost(data);
        }

        const fulldata = {
            like_posts: data,
            username: props.user.username
        };

        // Update state
        const updatedPosts = [];
        for(const post of posts) {
            if(post.postid === pid) {
                if(status === null) {
                    post.likes.push(fulldata);
                }else if(status) {
                    post.likes = post.likes.filter((x) => {
                        return x.like_posts.userid !== props.user.userid;
                    })
                    post.likes.push(fulldata);
                }else {
                    post.likes = post.likes.filter((x) => {
                        return x.like_posts.userid !== props.user.userid;
                    })
                }
            }
            updatedPosts.push(post);
        }
        setPosts(updatedPosts);
    }

    function getReplyLikeStatus(rid) {
        let status = null;
        replies.forEach((x) => {
            // if reply id is match
            if(x.replyid === rid) {
                // Check if the current user is liking this reply
                if(x.likes.filter(y => y.like_replies.userid === props.user.userid && y.like_replies.choice).length === 1) {
                    status = true;
                    // Check if the current user is disliking this reply
                }else if(x.likes.filter(y => y.like_replies.userid === props.user.userid && !y.like_replies.choice).length === 1){
                    status = false;
                    // Return null if the current user is not liking or disliking this reply
                }else {
                    status = null;
                }
            }
        });
        return status;
    }

    async function handleLikeReply(rid) {
        const status = getReplyLikeStatus(rid);
        const data = {
            userid: props.user.userid,
            replyid: rid,
            choice: true
        };
        // if the current user is not liking or disliking this reply
        if(status === null) {
            // Submit like
            await likeReply(data);
            // if the current user is liking this reply
        }else if(status) {
            // Remove the like record
            await deleteLikeReply(data);
            // if the current user is disliking this reply
        }else {
            // Remove the dislike record
            await deleteLikeReply(data);
            // Submit like
            await likeReply(data);
        }

        const fulldata = {
            like_replies: data,
            username: props.user.username
        };

        // Update state
        const updatedReplies = [];
        for(const reply of replies) {
            if(reply.replyid === rid) {
                if(status === null) {
                    reply.likes.push(fulldata);
                }else if(status) {
                    reply.likes = reply.likes.filter((x) => {
                        return x.like_replies.userid !== props.user.userid;
                    })
                }else {
                    reply.likes = reply.likes.filter((x) => {
                        return x.like_replies.userid !== props.user.userid;
                    })
                    reply.likes.push(fulldata);
                }
            }
            updatedReplies.push(reply);
        }
        setReplies(updatedReplies);
    }

    async function handleDislikeReply(rid) {
        const status = getReplyLikeStatus(rid);
        const data = {
            userid: props.user.userid,
            replyid: rid,
            choice: false
        };
        // if the current user is not liking or disliking this reply
        if(status === null) {
            // Submit dislike
            await dislikeReply(data);
            // if the current user is liking this reply
        }else if(status) {
            // Remove the like record
            await deleteLikeReply(data);
            // Submit dislike
            await dislikeReply(data);
            // if the current user is disliking this reply
        }else {
            // Remove the dislike record
            await deleteLikeReply(data);
        }

        const fulldata = {
            like_replies: data,
            username: props.user.username
        };

        // Update state
        const updatedReplies = [];
        for(const reply of replies) {
            if(reply.replyid === rid) {
                if(status === null) {
                    reply.likes.push(fulldata);
                }else if(status) {
                    reply.likes = reply.likes.filter((x) => {
                        return x.like_replies.userid !== props.user.userid;
                    })
                    reply.likes.push(fulldata);
                }else {
                    reply.likes = reply.likes.filter((x) => {
                        return x.like_replies.userid !== props.user.userid;
                    })
                }
            }
            updatedReplies.push(reply);
        }
        setReplies(updatedReplies);
    }

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <h3 className="mb-4" style={{ marginTop: "30px" }}>Post something?</h3>
                    <div style={{marginBottom: "2rem"}}>
            <textarea name="post" id="post" className="form-control mb-4" rows="3"
                      value={post} onChange={handleInputChange} />
                        <div className={`${styles.button_outer} ${fileUploading} ${fileUploaded}`}>
                            <div className={styles.btn_upload} style={{marginTop: "-4px"}}>
                                <input type="file" id="upload_file" onChange={handleImage} key={imageKey || '' }/><span>Upload Image</span>
                            </div>
                            <div className={styles.processing_bar}></div>
                            <div className={styles.success_box}></div>
                        </div>
                        {errorImgMessage !== null &&
                            <div className={styles.error_msg}>{errorImgMessage}</div>
                        }
                        {uploaded &&
                            <div className={`${styles.uploaded_file_view} ${show}`} id="uploaded_view">
                                <span className={styles.file_remove} onClick={cancelImage}>X</span>
                                {uploadedFile !== null &&
                                    <img src={uploadedFile} alt="" />
                                }
                            </div>
                        }
                    </div>
                    {errorMessage !== null &&
                        <div style={{marginBottom: "2rem"}}>
                            <span className="text-danger">{errorMessage}</span>
                        </div>
                    }
                    <div className="d-flex justify-content-center" style={{marginBottom: "2rem"}}>
                        <input type="button" className={`btn btn-secondary ${styles.btnclass} ${styles.btncancel}`} value="Cancel"
                               onClick={() => { setPost(""); setErrorMessage(null); setErrorImgMessage(null) }} />
                        <input type="submit" className={`btn btn-primary ${styles.btnclass} ${styles.btnpost}`} value="Post" />
                    </div>
                </fieldset>
            </form>

            <hr />

            <h1 className="my-5">Forum Discussion</h1>
            <div>
                {isLoading ?
                    <span className="text-muted">Loading Forum...</span>
                    :
                    posts.length === 0 ?
                        <span className="text-muted">No posts have been submitted.</span>
                        :
                        posts.map((x) =>
                            <div key={x.postid} className="my-5">
                                <div className="p-3" style={{ whiteSpace: "pre-wrap", border: "1px solid #808080" }}>
                                    <div className="mt-2">
                                        {x.profpic ?
                                            <img src={x.profpic} alt="" className="rounded-circle me-3 border border-dark" height="60" width="60" style={{ marginTop: "-12px" }} />
                                            :
                                            <img src="assets/blank-profile.png" alt="" className="rounded-circle me-3 border border-dark" height="60" width="60" style={{ marginTop: "-12px" }} />
                                        }
                                        <h2 className="text-primary d-inline-block mt-2">{x.username}</h2>
                                        <div className="d-inline float-end">
                                            {props.user.userid === x.userid &&
                                                <>
                                                    <button className="btn btn-outline-primary mx-2" onClick={() => { setIsReplying(null); setIsReplySelected(null); setIsPostSelected(x.postid); setEditMyPost(x.postContent); }}>Edit Post</button>
                                                    <button className="btn btn-outline-danger mx-2" onClick={() => { handleDeletePost(x.postid); }}>Delete Post</button>
                                                </>
                                            }
                                            <button className="btn btn-outline-secondary mx-2" onClick={() => { setIsPostSelected(null); setIsReplySelected(null); setIsReplying(x.postid); }}>Reply</button>
                                        </div>
                                    </div>
                                    <hr className="my-4" />
                                    {isPostSelected === x.postid ?
                                        <form className="mt-4 mb-3" onSubmit={handleUpdatePost}>
                                            <textarea className="form-control mb-3" rows="3" value={editMyPost} onChange={handlePostEditChange} />
                                            <input type="button" className="btn btn-secondary" value="Cancel" onClick={() => { setEditPostErrorMessage(""); setIsPostSelected(null); }} />
                                            <input type="submit" className="btn btn-primary mx-2" value="Save Update" />
                                            {editPostErrorMessage !== null &&
                                                <div className="float-end">
                                                    <span className="text-danger">{editPostErrorMessage}</span>
                                                </div>
                                            }
                                        </form>
                                        :
                                        <div className="mt-4 row">
                                            <div className="col-10 mt-2">
                                                <p>{x.postContent}</p>
                                            </div>
                                            <div className="col">
                                                <div className={`${styles.dislike} grow mx-3 ${x.likes.filter(y => y.like_posts.userid === props.user.userid && y.like_posts.choice).length === 1 && styles.active}`} onClick={() => { handleLikePost(x.postid) }}>
                                                    <i className="fa fa-thumbs-up fa-2x like me-2" aria-hidden="true"></i>
                                                    <h3 className="d-inline">{x.likes.filter(y => y.like_posts.choice).length}</h3>
                                                </div>
                                                <div className={`${styles.dislike} grow mx-3 ${x.likes.filter(y => y.like_posts.userid === props.user.userid && !y.like_posts.choice).length === 1 && styles.active}`} onClick={() => { handleDislikePost(x.postid) }}>
                                                    <i className="fa fa-thumbs-down fa-2x like me-2" aria-hidden="true"></i>
                                                    <h3 className="d-inline">{x.likes.filter(y => !y.like_posts.choice).length}</h3>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    {x.postImage &&
                                        <div className={`${styles.uploaded_file_view} ${styles.show}`} id="uploaded_view">
                                            <img src={x.postImage} alt="" />
                                        </div>
                                    }
                                </div>
                                {isReplying === x.postid &&
                                    <div className="p-3" style={{ whiteSpace: "pre-wrap", borderRight: "1px solid #808080", borderBottom: "1px solid #808080", borderLeft: "1px solid #808080" }}>
                                        <h4 className="text-primary d-inline">{props.user.username}</h4>
                                        <span className="text-muted"> (Replying to {x.username}...)</span>
                                        <form className="mt-3 mb-1" onSubmit={submitReply}>
                                            <textarea className="form-control mb-3" rows="2" value={reply} onChange={handleReplyChange} />
                                            <input type="button" className="btn btn-secondary" value="Cancel" onClick={() => { setReply(""); setReplyErrorMessage(""); setIsReplying(null); }} />
                                            <input type="submit" className="btn btn-primary mx-2" value="Reply" />
                                            {replyErrorMessage !== null &&
                                                <div className="float-end">
                                                    <span className="text-danger">{replyErrorMessage}</span>
                                                </div>
                                            }
                                        </form>
                                    </div>
                                }
                                {
                                    replies.map((y) => {
                                        return x.postid === y.postid &&
                                            <div key={y.replyid} className="p-4 pb-2" style={{ whiteSpace: "pre-wrap", borderRight: "1px solid #808080", borderBottom: "1px solid #808080", borderLeft: "1px solid #808080" }}>
                                                <div className="d-inline">
                                                    {y.profpic ?
                                                        <img src={y.profpic} alt="" className="rounded-circle me-3 border border-dark" height="50" width="50" style={{ marginTop: "-8px" }} />
                                                        :
                                                        <img src="assets/blank-profile.png" alt="" className="rounded-circle me-3 border border-dark" height="50" width="50" style={{ marginTop: "-8px" }} />
                                                    }

                                                    <h3 className="text-primary d-inline-block mt-2">{y.username}</h3>
                                                    <div className="d-inline float-end">
                                                        {props.user.userid === y.userid &&
                                                            <>
                                                                <button className="btn btn-outline-primary mx-2" onClick={() => { setIsPostSelected(null); setIsReplying(null); setIsReplySelected(y.replyid); setEditMyReply(y.replyContent); }}>Edit Reply</button>
                                                                <button className="btn btn-outline-danger mx-2" onClick={() => { handleDeleteReply(y.replyid); }}>Delete Reply</button>
                                                            </>
                                                        }
                                                    </div>
                                                </div>
                                                <hr className="my-4" />
                                                {isReplySelected === y.replyid ?
                                                    <form className="mt-4 mb-2" onSubmit={handleUpdateReply}>
                                                        <textarea className="form-control mb-3" rows="2" value={editMyReply} onChange={handleReplyEditChange} />
                                                        <input type="button" className="btn btn-secondary" value="Cancel" onClick={() => { setEditReplyErrorMessage(""); setIsReplySelected(null); }} />
                                                        <input type="submit" className="btn btn-primary mx-2" value="Save Update" />
                                                        {editReplyErrorMessage !== null &&
                                                            <div className="float-end">
                                                                <span className="text-danger">{editReplyErrorMessage}</span>
                                                            </div>
                                                        }
                                                    </form>
                                                    :
                                                    <div className="mb-1 row">
                                                        <div className="col-10" style={{ marginTop: "-12px" }}>
                                                            <p className="mt-3">{y.replyContent}</p>
                                                        </div>
                                                        <div className="col">
                                                            <div className={`${styles.dislike} grow mx-3 ${y.likes.filter(z => z.like_replies.userid === props.user.userid && z.like_replies.choice).length === 1 && styles.active}`} onClick={() => { handleLikeReply(y.replyid) }}>
                                                                <i className="fa fa-thumbs-up fa-2x like me-2" aria-hidden="true"></i>
                                                                <h3 className="d-inline">{y.likes.filter(z => z.like_replies.choice).length}</h3>
                                                            </div>
                                                            <div className={`${styles.dislike} grow mx-3 ${y.likes.filter(z => z.like_replies.userid === props.user.userid && !z.like_replies.choice).length === 1 && styles.active}`} onClick={() => { handleDislikeReply(y.replyid) }}>
                                                                <i className="fa fa-thumbs-down fa-2x like me-2" aria-hidden="true"></i>
                                                                <h3 className="d-inline">{y.likes.filter(z => !z.like_replies.choice).length}</h3>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                    })
                                }
                            </div>
                        )
                }
            </div>
        </div>
    );
}
