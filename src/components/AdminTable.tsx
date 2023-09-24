import React from "react";
import Form from "react-bootstrap/esm/Form";
import { useTable, Column } from "react-table";
import useAuth from "../hooks/useAuth";
import { UpdateUserFormData } from "../types/User.types";
import { useForm } from "react-hook-form";
import Button from 'react-bootstrap/Button'
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
  onAdminNameToggle: (documentId: string, newName: string) => void;
}

//Lägg till kolumner inne i table
const AdminTable: React.FC<AdminTableProps> = ({ data, onAdminStatusToggle, onAdminNameToggle }) => {
	const { currentUser } = useAuth()
	const {
		formState: { errors },
	} = useForm<UpdateUserFormData>({
		defaultValues: {
			email: currentUser?.email ?? "",
			name: currentUser?.displayName ?? "",
		},
	})

	if (!currentUser) {
		return <p>Failed</p>
	}

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
			<Form>
				<Form.Group>
				<div className="profile-photo-wrapper text-center my-2">
					<div className="d-flex">
						<Image src={row.original.photoFile || "https://via.placeholder.com/225"} fluid rounded className="img-square w-50" />
					</div>
				</div>
				<Form.Label>{row.original.name ? `${row.original.name}` : "(no name)"}</Form.Label>
					<Form.Control
						style={{width: "50%"}}
						placeholder={row.original.name ? `${row.original.name}`: "null"}
						defaultValue={row.original.name || ""}
						onChange={(e) => {
							const newName = e.target.value
							row.original.name = newName
						}}
					/>
					{errors.name && <p className="invalid">{errors.name.message ?? "Invalid value"}</p>}
				</Form.Group>
				<Button 
					variant="primary" 
					onClick={() => {
						const documentId = row.original.documentId;
						const newUsername = row.original.name
						onAdminNameToggle(documentId, newUsername)
					}}
					>
						Update 
				</Button>
			</Form>
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

  //useTable från react-table innehåller dessa variablar för att kunna rendera ut en table
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
    <table {...getTableProps()} className="table">
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
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
