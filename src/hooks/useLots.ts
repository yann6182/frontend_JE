import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export interface Lot {
  id_lot: number;
  numero_lot: string;
  nom_lot: string;
}

export interface Section {
  id_section: number;
  numero_section: string;
  titre_section: string;
  id_lot: number;
  niveau: number;
}

export interface Element {
  id_element: number;
  designation_exacte: string;
  unite: string;
  quantite: number;
  prix_unitaire_ht: number;
  prix_total_ht: number;
  id_section: number;
}

export function useLots(dpgfId: string) {
  return useQuery(['lots', dpgfId], async () => {
    const { data } = await api.get<Lot[]>(`/lots/?id_dpgf=${dpgfId}`);
    return data;
  });
}

export function useSections(lotId: string) {
  return useQuery(['sections', lotId], async () => {
    const { data } = await api.get<Section[]>(`/sections/?id_lot=${lotId}`);
    return data;
  });
}

export function useElements(sectionId: string) {
  return useQuery(['elements', sectionId], async () => {
    const { data } = await api.get<Element[]>(`/element_ouvrages/?id_section=${sectionId}`);
    return data;
  });
}

export interface Lot {
  id_lot: number;
  numero_lot: string;
  nom_lot: string;
}

export interface ElementWithSection extends Element {
  section: Section;
  lot?: {
    id_lot: number;
    numero_lot: string;
    nom_lot: string;
  };
}

export function useElementsWithSections(dpgfId?: string, sectionId?: string) {
  return useQuery(['elementsWithSections', dpgfId, sectionId], async () => {
    let url = `/element_ouvrages/with_sections`;
    const params = new URLSearchParams();
    
    if (dpgfId) {
      params.append('dpgf_id', dpgfId);
    }
    
    if (sectionId) {
      params.append('section_id', sectionId);
    }
    
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
    
    const { data } = await api.get<ElementWithSection[]>(url);
    return data;
  });
}
