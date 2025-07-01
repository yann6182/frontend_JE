import React from 'react';
import { ElementSearchButton } from '../components/ElementSearchButton';
import { ElementSearchResult } from '../hooks/useElementSearch';

export function ExampleUsage() {
  const handleElementSelected = (element: ElementSearchResult) => {
    console.log('Élément sélectionné:', element);
    alert(`Élément sélectionné: ${element.designation_exacte} - ${element.prix_unitaire_ht}€/${element.unite}`);
  };

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4">Exemples d'utilisation</h3>
      
      <div className="space-y-4">
        {/* Bouton simple */}
        <div>
          <h4 className="font-medium mb-2">Bouton de recherche simple :</h4>
          <ElementSearchButton 
            onSelectElement={handleElementSelected}
          />
        </div>

        {/* Bouton personnalisé */}
        <div>
          <h4 className="font-medium mb-2">Bouton personnalisé :</h4>
          <ElementSearchButton 
            onSelectElement={handleElementSelected}
            buttonText="🏗️ Choisir un élément d'ouvrage"
            className="bg-green-600 hover:bg-green-700"
          />
        </div>

        {/* Utilisation dans un formulaire */}
        <div>
          <h4 className="font-medium mb-2">Dans un formulaire :</h4>
          <div className="border border-gray-300 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sélectionner un élément d'ouvrage
            </label>
            <ElementSearchButton 
              onSelectElement={handleElementSelected}
              buttonText="Rechercher..."
              className="w-full justify-center"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
