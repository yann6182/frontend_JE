// Utilitaire pour tester manuellement l'API DPGF
import { api } from '../services/api';

export const testDpgfApi = {
    // Test basique
    async basic() {
        console.log('🔍 Test basique...');
        try {
            const response = await api.get('/dpgf/');
            console.log('✅ Résultats:', response.data?.length || 0);
            console.log('📋 Données:', response.data?.slice(0, 3)); // Afficher les 3 premiers
            return response.data;
        } catch (error) {
            console.error('❌ Erreur:', error);
            return null;
        }
    },

    // Test avec paramètres de pagination
    async withPagination(limit = 500, offset = 0) {
        console.log(`🔍 Test avec pagination (limit: ${limit}, offset: ${offset})...`);
        try {
            const response = await api.get('/dpgf/', {
                params: { limit, offset }
            });
            console.log('✅ Résultats:', response.data?.length || 0);
            return response.data;
        } catch (error) {
            console.error('❌ Erreur pagination:', error);
            return null;
        }
    },

    // Test des headers pour voir les métadonnées
    async checkHeaders() {
        console.log('🔍 Vérification des headers...');
        try {
            const response = await api.get('/dpgf/');
            console.log('📋 Headers complets:', response.headers);
            console.log('📊 X-Total-Count:', response.headers['x-total-count']);
            console.log('📊 Content-Length:', response.headers['content-length']);
            console.log('📊 Status:', response.status);
            return {
                headers: response.headers,
                dataLength: response.data?.length || 0,
                status: response.status
            };
        } catch (error) {
            console.error('❌ Erreur headers:', error);
            return null;
        }
    },

    // Test avec différents endpoints possibles
    async testEndpoints() {
        console.log('🔍 Test des différents endpoints...');

        const endpoints = [
            '/dpgf/',
            '/dpgf',
            '/dpgfs/',
            '/dpgfs',
            '/dpgf/all',
            '/dpgf/list'
        ];

        for (const endpoint of endpoints) {
            try {
                console.log(`🔍 Test de ${endpoint}...`);
                const response = await api.get(endpoint);
                console.log(`✅ ${endpoint}: ${response.data?.length || 0} résultats`);
            } catch (error: any) {
                console.log(`❌ ${endpoint}: ${error.response?.status || 'Erreur'} - ${error.response?.statusText || error.message}`);
            }
        }
    },

    // Test par batch pour récupérer tous les enregistrements
    async getAllByBatch(batchSize = 100) {
        console.log(`🔍 Récupération par batch (taille: ${batchSize})...`);
        let allData: any[] = [];
        let offset = 0;
        let hasMore = true;

        while (hasMore) {
            try {
                console.log(`📦 Batch ${Math.floor(offset / batchSize) + 1} (offset: ${offset})...`);
                const response = await api.get('/dpgf/', {
                    params: { limit: batchSize, offset }
                });

                const batchData = response.data || [];
                allData = [...allData, ...batchData];

                console.log(`📊 Batch reçu: ${batchData.length} éléments`);
                console.log(`📊 Total accumulé: ${allData.length} éléments`);

                // Si on reçoit moins que la taille demandée, on a atteint la fin
                hasMore = batchData.length === batchSize;
                offset += batchSize;

                // Sécurité: arrêter après 50 batchs (5000 éléments avec batch de 100)
                if (offset >= 5000) {
                    console.log('⚠️ Arrêt de sécurité à 5000 éléments');
                    break;
                }

            } catch (error) {
                console.error(`❌ Erreur batch à l'offset ${offset}:`, error);
                hasMore = false;
            }
        }

        console.log(`🎉 Récupération terminée: ${allData.length} éléments au total`);
        return allData;
    },

    // Test complet
    async runAllTests() {
        console.log('🚀 === DÉBUT DES TESTS DPGF API ===');

        await this.basic();
        await this.checkHeaders();
        await this.withPagination(500);
        await this.testEndpoints();

        console.log('🎉 === FIN DES TESTS ===');
    }
};

// Exposer globalement pour faciliter les tests depuis la console
if (typeof window !== 'undefined') {
    (window as any).testDpgfApi = testDpgfApi;
}
