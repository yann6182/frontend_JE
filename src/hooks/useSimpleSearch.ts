import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

// Version simplifiée et sécurisée des hooks
export interface SimpleElementResult {
  id_element: number;
  designation_exacte: string;
  unite: string;
  prix_unitaire_ht: number;
  similarity_score?: number;
}

// Hook simple pour tester la connexion API
export function useSimpleElementSearch(
  designation: string,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['simpleElementSearch', designation],
    queryFn: async () => {
      if (!designation?.trim()) {
        return [];
      }
      
      try {
        // Test avec un endpoint simple d'abord
        const response = await api.get('/element_ouvrages/', {
          params: {
            limit: 10
          }
        });
        
        return response.data || [];
      } catch (error) {
        console.error('Erreur API:', error);
        throw new Error(`Erreur de connexion API: ${error}`);
      }
    },
    enabled: enabled && !!designation?.trim(),
    retry: 1,
    retryDelay: 1000
  });
}

// Hook de test pour vérifier la connectivité
export function useApiTest() {
  return useQuery({
    queryKey: ['apiTest'],
    queryFn: async () => {
      try {
        const response = await api.get('/');
        return { status: 'success', data: response.data };
      } catch (error) {
        console.error('Test API échoué:', error);
        return { status: 'error', error: String(error) };
      }
    },
    retry: 1
  });
}
