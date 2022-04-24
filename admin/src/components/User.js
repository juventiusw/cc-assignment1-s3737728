import { useContext } from "react";
import { Link } from "react-router-dom";
import { blockUser, unblockUser, deleteUser, deleteImage } from "../data/repository";
import MessageContext from "../contexts/MessageContext";

export default function User(props) {
    const { setMessage } = useContext(MessageContext);

    const handleBlock = async () => {
        // Block user.
        const data = await blockUser(props.user.userid);

        // Update State.
        if(data) {
            const updatedUsers = [];
            props.users.forEach((x) => {
                if(x.userid === props.user.userid) {
                    x.userStatus = false;
                }
                updatedUsers.push(x);
            });
            props.setUsers(updatedUsers);
        }
    }

    const handleUnblock = async () => {
        // Unblock user.
        const data = await unblockUser(props.user.userid);

        // Update State.
        if(data) {
            const updatedUsers = [];
            props.users.forEach((x) => {
                if(x.userid === props.user.userid) {
                    x.userStatus = true;
                }
                updatedUsers.push(x);
            });
            props.setUsers(updatedUsers);
        }
    }

    const handleDelete = async () => {
        if(!window.confirm(`Are you sure you want to delete ${props.user.fullname} ?`))
            return;

        const postids = [];
        const postimgs = [];
        props.user.posts.forEach((x) => {
            postids.push(x.postid);
            if(x.postImage) {
                postimgs.push(x.postImage);
            }
        });
        const data = {
            id: props.user.userid,
            postid: postids,
        }
        const isDeleted = await deleteUser(data);

        if(isDeleted) {
            // Delete user profpic
            if(props.user.profpic) {
                const justname = props.user.profpic.split('https://a1-react-assets-uploads.s3.amazonaws.com/').pop();
                await deleteImage({ filename: justname });
            }
            // Delete the image of the posts that have been deleted
            for(const img of postimgs) {
                const justname = img.split('https://a1-react-assets-uploads.s3.amazonaws.com/').pop();
                await deleteImage({ filename: justname });
            }
        }

        // Refresh the users.
        // Here the users are refreshed.
        await props.loadUsers();

        setMessage(<><strong>{props.user.fullname}</strong> has been deleted successfully.</>);
    };

    return (
        <tr>
            <td className="text-light pt-3">{props.user.username}</td>
            <td className="text-light pt-3">{props.user.fullname}</td>
            <td className="text-light pt-3">{props.user.email}</td>
            <td className="text-light pt-3">{props.user.datejoined}</td>
            <td className="text-light text-center pt-3">{props.user.posts.filter(x => x.postContent !== "[**** This post has been deleted by the admin ***]").length}</td>
            <td className="text-light text-center pt-3">{props.user.replies.length}</td>
            <td className="text-center">
                <Link className="btn btn-primary" to={`/edit/${props.user.userid}`}>Modify</Link>
            </td>
            <td className="text-center">
                {props.user.userStatus ?
                    <button className="btn btn-info" onClick={handleBlock}>Block</button>
                    :
                    <button className="btn btn-success" onClick={handleUnblock}>Unblock</button>
                }
            </td>
            <td className="text-center">
                <button className="btn btn-danger" onClick={() => handleDelete()}>Delete</button>
            </td>
        </tr>
    );
}