import "@tanstack/react-table";
import type { RowData } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    align?: "left" | "center" | "right";
    className?: string;
  }

  interface TableMeta<TData extends RowData> {
    updateRow?: (updatedData: TData) => void;
    deleteRow?: (deletedData: TData) => void;
    getRowData?: (rowData: TData) => void;

    _unusedTData?: TData;
  }
}
