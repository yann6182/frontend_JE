import { Link, useLocation } from 'react-router-dom';

const links = [
  { to: '/', label: ' Dashboard' },
  /*{ to: '/search', label: ' Recherche Éléments' },
  { to: '/search-test', label: ' Test Recherche' }*/
];

export function Sidebar() {
  const location = useLocation();
  return (
    <aside className="w-64 bg-white shadow-md">
      <div className="p-4 text-xl font-semibold">DPGF</div>
      <nav className="p-2 space-y-2">
        {links.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`block px-4 py-2 rounded hover:bg-slate-100 ${
              location.pathname === link.to ? 'bg-slate-200' : ''
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
