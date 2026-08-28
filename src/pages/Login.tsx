import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setErro('Credenciais inválidas');
      return;
    }
    navigate('/dashboard');
  }

  return (
    <form onSubmit={handleLogin} className="max-w-sm mx-auto p-6 space-y-4">
      <h1 className="text-lg font-bold text-[#1F4E78]">Acesso Administrador</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border rounded p-2"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border rounded p-2"
      />
      {erro && <p className="text-red-600 text-sm">{erro}</p>}
      <button type="submit" className="w-full bg-blue-600 text-white rounded p-2">
        Entrar
      </button>
    </form>
  );
}