import React, { useState } from "react";
import Form from "react-bootstrap/esm/Form";
import { useTable, Column } from "react-table";
import useAuth from "../hooks/useAuth";
import { UpdateUserFormData } from "../types/User.types";
import { useForm } from "react-hook-form";
import Image from 'react-bootstrap/Image'

interface RowData {
  documentId: string;
  email: string;
  admin: boolean;
  name: string;
  photoFile: string;
}

interface AdminTableProps {
  data: RowData[];
  onAdminStatusToggle: (documentId: string, newAdminStatus: boolean) => void;
}

//Lägg till kolumner inne i table
const AdminTable: React.FC<AdminTableProps> = ({ data, onAdminStatusToggle }) => {
	const { currentUser } = useAuth()
	const {
	} = useForm<UpdateUserFormData>({
		defaultValues: {
			email: currentUser?.email ?? "",
			name: currentUser?.displayName ?? "",
		},
	})

	if (!currentUser) {
		return <p>Failed</p>
	}

	const [rowData, setRowData] = useState(data)


	const columns: Column<RowData>[] = React.useMemo(
		() => [
		{
			Header: "User",
			accessor: "email",
		},
		{
			Header: "Name & ProfileImg",
			accessor: "name",
			Cell: ({ row }) => (
				<div>
					<div className="profile-photo-wrapper text-center my-2">
						<div className="d-flex">
							<Image src={row.original.photoFile || "https://via.placeholder.com/225"} fluid rounded className="img-square w-50" />
						</div>
					</div>
					<p>{row.original.name ? `${row.original.name}` : "Missing Name"}</p>
				</div>
			),
		},
		{
			Header: "Role",
			accessor: "admin",
			Cell: ({ row }) => (
			<button
				className="btn btn-primary"
				onClick={() => {
				const documentId = row.original.documentId;
				const newAdminStatus = !row.original.admin;
				row.original.admin = newAdminStatus
              	setRowData([...rowData])
				onAdminStatusToggle(documentId, newAdminStatus);
				}}
			>
				{row.original.admin ? "Admin" : "Visitor"}
			</button>
			),
		},
		],
		[]
	);

	const [sortedRowArrayD, setSortedRowArrayD] = useState(data)

	//useTable från react-table innehåller dessa variablar för att kunna rendera ut en table
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
	} = useTable({
		columns,
		data: sortedRowArrayD,
	});

	const sortRowData = (colId: string) => {
		const sortRowArray = [...sortedRowArrayD].sort((a: any, b: any) => {
			const itemValueA = a[colId]
			const itemValueB = b[colId]

			if (typeof itemValueA === 'string' && typeof itemValueB === 'string') {
				// Sorting columns by alphabetical order in swedish characters
				return itemValueA.localeCompare(itemValueB, 'sv', { sensitivity: 'base' })
			} else if (typeof itemValueA === 'number' && typeof itemValueB === 'number') {
				// added same with numbers, its working kinda off
				return itemValueA - itemValueB
			} else {
				return 0
			}

		})
		setSortedRowArrayD(sortRowArray)
	}

	return (
		<table {...getTableProps()} className="table">
		<thead>
			{headerGroups.map((headerGroup) => (
			<tr {...headerGroup.getHeaderGroupProps()}>
				{headerGroup.headers.map((column) => (
				<th {...column.getHeaderProps()} onClick={() => sortRowData(column.id)}>{column.render("Header")}</th>
				))}
			</tr>
			))}
		</thead>
		<tbody {...getTableBodyProps()}>
			{rows.map((row) => {
			prepareRow(row);
			return (
				<tr {...row.getRowProps()}>
				{row.cells.map((cell) => {
					return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
				})}
				</tr>
			);
			})}
		</tbody>
		<tbody>
		</tbody>
		</table>
	);
};

export default AdminTable;
