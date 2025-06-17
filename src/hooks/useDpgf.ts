import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export function useDpgfs() {
  return useQuery(['dpgfs'], async () => {
    const { data } = await api.get('/dpgf/');
    return data;
  });
}

export function useDpgf(id: string) {
  return useQuery(['dpgf', id], async () => {
    const { data } = await api.get(`/dpgf/${id}`);
    return data;
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
  return useQuery(['dpgfStructure', id], async () => {
    const { data } = await api.get<DpgfStructure>(`/dpgf/${id}/structure`);
    return data;
  }, {
    enabled: !!id // Ne lance la requête que si l'ID est défini
  });
}
