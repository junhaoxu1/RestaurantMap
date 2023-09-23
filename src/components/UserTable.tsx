import React from "react";
import Form from "react-bootstrap/esm/Form";
import { useTable, Column } from "react-table";
import useAuth from "../hooks/useAuth";
import { UpdateUserFormData } from "../types/User.types";
import { useForm } from "react-hook-form";

interface RowData {
  documentId: string;
  email: string;
  admin: boolean;
  name: string;
}

interface AdminTableProps {
  data: RowData[];
  onAdminStatusToggle: (documentId: string, newAdminStatus: boolean) => void;
}

//Lägg till kolumner inne i table
const AdminTable: React.FC<AdminTableProps> = ({ data, onAdminStatusToggle }) => {
	const { currentUser } = useAuth()
	const {
		register,
		formState: { errors },
	} = useForm<UpdateUserFormData>({
		defaultValues: {
			email: currentUser?.email ?? "",
			name: currentUser?.displayName ?? "",
		},
	})

  const columns: Column<RowData>[] = React.useMemo(
    () => [
      {
        Header: "User",
        accessor: "email",
      },
	  {
		Header: "Name",
		accessor: "name",
		Cell: ({ row }) => (
			<Form>
			<Form.Label>{row.original.name}</Form.Label>
				<Form.Control
					style={{width: "50%"}}
					placeholder={row.original.name ? `${row.original.name}`: "null"}
					{...register('name')}
				/>
				{errors.name && <p className="invalid">{errors.name.message ?? "Invalid value"}</p>}
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
