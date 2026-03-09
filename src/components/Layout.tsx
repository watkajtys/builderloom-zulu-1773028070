
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-obsidian text-white font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
