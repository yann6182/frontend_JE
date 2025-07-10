import { ReactNode } from 'react';

interface Column<T> {
  key: keyof T;
  header: ReactNode;
  render?: (item: T) => ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField?: keyof T;
}

export function DataTable<T>({ 
  data, 
  columns, 
  keyField 
}: DataTableProps<T>) {
  // Fonction pour obtenir la clé unique d'une ligne
  const getRowKey = (row: T, index: number): string => {
    if (keyField && row[keyField] != null) {
      return String(row[keyField]);
    }
    // Fallback vers 'id' si disponible
    if (typeof row === 'object' && row != null && 'id' in row && (row as any).id != null) {
      return String((row as any).id);
    }
    // Fallback vers l'index si aucune clé n'est disponible
    return String(index);
  };
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
        {data.map((row, index) => {
          const rowKey = getRowKey(row, index);
          return (
            <tr key={rowKey} className="hover:bg-slate-50">
              {columns.map(col => (
                <td key={`${rowKey}-${String(col.key)}`} className="px-3 py-2 text-sm text-slate-700">
                  {col.render ? col.render(row) : String(row[col.key])}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
