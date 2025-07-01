import { useMutation } from '@tanstack/react-query';
import { api } from '../services/api';

export function useUpload() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post('dpgf/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return data;
    }
  });
}
