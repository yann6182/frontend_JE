import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import { Button } from './Button';
import { useCreateClient } from '../hooks/useClients';

export function AddClientDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const createClient = useCreateClient();

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-80 -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded shadow">
          <Dialog.Title className="font-medium mb-2">Nouveau Client</Dialog.Title>
          <form
            onSubmit={e => {
              e.preventDefault();
              createClient.mutate(
                { nom_client: name },
                {
                  onSuccess: () => {
                    setOpen(false);
                    setName('');
                  }
                }
              );
            }}
            className="space-y-2"
          >
            <input
              className="w-full border rounded px-2 py-1"
              placeholder="Nom du client"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={createClient.isLoading}>
                Ajouter
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
