import React, { useState } from 'react';
import { ElementSearchDialog } from '../components/ElementSearchDialog';
import { ElementSearchResult } from '../hooks/useElementSearch';

export function ElementSearchPage() {
  const [selectedElement, setSelectedElement] = useState<ElementSearchResult | null>(null);

  const handleSelectElement = (element: ElementSearchResult) => {
    setSelectedElement(element);
    console.log('Élément sélectionné:', element);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(price);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🔍 Recherche d'Éléments d'Ouvrage
        </h1>
        
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Fonctionnalités de recherche</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl mb-2">🔍</div>
              <h3 className="font-semibold text-blue-900">Recherche Fuzzy</h3>
              <p className="text-sm text-blue-700 mt-2">
                Trouvez des éléments même avec des fautes de frappe ou des variations de nom
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-semibold text-green-900">Analyse Historique</h3>
              <p className="text-sm text-green-700 mt-2">
                Obtenez les prix moyens par année et les tendances d'évolution
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl mb-2">💰</div>
              <h3 className="font-semibold text-purple-900">Recherche par Prix</h3>
              <p className="text-sm text-purple-700 mt-2">
                Trouvez des éléments avec des prix similaires pour comparer
              </p>
            </div>
          </div>
        </div>

        {selectedElement && (
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">✅ Élément sélectionné</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedElement.designation_exacte}</h3>
                  <p className="text-gray-600 mt-1">
                    <strong>Projet:</strong> {selectedElement.dpgf_info.nom_projet}
                  </p>
                  <p className="text-gray-600">
                    <strong>Lot:</strong> {selectedElement.lot_info.nom_lot}
                  </p>
                  <p className="text-gray-600">
                    <strong>Section:</strong> {selectedElement.section_info.titre_section}
                  </p>
                  <p className="text-gray-600">
                    <strong>Date:</strong> {selectedElement.dpgf_info.date_dpgf}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    {formatPrice(selectedElement.prix_unitaire_ht)} / {selectedElement.unite}
                  </div>
                  <p className="text-gray-600">
                    <strong>Quantité:</strong> {selectedElement.quantite}
                  </p>
                  <p className="text-gray-600">
                    <strong>Prix total:</strong> {formatPrice(selectedElement.prix_total_ht)}
                  </p>
                  {selectedElement.similarity_score && (
                    <p className="text-blue-600 mt-2">
                      <strong>Score de similarité:</strong> {selectedElement.similarity_score}%
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors"
          >
            🔍 Ouvrir la recherche
          </button>
        </div>

        <ElementSearchDialog
          isOpen={true}
          onClose={() => {}}
          onSelectElement={handleSelectElement}
        />
      </div>
    </div>
  );
}
