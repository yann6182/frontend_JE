// Utilitaires pour formater de manière sécurisée les données d'éléments

export interface SafeElementData {
  id_element: number;
  designation_exacte: string;
  unite: string;
  prix_unitaire_ht: number;
  [key: string]: any;
}

export function formatElementInfo(element: SafeElementData) {
  return {
    designation: element.designation_exacte || 'Désignation non spécifiée',
    prix: element.prix_unitaire_ht || 0,
    unite: element.unite || 'U',
    projet: (element as any).dpgf_info?.nom_projet || 'Projet non spécifié',
    lot: (element as any).lot_info?.nom_lot || 'Lot non spécifié',
    section: (element as any).section_info?.titre_section || 'Section non spécifiée',
    date: (element as any).dpgf_info?.date_dpgf || 'Date non spécifiée'
  };
}

export function formatPrice(price: number): string {
  try {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(price);
  } catch (error) {
    return `${price.toFixed(2)} €`;
  }
}

export function safeGet<T>(obj: any, path: string, defaultValue: T): T {
  try {
    const keys = path.split('.');
    let result = obj;
    
    for (const key of keys) {
      if (result === null || result === undefined) {
        return defaultValue;
      }
      result = result[key];
    }
    
    return result !== undefined ? result : defaultValue;
  } catch (error) {
    return defaultValue;
  }
}

// Exemple d'utilisation:
// const projet = safeGet(element, 'dpgf_info.nom_projet', 'Projet non spécifié');
// const lot = safeGet(element, 'lot_info.nom_lot', 'Lot non spécifié');
