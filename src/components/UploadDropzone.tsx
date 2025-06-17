import { useCallback, useRef } from 'react';
import { useUpload } from '../hooks/useUpload';
import { Button } from './Button';

interface UploadDropzoneProps {
  onUploaded?: (data: unknown) => void;
}

export function UploadDropzone({ onUploaded }: UploadDropzoneProps) {
  const uploadMutation = useUpload();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        uploadMutation.mutate(file, {
          onSuccess: data => {
            onUploaded?.(data);
          }
        });
      }
    },
    [uploadMutation, onUploaded]
  );

  return (
    <div className="border-2 border-dashed border-slate-300 p-4 rounded space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx"
        onChange={handleChange}
        className="hidden"
      />
      <Button type="button" onClick={() => inputRef.current?.click()}>Choisir un fichier</Button>
      {uploadMutation.isLoading && (
        <p className="text-sm text-slate-500">Uploading...</p>
      )}
    </div>
  );
}
