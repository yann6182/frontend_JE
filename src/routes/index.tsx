import { Route, Routes } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import DpgfView from '../pages/DpgfView';
import { ElementSearchPage } from '../pages/ElementSearchPage';
import { SearchTestComponent } from '../components/SearchTestComponent';
import NotFound from '../pages/NotFound';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dpgf/:id" element={<DpgfView />} />
      <Route path="/search" element={<ElementSearchPage />} />
      <Route path="/search-test" element={<SearchTestComponent />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
