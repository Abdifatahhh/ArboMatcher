import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogoText } from '../ui/Logo.tsx';
import { AuthLink } from '../AuthLink';
import { Menu, X, User, LogOut, Phone, Mail, MapPin } from 'lucide-react';
import { useState } from 'react';
import { preloadRoute } from '../../routes/lazyPages';

function prefetch(to: string) {
  return () => preloadRoute(to);
}

interface PublicLayoutProps {
  children: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!profile) return '/';
    switch (profile.role) {
      case 'professional': return '/professional/dashboard';
      case 'ORGANISATIE': return '/organisatie/dashboard';
      case 'ADMIN': return '/admin/dashboard';
      default: return '/';
    }
  };

  const navLinks = [
    { to: '/opdrachten', label: 'Opdrachten' },
    { to: '/oplossingen', label: 'Oplossingen' },
    { to: '/community', label: 'Community' },
    { to: '/over', label: 'Over ons' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0F172A]">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-10">
              <Link to="/" className="text-xl shrink-0">
                <LogoText theme="dark" />
              </Link>
              <div className="hidden lg:flex items-center gap-1">
                {navLinks.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white transition"
                    onMouseEnter={prefetch(item.to)}
                    onTouchStart={prefetch(item.to)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <a href="tel:013-1234567" className="hidden xl:flex items-center gap-1.5 px-3 py-2 text-xs text-slate-400 hover:text-white transition">
                <Phone className="w-3 h-3" />
                013-1234567
              </a>
              {user && profile ? (
                <>
                  <Link to={getDashboardLink()} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white transition">
                    <User className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <button onClick={handleSignOut} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white transition">
                    <LogOut className="w-4 h-4" />
                    <span>Uitloggen</span>
                  </button>
                </>
              ) : (
                <>
                  <AuthLink to="/login" className="px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white transition" onMouseEnter={prefetch('/login')} onTouchStart={prefetch('/login')}>Inloggen</AuthLink>
                  <AuthLink to="/register" className="bg-white text-[#0F172A] px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 transition" onMouseEnter={prefetch('/register')} onTouchStart={prefetch('/register')}>Gratis registreren</AuthLink>
                </>
              )}
            </div>

            <button className="md:hidden text-white p-2 min-w-[44px] min-h-[44px] flex items-center justify-center" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label={mobileMenuOpen ? 'Menu sluiten' : 'Menu openen'} aria-expanded={mobileMenuOpen}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-1">
              {navLinks.map((item) => (
                <Link key={item.to} to={item.to} className="block px-3 py-3 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition" onClick={() => setMobileMenuOpen(false)}>{item.label}</Link>
              ))}
              <div className="border-t border-white/10 mt-2 pt-2">
                {user && profile ? (
                  <>
                    <Link to={getDashboardLink()} className="block px-3 py-3 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                    <button onClick={() => { handleSignOut(); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition">Uitloggen</button>
                  </>
                ) : (
                  <>
                    <AuthLink to="/login" className="block px-3 py-3 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition" onClick={() => setMobileMenuOpen(false)}>Inloggen</AuthLink>
                    <div className="px-3 pt-2">
                      <AuthLink to="/register" className="block bg-white text-[#0F172A] py-2.5 rounded-lg text-sm font-medium hover:bg-slate-100 transition text-center" onClick={() => setMobileMenuOpen(false)}>Gratis registreren</AuthLink>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      <main className="flex-1 pt-16">{children}</main>

      <footer className="bg-[#0F172A] text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-14 grid grid-cols-2 md:grid-cols-12 gap-8 lg:gap-12">
            <div className="col-span-2 md:col-span-4">
              <LogoText theme="dark" className="text-xl mb-4 block" />
              <p className="text-slate-400 text-sm leading-relaxed mb-5">
                Het platform dat organisaties en arbo-professionals efficiënt verbindt.
              </p>
              <div className="space-y-2">
                <a href="tel:013-1234567" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  013-1234567
                </a>
                <a href="mailto:info@arbomatcher.nl" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  info@arbomatcher.nl
                </a>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  Tilburg, Nederland
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/opdrachten" className="text-slate-400 hover:text-white transition">Opdrachten</Link></li>
                <li><Link to="/oplossingen" className="text-slate-400 hover:text-white transition">Oplossingen</Link></li>
                <li><Link to="/prijzen" className="text-slate-400 hover:text-white transition">Prijzen</Link></li>
                <li><Link to="/community" className="text-slate-400 hover:text-white transition">Community</Link></li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Bedrijf</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/over" className="text-slate-400 hover:text-white transition">Over ons</Link></li>
                <li><Link to="/contact" className="text-slate-400 hover:text-white transition">Contact</Link></li>
                <li><Link to="/faq" className="text-slate-400 hover:text-white transition">FAQ</Link></li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Juridisch</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/privacy" className="text-slate-400 hover:text-white transition">Privacy</Link></li>
                <li><Link to="/terms" className="text-slate-400 hover:text-white transition">Voorwaarden</Link></li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Account</h4>
              <ul className="space-y-2 text-sm">
                <li><AuthLink to="/login" className="text-slate-400 hover:text-white transition">Inloggen</AuthLink></li>
                <li><AuthLink to="/register" className="text-slate-400 hover:text-white transition">Registreren</AuthLink></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
            <span>&copy; {new Date().getFullYear()} ArboMatcher B.V.</span>
            <span>KvK 12345678 · BTW NL123456789B01</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
