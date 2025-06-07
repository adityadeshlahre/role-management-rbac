import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  getFilteredRowModel,
  FilterFn,
} from "@tanstack/react-table";
import { User } from "@repo/types";
import { useUsersQuery } from "../../hooks/queries/useUsersQuery";
import { useDebounce } from "../../hooks/useDebounce";
import { rankItem } from "@tanstack/match-sorter-utils";
import { useNavigate } from "react-router-dom";

export const UserTable: React.FC = () => {
  const { data: users = [], isLoading, isError } = useUsersQuery();
  const [globalFilter, setGlobalFilter] = useState("");
  const debouncedFilter = useDebounce(globalFilter, 300);
  const navigate = useNavigate();

  const fuzzyFilter: FilterFn<any> = (row, columnId, value) => {
    return rankItem(row.getValue(columnId), value).passed;
  };

  const columns = React.useMemo<ColumnDef<User>[]>(
    () => [
      {
        header: "Name",
        accessorKey: "name",
      },
      {
        header: "Email",
        accessorKey: "email",
      },
      {
        header: "Role",
        accessorKey: "role.name",
        cell: ({ row }) => row.original.role?.name || "—",
      },
      {
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              className="text-blue-600 hover:underline"
              onClick={() => {
                navigate(`/users/edit/${row.original.id}`);
              }}
            >
              Edit
            </button>
            <button
              className="text-red-600 hover:underline"
              onClick={() => {
                navigate(`/users/delete/${row.original.id}`);
              }}
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: debouncedFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
  });

  if (isLoading) return <p>Loading users...</p>;
  if (isError) return <p>Failed to load users.</p>;

  return (
    <div className="rounded-xl border p-4 shadow-sm bg-white">
      <h2 className="text-lg font-semibold mb-4">Users</h2>
      <input
        type="text"
        placeholder="Search users..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="mb-4 w-full p-2 border rounded-md shadow-sm"
      />
      <table className="min-w-full text-left text-sm">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="p-2 font-medium text-gray-700">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-t hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-2 text-gray-800">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
