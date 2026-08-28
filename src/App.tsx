import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Inscricao from './pages/Inscricao';
import Dashboard from './pages/Dashboard';
import Editar from './pages/Editar';
import RotaProtegida from './components/RotaProtegida';
import Login from './pages/Login';

<BrowserRouter>
  <Routes>
    <Route path="/" element={<Inscricao />} />
    <Route path="/login" element={<Login />} />
    <Route
      path="/dashboard"
      element={<RotaProtegida><Dashboard /></RotaProtegida>}
    />
    <Route
      path="/editar/:id"
      element={<RotaProtegida><Editar /></RotaProtegida>}
    />
  </Routes>
</BrowserRouter>