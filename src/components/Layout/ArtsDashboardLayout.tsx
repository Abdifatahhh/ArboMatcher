import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
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

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
  badge?: 'invites' | 'messages';
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Overzicht',
    items: [
      { path: '/professional/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Opdrachten',
    items: [
      { path: '/professional/opdrachten', label: 'Zoeken', icon: Search },
      { path: '/professional/zoekopdrachten', label: 'Mijn zoekopdrachten', icon: Bookmark },
      { path: '/professional/favorieten', label: 'Favorieten', icon: Heart },
    ],
  },
  {
    title: 'Reacties & berichten',
    items: [
      { path: '/professional/reacties', label: 'Verstuurde reacties', icon: Send },
      { path: '/professional/beoordelingen', label: 'Gegeven beoordelingen', icon: Star },
      { path: '/professional/uitnodigingen', label: 'Uitnodigingen', icon: Bell, badge: 'invites' as const },
      { path: '/professional/inbox', label: 'Berichten', icon: MessageSquare, badge: 'messages' as const },
    ],
  },
  {
    title: 'Account',
    items: [
      { path: '/professional/profiel', label: 'Mijn profiel', icon: FileText },
      { path: '/professional/abonnement', label: 'Upgrade naar PRO', icon: Crown },
    ],
  },
];

const ALL_NAV_ITEMS = NAV_GROUPS.flatMap((g) => g.items);

export function ArtsDashboardLayout() {
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
    const { data: professional } = await supabase.from('professionals').select('id').eq('user_id', user.id).maybeSingle();
    if (professional) {
      const { count } = await supabase.from('invites').select('id', { count: 'exact' }).eq('professional_id', professional.id).eq('status', 'PENDING');
      setPendingInvites(count || 0);
    }
    const { count } = await supabase.from('messages').select('id', { count: 'exact' }).is('read_at', null).neq('sender_id', user.id);
    setUnreadMessages(count || 0);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getBadge = (item: NavItem) => {
    if (item.badge === 'invites') return pendingInvites;
    if (item.badge === 'messages') return unreadMessages;
    return 0;
  };

  const NavLink = ({ item, compact }: { item: NavItem; compact?: boolean }) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path;
    const badge = getBadge(item);
    return (
      <Link
        to={item.path}
        className={`flex items-center justify-between px-3 py-2 ${compact ? '' : 'lg:px-3.5 lg:py-2.5'} rounded-xl transition-all duration-200 text-[13px] lg:text-sm ${
          isActive
            ? 'bg-[#0F172A] text-white shadow-md shadow-slate-900/10'
            : 'text-slate-600 hover:bg-white hover:text-[#0F172A] hover:shadow-sm'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <Icon className="w-[18px] h-[18px] shrink-0" />
          <span className="truncate">{item.label}</span>
        </div>
        {badge > 0 && (
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${isActive ? 'bg-white text-[#0F172A]' : 'bg-[#0F172A] text-white'}`}>
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </Link>
    );
  };

  const SidebarContent = () => (
    <>
      <div className="p-4 lg:p-5 border-b border-slate-200">
        <Link to="/" className="inline-block">
          <LogoText theme="light" className="text-lg lg:text-xl" />
        </Link>
        <p className="text-[11px] lg:text-xs mt-1.5 text-slate-400 font-medium tracking-wide">Professional Portal</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 lg:p-3.5 space-y-5">
        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            <p className="px-3 mb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{group.title}</p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink key={item.path} item={item} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-3 lg:p-3.5 border-t border-slate-200">
        <Link
          to="/professional/instellingen"
          className={`flex items-center gap-2.5 px-3 py-2 lg:px-3.5 lg:py-2.5 rounded-xl transition text-[13px] lg:text-sm ${
            location.pathname === '/professional/instellingen'
              ? 'bg-[#0F172A] text-white shadow-md shadow-slate-900/10'
              : 'text-slate-600 hover:bg-white hover:text-[#0F172A]'
          }`}
        >
          <Settings className="w-[18px] h-[18px]" />
          <span>Instellingen</span>
        </Link>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2.5 px-3 py-2 lg:px-3.5 lg:py-2.5 rounded-xl transition w-full text-[13px] lg:text-sm text-slate-600 hover:bg-white hover:text-[#0F172A] mt-0.5"
        >
          <LogOut className="w-[18px] h-[18px]" />
          <span>Uitloggen</span>
        </button>
        <p className="text-[10px] text-slate-300 mt-2 px-3">v0.30.0</p>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-white">
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-slate-50 border-r border-slate-200">
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 lg:hidden">
          <div className="flex items-center justify-between px-3 py-2.5 md:px-4 md:py-3">
            <Link to="/professional/dashboard" className="inline-block">
              <LogoText theme="light" className="text-lg" />
            </Link>
            <div className="flex items-center gap-1">
              <Link to="/professional/inbox" className="p-2 rounded-lg hover:bg-slate-50 text-[#0F172A] relative">
                <MessageSquare className="w-5 h-5" />
                {unreadMessages > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-semibold bg-[#0F172A] text-white rounded-full px-1">
                    {unreadMessages > 9 ? '9+' : unreadMessages}
                  </span>
                )}
              </Link>
              <Link to="/professional/uitnodigingen" className="p-2 rounded-lg hover:bg-slate-50 text-[#0F172A] relative">
                <Bell className="w-5 h-5" />
                {pendingInvites > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-semibold bg-[#0F172A] text-white rounded-full px-1">
                    {pendingInvites > 9 ? '9+' : pendingInvites}
                  </span>
                )}
              </Link>
              <Link to="/professional/profiel" className="p-1.5 rounded-full hover:bg-slate-50 text-[#0F172A] flex items-center justify-center w-9 h-9 bg-slate-50 border border-slate-200">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" width={24} height={24} className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-slate-700" />
                )}
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto pb-20 lg:pb-0"><Outlet /></main>

        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 lg:hidden safe-area-pb">
          <div className="grid grid-cols-3 h-14">
            <Link to="/professional/opdrachten" className="flex flex-col items-center justify-center gap-0.5 text-[#0F172A] hover:bg-slate-50 transition">
              <Search className="w-5 h-5 text-slate-700" />
              <span className="text-[10px] font-medium">Zoeken</span>
            </Link>
            <button
              type="button"
              onClick={() => setBottomSheetOpen(true)}
              className="flex flex-col items-center justify-center gap-0.5 text-[#0F172A] hover:bg-slate-50 transition"
            >
              <List className="w-5 h-5 text-slate-700" />
              <span className="text-[10px] font-medium">Menu</span>
            </button>
            <Link to="/professional/abonnement" className="flex flex-col items-center justify-center gap-0.5 text-[#0F172A] hover:bg-slate-50 transition">
              <Crown className="w-5 h-5 text-slate-700" />
              <span className="text-[10px] font-medium">Upgrade PRO</span>
            </Link>
          </div>
        </nav>

        {bottomSheetOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setBottomSheetOpen(false)} />
            <div className="absolute bottom-0 left-0 right-0 max-h-[75vh] flex flex-col bg-white rounded-t-2xl overflow-hidden animate-in slide-in-from-bottom duration-200 border-t border-slate-200 shadow-lg">
              <div className="flex items-center justify-between p-4 border-b border-slate-200">
                <span className="font-semibold text-[#0F172A]">Menu</span>
                <button onClick={() => setBottomSheetOpen(false)} className="p-2 rounded-lg hover:bg-slate-50 text-[#0F172A]">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 overflow-auto p-3 space-y-4">
                {NAV_GROUPS.map((group) => (
                  <div key={group.title}>
                    <p className="px-4 mb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{group.title}</p>
                    <div className="space-y-0.5">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        const badge = getBadge(item);
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setBottomSheetOpen(false)}
                            className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm ${isActive ? 'bg-[#0F172A] text-white' : 'text-slate-700 hover:bg-slate-50'}`}
                          >
                            <div className="flex items-center gap-3">
                              <Icon className="w-5 h-5 shrink-0" />
                              <span>{item.label}</span>
                            </div>
                            {badge > 0 && (
                              <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-[#0F172A] text-white'}`}>
                                {badge > 9 ? '9+' : badge}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>
              <div className="p-3 border-t border-slate-200 space-y-1">
                <Link to="/professional/instellingen" onClick={() => setBottomSheetOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-50 text-sm">
                  <Settings className="w-5 h-5" />
                  <span>Instellingen</span>
                </Link>
                <button onClick={() => { handleSignOut(); setBottomSheetOpen(false); }} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-50 text-sm w-full">
                  <LogOut className="w-5 h-5" />
                  <span>Uitloggen</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
