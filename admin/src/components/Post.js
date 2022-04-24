import { useContext } from "react";
import { deleteImage, deletePost } from "../data/repository";
import MessageContext from "../contexts/MessageContext";
import styles from '../Styles.module.css';

export default function Post(props) {
    const { setMessage } = useContext(MessageContext);

    const handleDeletePost = async () => {
        const isDeleted = await deletePost(props.post.postid);

        if(isDeleted) {
            // Delete post image if exists
            if(props.post.postImage) {
                const justname = props.post.postImage.split('https://a1-react-assets-uploads.s3.amazonaws.com/').pop();
                await deleteImage({ filename: justname });
            }
        }

        // Refresh the posts.
        // Here the posts are refreshed.
        await props.loadPosts();

        setMessage(<>Post with ID of <strong>{props.post.postid}</strong> has been deleted successfully.</>);
    }

    return (
        <div className="p-4" style={{ whiteSpace: "pre-wrap", border: "1px solid #808080" }}>
            <div className="pb-4" style={{ borderBottom: "1px solid #808080" }}>
                {props.post.profpic ?
                    <img src={props.post.profpic} alt="" className="rounded-circle mr-3 border" height="60" width="60" style={{ marginTop: "-12px" }} />
                    :
                    <img src="https://a1-react-assets.s3.amazonaws.com/blank-profile.png" alt="" className="rounded-circle mr-3 border" height="60" width="60" style={{ marginTop: "-12px" }} />
                }
                <h3 className="text-white d-inline-block mt-2">{props.post.fullname}</h3>
                <span className="ml-2 h3" style={{ color: "#E4E6EB" }}>[{props.post.username}]</span>
                <div className="d-inline float-right">
                    <button className="btn btn-outline-danger mx-2" onClick={handleDeletePost}>Delete Post</button>
                </div>
            </div>
            <div className="mt-4">
                <p className="text-light">{props.post.postContent}</p>
            </div>
            {props.post.postImage &&
                <div className={`${styles.uploaded_file_view} ${styles.show}`} id="uploaded_view">
                    <img src={props.post.postImage} alt="" />
                </div>
            }
        </div>
    );
}