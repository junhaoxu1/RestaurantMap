import React from "react";
import { useTable, Column } from "react-table";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom"

interface RowData {
	_id: string
	address: string;
	category: string;
	city: string;
	description: string;
	email?: string;
	facebook?: string;
	instagram?: string;
	name: string;
	phone: string;
	supply: string;
	webpage: string;
	geolocation: {
		lat: number;
		lng: number;
	};
	cover_photo?: string;
}

interface RequestTableProps {
	data: RowData[];
}

const RequestTable: React.FC<RequestTableProps> = ({ data }) => {

	const columns: Column<RowData>[] = React.useMemo(
		() => [
		{
			Header: "Name",
			accessor: "name",
		},
		{
			Header: "Address",
			accessor: "address",
		},
		{
			Header: "Category",
			accessor: "category",
		},
		{
			Header: "City",
			accessor: "city",
		},
		{
			Header: "Description",
			accessor: "description",
		},
		{
			Header: "Email",
			accessor: "email",
		},
		{
			Header: "Facebook",
			accessor: "facebook",
		},
		{
			Header: "Instagram",
			accessor: "instagram",
		},
		{
			Header: "Phone",
			accessor: "phone",
		},
		{
			Header: "Supply",
			accessor: "supply",
		},
		{
			Header: "Webpage",
			accessor: "webpage",
		},
		{
			Header: "Geolocation",
			accessor: "geolocation",
			Cell: ({ cell }) => (
			<div>
				Latitude: {cell.row.original.geolocation.lat}
				<br />
				Longitude: {cell.row.original.geolocation.lng}
			</div>
			),
		},
		{
			Header: "Cover Photo",
			accessor: "cover_photo",
		},
		],
		[]
	);

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
	} = useTable({
		columns,
		data,
	});

	return (
		<div className="table-responsive" style={{ height: "100vh", overflowY: "auto" }}>

			<table {...getTableProps()} className="table">
			<thead>
				{headerGroups.map((headerGroup) => (
				<tr {...headerGroup.getHeaderGroupProps()}>
					{headerGroup.headers.map((column) => (
					<th {...column.getHeaderProps()} className="col">
						{column.render("Header")}</th>
					))}
				</tr>
				))}
			</thead>
			<tbody {...getTableBodyProps()}>
				{rows.map((row) => {
				prepareRow(row);
				return (
					<tr {...row.getRowProps()}>
					{row.cells.map((cell) => (
						<td {...cell.getCellProps()} className="col">
							{cell.render("Cell")}</td>
					))}
					<td className="col">
						<Link
							to={`/users-request/${row.original._id}`}
						>
						<Button>
						Edit
						</Button>
						</Link>
					</td>
					</tr>
				);
				})}
			</tbody>
			</table>
		</div>
	);
};

export default RequestTable;
