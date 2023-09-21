import useGetDocument from "../hooks/useGetDocument"
import { UserInformation } from "../types/User.types"
import { usersCol } from "../services/firebase"
import { useParams } from "react-router-dom"


const AdminUpdatePage = () => {
    const { id } = useParams();

    const documentId = String(id);

    if (!documentId) return <p>User Doesn't Exist</p>;

    const { data: user, loading } = useGetDocument<UserInformation>(usersCol, documentId);

    console.log("Document ID:", documentId); 

    const firestoreDocumentId = user?._id;

    console.log(firestoreDocumentId)

    if (!user || loading) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <h1>{firestoreDocumentId}</h1>
           <h1>{user?.email}</h1>
        </>
    );
}

export default AdminUpdatePage;