import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Inscricao from './pages/Inscricao';
import Dashboard from './pages/Dashboard';
import Editar from './pages/Editar';
import RotaProtegida from './components/RotaProtegida';
import Login from './pages/Login';
import PreviewFicha from './pages/PreviewFicha';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inscricao />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <RotaProtegida>
              <Dashboard />
            </RotaProtegida>
          }
        />
        <Route
          path="/editar/:id"
          element={
            <RotaProtegida>
              <Editar />
            </RotaProtegida>
          }
        />
        <Route path="/pdf/:id" element={<RotaProtegida><PreviewFicha /></RotaProtegida>} />
      </Routes>
    </BrowserRouter>
  );
}