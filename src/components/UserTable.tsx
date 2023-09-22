import React from "react";
import { useTable, Column } from "react-table";

interface RowData {
  documentId: string;
  email: string; 
  admin: boolean;
}

interface AdminTableProps {
  data: RowData[];
  onAdminStatusToggle: (documentId: string, newAdminStatus: boolean) => void;
}

const AdminTable: React.FC<AdminTableProps> = ({ data, onAdminStatusToggle }) => {
  const columns: Column<RowData>[] = React.useMemo(
    () => [
      {
        Header: "User",
        accessor: "email", 
      },
      {
        Header: "Role",
        accessor: "admin",
        Cell: ({ row }) => (
          <button
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
    </table>
  );
};

export default AdminTable;