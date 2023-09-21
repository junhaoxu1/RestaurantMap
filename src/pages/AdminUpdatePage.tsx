import useGetDocument from "../hooks/useGetDocument"
import { UserInformation } from "../types/User.types"
import { usersCol } from "../services/firebase"
import { useParams } from "react-router-dom"
import useGetUsers from "../hooks/useGetUsers"
import useAuth from "../hooks/useAuth"


const AdminUpdatePage = () => {
    const { id } = useParams();

	const { currentUser } = useAuth()
	const documentId = id as string

    if (!documentId) return <p>User Doesn't Exist</p>;

    const { data: user, loading } = useGetUsers(documentId)

    console.log("Document ID:", documentId);

    const firestoreDocumentId = documentId;

    console.log(firestoreDocumentId)

    if (!user || loading) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <h1>{firestoreDocumentId}</h1>
           <h1>{currentUser?.email}</h1>
        </>
    );
}

export default AdminUpdatePage;
