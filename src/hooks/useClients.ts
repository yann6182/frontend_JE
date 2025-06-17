import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

export interface Client {
  id_client: number;
  nom_client: string;
}

export function useClients() {
  return useQuery(['clients'], async () => {
    const { data } = await api.get<Client[]>('/clients/');
    return data;
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  return useMutation(
    async (client: Omit<Client, 'id_client'>) => {
      const { data } = await api.post<Client>('/clients/', client);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['clients']);
      }
    }
  );
}
