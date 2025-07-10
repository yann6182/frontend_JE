import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export function useDpgfs(options?: {
  limit?: number;
  offset?: number;
  getAllRecords?: boolean;
}) {
  return useQuery({
    queryKey: ['dpgfs', options],
    queryFn: async () => {
      // Si on veut tous les enregistrements, on fait d'abord une requête pour avoir le count
      if (options?.getAllRecords) {
        try {
          // Essayer avec un limit très élevé
          const { data } = await api.get('/dpgf/', {
            params: {
              limit: 10000 // Limite très élevée pour récupérer tous les enregistrements
            }
          });
          return data;
        } catch (error) {
          // Si le paramètre limit n'est pas supporté, essayer sans paramètres
          console.warn('Limite non supportée, récupération sans paramètres');
          const { data } = await api.get('/dpgf/');
          return data;
        }
      }

      // Requête normale avec pagination
      const params: any = {};
      if (options?.limit) params.limit = options.limit;
      if (options?.offset) params.offset = options.offset;

      const { data } = await api.get('/dpgf/', { params });
      return data;
    }
  });
}

export function useDpgf(id: string) {
  return useQuery({
    queryKey: ['dpgf', id],
    queryFn: async () => {
      const { data } = await api.get(`/dpgf/${id}`);
      return data;
    }
  });
}

// Interface pour la structure complète d'un DPGF
export interface DpgfStructure {
  id_dpgf: number;
  nom_projet: string;
  date_dpgf: string;
  statut_offre: string;
  client?: {
    id_client: number;
    nom_client: string;
  };
  lots: {
    id_lot: number;
    numero_lot: string;
    nom_lot: string;
    sections: {
      id_section: number;
      numero_section: string;
      titre_section: string;
      niveau_hierarchique: number;
      elements: {
        id_element: number;
        designation_exacte: string;
        unite: string;
        quantite: number;
        prix_unitaire_ht: number;
        prix_total_ht: number;
        offre_acceptee: boolean;
      }[];
    }[];
  }[];
}

// Hook pour récupérer la structure complète d'un DPGF
export function useDpgfStructure(id: string) {
  return useQuery({
    queryKey: ['dpgfStructure', id],
    queryFn: async () => {
      const { data } = await api.get<DpgfStructure>(`/dpgf/${id}/structure`);
      return data;
    },
    enabled: !!id // Ne lance la requête que si l'ID est défini
  });
}

// Hook de debug pour tester différentes stratégies de récupération
export function useDpgfsDebug() {
  return useQuery({
    queryKey: ['dpgfs-debug'],
    queryFn: async () => {
      console.log('🔍 Test de récupération des DPGFs...');

      // Test 1: Requête normale
      try {
        const { data: normalData } = await api.get('/dpgf/');
        console.log('📊 Requête normale:', normalData?.length || 0, 'résultats');
      } catch (error) {
        console.error('❌ Erreur requête normale:', error);
      }

      // Test 2: Avec limit élevé
      try {
        const { data: limitData } = await api.get('/dpgf/', {
          params: { limit: 1000 }
        });
        console.log('📊 Avec limit=1000:', limitData?.length || 0, 'résultats');
      } catch (error) {
        console.error('❌ Erreur avec limit:', error);
      }

      // Test 3: Avec offset et limit
      try {
        const { data: offsetData } = await api.get('/dpgf/', {
          params: { limit: 100, offset: 0 }
        });
        console.log('📊 Avec pagination:', offsetData?.length || 0, 'résultats');
      } catch (error) {
        console.error('❌ Erreur avec pagination:', error);
      }

      // Test 4: Vérifier si il y a des headers de pagination
      try {
        const response = await api.get('/dpgf/');
        console.log('📋 Headers de réponse:', response.headers);
        console.log('📋 Status:', response.status);
        return response.data;
      } catch (error) {
        console.error('❌ Erreur headers:', error);
        return [];
      }
    },
    enabled: false // Ne pas l'exécuter automatiquement
  });
}
