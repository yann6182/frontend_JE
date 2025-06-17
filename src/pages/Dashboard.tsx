import { Link } from 'react-router-dom';
import { DataTable } from '../components/DataTable';
import { UploadDropzone } from '../components/UploadDropzone';
import { Button } from '../components/Button';
import { useDpgfs } from '../hooks/useDpgf';
import { AddClientDialog } from '../components/AddClientDialog';
import { AddDpgfDialog } from '../components/AddDpgfDialog';

export default function Dashboard() {
  const { data = [], isLoading } = useDpgfs();

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <AddClientDialog />
        <AddDpgfDialog />
        <Button variant="outline" onClick={() => window.location.reload()}>
          Rafraîchir
        </Button>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h1 className="text-xl font-semibold mb-2">DPGF</h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <DataTable
            data={data}
            columns={[
              { key: 'nom_projet', header: 'Projet' },
              { key: 'date_dpgf', header: 'Date' },
              {
                key: 'id_dpgf',
                header: 'Action',
                render: row => (
                  <Link to={`/dpgf/${row.id_dpgf}`} className="text-blue-600 hover:underline">
                    View
                  </Link>
                )
              }
            ]}
          />
        )}
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Créer nouveau DPGF depuis un fichier</h2>
        <UploadDropzone onUploaded={() => {}} />
      </div>
    </div>
  );
}
