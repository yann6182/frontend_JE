import { Route, Routes } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import DpgfView from '../pages/DpgfView';
import NotFound from '../pages/NotFound';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dpgf/:id" element={<DpgfView />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
