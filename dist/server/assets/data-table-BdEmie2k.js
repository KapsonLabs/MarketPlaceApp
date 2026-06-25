import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useReactTable, getSortedRowModel, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-D9UBOVre.js";
import { c as cn } from "./button-BmLZMIt9.js";
function cellAlign(meta) {
  if (meta?.align === "right") return "text-right";
  if (meta?.align === "center") return "text-center";
  return void 0;
}
function DataTable({
  columns,
  data,
  emptyMessage = "No results.",
  onRowClick,
  className
}) {
  const [sorting, setSorting] = useState([]);
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  });
  return /* @__PURE__ */ jsx("div", { className: cn("w-full overflow-auto", className), children: /* @__PURE__ */ jsxs(Table, { children: [
    /* @__PURE__ */ jsx(TableHeader, { children: table.getHeaderGroups().map((headerGroup) => /* @__PURE__ */ jsx(TableRow, { children: headerGroup.headers.map((header) => /* @__PURE__ */ jsx(
      TableHead,
      {
        className: cn(
          "whitespace-nowrap",
          cellAlign(header.column.columnDef.meta)
        ),
        children: header.isPlaceholder ? null : header.column.getCanSort() ? /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            className: "inline-flex items-center gap-1 hover:text-foreground",
            onClick: header.column.getToggleSortingHandler(),
            children: [
              flexRender(header.column.columnDef.header, header.getContext()),
              /* @__PURE__ */ jsx(SortIcon, { direction: header.column.getIsSorted() })
            ]
          }
        ) : flexRender(header.column.columnDef.header, header.getContext())
      },
      header.id
    )) }, headerGroup.id)) }),
    /* @__PURE__ */ jsx(TableBody, { children: table.getRowModel().rows.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(
      TableCell,
      {
        colSpan: columns.length,
        className: "h-24 text-center text-sm text-muted-foreground",
        children: emptyMessage
      }
    ) }) : table.getRowModel().rows.map((row) => /* @__PURE__ */ jsx(
      TableRow,
      {
        className: cn(onRowClick && "cursor-pointer"),
        onClick: onRowClick ? () => onRowClick(row.original) : void 0,
        children: row.getVisibleCells().map((cell) => /* @__PURE__ */ jsx(
          TableCell,
          {
            className: cellAlign(cell.column.columnDef.meta),
            children: flexRender(cell.column.columnDef.cell, cell.getContext())
          },
          cell.id
        ))
      },
      row.id
    )) })
  ] }) });
}
function SortIcon({ direction }) {
  if (direction === "asc") return /* @__PURE__ */ jsx(ArrowUp, { className: "h-3.5 w-3.5" });
  if (direction === "desc") return /* @__PURE__ */ jsx(ArrowDown, { className: "h-3.5 w-3.5" });
  return /* @__PURE__ */ jsx(ArrowUpDown, { className: "h-3.5 w-3.5 opacity-40" });
}
export {
  DataTable as D
};
