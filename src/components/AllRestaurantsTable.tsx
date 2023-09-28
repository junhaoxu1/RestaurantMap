import React, { useState, useEffect } from "react"
import { useTable, Column } from "react-table"
import Button from "react-bootstrap/Button"
import { Link } from "react-router-dom"

interface RowData {
	_id: string
	address: string
	category: string
	city: string
	description: string
	email?: string
	facebook?: string
	instagram?: string
	name: string
	phone: string
	supply: string
	webpage: string
	geolocation: {
		lat: number
		lng: number
	}
	cover_photo?: string
}

interface RestaurantTableProps {
	data: RowData[]
}

const AllRestaurantsTable: React.FC<RestaurantTableProps> = ({ data }) => {

	const columns: Column<RowData>[] = React.useMemo(
		() => [
		{
			Header: "Name",
			accessor: "name",
			sortby: true,
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
		],
		[]
	)

	const [sortedRowArrayD, setSortedRowArrayD] = useState(data)


	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
	} = useTable({
		columns,
		data: sortedRowArrayD,
	},
	)

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

	useEffect(() => {
		setSortedRowArrayD(data);
	  }, [data]);

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
			prepareRow(row)
			return (
				<tr {...row.getRowProps()}>
				{row.cells.map((cell) => (
					<td {...cell.getCellProps()} className="col">
						{cell.render("Cell")}</td>
				))}
				<td className="col">
					<Link
						to={`/admin-restaurants/${row.original._id}`}
					>
					<Button
					>
					Edit
					</Button>
					</Link>
				</td>
				</tr>
			)
			})}
		</tbody>
		</table>
	)
}

export default AllRestaurantsTable
