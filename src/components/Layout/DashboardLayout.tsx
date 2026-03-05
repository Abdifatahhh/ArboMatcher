import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogoText } from '../ui/Logo.tsx';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Building2,
  MessageSquare,
  Heart,
  Settings,
  LogOut,
  User,
  FileText,
  CreditCard,
  CheckCircle,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getInstellingenPath = () => {
    if (!profile) return '/';
    switch (profile.role) {
      case 'ARTS': return '/arts/instellingen';
      case 'OPDRACHTGEVER': return '/opdrachtgever/profiel';
      case 'ADMIN': return '/admin/instellingen';
      default: return '/';
    }
  };

  const getNavigationItems = () => {
    if (!profile) return [];
    switch (profile.role) {
      case 'ARTS':
        return [
          { path: '/arts/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { path: '/arts/profiel', label: 'Profiel', icon: User },
          { path: '/arts/opdrachten', label: 'Opdrachten', icon: Briefcase },
          { path: '/arts/reacties', label: 'Mijn reacties', icon: FileText },
          { path: '/arts/uitnodigingen', label: 'Uitnodigingen', icon: Users },
          { path: '/arts/inbox', label: 'Berichten', icon: MessageSquare },
          { path: '/arts/abonnement', label: 'Premium', icon: CreditCard }
        ];
      case 'OPDRACHTGEVER':
        return [
          { path: '/opdrachtgever/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { path: '/opdrachtgever/profiel', label: 'Bedrijfsprofiel', icon: User },
          { path: '/opdrachtgever/opdrachten', label: 'Mijn opdrachten', icon: Briefcase },
          { path: '/opdrachtgever/kandidaten', label: 'Kandidaten', icon: Users },
          { path: '/opdrachtgever/favorieten', label: 'Favorieten', icon: Heart },
          { path: '/opdrachtgever/inbox', label: 'Berichten', icon: MessageSquare },
          { path: '/opdrachtgever/abonnement', label: 'Abonnement', icon: CreditCard }
        ];
      case 'ADMIN':
        return [
          { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { path: '/admin/verificaties', label: 'BIG Verificaties', icon: CheckCircle },
          { path: '/admin/artsen', label: 'Artsen', icon: User },
          { path: '/admin/gebruikers', label: 'Gebruikers', icon: Users },
          { path: '/admin/opdrachtgevers', label: 'Opdrachtgevers', icon: Building2 },
          { path: '/admin/opdrachten', label: 'Opdrachten', icon: Briefcase },
          { path: '/admin/reacties', label: 'Reacties', icon: FileText },
          { path: '/admin/abonnementen', label: 'Abonnementen', icon: CreditCard }
        ];
      default: return [];
    }
  };

  const navItems = getNavigationItems();

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-gray-200">
        <Link to="/" className="inline-block">
          <LogoText theme="light" className="text-xl" />
        </Link>
        {profile && (
          <p className="text-sm text-gray-600 mt-2">
            {profile.role === 'ARTS' && 'Arts Dashboard'}
            {profile.role === 'OPDRACHTGEVER' && 'Opdrachtgever Dashboard'}
            {profile.role === 'ADMIN' && 'Admin Dashboard'}
          </p>
        )}
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${isActive ? 'bg-[#0F172A] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <Link to={getInstellingenPath()} className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition mb-2" onClick={() => setSidebarOpen(false)}>
          <Settings className="w-5 h-5" />
          <span>Instellingen</span>
        </Link>
        <button onClick={handleSignOut} className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition w-full">
          <LogOut className="w-5 h-5" />
          <span>Uitloggen</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-200">
        <SidebarContent />
      </aside>
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 flex flex-col">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 p-2">
              <X className="w-6 h-6" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between px-4 py-4">
            <button onClick={() => setSidebarOpen(true)}><Menu className="w-6 h-6" /></button>
            <Link to="/" className="inline-block"><LogoText theme="light" className="text-lg" /></Link>
            <div className="w-6" />
          </div>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
