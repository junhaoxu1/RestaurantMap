import React, { useState } from "react";
import Form from "react-bootstrap/esm/Form";
import { useTable, Column } from "react-table";
import useAuth from "../hooks/useAuth";
import { UpdateUserFormData } from "../types/User.types";
import { useForm } from "react-hook-form";
import { Button, Image } from "react-bootstrap";
import { db, restaurantRequestCol } from "../services/firebase"
import { FirebaseError } from "firebase/app";
import useGetCollection from "../hooks/useGetCollection";
import { RestaurantFormData } from "../types/restaurants.types";
import { collection, getDocs } from "@firebase/firestore";

interface RowData {
	documentId: string;
	email: string;
	admin: boolean;
	name: string;
	photoFile: string;
}

interface UsersTableProps {
	data: RowData[];
	// restaurantsReq: RestaurantFormData[];
}

//Lägg till kolumner inne i table
const UsersTable: React.FC<UsersTableProps> = ({ data }) => {
	const [tipRequests, setTipRequests] = useState([]);
	const [documentData, setDocumentData] = useState<{ documentId: string; admin: boolean; email: string, name: string, photoFile: string }[]>([]);

	// const { data: restaurantsReq } = useGetCollection<RestaurantFormData>(restaurantRequestCol)

	const getCollectionRequest = async () => {


		try {
			const getcolReq = collection(db, 'requests');

			const querySnapshot = await getDocs(getcolReq);

			const newDocumentData: { documentId: string; admin: boolean; email: string, name: string, photoFile: string }[] = [];

			querySnapshot.forEach((doc) => {
				const documentId: string = doc.id;
				const email: string = doc.data().email;
				const admin: boolean = doc.data().admin
				const name: string = doc.data().name
				const photoFile: string = doc.data().photoFile
				newDocumentData.push({ documentId, email, admin, name, photoFile });
			});

			// const collectiontipsRef = useGetCollection()
			setDocumentData(newDocumentData);

		} catch (error) {
			if (error instanceof FirebaseError) {
				console.error('Error fetching tip requests:', error);
			}
		}
	}
	const columnsGuest: Column<RowData>[] = React.useMemo(
		() => [
		{
			Header: "Requests",
			// accessor: "requests",
		},
		{
			Header: "Name & ProfileImg",
			accessor: "name",
			Cell: ({ row }) => (
				<Form>
				{!row.original.admin && (
					<>
						<Form.Group>
							<div className="profile-photo-wrapper text-center my-2">
								<div className="d-flex">
									<Image src={row.original.photoFile || "https://via.placeholder.com/225"} fluid rounded className="img-square w-50" />
								</div>
							</div>
							<Form.Label>{row.original.name ? `${row.original.name}` : "(no name)"} | {row.original.email} | {row.original.admin ? "admin" : "vistor"}</Form.Label>
						</Form.Group>
					</>
				)}
				</Form>
			),
		},
		],
		[]
	);

	// const column: Column<RestaurantFormData>[] = React.useMemo(
	// 	() => [
	// 	{
	// 		Header: "Request Details",
	// 		accessor: "request",
	// 		Cell: ({ row }) => (
	// 			<Form>
	// 			{!row.original && (
	// 				<>
	// 					<Form.Group>
	// 						<div className="profile-photo-wrapper text-center my-2">
	// 							<div className="d-flex">
	// 								{/* <Image src={row.original.photoFile || "https://via.placeholder.com/225"} fluid rounded className="img-square w-50" /> */}
	// 							</div>
	// 						</div>
	// 						{/* <Form.Label>{row.original.name ? `${row.original.name}` : "(no name)"} | {row.original.email} | {row.original.admin ? "admin" : "vistor"}</Form.Label> */}
	// 					</Form.Group>
	// 				</>
	// 			)}
	// 			</Form>
	// 		),
	// 	},
	// 	],
	// 	[]
	// );

	//useTable från react-table innehåller dessa variablar för att kunna rendera ut en table
	const {
		getTableProps: getGuestUserTableProps,
		getTableBodyProps: getGuestUserBodyProps,
		headerGroups: GuestUserHeaderGroups,
		rows: GuestUserRows,
		prepareRow: prepareGuestUserRows,
	} = useTable({
		columns: columnsGuest,
		data,
	});

	// const {
	// 	getTableProps: getReqTableProps,
	// 	getTableBodyProps: getReqBodyProps,
	// 	headerGroups: ReqHeaderGroups,
	// 	rows: ReqRows,
	// 	prepareRow: ReqPrepareRow,
	// } = useTable({
	// 	columns: column,
	// 	restaurantsReq,
	// });


	return (
		<table {...getGuestUserTableProps()} className="table">
		<thead>
			{GuestUserHeaderGroups.map((headerGroup) => (
			<tr {...headerGroup.getHeaderGroupProps()}>
				{headerGroup.headers.map((column) => (
				<th {...column.getHeaderProps()}>{column.render("Header")}</th>
				))}
			</tr>
			))}
		</thead>
		<tbody {...getGuestUserBodyProps()}>
			{GuestUserRows.filter(row => !row.original.admin)
				.map((row) => {
				prepareGuestUserRows(row);
				return (
					<tr {...row.getRowProps()}>
					{row.cells.map((cell) => {
						return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
					})}
					</tr>
				);
			})}
		</tbody>
		</table>

		// <table {...getReqTableProps()} className="table">
		// <thead>
		// 	{ReqHeaderGroups.map((headerGroup) => (
		// 	<tr {...headerGroup.getHeaderGroupProps()}>
		// 		{headerGroup.headers.map((column) => (
		// 		<th {...column.getHeaderProps()}>{column.render("Header")}</th>
		// 		))}
		// 	</tr>
		// 	))}
		// </thead>
		// <tbody {...getReqBodyProps()}>
		// 	{ReqRows.filter(row => !row.original.admin)
		// 		.map((row) => {
		// 		ReqPrepareRow(row);
		// 		return (
		// 			<tr {...row.getRowProps()}>
		// 			{row.cells.map((cell) => {
		// 				return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
		// 			})}
		// 			</tr>
		// 		);
		// 	})}
		// </tbody>
		// </table>
	);
};

export default UsersTable;
