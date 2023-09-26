import React, { useState, useEffect } from "react"
import { useTable, Column } from "react-table"
import Button from "react-bootstrap/Button"
import { Link } from "react-router-dom"
import Image from "react-bootstrap/Image"

interface RowData {
	_id: string
	name: string
	user_photos?: {
		id: string
		photo: string
	}[]
}

interface RequestTableProps {
	data: RowData[]
}

const PhotoTable: React.FC<RequestTableProps> = ({ data }) => {
	const columns: Column<RowData>[] = React.useMemo(
		() => [
			{
				Header: "Name",
				accessor: "name",
				sortby: true,
			},
			{
				Header: "Photo",
				accessor: "user_photos",
				Cell: ({ row }) => (
					<>
						{row.original.user_photos?.map((photo, index) => (
							<Image key={index} src={photo.photo} height={"100px"} />
						))}
					</>
				),
			},
		],
		[]
	)

	const [sortedRowArrayD, setSortedRowArrayD] = useState(data)

	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
		columns,
		data: sortedRowArrayD,
	})

	const sortRowData = (colId: string) => {
		const sortRowArray = [...sortedRowArrayD].sort((a: any, b: any) => {
			const itemValueA = a[colId]
			const itemValueB = b[colId]

			if (typeof itemValueA === "string" && typeof itemValueB === "string") {
				// Sorting columns by alphabetical order in swedish characters
				return itemValueA.localeCompare(itemValueB, "sv", { sensitivity: "base" })
			} else if (typeof itemValueA === "number" && typeof itemValueB === "number") {
				// added same with numbers, its working kinda off
				return itemValueA - itemValueB
			} else {
				return 0
			}
		})
		setSortedRowArrayD(sortRowArray)
	}

	useEffect(() => {
		setSortedRowArrayD(data)
	}, [data])

	return (
		<table {...getTableProps()} className="table">
			<thead>
				{headerGroups.map((headerGroup) => (
					<tr {...headerGroup.getHeaderGroupProps()}>
						{headerGroup.headers.map((column) => (
							<th {...column.getHeaderProps()} onClick={() => sortRowData(column.id)}>
								{column.render("Header")}
							</th>
						))}
					</tr>
				))}
			</thead>
			<tbody {...getTableBodyProps()}>
				{rows.map((row) => {
					prepareRow(row)
					return (
						<tr {...row.getRowProps()}>
							{row.cells.map((cell) => (
								<td {...cell.getCellProps()} className="col">
									{cell.render("Cell")}
								</td>
							))}
							<td className="col">
								<Link to={`/photos-request/${row.original._id}`}>
									<Button>Edit</Button>
								</Link>
							</td>
						</tr>
					)
				})}
			</tbody>
		</table>
	)
}

export default PhotoTable
