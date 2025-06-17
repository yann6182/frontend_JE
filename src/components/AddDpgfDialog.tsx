import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import { Button } from './Button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useClients } from '../hooks/useClients';
import { api } from '../services/api';

export function AddDpgfDialog() {
  const [open, setOpen] = useState(false);
  const [nom, setNom] = useState('');
  const [date, setDate] = useState('');
  const [clientId, setClientId] = useState('');
  const { data: clients = [] } = useClients();
  const qc = useQueryClient();
  const createDpgf = useMutation(
    async () => {
      const { data } = await api.post('/dpgf/', {
        nom_projet: nom,
        date_dpgf: date,
        id_client: Number(clientId)
      });
      return data;
    },
    {
      onSuccess: () => {
        qc.invalidateQueries(['dpgfs']);
        setOpen(false);
        setNom('');
        setDate('');
        setClientId('');
      }
    }
  );

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button>Ajouter un DPGF</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-96 -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded shadow">
          <Dialog.Title className="font-medium mb-2">Nouveau DPGF</Dialog.Title>
          <form
            onSubmit={e => {
              e.preventDefault();
              createDpgf.mutate();
            }}
            className="space-y-2"
          >
            <input
              className="w-full border rounded px-2 py-1"
              placeholder="Nom du projet"
              value={nom}
              onChange={e => setNom(e.target.value)}
            />
            <input
              type="date"
              className="w-full border rounded px-2 py-1"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
            <select
              className="w-full border rounded px-2 py-1"
              value={clientId}
              onChange={e => setClientId(e.target.value)}
            >
              <option value="">-- Client --</option>
              {clients.map(c => (
                <option key={c.id_client} value={c.id_client}>
                  {c.nom_client}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={createDpgf.isLoading}>
                Ajouter
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
