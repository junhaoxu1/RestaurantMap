import { useParams } from "react-router-dom"
import useGetUsers from "../hooks/useGetUsers"
import { UserInformation } from "../types/User.types";
import { usersCol } from "../services/firebase";
import useGetDocument from "../hooks/useGetDocument";
import UserInfoDetails from "../components/UserInfoDetails";

const AdminUpdatePage = () => {
    const { id } = useParams();

    const documentId = String(id)

    if (!documentId) return <p>User doesn't exist</p>

    const { data: user, loading } = useGetDocument<UserInformation>(usersCol, documentId)

    if (!user || loading) {
        return <p>Loading...</p>
    }

    return (
        <>
            <UserInfoDetails user={user} />
        </>
    )
}

export default AdminUpdatePage;
