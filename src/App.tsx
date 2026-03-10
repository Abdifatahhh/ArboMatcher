import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { RedirectToDashboard, RedirectToProfiel } from './components/auth/RedirectByRole';
import { MaintenanceGate } from './components/MaintenanceGate';
import { EnvBanner } from './components/EnvBanner';
import { CookieBanner } from './components/CookieBanner';
import { PublicLayout } from './components/Layout/PublicLayout';
import { DashboardLayout } from './components/Layout/DashboardLayout';
import { ArtsDashboardLayout } from './components/Layout/ArtsDashboardLayout';
import { PortalRoot } from './components/PortalRoot';
import { RequireMarketingSite } from './components/RequireMarketingSite';
import { isPortal } from './config/portal';

import Home from './pages/Home';
import Over from './pages/Over';
import Opdrachten from './pages/Opdrachten';
import OpdrachtDetail from './pages/OpdrachtDetail';
import Prijzen from './pages/Prijzen';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import WachtwoordVergeten from './pages/WachtwoordVergeten';
import EmailVerificatie from './pages/EmailVerificatie';
import RegistratieGelukt from './pages/RegistratieGelukt';
import VerificatieGelukt from './pages/VerificatieGelukt';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Contact from './pages/Contact';
import Community from './pages/Community';
import CommunityArticle from './pages/CommunityArticle';
import CommunityTopic from './pages/CommunityTopic';
import Oplossingen from './pages/Oplossingen';
import FAQ from './pages/FAQ';

import ArtsDashboard from './pages/Arts/Dashboard';
import ArtsProfiel from './pages/Arts/Profiel';
import ArtsOpdrachten from './pages/Arts/Opdrachten';
import ArtsReacties from './pages/Arts/Reacties';
import ArtsUitnodigingen from './pages/Arts/Uitnodigingen';
import ArtsInbox from './pages/Arts/Inbox';
import ArtsAbonnement from './pages/Arts/Abonnement';
import ArtsFavorieten from './pages/Arts/Favorieten';

import OpdrachtgeverDashboard from './pages/Opdrachtgever/Dashboard';
import OpdrachtgeverProfiel from './pages/Opdrachtgever/Profiel';
import OpdrachtgeverOpdrachten from './pages/Opdrachtgever/Opdrachten';
import OpdrachtgeverKandidaten from './pages/Opdrachtgever/Kandidaten';
import OpdrachtgeverFavorieten from './pages/Opdrachtgever/Favorieten';
import OpdrachtgeverInbox from './pages/Opdrachtgever/Inbox';
import OpdrachtgeverAbonnement from './pages/Opdrachtgever/Abonnement';

import AdminDashboard from './pages/Admin/Dashboard';
import AdminVerificaties from './pages/Admin/Verificaties';
import AdminGebruikers from './pages/Admin/Gebruikers';
import AdminOpdrachten from './pages/Admin/Opdrachten';
import AdminAbonnementen from './pages/Admin/Abonnementen';
import AdminInstellingen from './pages/Admin/Instellingen';
import AdminGebruikerDetail from './pages/Admin/GebruikerDetail';
import AdminArtsen from './pages/Admin/Artsen';
import AdminArtsDetail from './pages/Admin/ArtsDetail';
import AdminReacties from './pages/Admin/Reacties';
import AdminOpdrachtgevers from './pages/Admin/Opdrachtgevers';
import AdminOpdrachtgeverDetail from './pages/Admin/OpdrachtgeverDetail';
import AdminCommunityBeheer from './pages/Admin/CommunityBeheer';

function OpdrachtRedirect() {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={id ? `/opdrachten/${id}` : '/opdrachten'} replace />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <EnvBanner />
        <ToastProvider>
          <MaintenanceGate>
            <Routes>
            <Route
            path="/"
            element={isPortal() ? <PortalRoot /> : (
              <PublicLayout>
                <Home />
              </PublicLayout>
            )}
          />
            <Route
            path="/over"
            element={
              <RequireMarketingSite>
                <PublicLayout><Over /></PublicLayout>
              </RequireMarketingSite>
            }
          />
            <Route
            path="/opdrachten"
            element={
              <RequireMarketingSite>
                <PublicLayout><Opdrachten /></PublicLayout>
              </RequireMarketingSite>
            }
          />
            <Route
            path="/opdrachten/:id"
            element={
              <RequireMarketingSite>
                <PublicLayout><OpdrachtDetail /></PublicLayout>
              </RequireMarketingSite>
            }
          />
            <Route
            path="/opdracht/:id"
            element={<RequireMarketingSite><OpdrachtRedirect /></RequireMarketingSite>}
          />
            <Route
            path="/prijzen"
            element={
              <RequireMarketingSite>
                <PublicLayout><Prijzen /></PublicLayout>
              </RequireMarketingSite>
            }
          />
            <Route
            path="/login"
            element={isPortal() ? <Navigate to="/" replace /> : <Login />}
          />
            <Route
            path="/register"
            element={<Register />}
          />
            <Route
            path="/email-verificatie"
            element={<EmailVerificatie />}
          />
            <Route
            path="/registratie-gelukt"
            element={<RegistratieGelukt />}
          />
            <Route
            path="/verificatie-gelukt"
            element={<VerificatieGelukt />}
          />
            <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            }
          />
            <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <RedirectToDashboard />
              </ProtectedRoute>
            }
          />
            <Route
            path="/profiel"
            element={
              <ProtectedRoute>
                <RedirectToProfiel />
              </ProtectedRoute>
            }
          />
            <Route
            path="/wachtwoord-vergeten"
            element={<WachtwoordVergeten />}
          />
            <Route
            path="/privacy"
            element={
              <RequireMarketingSite>
                <PublicLayout><Privacy /></PublicLayout>
              </RequireMarketingSite>
            }
          />
            <Route
            path="/terms"
            element={
              <RequireMarketingSite>
                <PublicLayout><Terms /></PublicLayout>
              </RequireMarketingSite>
            }
          />
            <Route
            path="/contact"
            element={
              <RequireMarketingSite>
                <PublicLayout><Contact /></PublicLayout>
              </RequireMarketingSite>
            }
          />
            <Route
            path="/faq"
            element={
              <RequireMarketingSite>
                <PublicLayout><FAQ /></PublicLayout>
              </RequireMarketingSite>
            }
          />
            <Route
            path="/oplossingen"
            element={
              <RequireMarketingSite>
                <PublicLayout><Oplossingen /></PublicLayout>
              </RequireMarketingSite>
            }
          />
            <Route
            path="/community"
            element={
              <RequireMarketingSite>
                <PublicLayout><Community /></PublicLayout>
              </RequireMarketingSite>
            }
          />
            <Route
            path="/community/artikel/:slug"
            element={
              <RequireMarketingSite>
                <PublicLayout><CommunityArticle /></PublicLayout>
              </RequireMarketingSite>
            }
          />
            <Route
            path="/community/onderwerp/:slug"
            element={
              <RequireMarketingSite>
                <PublicLayout><CommunityTopic /></PublicLayout>
              </RequireMarketingSite>
            }
          />

            <Route path="/arts" element={<ProtectedRoute allowedRoles={['professional']}><ArtsDashboardLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/arts/dashboard" replace />} />
              <Route path="dashboard" element={<ArtsDashboard />} />
              <Route path="profiel" element={<ArtsProfiel />} />
              <Route path="opdrachten" element={<ArtsOpdrachten />} />
              <Route path="reacties" element={<ArtsReacties />} />
              <Route path="uitnodigingen" element={<ArtsUitnodigingen />} />
              <Route path="inbox" element={<ArtsInbox />} />
              <Route path="abonnement" element={<ArtsAbonnement />} />
              <Route path="favorieten" element={<ArtsFavorieten />} />
              <Route path="zoekopdrachten" element={<ArtsOpdrachten />} />
              <Route path="beoordelingen" element={<ArtsReacties />} />
              <Route path="instellingen" element={<ArtsProfiel />} />
            </Route>

            <Route
            path="/opdrachtgever/dashboard"
            element={
              <ProtectedRoute allowedRoles={['OPDRACHTGEVER']}>
                <DashboardLayout>
                  <OpdrachtgeverDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/opdrachtgever/profiel"
            element={
              <ProtectedRoute allowedRoles={['OPDRACHTGEVER']}>
                <DashboardLayout>
                  <OpdrachtgeverProfiel />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/opdrachtgever/opdrachten"
            element={
              <ProtectedRoute allowedRoles={['OPDRACHTGEVER']}>
                <DashboardLayout>
                  <OpdrachtgeverOpdrachten />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/opdrachtgever/kandidaten"
            element={
              <ProtectedRoute allowedRoles={['OPDRACHTGEVER']}>
                <DashboardLayout>
                  <OpdrachtgeverKandidaten />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/opdrachtgever/favorieten"
            element={
              <ProtectedRoute allowedRoles={['OPDRACHTGEVER']}>
                <DashboardLayout>
                  <OpdrachtgeverFavorieten />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/opdrachtgever/inbox"
            element={
              <ProtectedRoute allowedRoles={['OPDRACHTGEVER']}>
                <DashboardLayout>
                  <OpdrachtgeverInbox />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/opdrachtgever/abonnement"
            element={
              <ProtectedRoute allowedRoles={['OPDRACHTGEVER']}>
                <DashboardLayout>
                  <OpdrachtgeverAbonnement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

            <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout>
                  <AdminDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/admin/verificaties"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout>
                  <AdminVerificaties />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/admin/gebruikers"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout>
                  <AdminGebruikers />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/admin/gebruikers/:id"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout>
                  <AdminGebruikerDetail />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/admin/artsen"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout>
                  <AdminArtsen />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/admin/artsen/:id"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout>
                  <AdminArtsDetail />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/admin/reacties"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout>
                  <AdminReacties />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/admin/opdrachtgevers"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout>
                  <AdminOpdrachtgevers />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/admin/opdrachtgevers/:id"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout>
                  <AdminOpdrachtgeverDetail />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/admin/opdrachten"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout>
                  <AdminOpdrachten />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/admin/abonnementen"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout>
                  <AdminAbonnementen />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/admin/instellingen"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout>
                  <AdminInstellingen />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/admin/community"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout>
                  <AdminCommunityBeheer />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            </Routes>
          <CookieBanner />
          </MaintenanceGate>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
