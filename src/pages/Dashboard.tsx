import { Link } from 'react-router-dom';
import { DataTable } from '../components/DataTable';
import { UploadDropzone } from '../components/UploadDropzone';
import { Button } from '../components/Button';
import { useDpgfs, useDpgfsDebug } from '../hooks/useDpgf';
import { testDpgfApi } from '../utils/dpgfApiTester';
import { AddClientDialog } from '../components/AddClientDialog';
import { AddDpgfDialog } from '../components/AddDpgfDialog';

export default function Dashboard() {
  const { data = [], isLoading } = useDpgfs({ getAllRecords: true });
  const debugQuery = useDpgfsDebug();

  const handleDebugClick = () => {
    console.log('🚀 Lancement du debug des DPGFs...');
    debugQuery.refetch();
  };

  const handleApiTestClick = () => {
    console.log('🧪 Lancement des tests API...');
    testDpgfApi.runAllTests();
  };

  const handleBatchTestClick = async () => {
    console.log('📦 Test de récupération par batch...');
    const allData = await testDpgfApi.getAllByBatch(100);
    console.log(`🎯 Total récupéré: ${allData.length} DPGFs`);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <AddClientDialog />
        <AddDpgfDialog />
        <Button variant="outline" onClick={() => window.location.reload()}>
          Rafraîchir
        </Button>
        
      </div>
      <div className="bg-white p-4 rounded shadow">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-xl font-semibold">DPGF</h1>
          <span className="text-sm text-gray-500">
            {isLoading ? 'Chargement...' : `${data.length} projet(s)`}
          </span>
        </div>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <DataTable
            data={data}
            keyField="id_dpgf"
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
      
    </div>
  );
}
