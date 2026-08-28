import { Navigate } from 'react-router-dom';
import { useSession } from '../lib/auth';

export default function RotaProtegida({ children }: { children: React.ReactNode }) {
  const { session, loading } = useSession();

  if (loading) return <p className="p-6 text-sm text-gray-500">A verificar sessão...</p>;
  if (!session) return <Navigate to="/login" replace />;

  return <>{children}</>;
}