import Container from "react-bootstrap/Container"
import { usersCol, db } from "../services/firebase"
import { UserFormData } from "../types/User.types"
import useAuth from "../hooks/useAuth"
import useGetCollection from "../hooks/useGetCollection"
import { getDocs, collection, doc, updateDoc } from "firebase/firestore"
import { useState, useEffect } from 'react'
import AdminTable from "../components/AdminTable"
import { FirebaseError } from "firebase/app"
import { updateProfile } from "firebase/auth"
import UsersTable from "../components/UsersTable"

const UsersTipsRequestPage = () => {
	const { data: users, loading } = useGetCollection<UserFormData>(usersCol)
	const { currentUser, reloadUser, setDisplayName } = useAuth()
	const [ error, setError ] = useState<string | null>(null)
	const [ load, setLoad ] = useState(Boolean)

	const admins = users?.filter((user) => user.admin === true)

	const getCol = collection(db, "users");

	const [documentData, setDocumentData] = useState<{ documentId: string; admin: boolean; email: string, name: string, photoFile: string }[]>([]);

	const getData = async () => {
		const querySnapshot = await getDocs(getCol);
		const newDocumentData: { documentId: string; admin: boolean; email: string, name: string, photoFile: string }[] = [];

		querySnapshot.forEach((doc) => {
		  const documentId: string = doc.id;
		  const email: string = doc.data().email;
		  const admin: boolean = doc.data().admin
		  const name: string = doc.data().name
		  const photoFile: string = doc.data().photoFile
		  newDocumentData.push({ documentId, email, admin, name, photoFile });
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
				<UsersTable data={documentData} />
			) : (
			  <p>You do not have permission to view this page.</p>
			)
		  ) : (
			<p>Loading...</p>
		  )}
		</Container>
	  );
	}

	export default UsersTipsRequestPage;
