import { useParams } from 'react-router-dom';
import { useDpgf, useDpgfStructure, DpgfStructure } from '../hooks/useDpgf';
import { useMemo, useState } from 'react';

// Fonction pour formater les prix de façon robuste
const formatPrice = (price: any): string => {
  if (price === null || price === undefined) return '0.00';
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
};

export default function DpgfView() {
  const { id = '' } = useParams();
  const { data: dpgfStructure, isLoading, error } = useDpgfStructure(id);
  const [viewMode, setViewMode] = useState<'byLots' | 'excel'>('byLots');
  
  // Calculer le total général du DPGF - Déplacé avant les instructions conditionnelles
  const totalGeneral = useMemo(() => {
    let total = 0;
    
    if (dpgfStructure && dpgfStructure.lots) {
      dpgfStructure.lots.forEach(lot => {
        if (lot.sections) {
          lot.sections.forEach(section => {
            if (section.elements) {
              section.elements.forEach(element => {
                total += element.prix_total_ht || 0;
              });
            }
          });
        }
      });
    }
    
    return total;
  }, [dpgfStructure]);
  
  if (isLoading) return <div className="p-4 text-center">Chargement du DPGF...</div>;
  if (error) return <div className="p-4 text-center text-red-600">Erreur lors du chargement du DPGF</div>;
  if (!dpgfStructure) return <div className="p-4 text-center">DPGF non trouvé</div>;

  return (
    <div className="space-y-6 p-4">
      <div className="bg-white p-4 rounded shadow">
        <h1 className="text-2xl font-semibold">{dpgfStructure.nom_projet}</h1>
        <div className="mt-2 text-gray-600">          <p>Client: <span className="font-medium">{dpgfStructure.client?.nom_client}</span></p>
          <p>Date: <span className="font-medium">{new Date(dpgfStructure.date_dpgf).toLocaleDateString()}</span></p>
          <p>Statut: <span className="font-medium">{dpgfStructure.statut_offre || "Non défini"}</span></p>
          <p>Total: <span className="font-medium">{formatPrice(totalGeneral)} €</span></p>
        </div>
        
        <div className="mt-4 flex gap-2">
          <button 
            className={`px-4 py-2 rounded ${viewMode === 'byLots' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setViewMode('byLots')}
          >
            Vue Hiérarchique
          </button>
          <button 
            className={`px-4 py-2 rounded ${viewMode === 'excel' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setViewMode('excel')}
          >
            Vue Excel
          </button>
        </div>
      </div>
      
      {viewMode === 'byLots' ? (
        <HierarchicalView dpgfStructure={dpgfStructure} />
      ) : (
        <ExcelView dpgfStructure={dpgfStructure} />
      )}
    </div>
  );
}

function HierarchicalView({ dpgfStructure }: { dpgfStructure: DpgfStructure }) {
  if (!dpgfStructure.lots || dpgfStructure.lots.length === 0) {
    return (
      <div className="bg-white p-4 rounded shadow text-center">
        Aucun lot trouvé pour ce DPGF
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {dpgfStructure.lots.map(lot => (
        <LotView key={lot.id_lot} lot={lot} />
      ))}
    </div>
  );
}

function LotView({ lot }: { lot: DpgfStructure['lots'][0] }) {
  // Calculer le total du lot
  const totalLot = useMemo(() => {
    let total = 0;
    
    if (lot.sections) {
      lot.sections.forEach(section => {
        if (section.elements) {
          section.elements.forEach(element => {
            total += element.prix_total_ht || 0;
          });
        }
      });
    }
    
    return total;
  }, [lot]);

  return (
    <div className="rounded border bg-white shadow">
      <div className="bg-gray-50 p-3 border-b">
        <h2 className="text-lg font-semibold">
          Lot {lot.numero_lot} - {lot.nom_lot}
        </h2>
      </div>
      
      <div className="divide-y">
        {!lot.sections || lot.sections.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Aucune section dans ce lot
          </div>
        ) : (
          lot.sections.map(section => <SectionView key={section.id_section} section={section} />)
        )}
      </div>
      
      <div className="p-3 border-t bg-gray-50 flex justify-between items-center">
        <span className="font-medium">Total du lot</span>
        <span className="text-lg font-semibold">{formatPrice(totalLot)} €</span>
      </div>
    </div>
  );
}

function SectionView({ section }: { section: DpgfStructure['lots'][0]['sections'][0] }) {
  // Calculer le total de la section
  const sectionTotal = useMemo(() => {
    let total = 0;
    
    if (section.elements) {
      section.elements.forEach(element => {
        total += element.prix_total_ht || 0;
      });
    }
    
    return total;
  }, [section]);

  // Calculer l'indentation en fonction du niveau hiérarchique
  const indentationStyle = {
    marginLeft: `${(section.niveau_hierarchique - 1) * 20}px`
  };

  return (
    <div className="p-4" style={indentationStyle}>
      <div className="font-medium pb-2 text-gray-700">
        {section.numero_section && <span className="mr-2">{section.numero_section}</span>}
        {section.titre_section}
      </div>
      
      {!section.elements || section.elements.length === 0 ? (
        <div className="text-center text-sm text-gray-500 p-2">
          Aucun élément dans cette section
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Désignation</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unité</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qté</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">PU HT</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total HT</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {section.elements.map(element => (
                <tr key={element.id_element} className="hover:bg-gray-50">
                  <td className="px-3 py-2">{element.designation_exacte}</td>
                  <td className="px-3 py-2 text-right">{element.unite}</td>
                  <td className="px-3 py-2 text-right">{element.quantite}</td>
                  <td className="px-3 py-2 text-right">{formatPrice(element.prix_unitaire_ht)} €</td>
                  <td className="px-3 py-2 text-right font-medium">{formatPrice(element.prix_total_ht)} €</td>
                </tr>
              ))}
              <tr className="bg-gray-50">
                <td colSpan={4} className="px-3 py-2 text-right font-medium">Total section</td>
                <td className="px-3 py-2 text-right font-semibold">{formatPrice(sectionTotal)} €</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ExcelView({ dpgfStructure }: { dpgfStructure: DpgfStructure }) {
  // Préparer les données pour la vue Excel (format plat)
  const flatElements = useMemo(() => {
    const elements: {
      lotId: number;
      lotNumero: string;
      lotNom: string;
      sectionId: number;
      sectionNumero: string;
      sectionTitre: string;
      sectionNiveau: number;
      element: DpgfStructure['lots'][0]['sections'][0]['elements'][0];
    }[] = [];
    
    if (dpgfStructure.lots) {
      dpgfStructure.lots.forEach(lot => {
        if (lot.sections) {
          lot.sections.forEach(section => {
            if (section.elements) {
              section.elements.forEach(element => {
                elements.push({
                  lotId: lot.id_lot,
                  lotNumero: lot.numero_lot,
                  lotNom: lot.nom_lot,
                  sectionId: section.id_section,
                  sectionNumero: section.numero_section,
                  sectionTitre: section.titre_section,
                  sectionNiveau: section.niveau_hierarchique,
                  element
                });
              });
            }
          });
        }
      });
    }
    
    return elements;
  }, [dpgfStructure]);
    // Calculer le grand total
  const grandTotal = useMemo(() => {
    return flatElements ? flatElements.reduce((total, item) => total + (item.element.prix_total_ht || 0), 0) : 0;
  }, [flatElements]);
  
  if (!flatElements || flatElements.length === 0) {
    return (
      <div className="bg-white p-8 rounded shadow text-center">
        <p className="text-gray-500">Aucun élément trouvé pour ce DPGF</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded shadow">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Détails des éléments du DPGF (Format Excel)</h2>
        <p className="text-sm text-gray-600 mb-4">
          Ce tableau affiche tous les éléments d'ouvrage appartenant à ce DPGF, organisés par lot et par section.
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Lot</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom Lot</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Section</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre Section</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Désignation</th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unité</th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qté</th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">PU HT</th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total HT</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {flatElements.map((item) => {
              const isEvenLot = item.lotId % 2 === 0;
              const bgColorClass = isEvenLot ? 'bg-gray-50' : 'bg-white';
              
              return (
                <tr 
                  key={item.element.id_element} 
                  className={`hover:bg-blue-50 ${bgColorClass}`}
                >
                  <td className="px-3 py-2 whitespace-nowrap font-medium">
                    {item.lotNumero}
                  </td>
                  <td className="px-3 py-2">
                    {item.lotNom}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {item.sectionNumero}
                  </td>
                  <td className="px-3 py-2">
                    <div style={{ marginLeft: `${(item.sectionNiveau - 1) * 12}px` }}>
                      {item.sectionTitre}
                    </div>
                  </td>
                  <td className="px-3 py-2">{item.element.designation_exacte}</td>
                  <td className="px-3 py-2 text-right">{item.element.unite}</td>
                  <td className="px-3 py-2 text-right">{item.element.quantite}</td>
                  <td className="px-3 py-2 text-right">{formatPrice(item.element.prix_unitaire_ht)} €</td>
                  <td className="px-3 py-2 text-right font-medium">{formatPrice(item.element.prix_total_ht)} €</td>
                </tr>
              );
            })}
            <tr className="bg-gray-100 font-semibold">
              <td colSpan={8} className="px-3 py-3 text-right">TOTAL GÉNÉRAL</td>
              <td className="px-3 py-3 text-right text-lg">{formatPrice(grandTotal)} €</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
