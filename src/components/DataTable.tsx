import { ReactNode } from 'react';

interface Column<T> {
  key: keyof T;
  header: ReactNode;
  render?: (item: T) => ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
}

export function DataTable<T extends { id: string | number }>({ data, columns }: DataTableProps<T>) {
  return (
    <table className="min-w-full divide-y divide-slate-200">
      <thead className="bg-slate-50">
        <tr>
          {columns.map(col => (
            <th key={String(col.key)} className="px-3 py-2 text-left text-sm font-semibold text-slate-700">
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-200 bg-white">
        {data.map(row => (
          <tr key={row.id} className="hover:bg-slate-50">
            {columns.map(col => (
              <td key={String(col.key)} className="px-3 py-2 text-sm text-slate-700">
                {col.render ? col.render(row) : String(row[col.key])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
