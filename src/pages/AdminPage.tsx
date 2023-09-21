import Container from "react-bootstrap/Container"
import ListGroup from "react-bootstrap/ListGroup"
import { usersCol, db } from "../services/firebase"
import { UserFormData } from "../types/User.types"
import useAuth from "../hooks/useAuth"
import useGetCollection from "../hooks/useGetCollection"
import { Link } from "react-router-dom"
import { Button } from "react-bootstrap"
import { getDocs, collection, doc } from "firebase/firestore"
import AdminUpdatePage from "./AdminUpdatePage"
import { QuerySnapshot } from "firebase-admin/firestore"
import { useState, useEffect } from 'react'

const AdminPage = () => {
	const { data: users, loading } = useGetCollection<UserFormData>(usersCol)
	const { currentUser } = useAuth()

	const admins = users?.filter((user) => user.admin === true)
	const sortByAdmin = (a: UserFormData, b: UserFormData) => (a.admin === b.admin ? 0 : a.admin ? -1 : 1)

	const getCol = collection(db, "users");

	const [documentData, setDocumentData] = useState<{ documentId: string; admin: boolean; email: string }[]>([]);

	const getData = async () => {
		const querySnapshot = await getDocs(getCol);
		const newDocumentData: { documentId: string; admin: boolean; email: string }[] = [];
	  
		querySnapshot.forEach((doc) => {
		  const documentId: string = doc.id;
		  const email: string = doc.data().email;
		  const admin: boolean = doc.data().admin
		  newDocumentData.push({ documentId, email, admin });
		});
	  
		setDocumentData(newDocumentData);
	  };

	useEffect(() => {
		getData();
	  }, []);

	return (
		<Container className="py-3">
		{loading ? (
		  <p>Loading...</p>
		) : users && currentUser ? (
		  admins?.some((admin) => admin.email === currentUser.email) ? (
			<ListGroup className="userlist">
			  {documentData.map((document) => (
				<ListGroup.Item
				  key={document.documentId}
				  as={Link}
				  to={`/admin/${document.documentId}`}
				>
				  <p>User: {document.email}</p>
				  <p>Role: {document.admin ? "Admin" : "Visitor"}</p>
				</ListGroup.Item>
			  ))}
			</ListGroup>
		  ) : (
			<p>You do not have permission to view this page.</p>
		  )
		) : (
		  <p>Loading...</p>
		)}
	  </Container>
	)
}

export default AdminPage
