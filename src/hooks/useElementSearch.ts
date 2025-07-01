import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

// Interfaces pour les réponses de l'API de recherche
export interface ElementSearchResult {
  id_element: number;
  designation_exacte: string;
  unite: string;
  prix_unitaire_ht: number;
  quantite: number;
  prix_total_ht: number;
  similarity_score?: number;
  section_info?: {
    id_section: number;
    numero_section: string;
    titre_section: string;
  };
  lot_info?: {
    id_lot: number;
    numero_lot: string;
    nom_lot: string;
  };
  dpgf_info?: {
    id_dpgf: number;
    nom_projet: string;
    date_dpgf: string;
  };
}

export interface HistoricalPriceAnalysis {
  designation: string;
  total_elements: number;
  average_price: number;
  min_price: number;
  max_price: number;
  std_deviation: number;
  yearly_averages: {
    year: number;
    average_price: number;
    count: number;
  }[];
  trend: 'hausse' | 'baisse' | 'stable';
  price_range: {
    min: number;
    max: number;
  };
  most_common_unit: string;
  elements: ElementSearchResult[];
}

export interface SimilarPriceElement {
  id_element: number;
  designation_exacte: string;
  unite: string;
  prix_unitaire_ht: number;
  price_difference_percent: number;
  section_info?: {
    id_section: number;
    numero_section: string;
    titre_section: string;
  };
  lot_info?: {
    id_lot: number;
    numero_lot: string;
    nom_lot: string;
  };
  dpgf_info?: {
    id_dpgf: number;
    nom_projet: string;
    date_dpgf: string;
  };
}

// Hook pour la recherche fuzzy
export function useElementFuzzySearch(
  designation: string,
  minSimilarity: number = 70,
  limit: number = 50,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['elementFuzzySearch', designation, minSimilarity, limit],
    queryFn: async () => {
      if (!designation.trim()) return [];
      
      const params = new URLSearchParams({
        designation: designation.trim(),
        min_similarity: minSimilarity.toString(),
        limit: limit.toString()
      });
      
      const { data } = await api.get<ElementSearchResult[]>(
        `/element_ouvrages/search/fuzzy?${params}`
      );
      return data;
    },
    enabled: enabled && !!designation.trim()
  });
}

// Hook pour l'analyse des prix historiques
export function useHistoricalPriceAnalysis(
  designation: string,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['historicalPriceAnalysis', designation],
    queryFn: async () => {
      if (!designation.trim()) return null;
      
      const params = new URLSearchParams({
        designation: designation.trim()
      });
      
      const { data } = await api.get<HistoricalPriceAnalysis>(
        `/element_ouvrages/search/price-analysis?${params}`
      );
      return data;
    },
    enabled: enabled && !!designation.trim()
  });
}

// Hook pour la recherche par prix similaire
export function useSimilarPriceElements(
  targetPrice: number,
  tolerancePercent: number = 20,
  unit?: string,
  limit: number = 20,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['similarPriceElements', targetPrice, tolerancePercent, unit, limit],
    queryFn: async () => {
      if (!targetPrice || targetPrice <= 0) return [];
      
      const params = new URLSearchParams({
        target_price: targetPrice.toString(),
        tolerance_percent: tolerancePercent.toString(),
        limit: limit.toString()
      });
      
      if (unit) {
        params.append('unit', unit);
      }
      
      const { data } = await api.get<SimilarPriceElement[]>(
        `/element_ouvrages/search/similar-price?${params}`
      );
      return data;
    },
    enabled: enabled && !!targetPrice && targetPrice > 0
  });
}

// Hook pour obtenir la liste des unités disponibles
export function useAvailableUnits() {
  return useQuery({
    queryKey: ['availableUnits'],
    queryFn: async () => {
      const { data } = await api.get<string[]>('/element_ouvrages/units');
      return data;
    }
  });
}
