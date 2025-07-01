import React, { useState, useEffect } from 'react';
import { useSimpleElementSearch } from '../hooks/useSimpleSearch';
import { ElementCard } from './ElementCard';
import { SafeElementData } from '../utils/elementUtils';
import ErrorBoundary from './ErrorBoundary';

interface SimpleSearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectElement?: (element: SafeElementData) => void;
}

export function SimpleSearchDialog({ isOpen, onClose, onSelectElement }: SimpleSearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce de la recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: results = [], isLoading, error } = useSimpleElementSearch(
    debouncedQuery, 
    isOpen && debouncedQuery.length > 2
  );

  if (!isOpen) return null;

  const handleSelectElement = (element: SafeElementData) => {
    onSelectElement?.(element);
    onClose();
  };

  return (
    <ErrorBoundary>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">🔍 Recherche Simple</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold p-2 rounded-full hover:bg-gray-100"
            >
              ✕
            </button>
          </div>

          {/* Formulaire de recherche */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rechercher un élément d'ouvrage
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tapez au moins 3 caractères pour commencer la recherche..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              autoFocus
            />
            <p className="text-sm text-gray-500 mt-1">
              {searchQuery.length < 3 
                ? `Tapez encore ${3 - searchQuery.length} caractère(s)`
                : `${results.length} résultat(s) trouvé(s)`
              }
            </p>
          </div>

          {/* Résultats */}
          <div className="space-y-4">
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                <span className="text-gray-600">Recherche en cours...</span>
              </div>
            )}

            {error && (
              <div className="text-red-600 bg-red-50 p-4 rounded-lg">
                <p className="font-medium">Erreur de recherche</p>
                <p className="text-sm mt-1">
                  {error instanceof Error ? error.message : String(error)}
                </p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  Recharger la page
                </button>
              </div>
            )}

            {!isLoading && !error && results.length === 0 && debouncedQuery.length >= 3 && (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">🔍</div>
                <p>Aucun résultat trouvé pour "{debouncedQuery}"</p>
                <p className="text-sm mt-1">Essayez avec d'autres mots-clés</p>
              </div>
            )}

            {!isLoading && !error && results.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Résultats de recherche ({results.length})
                </h3>
                <div className="max-h-96 overflow-y-auto space-y-3">
                  {results.map((element: SafeElementData, index: number) => (
                    <ElementCard
                      key={element.id_element || index}
                      element={element}
                      onClick={() => handleSelectElement(element)}
                      showSimilarity={false}
                      className="hover:shadow-md"
                    />
                  ))}
                </div>
              </div>
            )}

            {debouncedQuery.length < 3 && !isLoading && (
              <div className="text-center py-8 text-gray-400">
                <div className="text-4xl mb-2">🔍</div>
                <p>Commencez à taper pour rechercher des éléments d'ouvrage</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
