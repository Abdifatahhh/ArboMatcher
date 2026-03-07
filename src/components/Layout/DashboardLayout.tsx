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
  List,
  X,
  BookOpen,
  Bell,
  UserCircle,
} from 'lucide-react';
import { useState } from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getInstellingenPath = () => {
    if (!profile) return '/';
    switch (profile.role) {
      case 'OPDRACHTGEVER':
      case 'company': return '/opdrachtgever/profiel';
      case 'intermediary': return '/opdrachtgever/profiel';
      case 'ADMIN': return '/admin/instellingen';
      default: return '/';
    }
  };

  const getInboxPath = () => {
    if (!profile) return '/';
    switch (profile.role) {
      case 'OPDRACHTGEVER':
      case 'company':
      case 'intermediary': return '/opdrachtgever/inbox';
      default: return '#';
    }
  };

  const getProfilePath = () => {
    if (!profile) return '/';
    switch (profile.role) {
      case 'OPDRACHTGEVER':
      case 'company':
      case 'intermediary': return '/opdrachtgever/profiel';
      case 'ADMIN': return '/admin/instellingen';
      default: return '/';
    }
  };

  const getMobileQuickActions = () => {
    if (!profile) return [];
    if (profile.role === 'ADMIN') {
      return [
        { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/admin/artsen', label: 'Professionals', icon: User },
        { path: '/admin/instellingen', label: 'Instellingen', icon: Settings },
      ];
    }
    return [
      { path: '/opdrachtgever/opdrachten', label: 'Opdrachten', icon: Briefcase },
      { path: '/opdrachtgever/kandidaten', label: 'Kandidaten', icon: Users },
      { path: '/opdrachtgever/abonnement', label: 'Abonnement', icon: CreditCard },
    ];
  };

  const getNavigationItems = () => {
    if (!profile) return [];
    switch (profile.role) {
      case 'OPDRACHTGEVER':
      case 'company': {
        const ogRest = [
          { path: '/opdrachtgever/profiel', label: 'Bedrijfsprofiel', icon: User },
          { path: '/opdrachtgever/opdrachten', label: 'Mijn opdrachten', icon: Briefcase },
          { path: '/opdrachtgever/kandidaten', label: 'Kandidaten', icon: Users },
          { path: '/opdrachtgever/favorieten', label: 'Favorieten', icon: Heart },
          { path: '/opdrachtgever/inbox', label: 'Berichten', icon: MessageSquare },
          { path: '/opdrachtgever/abonnement', label: 'Abonnement', icon: CreditCard },
        ].sort((a, b) => a.label.localeCompare(b.label, 'nl'));
        return [{ path: '/opdrachtgever/dashboard', label: 'Dashboard', icon: LayoutDashboard }, ...ogRest];
      }
      case 'intermediary': {
        const intRest = [
          { path: '/opdrachtgever/profiel', label: 'Bedrijfsprofiel', icon: User },
          { path: '/opdrachtgever/opdrachten', label: 'Mijn opdrachten', icon: Briefcase },
          { path: '/opdrachtgever/kandidaten', label: 'Kandidaten', icon: Users },
          { path: '/opdrachtgever/favorieten', label: 'Favorieten', icon: Heart },
          { path: '/opdrachtgever/inbox', label: 'Berichten', icon: MessageSquare },
          { path: '/opdrachtgever/abonnement', label: 'Abonnement', icon: CreditCard },
        ].sort((a, b) => a.label.localeCompare(b.label, 'nl'));
        return [{ path: '/intermediair/dashboard', label: 'Dashboard', icon: LayoutDashboard }, ...intRest];
      }
      case 'ADMIN': {
        const rest = [
          { path: '/admin/verificaties', label: 'BIG Verificaties', icon: CheckCircle },
          { path: '/admin/artsen', label: 'Professionals', icon: User },
          { path: '/admin/gebruikers', label: 'Gebruikers', icon: Users },
          { path: '/admin/opdrachtgevers', label: 'Organisaties', icon: Building2 },
          { path: '/admin/intermediairs', label: 'Intermediairs', icon: UserCircle },
          { path: '/admin/opdrachten', label: 'Opdrachten', icon: Briefcase },
          { path: '/admin/reacties', label: 'Reacties', icon: FileText },
          { path: '/admin/abonnementen', label: 'Abonnementen', icon: CreditCard },
          { path: '/admin/community', label: 'Community', icon: BookOpen },
        ].sort((a, b) => a.label.localeCompare(b.label, 'nl'));
        return [{ path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard }, ...rest];
      }
      default: return [];
    }
  };

  const navItems = getNavigationItems();
  const isAdmin = profile?.role === 'ADMIN';
  const useGreenSidebar = isAdmin || profile?.role === 'OPDRACHTGEVER' || profile?.role === 'company' || profile?.role === 'intermediary';

  const sidebarBg = useGreenSidebar
    ? 'bg-[#F4FAF4] border-r border-[#4FA151]/15 shadow-lg shadow-slate-200/20'
    : 'bg-white border-r border-gray-200';
  const headerBorder = useGreenSidebar ? 'border-[#4FA151]/15' : 'border-gray-200';
  const navActive = useGreenSidebar
    ? 'bg-[#4FA151] text-white shadow-md shadow-[#4FA151]/25'
    : 'bg-[#0F172A] text-white';
  const navInactive = useGreenSidebar
    ? 'text-[#0F172A]/80 hover:bg-white/80 hover:text-[#0F172A]'
    : 'text-gray-700 hover:bg-gray-100';
  const footerStyle = useGreenSidebar ? 'border-t border-[#4FA151]/15' : 'border-t border-gray-200';
  const footerLink = useGreenSidebar
    ? 'text-[#0F172A]/80 hover:bg-white/80 hover:text-[#0F172A]'
    : 'text-gray-700 hover:bg-gray-100';
  const mainBg = 'bg-gradient-to-b from-[#E8F5E9] via-[#F4FAF4] to-white';

  const SidebarContent = () => (
    <>
      <div className={`p-4 lg:p-6 border-b ${headerBorder}`}>
        <Link to="/" className="inline-block">
          <LogoText theme="light" className="text-lg lg:text-xl" />
        </Link>
        {profile && (
          <p className={`text-xs lg:text-sm mt-1.5 lg:mt-2 ${useGreenSidebar ? 'text-[#0F172A]/70 font-medium' : 'text-gray-600'}`}>
            {(profile.role === 'OPDRACHTGEVER' || profile.role === 'company') && 'Bedrijf Dashboard'}
            {profile.role === 'intermediary' && 'Intermediair Dashboard'}
            {profile.role === 'ADMIN' && 'Admin Dashboard'}
          </p>
        )}
      </div>
      <nav className="flex-1 p-3 lg:p-4 space-y-0.5 lg:space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-3 py-2.5 lg:px-4 lg:py-3 rounded-xl transition-all duration-200 text-sm lg:text-base ${isActive ? navActive : navInactive}`}
            >
              <Icon className="w-4 h-4 lg:w-5 lg:h-5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className={`p-3 lg:p-4 ${footerStyle}`}>
        <Link
          to={getInstellingenPath()}
          className={`flex items-center space-x-3 px-3 py-2.5 lg:px-4 lg:py-3 rounded-xl transition mb-1.5 lg:mb-2 text-sm lg:text-base ${footerLink}`}
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
            <Link to={profile?.role === 'ADMIN' ? '/admin/dashboard' : '/opdrachtgever/dashboard'} className="inline-block"><LogoText theme="light" className="text-lg" /></Link>
            <div className="flex items-center gap-1">
              {getInboxPath() !== '#' && (
                <Link to={getInboxPath()} className="p-2 rounded-lg hover:bg-gray-100 text-[#0F172A]">
                  <MessageSquare className="w-5 h-5" />
                </Link>
              )}
              <Link to={getInboxPath() !== '#' ? getInboxPath() : '#'} className="p-2 rounded-lg hover:bg-gray-100 text-[#0F172A]">
                <Bell className="w-5 h-5" />
              </Link>
              <Link to={getProfilePath()} className="p-1.5 rounded-full hover:bg-gray-100 text-[#0F172A] flex items-center justify-center w-9 h-9 bg-[#F4FAF4] border border-[#4FA151]/20">
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
            {(() => {
              const qa = getMobileQuickActions();
              if (qa.length < 3) return null;
              const [first, , third] = qa;
              const FirstIcon = first.icon;
              const ThirdIcon = third.icon;
              return (
                <>
                  <Link to={first.path} className="flex flex-col items-center justify-center gap-0.5 text-[#0F172A] hover:bg-[#F4FAF4] transition">
                    <FirstIcon className="w-5 h-5 text-[#4FA151]" />
                    <span className="text-[10px] font-medium">{first.label}</span>
                  </Link>
                  <button type="button" onClick={() => setBottomSheetOpen(true)} className="flex flex-col items-center justify-center gap-0.5 text-[#0F172A] hover:bg-[#F4FAF4] transition">
                    <List className="w-5 h-5 text-[#4FA151]" />
                    <span className="text-[10px] font-medium">Menu</span>
                  </button>
                  <Link to={third.path} className="flex flex-col items-center justify-center gap-0.5 text-[#0F172A] hover:bg-[#F4FAF4] transition">
                    <ThirdIcon className="w-5 h-5 text-[#4FA151]" />
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
            <div className="absolute bottom-0 left-0 right-0 max-h-[75vh] flex flex-col bg-white rounded-t-2xl overflow-hidden animate-in slide-in-from-bottom duration-200 border-t border-[#4FA151]/15 shadow-lg">
              <div className="flex items-center justify-between p-4 border-b border-[#4FA151]/15">
                <span className="font-semibold text-[#0F172A]">Menu</span>
                <button onClick={() => setBottomSheetOpen(false)} className="p-2 rounded-lg hover:bg-[#F4FAF4] text-[#0F172A]">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 overflow-auto p-3 space-y-0.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setBottomSheetOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${isActive ? 'bg-[#4FA151] text-white' : 'text-[#0F172A]/90 hover:bg-[#F4FAF4]'}`}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
              <div className="p-3 border-t border-[#4FA151]/15 space-y-1">
                <Link to={getInstellingenPath()} onClick={() => setBottomSheetOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#0F172A]/90 hover:bg-[#F4FAF4] text-sm">
                  <Settings className="w-5 h-5" />
                  <span>Instellingen</span>
                </Link>
                <button onClick={() => { handleSignOut(); setBottomSheetOpen(false); }} className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#0F172A]/90 hover:bg-[#F4FAF4] text-sm w-full">
                  <LogOut className="w-5 h-5" />
                  <span>Uitloggen</span>
                </button>
              </div>
              <div className="p-3 grid grid-cols-3 gap-2 bg-[#F4FAF4] border-t border-[#4FA151]/15">
                {getMobileQuickActions().map((action, i) => {
                  const Icon = action.icon;
                  return (
                    <Link key={action.path} to={action.path} onClick={() => setBottomSheetOpen(false)} className="flex flex-col items-center justify-center py-2.5 rounded-lg hover:bg-[#4FA151]/10 transition">
                      <Icon className="w-5 h-5 mb-1 text-[#4FA151]" />
                      <span className="text-[10px] text-[#0F172A] font-medium">{action.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
