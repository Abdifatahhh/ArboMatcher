import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Search,
  Bookmark,
  Heart,
  FileText,
  Send,
  Star,
  Crown,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  Bell,
  MessageSquare,
  User,
  LogOut,
  LayoutDashboard,
  Settings,
} from 'lucide-react';

interface ArtsDashboardLayoutProps {
  children: React.ReactNode;
}

interface NavSection {
  title: string;
  isOpen: boolean;
  items: { path: string; label: string; icon: React.ElementType; badge?: number }[];
}

export function ArtsDashboardLayout({ children }: ArtsDashboardLayoutProps) {
  const { profile, signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [pendingInvites, setPendingInvites] = useState(0);
  const [sections, setSections] = useState<NavSection[]>([
    { title: 'Opdrachten vinden', isOpen: true, items: [
      { path: '/arts/opdrachten', label: 'Zoeken', icon: Search },
      { path: '/arts/zoekopdrachten', label: 'Mijn zoekopdrachten', icon: Bookmark },
      { path: '/arts/favorieten', label: 'Favoriete opdrachten', icon: Heart },
      { path: '/arts/profiel', label: 'Mijn profiel', icon: FileText },
      { path: '/arts/reacties', label: 'Verstuurde reacties', icon: Send },
      { path: '/arts/beoordelingen', label: 'Gegeven beoordelingen', icon: Star },
      { path: '/arts/abonnement', label: 'Upgrade naar PRO', icon: Crown }
    ]},
    { title: 'Mijn account', isOpen: false, items: [
      { path: '/arts/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/arts/uitnodigingen', label: 'Uitnodigingen', icon: Bell },
      { path: '/arts/inbox', label: 'Berichten', icon: MessageSquare },
      { path: '/arts/instellingen', label: 'Instellingen', icon: Settings }
    ]}
  ]);

  useEffect(() => { fetchNotifications(); }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;
    const { data: doctor } = await supabase.from('doctors').select('id').eq('user_id', user.id).maybeSingle();
    if (doctor) {
      const { count: inviteCount } = await supabase.from('invites').select('id', { count: 'exact' }).eq('doctor_id', doctor.id).eq('status', 'PENDING');
      setPendingInvites(inviteCount || 0);
    }
    const { count: msgCount } = await supabase.from('messages').select('id', { count: 'exact' }).is('read_at', null).neq('sender_id', user.id);
    setUnreadMessages(msgCount || 0);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const toggleSection = (index: number) => {
    setSections(prev => prev.map((section, i) => i === index ? { ...section, isOpen: !section.isOpen } : section));
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <Link to="/" className="text-xl font-bold text-[#0F172A]">ArboMatcher</Link>
      </div>
      <nav className="flex-1 overflow-y-auto py-2">
        {sections.map((section, sectionIndex) => (
          <div key={section.title} className="mb-2">
            <button onClick={() => toggleSection(sectionIndex)} className="w-full flex items-center justify-between px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50">
              <span>{section.title}</span>
              {section.isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {section.isOpen && (
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  const badge = item.path === '/arts/uitnodigingen' ? pendingInvites : item.path === '/arts/inbox' ? unreadMessages : undefined;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center justify-between mx-2 px-3 py-2.5 rounded-lg transition text-sm ${isActive ? 'bg-[#0F172A] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {badge !== undefined && badge > 0 && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-white text-[#0F172A]' : 'bg-[#16A34A] text-white'}`}>{badge}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <button onClick={handleSignOut} className="flex items-center space-x-3 w-full px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition text-sm">
          <LogOut className="w-4 h-4" />
          <span>Uitloggen</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex">
      <aside className="hidden lg:flex lg:flex-col lg:w-60 bg-white border-r border-gray-200 fixed h-full">
        <SidebarContent />
      </aside>
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-60 bg-white flex flex-col">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 p-2"><X className="w-5 h-5" /></button>
            <SidebarContent />
          </aside>
        </div>
      )}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-60">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="flex items-center justify-between px-4 lg:px-6 py-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden"><Menu className="w-6 h-6" /></button>
            <div className="hidden lg:block" />
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition">
                <MessageSquare className="w-5 h-5" />
                {unreadMessages > 0 && <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#16A34A] text-white text-xs rounded-full flex items-center justify-center">{unreadMessages > 9 ? '9+' : unreadMessages}</span>}
              </button>
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition">
                <Bell className="w-5 h-5" />
                {pendingInvites > 0 && <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#16A34A] text-white text-xs rounded-full flex items-center justify-center">{pendingInvites > 9 ? '9+' : pendingInvites}</span>}
              </button>
              <Link to="/arts/profiel" className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-300 transition overflow-hidden">
                {profile?.full_name ? <span className="text-sm font-semibold">{profile.full_name.charAt(0).toUpperCase()}</span> : <User className="w-5 h-5" />}
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
