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
  FileCheck,
  CreditCard,
  CheckCircle,
  List,
  X,
  BookOpen,
  Bell,
  ChevronDown,
  Search,
  Sparkles,
} from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getInstellingenPath = () => {
    if (!profile) return '/';
    switch (profile.role) {
      case 'ORGANISATIE': return '/organisatie/profiel';
      case 'ADMIN': return '/admin/instellingen';
      default: return '/';
    }
  };

  const getInboxPath = () => {
    if (!profile) return '/';
    return profile.role === 'ORGANISATIE' ? '/organisatie/inbox' : '#';
  };

  const getProfilePath = () => {
    if (!profile) return '/';
    switch (profile.role) {
      case 'ORGANISATIE': return '/organisatie/profiel';
      case 'ADMIN': return '/admin/instellingen';
      default: return '/';
    }
  };

  const getMobileQuickActions = () => {
    if (!profile) return [];
    if (profile.role === 'ADMIN') {
      return [
        { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/admin/professionals', label: 'Professionals', icon: User },
        { path: '/admin/instellingen', label: 'Instellingen', icon: Settings },
      ];
    }
    return [
      { path: '/organisatie/opdrachten', label: 'Opdrachten', icon: Briefcase },
      { path: '/organisatie/kandidaten', label: 'Kandidaten', icon: Users },
      { path: '/organisatie/abonnement', label: 'Abonnement', icon: CreditCard },
    ];
  };

  const getNavigationGroups = (): NavGroup[] => {
    if (!profile) return [];
    if (profile.role === 'ADMIN') {
      return [
        {
          title: '',
          items: [{ path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
        },
        {
          title: 'Beheer',
          items: [
            { path: '/admin/verificaties', label: 'BIG Verificaties', icon: CheckCircle },
            { path: '/admin/gebruikers', label: 'Gebruikers', icon: Users },
            { path: '/admin/professionals', label: 'Professionals', icon: User },
            { path: '/admin/organisaties', label: 'Organisaties', icon: Building2 },
          ],
        },
        {
          title: 'Opdrachten',
          items: [
            { path: '/admin/opdrachten', label: 'Opdrachten', icon: Briefcase },
            { path: '/admin/jobs/review', label: 'Review', icon: FileCheck },
            { path: '/admin/matches', label: 'Matching', icon: Sparkles },
            { path: '/admin/reacties', label: 'Reacties', icon: FileText },
          ],
        },
        {
          title: 'Systeem',
          items: [
            { path: '/admin/abonnementen', label: 'Abonnementen', icon: CreditCard },
            { path: '/admin/community', label: 'Community', icon: BookOpen },
          ],
        },
      ];
    }
    if (profile.role === 'ORGANISATIE') {
      return [
        {
          title: '',
          items: [{ path: '/organisatie/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
        },
        {
          title: '',
          items: [
            { path: '/organisatie/profiel', label: 'Profiel', icon: User },
            { path: '/organisatie/opdrachten', label: 'Mijn opdrachten', icon: Briefcase },
            { path: '/organisatie/kandidaten', label: 'Kandidaten', icon: Users },
            { path: '/organisatie/favorieten', label: 'Favorieten', icon: Heart },
            { path: '/organisatie/inbox', label: 'Berichten', icon: MessageSquare },
            { path: '/organisatie/abonnement', label: 'Abonnement', icon: CreditCard },
          ].sort((a, b) => a.label.localeCompare(b.label, 'nl')),
        },
      ];
    }
    return [];
  };

  const getAllNavItems = (): NavItem[] => {
    return getNavigationGroups().flatMap((g) => g.items);
  };

  const navGroups = getNavigationGroups();
  const allNavItems = getAllNavItems();

  const navActive = 'bg-gradient-to-r from-emerald-500 to-green-400 text-white shadow-sm shadow-emerald-500/10';
  const navInactive = 'text-slate-600 hover:bg-slate-50 hover:text-slate-900';

  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = (e: MouseEvent) => { if (accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountOpen(false); };
    document.addEventListener('click', fn);
    return () => document.removeEventListener('click', fn);
  }, []);
  const displayName = profile?.full_name?.trim() || profile?.email || 'Account';

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, []);

  const SidebarContent = () => (
    <nav className="flex-1 p-3 lg:p-4 space-y-4 overflow-y-auto">
      {navGroups.map((group, gi) => (
        <div key={gi}>
          {group.title && (
            <p className="px-3 lg:px-4 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              {group.title}
            </p>
          )}
          <div className="space-y-0.5">
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path ||
                (item.path !== '/admin/dashboard' && item.path !== '/organisatie/dashboard' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 lg:px-4 lg:py-2.5 rounded-lg transition-all duration-150 text-sm ${isActive ? navActive : navInactive}`}
                >
                  <Icon className="w-4 h-4 lg:w-[18px] lg:h-[18px] shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  const SidebarFooter = () => (
    <div className="border-t border-slate-100 p-3 lg:p-4 space-y-1">
      <Link
        to={getInstellingenPath()}
        className={`flex items-center space-x-3 px-3 py-2 lg:px-4 lg:py-2.5 rounded-lg text-sm ${location.pathname === getInstellingenPath() ? navActive : navInactive}`}
      >
        <Settings className="w-4 h-4 lg:w-[18px] lg:h-[18px] shrink-0" />
        <span>Instellingen</span>
      </Link>
      <button
        type="button"
        onClick={handleSignOut}
        className="flex items-center space-x-3 px-3 py-2 lg:px-4 lg:py-2.5 rounded-lg text-sm text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-150 w-full"
      >
        <LogOut className="w-4 h-4 lg:w-[18px] lg:h-[18px] shrink-0" />
        <span>Uitloggen</span>
      </button>
      <p className="px-3 lg:px-4 pt-1 text-[10px] text-slate-300">v0.30.0</p>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="flex items-center w-full bg-white border-b border-slate-200 shrink-0">
        <div className="flex px-4 lg:w-64 lg:px-6 items-center shrink-0">
          <Link to="/" className="inline-block" aria-label="ArboMatcher">
            <LogoText theme="light" className="text-lg lg:text-xl" />
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-between px-3 py-2.5 md:px-4 md:py-3 lg:px-6 min-w-0">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-400 hover:text-slate-600 hover:border-slate-300 transition w-64"
          >
            <Search className="w-4 h-4" />
            <span>Zoeken...</span>
            <kbd className="ml-auto text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-400">⌘K</kbd>
          </button>
          <div className="flex items-center gap-1 ml-auto">
            {getInboxPath() !== '#' && (
              <Link to={getInboxPath()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-700 lg:hidden">
                <MessageSquare className="w-5 h-5" />
              </Link>
            )}
            <Link to={getInboxPath() !== '#' ? getInboxPath() : '#'} className="p-2 rounded-lg hover:bg-slate-100 text-slate-700 lg:hidden">
              <Bell className="w-5 h-5" />
            </Link>
            <div className="relative hidden lg:block" ref={accountRef}>
              <button
                type="button"
                onClick={() => setAccountOpen((o) => !o)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition text-slate-700"
                aria-expanded={accountOpen}
                aria-haspopup="true"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-emerald-500 to-green-400 text-white flex items-center justify-center text-xs font-medium">
                  {(displayName[0] || 'A').toUpperCase()}
                </div>
                <span className="max-w-[120px] truncate text-sm font-medium">{displayName}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition ${accountOpen ? 'rotate-180' : ''}`} />
              </button>
              {accountOpen && (
                <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="font-semibold text-slate-900 truncate">{displayName}</p>
                    {profile?.email && <p className="text-xs text-slate-500 truncate mt-0.5">{profile.email}</p>}
                  </div>
                  <Link
                    to={getInstellingenPath()}
                    onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <Settings className="w-4 h-4" />
                    Instellingen
                  </Link>
                  <button
                    type="button"
                    onClick={() => { setAccountOpen(false); handleSignOut(); }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Uitloggen
                  </button>
                </div>
              )}
            </div>
            <Link to={getProfilePath()} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 flex items-center justify-center w-9 h-9 bg-slate-50 border border-slate-200 lg:hidden">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" width={24} height={24} className="w-6 h-6 rounded-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-slate-500" />
              )}
            </Link>
          </div>
        </div>
      </header>
      <div className="flex flex-1 min-w-0">
        <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-slate-200">
          <SidebarContent />
          <SidebarFooter />
        </aside>
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 overflow-auto pb-20 lg:pb-0">{children}</main>

          <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 lg:hidden safe-area-pb">
            <div className="grid grid-cols-3 h-14">
              {(() => {
                const qa = getMobileQuickActions();
                if (qa.length < 3) return null;
                const [first, , third] = qa;
                const FirstIcon = first.icon;
                const ThirdIcon = third.icon;
                return (
                  <>
                    <Link to={first.path} className="flex flex-col items-center justify-center gap-0.5 text-slate-700 hover:bg-slate-50 transition">
                      <FirstIcon className="w-5 h-5 text-slate-500" />
                      <span className="text-[10px] font-medium">{first.label}</span>
                    </Link>
                    <button type="button" onClick={() => setBottomSheetOpen(true)} className="flex flex-col items-center justify-center gap-0.5 text-slate-700 hover:bg-slate-50 transition">
                      <List className="w-5 h-5 text-slate-500" />
                      <span className="text-[10px] font-medium">Menu</span>
                    </button>
                    <Link to={third.path} className="flex flex-col items-center justify-center gap-0.5 text-slate-700 hover:bg-slate-50 transition">
                      <ThirdIcon className="w-5 h-5 text-slate-500" />
                      <span className="text-[10px] font-medium">{third.label}</span>
                    </Link>
                  </>
                );
              })()}
            </div>
          </nav>

          {bottomSheetOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setBottomSheetOpen(false)} />
              <div className="absolute bottom-0 left-0 right-0 max-h-[75vh] flex flex-col bg-white rounded-t-2xl overflow-hidden animate-in slide-in-from-bottom duration-200 border-t border-slate-200 shadow-lg">
                <div className="flex items-center justify-between p-4 border-b border-slate-100">
                  <span className="font-semibold text-slate-900">Menu</span>
                  <button onClick={() => setBottomSheetOpen(false)} className="p-2 rounded-lg hover:bg-slate-50 text-slate-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="flex-1 overflow-auto p-3 space-y-3">
                  {navGroups.map((group, gi) => (
                    <div key={gi}>
                      {group.title && (
                        <p className="px-4 mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">{group.title}</p>
                      )}
                      <div className="space-y-0.5">
                        {group.items.map((item) => {
                          const Icon = item.icon;
                          const isActive = location.pathname === item.path;
                          return (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={() => setBottomSheetOpen(false)}
                              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${isActive ? 'bg-gradient-to-r from-emerald-500 to-green-400 text-white' : 'text-slate-700 hover:bg-slate-50'}`}
                            >
                              <Icon className="w-5 h-5 shrink-0" />
                              <span>{item.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </nav>
                <div className="p-3 border-t border-slate-100 space-y-1">
                  <Link to={getInstellingenPath()} onClick={() => setBottomSheetOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-50 text-sm">
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

      {searchOpen && (
        <CommandPalette
          items={allNavItems}
          onClose={() => setSearchOpen(false)}
          onNavigate={(path) => { navigate(path); setSearchOpen(false); }}
        />
      )}
    </div>
  );
}

function CommandPalette({ items, onClose, onNavigate }: { items: NavItem[]; onClose: () => void; onNavigate: (path: string) => void }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filtered = query.trim()
    ? items.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
    : items;

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => { setSelectedIndex(0); }, [query]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1)); return; }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex((i) => Math.max(i - 1, 0)); return; }
    if (e.key === 'Enter' && filtered[selectedIndex]) { onNavigate(filtered[selectedIndex].path); }
  }, [filtered, selectedIndex, onClose, onNavigate]);

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative mx-auto mt-[15vh] w-full max-w-lg">
        <div className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
          <div className="flex items-center gap-3 px-4 border-b border-slate-100">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Zoek pagina's..."
              className="flex-1 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
            />
            <kbd className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-400">ESC</kbd>
          </div>
          <div className="max-h-72 overflow-y-auto py-2">
            {filtered.length === 0 ? (
              <p className="px-4 py-6 text-sm text-slate-400 text-center">Geen resultaten</p>
            ) : (
              filtered.map((item, i) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => onNavigate(item.path)}
                    onMouseEnter={() => setSelectedIndex(i)}
                    className={`flex items-center gap-3 px-4 py-2.5 w-full text-left text-sm transition-colors ${
                      i === selectedIndex ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                    {i === selectedIndex && (
                      <span className="ml-auto text-[10px] text-slate-400">↵ openen</span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
