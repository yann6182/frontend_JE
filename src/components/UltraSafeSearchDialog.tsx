import React, { useState, useEffect } from 'react';
import { useSimpleElementSearch } from '../hooks/useSimpleSearch';
import { ElementCard } from './ElementCard';
import { SafeElementData } from '../utils/elementUtils';
import ErrorBoundary from './ErrorBoundary';

interface UltraSafeSearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectElement?: (element: SafeElementData) => void;
}

export function UltraSafeSearchDialog({ isOpen, onClose, onSelectElement }: UltraSafeSearchDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [hasError, setHasError] = useState(false);

  // Debounce de la recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchTerm);
      setHasError(false); // Reset error on new search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const searchQuery = useSimpleElementSearch(
    debouncedQuery, 
    isOpen && debouncedQuery.length > 2
  );

  if (!isOpen) return null;

  const handleSelectElement = (element: SafeElementData) => {
    try {
      onSelectElement?.(element);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sélection:', error);
      setHasError(true);
    }
  };

  const safeResults = (() => {
    try {
      if (!searchQuery.data || !Array.isArray(searchQuery.data)) {
        return [];
      }
      return searchQuery.data.slice(0, 50); // Limite sécurisée
    } catch (error) {
      console.error('Erreur lors du traitement des résultats:', error);
      setHasError(true);
      return [];
    }
  })();

  return (
    <ErrorBoundary>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">🔍 Recherche Sécurisée</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold p-2 rounded-full hover:bg-gray-100"
              title="Fermer"
            >
              ✕
            </button>
          </div>

          {/* Messages d'état */}
          {hasError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">
                ⚠️ Une erreur s'est produite. Veuillez recharger la page si le problème persiste.
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Recharger la page
              </button>
            </div>
          )}

          {/* Formulaire de recherche */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rechercher un élément d'ouvrage
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                try {
                  setSearchTerm(e.target.value);
                } catch (error) {
                  console.error('Erreur lors de la saisie:', error);
                }
              }}
              placeholder="Tapez au moins 3 caractères..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              autoFocus
              maxLength={100} // Limite sécurisée
            />
            <p className="text-sm text-gray-500 mt-1">              {searchTerm.length < 3
                ? `Tapez encore ${3 - searchTerm.length} caractère(s)`
                : `${safeResults.length} résultat(s) trouvé(s)`
              }
            </p>
          </div>

          {/* Résultats */}
          <div className="space-y-4">
            {searchQuery.isLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                <span className="text-gray-600">Recherche en cours...</span>
              </div>
            )}

            {searchQuery.error && !hasError ? (
              <div className="text-red-600 bg-red-50 p-4 rounded-lg">
                <p className="font-medium">Erreur de recherche</p>
                <p className="text-sm mt-1">
                  La recherche a échoué. Vérifiez votre connexion internet.
                </p>
                <details className="mt-2">
                  <summary className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                    Détails de l'erreur
                  </summary>
                  <pre className="text-xs mt-1 text-gray-600 overflow-auto">
                    {String(searchQuery.error)}
                  </pre>
                </details>
                <button 
                  onClick={() => setHasError(true)}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  Signaler le problème
                </button>
              </div>
            ) : null}

            {!searchQuery.isLoading && !searchQuery.error && !hasError && (
              <>
                {safeResults.length === 0 && debouncedQuery.length >= 3 && (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">🔍</div>
                    <p>Aucun résultat trouvé pour "{debouncedQuery}"</p>
                    <p className="text-sm mt-1">Essayez avec d'autres termes</p>
                  </div>
                )}

                {safeResults.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <span>📋 Résultats ({safeResults.length})</span>
                      {safeResults.length >= 50 && (
                        <span className="text-sm text-orange-600">(50 premiers résultats)</span>
                      )}
                    </h3>
                    <div className="max-h-96 overflow-y-auto space-y-3">
                      {safeResults.map((element: SafeElementData, index: number) => {
                        try {
                          return (
                            <ElementCard
                              key={element.id_element || `fallback-${index}`}
                              element={element}
                              onClick={() => handleSelectElement(element)}
                              className="hover:shadow-md"
                            />
                          );
                        } catch (error) {
                          console.error('Erreur lors du rendu de l\'élément:', error);
                          return (
                            <div key={`error-${index}`} className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                              ⚠️ Erreur lors de l'affichage de l'élément #{index + 1}
                            </div>
                          );
                        }
                      })}
                    </div>
                  </div>
                )}
              </>
            )}

            {debouncedQuery.length < 3 && !searchQuery.isLoading && !hasError && (
              <div className="text-center py-8 text-gray-400">
                <div className="text-4xl mb-2">🔍</div>
                <p>Commencez à taper pour rechercher</p>
                <p className="text-sm mt-1">Minimum 3 caractères requis</p>
              </div>
            )}
          </div>

          {/* Informations de debug (en bas) */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <details className="text-sm text-gray-500">
              <summary className="cursor-pointer hover:text-gray-700">
                Informations de diagnostic
              </summary>
              <div className="mt-2 space-y-1">
                <div>Status: {searchQuery.status}</div>
                <div>Requête: "{debouncedQuery}"</div>
                <div>Résultats: {safeResults.length}</div>
                <div>Erreur: {hasError ? 'Oui' : 'Non'}</div>
              </div>
            </details>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
