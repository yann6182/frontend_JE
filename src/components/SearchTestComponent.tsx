import React, { useState } from 'react';
import { useSimpleElementSearch, useApiTest } from '../hooks/useSimpleSearch';
import { api } from '../services/api';
import ErrorBoundary from './ErrorBoundary';

export function SearchTestComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);

  const apiTest = useApiTest();
  const searchResults = useSimpleElementSearch(searchTerm, isSearchEnabled);

  return (
    <ErrorBoundary>
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">🧪 Test de Recherche - Diagnostic</h2>
        
        {/* Test de connectivité API */}
        <div className="mb-6 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-3">🌐 Test de connectivité API</h3>
          {apiTest.isLoading && (
            <div className="text-blue-600">⏳ Test de connexion en cours...</div>
          )}
          {apiTest.error && (
            <div className="text-red-600 bg-red-50 p-3 rounded">
              ❌ Erreur de connexion: {apiTest.error instanceof Error ? apiTest.error.message : 'Erreur inconnue'}
            </div>
          )}
          {apiTest.data && (
            <div className={`p-3 rounded ${
              apiTest.data.status === 'success' 
                ? 'text-green-600 bg-green-50' 
                : 'text-red-600 bg-red-50'
            }`}>
              {apiTest.data.status === 'success' 
                ? '✅ API accessible' 
                : `❌ Erreur API: ${apiTest.data.error}`
              }
            </div>
          )}
        </div>

        {/* Formulaire de test */}
        <div className="mb-6 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-3">🔍 Test de recherche</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Terme de recherche
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Entrez un terme de recherche..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSearchEnabled(!isSearchEnabled)}
                className={`px-4 py-2 rounded ${
                  isSearchEnabled 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isSearchEnabled ? '⏹️ Arrêter' : '▶️ Démarrer'} la recherche
              </button>
              
              <div className="text-sm text-gray-600">
                Status: {isSearchEnabled ? 'Activé' : 'Désactivé'}
              </div>
            </div>
          </div>
        </div>

        {/* Résultats */}
        {isSearchEnabled && (
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-semibold mb-3">📊 Résultats</h3>
            
            {searchResults.isLoading && (
              <div className="text-blue-600">⏳ Recherche en cours...</div>
            )}
            
            {searchResults.error && (
              <div className="text-red-600 bg-red-50 p-3 rounded">
                ❌ Erreur de recherche: {String(searchResults.error)}
              </div>
            )}
            
            {searchResults.data && (
              <div>
                <div className="text-green-600 bg-green-50 p-3 rounded mb-4">
                  ✅ Recherche réussie - {searchResults.data.length} élément(s) trouvé(s)
                </div>
                
                {searchResults.data.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Premiers résultats :</h4>
                    {searchResults.data.slice(0, 5).map((item: any, index: number) => (
                      <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                        <strong>#{item.id_element || index}</strong>: {item.designation_exacte || 'N/A'}
                        {item.prix_unitaire_ht && (
                          <span className="text-green-600 ml-2">
                            - {item.prix_unitaire_ht}€
                          </span>
                        )}
                      </div>
                    ))}
                    {searchResults.data.length > 5 && (
                      <div className="text-gray-500 text-sm">
                        ... et {searchResults.data.length - 5} autres
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Informations de debugging */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">🔧 Informations de debugging</h3>
          <div className="text-sm space-y-1">
            <div>URL de base API: {api.defaults.baseURL || 'Non définie'}</div>
            <div>Terme de recherche: "{searchTerm}"</div>
            <div>Recherche activée: {isSearchEnabled ? 'Oui' : 'Non'}</div>
            <div>Status API Test: {apiTest.status}</div>
            <div>Status Recherche: {searchResults.status}</div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
