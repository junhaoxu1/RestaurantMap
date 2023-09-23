import { useParams } from "react-router-dom";
import useGetUsers from "../hooks/useGetUsers";
import { UserInformation } from "../types/User.types";
import { usersCol } from "../services/firebase";
import useGetDocument from "../hooks/useGetDocument";
import useAuth from "../hooks/useAuth";

const AdminUpdatePage = () => {
    const { id } = useParams();
    const documentId = String(id);
    const { currentUser } = useAuth();

    if (!documentId) return <p>User doesn't exist</p>;

    const { data: user, loading } = useGetUsers(documentId);
    const { data: SearchUser } = useGetDocument<UserInformation>(usersCol, documentId);

    if (!user || loading) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <p>Email: {SearchUser?.email}</p>
        </>
    );
};

export default AdminUpdatePage;