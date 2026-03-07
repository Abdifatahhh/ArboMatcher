import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { LogoText } from '../ui/Logo';
import {
  Search,
  Bookmark,
  Heart,
  FileText,
  Send,
  Star,
  Crown,
  Menu,
  X,
  Bell,
  MessageSquare,
  LayoutDashboard,
  Settings,
  LogOut,
} from 'lucide-react';

interface ArtsDashboardLayoutProps {
  children: React.ReactNode;
}

const ARTS_NAV: { path: string; label: string; icon: React.ElementType; badge?: 'invites' | 'messages' }[] = [
  { path: '/arts/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/arts/opdrachten', label: 'Zoeken', icon: Search },
  { path: '/arts/zoekopdrachten', label: 'Mijn zoekopdrachten', icon: Bookmark },
  { path: '/arts/favorieten', label: 'Favorieten', icon: Heart },
  { path: '/arts/profiel', label: 'Mijn profiel', icon: FileText },
  { path: '/arts/reacties', label: 'Verstuurde reacties', icon: Send },
  { path: '/arts/beoordelingen', label: 'Gegeven beoordelingen', icon: Star },
  { path: '/arts/abonnement', label: 'Upgrade naar PRO', icon: Crown },
  { path: '/arts/uitnodigingen', label: 'Uitnodigingen', icon: Bell, badge: 'invites' },
  { path: '/arts/inbox', label: 'Berichten', icon: MessageSquare, badge: 'messages' },
];

export function ArtsDashboardLayout({ children }: ArtsDashboardLayoutProps) {
  const { profile, signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [pendingInvites, setPendingInvites] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, [user?.id]);

  const fetchNotifications = async () => {
    if (!user?.id) return;
    const { data: doctor } = await supabase.from('professionals').select('id').eq('user_id', user.id).maybeSingle();
    if (doctor) {
      const { count } = await supabase.from('invites').select('id', { count: 'exact' }).eq('doctor_id', doctor.id).eq('status', 'PENDING');
      setPendingInvites(count || 0);
    }
    const { count } = await supabase.from('messages').select('id', { count: 'exact' }).is('read_at', null).neq('sender_id', user.id);
    setUnreadMessages(count || 0);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const sidebarBg = 'bg-[#F4FAF4] border-r border-[#4FA151]/15 shadow-lg shadow-slate-200/20';
  const headerBorder = 'border-[#4FA151]/15';
  const navActive = 'bg-[#4FA151] text-white shadow-md shadow-[#4FA151]/25';
  const navInactive = 'text-[#0F172A]/80 hover:bg-white/80 hover:text-[#0F172A]';
  const footerStyle = 'border-t border-[#4FA151]/15';
  const footerLink = 'text-[#0F172A]/80 hover:bg-white/80 hover:text-[#0F172A]';
  const mainBg = 'bg-gradient-to-b from-[#E8F5E9] via-[#F4FAF4] to-white';

  const getBadge = (item: (typeof ARTS_NAV)[0]) => {
    if (item.badge === 'invites') return pendingInvites;
    if (item.badge === 'messages') return unreadMessages;
    return 0;
  };

  const SidebarContent = () => (
    <>
      <div className={`p-6 border-b ${headerBorder}`}>
        <Link to="/" className="inline-block">
          <LogoText theme="light" className="text-xl" />
        </Link>
        <p className="text-sm mt-2 text-[#0F172A]/70 font-medium">Arts Dashboard</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {ARTS_NAV.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const badge = getBadge(item);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? navActive : navInactive}`}
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </div>
              {badge > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-white text-[#4FA151]' : 'bg-[#4FA151] text-white'}`}>
                  {badge > 9 ? '9+' : badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className={`p-4 ${footerStyle}`}>
        <Link
          to="/arts/instellingen"
          className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition mb-2 ${footerLink}`}
          onClick={() => setSidebarOpen(false)}
        >
          <Settings className="w-5 h-5" />
          <span>Instellingen</span>
        </Link>
        <button
          onClick={handleSignOut}
          className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition w-full ${footerLink}`}
        >
          <LogOut className="w-5 h-5" />
          <span>Uitloggen</span>
        </button>
      </div>
    </>
  );

  return (
    <div className={`min-h-screen flex ${mainBg}`}>
      <aside className={`hidden lg:flex lg:flex-col lg:w-64 flex-col ${sidebarBg}`}>
        <SidebarContent />
      </aside>
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className={`absolute left-0 top-0 bottom-0 w-64 flex flex-col ${sidebarBg}`}>
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/80 text-[#0F172A]">
              <X className="w-6 h-6" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}
      <div className="flex-1 flex flex-col min-w-0">
        <header className={`bg-white border-b lg:hidden ${headerBorder}`}>
          <div className="flex items-center justify-between px-4 py-4">
            <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100">
              <Menu className="w-6 h-6" />
            </button>
            <Link to="/" className="inline-block"><LogoText theme="light" className="text-lg" /></Link>
            <div className="w-6" />
          </div>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
