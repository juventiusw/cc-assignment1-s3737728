import { useContext, useState } from "react";
import MessageContext from "../contexts/MessageContext";
import TableUsers from "./TableUsers";
import ListPosts from "./ListPosts";

export default function Dashboard() {
    const { message } = useContext(MessageContext);
    const [ mode, setMode ] = useState(true);

    const handleMode = (value) => {
        setMode(value);
    }

    return (
        <div>
            {message && <div className="alert alert-success mt-4" role="alert">{message}</div>}
            <div className="row d-flex align-items-center mb-3">
                {mode ?
                    <h1 className="display-4 my-4 col-6 text-light">Users</h1>
                    :
                    <h1 className="display-4 my-4 col-6 text-light">Posts</h1>
                }
                <div className="col-6 btn-group btn-group-toggle" style={{height: "40px"}}>
                    <label className={`btn btn-dark ${mode && "active"}`} style={{ border: "1px solid #808080" }}>
                        <button className="d-none" onClick={() => {handleMode(true)}} />
                        <span className="font-weight-bold">Manage Users</span>
                    </label>
                    <label className={`btn btn-dark ${!mode && "active"}`} style={{ border: "1px solid #808080" }}>
                        <button className="d-none" onClick={() => {handleMode(false)}} />
                        <span className="font-weight-bold">Manage Posts</span>
                    </label>
                </div>
            </div>
            <div className="mb-5">
                {mode ?
                    <TableUsers />
                    :
                    <ListPosts />
                }

            </div>
        </div>
    );
}
