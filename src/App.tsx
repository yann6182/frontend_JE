import { Sidebar } from './components/Sidebar';
import AppRoutes from './routes';

function App() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4">
        <AppRoutes />
      </main>
    </div>
  );
}

export default App;
