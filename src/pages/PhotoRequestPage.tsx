import Container from "react-bootstrap/Container";
import { photoRequestCol, usersCol } from "../services/firebase";
import { UserFormData } from "../types/User.types";
import useAuth from "../hooks/useAuth";
import useGetCollection from "../hooks/useGetCollection";
import { useState, useEffect } from 'react';
import { Restaurant } from "../types/restaurants.types";
import PhotoTable from "../components/PhotoTable";

const UserRequestsPage = () => {
    const { currentUser } = useAuth();

    const { data: restaurants, loading } = useGetCollection<Restaurant>(photoRequestCol);
    const { data: users } = useGetCollection<UserFormData>(usersCol);

    const [documentData, setDocumentData] = useState<Restaurant[]>([]);

    useEffect(() => {
        if (restaurants) {
          setDocumentData(restaurants);
        }
      }, [restaurants]);

    const admins = users?.filter((user) => user.admin === true)


    return (
        <Container className="py-3">
            {loading ? (
                <p>Loading...</p>
            ) : users && currentUser ? (
                admins?.some((admin) => admin.email === currentUser.email) ? (
                    <PhotoTable data={documentData}/>
                ) : (
                    <p>You do not have permission to view this page.</p>
                )
            ) : (
                <p>Loading...</p>
            )}
        </Container>
    )
}

export default UserRequestsPage
