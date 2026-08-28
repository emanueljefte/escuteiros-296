import { useEffect, useRef, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db-local';
import { useOnlineStatus } from '../lib/connectivity';
import { sincronizarPendentes } from '../lib/sync';

export function SyncStatus() {
  const isOnline = useOnlineStatus();
  const [sincronizando, setSincronizando] = useState(false);

  const pendentes = useLiveQuery(
    () => db.escuteiros.where('sync_status').equals('pendente').count(),
    []
  );

  const sincronizandoRef = useRef(false);

useEffect(() => {
  if (!isOnline || !pendentes || pendentes === 0) return;
  if (sincronizandoRef.current) return;

  sincronizandoRef.current = true;

  (async () => {
    setSincronizando(true);
    try {
      await sincronizarPendentes();
    } finally {
      setSincronizando(false);
      sincronizandoRef.current = false;
    }
  })();
}, [isOnline, pendentes]);

  if (pendentes === undefined) return null;

  return (
    <div className="fixed bottom-4 right-4 flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-md text-sm">
      <span
        className={`h-2 w-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}
      />
      {!isOnline && <span>Offline</span>}
      {isOnline && sincronizando && <span>A sincronizar...</span>}
      {isOnline && !sincronizando && pendentes > 0 && (
        <span>{pendentes} por sincronizar</span>
      )}
      {isOnline && !sincronizando && pendentes === 0 && <span>Tudo sincronizado</span>}
    </div>
  );
}