import React, { useState, useEffect } from 'react';
import { 
  useElementFuzzySearch, 
  useHistoricalPriceAnalysis, 
  useSimilarPriceElements,
  ElementSearchResult,
  HistoricalPriceAnalysis 
} from '../hooks/useElementSearch';

interface ElementSearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectElement?: (element: ElementSearchResult) => void;
}

export function ElementSearchDialog({ isOpen, onClose, onSelectElement }: ElementSearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'fuzzy' | 'analysis' | 'price'>('fuzzy');
  const [minSimilarity, setMinSimilarity] = useState(70);
  const [targetPrice, setTargetPrice] = useState<number | ''>('');
  const [tolerancePercent, setTolerancePercent] = useState(20);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce de la recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { 
    data: fuzzyResults = [], 
    isLoading: fuzzyLoading,
    error: fuzzyError 
  } = useElementFuzzySearch(debouncedQuery, minSimilarity, 50, activeTab === 'fuzzy');

  const { 
    data: analysisData, 
    isLoading: analysisLoading,
    error: analysisError 
  } = useHistoricalPriceAnalysis(debouncedQuery, activeTab === 'analysis');

  const { 
    data: similarPriceResults = [], 
    isLoading: priceLoading,
    error: priceError 
  } = useSimilarPriceElements(
    typeof targetPrice === 'number' ? targetPrice : 0, 
    tolerancePercent, 
    undefined, 
    20, 
    activeTab === 'price'
  );

  if (!isOpen) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(price);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'hausse': return '📈';
      case 'baisse': return '📉';
      case 'stable': return '➡️';
      default: return '📊';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recherche d'Éléments d'Ouvrage</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Onglets */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('fuzzy')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'fuzzy'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🔍 Recherche Fuzzy
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analysis'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📊 Analyse Historique
            </button>
            <button
              onClick={() => setActiveTab('price')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'price'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              💰 Recherche par Prix
            </button>
          </nav>
        </div>

        {/* Formulaires de recherche */}
        {activeTab === 'fuzzy' && (
          <div className="mb-6 space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Désignation à rechercher
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ex: béton armé, carrelage, enduit..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="w-32">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Similarité min (%)
                </label>
                <input
                  type="number"
                  value={minSimilarity}
                  onChange={(e) => setMinSimilarity(Number(e.target.value))}
                  min="1"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Désignation pour analyse historique
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ex: béton armé, carrelage, enduit..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {activeTab === 'price' && (
          <div className="mb-6 space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix cible (€)
                </label>
                <input
                  type="number"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Ex: 100.50"
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="w-32">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tolérance (%)
                </label>
                <input
                  type="number"
                  value={tolerancePercent}
                  onChange={(e) => setTolerancePercent(Number(e.target.value))}
                  min="1"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Résultats */}
        <div className="space-y-4">
          {/* Recherche Fuzzy */}
          {activeTab === 'fuzzy' && (
            <>
              {fuzzyLoading && <div className="text-center py-8">🔍 Recherche en cours...</div>}
              {fuzzyError && (
                <div className="text-red-600 bg-red-50 p-4 rounded-md">
                  Erreur lors de la recherche: {String(fuzzyError)}
                </div>
              )}
              {fuzzyResults.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">
                    Résultats de recherche ({fuzzyResults.length})
                  </h3>
                  <div className="max-h-96 overflow-y-auto space-y-2">
                    {fuzzyResults.map((element) => (
                      <div
                        key={element.id_element}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                        onClick={() => onSelectElement?.(element)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{element.designation_exacte}</h4>
                            <p className="text-sm text-gray-600">
                              {element.dpgf_info?.nom_projet || 'Projet non spécifié'} - {element.lot_info?.nom_lot || 'Lot non spécifié'}
                            </p>
                            <p className="text-xs text-gray-500">
                              Section: {element.section_info?.titre_section || 'Section non spécifiée'}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">
                              {formatPrice(element.prix_unitaire_ht)} / {element.unite}
                            </div>
                            <div className="text-sm text-blue-600">
                              Similarité: {element.similarity_score}%
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {!fuzzyLoading && fuzzyResults.length === 0 && debouncedQuery && (
                <div className="text-center py-8 text-gray-500">
                  Aucun résultat trouvé pour "{debouncedQuery}"
                </div>
              )}
            </>
          )}

          {/* Analyse Historique */}
          {activeTab === 'analysis' && (
            <>
              {analysisLoading && <div className="text-center py-8">📊 Analyse en cours...</div>}
              {analysisError && (
                <div className="text-red-600 bg-red-50 p-4 rounded-md">
                  Erreur lors de l'analyse: {String(analysisError)}
                </div>
              )}
              {analysisData && (
                <div className="space-y-6">
                  {/* Résumé */}
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      📊 Analyse pour "{analysisData.designation}"
                      <span className="text-2xl">{getTrendIcon(analysisData.trend)}</span>
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">Éléments trouvés</div>
                        <div className="text-2xl font-bold">{analysisData.total_elements}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Prix moyen</div>
                        <div className="text-2xl font-bold text-green-600">
                          {formatPrice(analysisData.average_price)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Fourchette</div>
                        <div className="text-lg font-semibold">
                          {formatPrice(analysisData.min_price)} - {formatPrice(analysisData.max_price)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Unité courante</div>
                        <div className="text-xl font-bold">{analysisData.most_common_unit}</div>
                      </div>
                    </div>
                  </div>

                  {/* Moyennes par année */}
                  {analysisData?.yearly_averages && analysisData.yearly_averages.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold mb-3">📈 Évolution des prix par année</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {(analysisData?.yearly_averages || []).map((year) => (
                            <div key={year.year} className="bg-white p-3 rounded border">
                              <div className="text-sm font-medium">{year.year}</div>
                              <div className="text-lg font-bold text-green-600">
                                {formatPrice(year.average_price)}
                              </div>
                              <div className="text-xs text-gray-500">
                                {year.count} élément{year.count > 1 ? 's' : ''}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Liste des éléments */}
                  {analysisData?.elements && analysisData.elements.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold mb-3">📋 Éléments détaillés</h4>
                      <div className="max-h-64 overflow-y-auto space-y-2">
                        {(analysisData?.elements || []).map((element) => (
                        <div
                          key={element.id_element}
                          className="border border-gray-200 rounded p-3 hover:bg-gray-50 cursor-pointer"
                          onClick={() => onSelectElement?.(element)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h5 className="font-medium">{element.designation_exacte}</h5>
                              <p className="text-sm text-gray-600">
                                {element.dpgf_info?.nom_projet || 'Projet non spécifié'} ({element.dpgf_info?.date_dpgf || 'Date non spécifiée'})
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-green-600">
                                {formatPrice(element.prix_unitaire_ht)} / {element.unite}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    </div>
                  )}
                </div>
              )}
              {!analysisLoading && !analysisData && debouncedQuery && (
                <div className="text-center py-8 text-gray-500">
                  Aucune donnée d'analyse trouvée pour "{debouncedQuery}"
                </div>
              )}
            </>
          )}

          {/* Recherche par Prix */}
          {activeTab === 'price' && (
            <>
              {priceLoading && <div className="text-center py-8">💰 Recherche par prix en cours...</div>}
              {priceError && (
                <div className="text-red-600 bg-red-50 p-4 rounded-md">
                  Erreur lors de la recherche par prix: {String(priceError)}
                </div>
              )}
              {similarPriceResults.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">
                    Éléments avec prix similaire à {formatPrice(typeof targetPrice === 'number' ? targetPrice : 0)} 
                    (±{tolerancePercent}%)
                  </h3>
                  <div className="max-h-96 overflow-y-auto space-y-2">
                    {similarPriceResults.map((element) => (
                      <div
                        key={element.id_element}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                        onClick={() => onSelectElement && onSelectElement({
                          ...element,
                          similarity_score: 100 - Math.abs(element.price_difference_percent),
                          quantite: 1, // Valeur par défaut
                          prix_total_ht: element.prix_unitaire_ht // Valeur par défaut
                        })}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{element.designation_exacte}</h4>
                            <p className="text-sm text-gray-600">
                              {element.dpgf_info?.nom_projet || 'Projet non spécifié'} - {element.lot_info?.nom_lot || 'Lot non spécifié'}
                            </p>
                            <p className="text-xs text-gray-500">
                              Section: {element.section_info?.titre_section || 'Section non spécifiée'}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">
                              {formatPrice(element.prix_unitaire_ht)} / {element.unite}
                            </div>
                            <div className={`text-sm ${
                              element.price_difference_percent > 0 ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {element.price_difference_percent > 0 ? '+' : ''}
                              {element.price_difference_percent.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {!priceLoading && similarPriceResults.length === 0 && targetPrice && (
                <div className="text-center py-8 text-gray-500">
                  Aucun élément trouvé avec un prix similaire à {formatPrice(typeof targetPrice === 'number' ? targetPrice : 0)}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
