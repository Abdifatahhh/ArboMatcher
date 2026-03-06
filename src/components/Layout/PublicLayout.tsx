import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogoText } from '../ui/Logo.tsx';
import { Menu, X, User, LogOut, Phone } from 'lucide-react';
import { useState } from 'react';

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
      case 'ARTS':
        return '/arts/dashboard';
      case 'OPDRACHTGEVER':
        return '/opdrachtgever/dashboard';
      case 'ADMIN':
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#E8F5E9] via-[#F4FAF4] to-white">
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0F172A]">
        <div className="h-10 bg-[#0F172A] border-b border-gray-700/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
            <div className="flex justify-end items-center h-full space-x-6">
              <a
                href="tel:013-1234567"
                className="flex items-center gap-2 text-sm font-medium transition text-gray-300 hover:text-white"
              >
                <Phone className="w-3.5 h-3.5" />
                013-1234567
              </a>
              <Link
                to="/contact"
                className="text-sm font-medium transition text-gray-300 hover:text-white"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>

        <header className="bg-[#0F172A]">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-10">
                <Link to="/" className="text-xl">
                  <LogoText theme="dark" />
                </Link>

                <div className="hidden lg:flex items-center space-x-8">
                  <Link to="/opdrachten" className="transition text-gray-200 hover:text-white">Opdrachten</Link>
                  <Link to="/oplossingen" className="transition text-gray-200 hover:text-white">Oplossingen</Link>
                  <Link to="/community" className="transition text-gray-200 hover:text-white">Community</Link>
                  <Link to="/over" className="transition text-gray-200 hover:text-white">Over ArboMatcher</Link>
                </div>
              </div>

              <div className="hidden md:flex items-center space-x-4">
                {user && profile ? (
                  <>
                    <Link to={getDashboardLink()} className="flex items-center space-x-2 transition text-gray-200 hover:text-white">
                      <User className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                    <button onClick={handleSignOut} className="flex items-center space-x-2 transition text-gray-200 hover:text-white">
                      <LogOut className="w-4 h-4" />
                      <span>Uitloggen</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="transition text-gray-200 hover:text-white">Inloggen</Link>
                    <Link to="/register" className="bg-[#4FA151] text-white px-5 py-2.5 rounded-xl font-medium hover:bg-[#3E8E45] transition">Gratis registreren</Link>
                  </>
                )}
              </div>

              <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {mobileMenuOpen && (
              <div className="md:hidden py-4 space-y-4 bg-white rounded-b-lg shadow-lg">
                <div className="px-4 pb-3 mb-3 border-b border-gray-100 flex items-center justify-between text-sm">
                  <a href="tel:013-1234567" className="flex items-center gap-2 text-[#0F172A] font-medium"><Phone className="w-3.5 h-3.5" />013-1234567</a>
                  <Link to="/contact" className="text-[#0F172A] font-medium" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
                </div>
                <Link to="/opdrachten" className="block px-4 text-gray-700 hover:text-[#0F172A] transition" onClick={() => setMobileMenuOpen(false)}>Opdrachten</Link>
                <Link to="/oplossingen" className="block px-4 text-gray-700 hover:text-[#0F172A] transition" onClick={() => setMobileMenuOpen(false)}>Oplossingen</Link>
                <Link to="/community" className="block px-4 text-gray-700 hover:text-[#0F172A] transition" onClick={() => setMobileMenuOpen(false)}>Community</Link>
                <Link to="/over" className="block px-4 text-gray-700 hover:text-[#0F172A] transition" onClick={() => setMobileMenuOpen(false)}>Over ArboMatcher</Link>
                {user && profile ? (
                  <>
                    <Link to={getDashboardLink()} className="block px-4 text-gray-700 hover:text-[#0F172A] transition" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                    <button onClick={() => { handleSignOut(); setMobileMenuOpen(false); }} className="block w-full text-left px-4 text-gray-700 hover:text-[#0F172A] transition">Uitloggen</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="block px-4 text-gray-700 hover:text-[#0F172A] transition" onClick={() => setMobileMenuOpen(false)}>Inloggen</Link>
                    <div className="px-4">
                      <Link to="/register" className="block bg-[#4FA151] text-white px-4 py-2 rounded-xl hover:bg-[#3E8E45] transition text-center" onClick={() => setMobileMenuOpen(false)}>Gratis registreren</Link>
                    </div>
                  </>
                )}
              </div>
            )}
          </nav>
        </header>
      </div>

      <main className="flex-1 pt-[104px]">{children}</main>

      <footer className="bg-[#0F172A] text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <LogoText theme="dark" className="text-xl mb-4 block" />
              <p className="text-gray-400 text-sm leading-relaxed">Het platform voor opdrachtgevers, intermediairs, detacheerders en arbo-professionals.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link to="/opdrachten" className="hover:text-white transition">Opdrachten</Link></li>
                <li><Link to="/oplossingen" className="hover:text-white transition">Oplossingen</Link></li>
                <li><Link to="/community" className="hover:text-white transition">Community</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Over</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link to="/over" className="hover:text-white transition">Over ArboMatcher</Link></li>
                <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
                <li><Link to="/faq" className="hover:text-white transition">Veelgestelde vragen</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Juridisch</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link to="/privacy" className="hover:text-white transition">Privacy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition">Voorwaarden</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">&copy; 2026 ArboMatcher. Alle rechten voorbehouden.</div>
        </div>
      </footer>
    </div>
  );
}
