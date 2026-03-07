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
  List,
  X,
  Bell,
  MessageSquare,
  LayoutDashboard,
  Settings,
  LogOut,
  User,
} from 'lucide-react';

interface ArtsDashboardLayoutProps {
  children: React.ReactNode;
}

const ARTS_NAV: { path: string; label: string; icon: React.ElementType; badge?: 'invites' | 'messages' }[] = [
  { path: '/arts/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ...[
    { path: '/arts/opdrachten', label: 'Zoeken', icon: Search },
    { path: '/arts/zoekopdrachten', label: 'Mijn zoekopdrachten', icon: Bookmark },
    { path: '/arts/favorieten', label: 'Favorieten', icon: Heart },
    { path: '/arts/profiel', label: 'Mijn profiel', icon: FileText },
    { path: '/arts/reacties', label: 'Verstuurde reacties', icon: Send },
    { path: '/arts/beoordelingen', label: 'Gegeven beoordelingen', icon: Star },
    { path: '/arts/abonnement', label: 'Upgrade naar PRO', icon: Crown },
    { path: '/arts/uitnodigingen', label: 'Uitnodigingen', icon: Bell, badge: 'invites' as const },
    { path: '/arts/inbox', label: 'Berichten', icon: MessageSquare, badge: 'messages' as const },
  ].sort((a, b) => a.label.localeCompare(b.label, 'nl')),
];

export function ArtsDashboardLayout({ children }: ArtsDashboardLayoutProps) {
  const { profile, signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
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
      <div className={`p-4 lg:p-6 border-b ${headerBorder}`}>
        <Link to="/" className="inline-block">
          <LogoText theme="light" className="text-lg lg:text-xl" />
        </Link>
        <p className="text-xs lg:text-sm mt-1.5 lg:mt-2 text-[#0F172A]/70 font-medium">Arts Dashboard</p>
      </div>
      <nav className="flex-1 p-3 lg:p-4 space-y-0.5 lg:space-y-1">
        {ARTS_NAV.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const badge = getBadge(item);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 lg:px-4 lg:py-3 rounded-xl transition-all duration-200 text-sm lg:text-base ${isActive ? navActive : navInactive}`}
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
      <div className={`p-3 lg:p-4 ${footerStyle}`}>
        <Link
          to="/arts/instellingen"
          className={`flex items-center space-x-3 px-3 py-2.5 lg:px-4 lg:py-3 rounded-xl transition mb-1.5 lg:mb-2 text-sm lg:text-base ${footerLink}`}
          onClick={() => setSidebarOpen(false)}
        >
          <Settings className="w-4 h-4 lg:w-5 lg:h-5" />
          <span>Instellingen</span>
        </Link>
        <button
          onClick={handleSignOut}
          className={`flex items-center space-x-3 px-3 py-2.5 lg:px-4 lg:py-3 rounded-xl transition w-full text-sm lg:text-base ${footerLink}`}
        >
          <LogOut className="w-4 h-4 lg:w-5 lg:h-5" />
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
      <div className="flex-1 flex flex-col min-w-0">
        <header className={`bg-white border-b lg:hidden ${headerBorder}`}>
          <div className="flex items-center justify-between px-3 py-2.5 md:px-4 md:py-4">
            <Link to="/arts/dashboard" className="inline-block"><LogoText theme="light" className="text-lg" /></Link>
            <div className="flex items-center gap-1">
              <Link to="/arts/inbox" className="p-2 rounded-lg hover:bg-gray-100 text-[#0F172A] relative">
                <MessageSquare className="w-5 h-5" />
                {unreadMessages > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-semibold bg-[#4FA151] text-white rounded-full px-1">
                    {unreadMessages > 9 ? '9+' : unreadMessages}
                  </span>
                )}
              </Link>
              <Link to="/arts/uitnodigingen" className="p-2 rounded-lg hover:bg-gray-100 text-[#0F172A] relative">
                <Bell className="w-5 h-5" />
                {pendingInvites > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-semibold bg-[#4FA151] text-white rounded-full px-1">
                    {pendingInvites > 9 ? '9+' : pendingInvites}
                  </span>
                )}
              </Link>
              <Link to="/arts/profiel" className="p-1.5 rounded-full hover:bg-gray-100 text-[#0F172A] flex items-center justify-center w-9 h-9 bg-[#F4FAF4] border border-[#4FA151]/20">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-[#4FA151]" />
                )}
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto pb-20 lg:pb-0">{children}</main>

        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#4FA151]/15 z-40 lg:hidden safe-area-pb">
          <div className="grid grid-cols-3 h-14">
            <Link to="/arts/opdrachten" className="flex flex-col items-center justify-center gap-0.5 text-[#0F172A] hover:bg-[#F4FAF4] transition">
              <Search className="w-5 h-5 text-[#4FA151]" />
              <span className="text-[10px] font-medium">Zoeken</span>
            </Link>
            <button
              type="button"
              onClick={() => setBottomSheetOpen(true)}
              className="flex flex-col items-center justify-center gap-0.5 text-[#0F172A] hover:bg-[#F4FAF4] transition"
            >
              <List className="w-5 h-5 text-[#4FA151]" />
              <span className="text-[10px] font-medium">Menu</span>
            </button>
            <Link to="/arts/abonnement" className="flex flex-col items-center justify-center gap-0.5 text-[#0F172A] hover:bg-[#F4FAF4] transition">
              <Crown className="w-5 h-5 text-[#4FA151]" />
              <span className="text-[10px] font-medium">Upgrade PRO</span>
            </Link>
          </div>
        </nav>

        {bottomSheetOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setBottomSheetOpen(false)} />
            <div className="absolute bottom-0 left-0 right-0 max-h-[75vh] flex flex-col bg-white rounded-t-2xl overflow-hidden animate-in slide-in-from-bottom duration-200 border-t border-[#4FA151]/15 shadow-lg">
              <div className="flex items-center justify-between p-4 border-b border-[#4FA151]/15">
                <span className="font-semibold text-[#0F172A]">Menu</span>
                <button onClick={() => setBottomSheetOpen(false)} className="p-2 rounded-lg hover:bg-[#F4FAF4] text-[#0F172A]">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 overflow-auto p-3 space-y-0.5">
                {ARTS_NAV.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  const badge = getBadge(item);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setBottomSheetOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm ${isActive ? 'bg-[#4FA151] text-white' : 'text-[#0F172A]/90 hover:bg-[#F4FAF4]'}`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      {badge > 0 && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-[#4FA151] text-white'}`}>
                          {badge > 9 ? '9+' : badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
              <div className="p-3 border-t border-[#4FA151]/15 space-y-1">
                <Link to="/arts/instellingen" onClick={() => setBottomSheetOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#0F172A]/90 hover:bg-[#F4FAF4] text-sm">
                  <Settings className="w-5 h-5" />
                  <span>Instellingen</span>
                </Link>
                <button onClick={() => { handleSignOut(); setBottomSheetOpen(false); }} className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#0F172A]/90 hover:bg-[#F4FAF4] text-sm w-full">
                  <LogOut className="w-5 h-5" />
                  <span>Uitloggen</span>
                </button>
              </div>
              <div className="p-3 grid grid-cols-3 gap-2 bg-[#F4FAF4] border-t border-[#4FA151]/15">
                <Link to="/arts/opdrachten" onClick={() => setBottomSheetOpen(false)} className="flex flex-col items-center justify-center py-2.5 rounded-lg hover:bg-[#4FA151]/10 transition">
                  <Search className="w-5 h-5 text-[#4FA151] mb-1" />
                  <span className="text-[10px] text-[#0F172A] font-medium">Zoeken</span>
                </Link>
                <Link to="/arts/reacties" onClick={() => setBottomSheetOpen(false)} className="flex flex-col items-center justify-center py-2.5 rounded-lg hover:bg-[#4FA151]/10 transition">
                  <Send className="w-5 h-5 text-[#4FA151] mb-1" />
                  <span className="text-[10px] text-[#0F172A] font-medium">Reacties</span>
                </Link>
                <Link to="/arts/abonnement" onClick={() => setBottomSheetOpen(false)} className="flex flex-col items-center justify-center py-2.5 rounded-lg hover:bg-[#4FA151]/10 transition">
                  <Crown className="w-5 h-5 text-[#4FA151] mb-1" />
                  <span className="text-[10px] text-[#0F172A] font-medium">Upgrade PRO</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
