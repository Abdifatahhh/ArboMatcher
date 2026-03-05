import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { RedirectToDashboard, RedirectToProfiel } from './components/auth/RedirectByRole';
import { PublicLayout } from './components/Layout/PublicLayout';
import { DashboardLayout } from './components/Layout/DashboardLayout';
import { ArtsDashboardLayout } from './components/Layout/ArtsDashboardLayout';

import Home from './pages/Home';
import Over from './pages/Over';
import Opdrachten from './pages/Opdrachten';
import OpdrachtDetail from './pages/OpdrachtDetail';
import Prijzen from './pages/Prijzen';
import Login from './pages/Login';
import Register from './pages/Register';
import WachtwoordVergeten from './pages/WachtwoordVergeten';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Contact from './pages/Contact';
import HoeHetWerkt from './pages/HoeHetWerkt';
import Oplossingen from './pages/Oplossingen';

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

function OpdrachtRedirect() {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={id ? `/opdrachten/${id}` : '/opdrachten'} replace />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <PublicLayout>
                <Home />
              </PublicLayout>
            }
          />
          <Route
            path="/over"
            element={
              <PublicLayout>
                <Over />
              </PublicLayout>
            }
          />
          <Route
            path="/opdrachten"
            element={
              <PublicLayout>
                <Opdrachten />
              </PublicLayout>
            }
          />
          <Route
            path="/opdrachten/:id"
            element={
              <PublicLayout>
                <OpdrachtDetail />
              </PublicLayout>
            }
          />
          <Route
            path="/opdracht/:id"
            element={<OpdrachtRedirect />}
          />
          <Route
            path="/prijzen"
            element={
              <PublicLayout>
                <Prijzen />
              </PublicLayout>
            }
          />
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/register"
            element={<Register />}
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
              <PublicLayout>
                <Privacy />
              </PublicLayout>
            }
          />
          <Route
            path="/terms"
            element={
              <PublicLayout>
                <Terms />
              </PublicLayout>
            }
          />
          <Route
            path="/contact"
            element={
              <PublicLayout>
                <Contact />
              </PublicLayout>
            }
          />
          <Route
            path="/hoe-het-werkt"
            element={
              <PublicLayout>
                <HoeHetWerkt />
              </PublicLayout>
            }
          />
          <Route
            path="/oplossingen"
            element={
              <PublicLayout>
                <Oplossingen />
              </PublicLayout>
            }
          />

          <Route
            path="/arts/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ARTS']}>
                <ArtsDashboardLayout>
                  <ArtsDashboard />
                </ArtsDashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/arts/profiel"
            element={
              <ProtectedRoute allowedRoles={['ARTS']}>
                <ArtsDashboardLayout>
                  <ArtsProfiel />
                </ArtsDashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/arts/opdrachten"
            element={
              <ProtectedRoute allowedRoles={['ARTS']}>
                <ArtsDashboardLayout>
                  <ArtsOpdrachten />
                </ArtsDashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/arts/reacties"
            element={
              <ProtectedRoute allowedRoles={['ARTS']}>
                <ArtsDashboardLayout>
                  <ArtsReacties />
                </ArtsDashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/arts/uitnodigingen"
            element={
              <ProtectedRoute allowedRoles={['ARTS']}>
                <ArtsDashboardLayout>
                  <ArtsUitnodigingen />
                </ArtsDashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/arts/inbox"
            element={
              <ProtectedRoute allowedRoles={['ARTS']}>
                <ArtsDashboardLayout>
                  <ArtsInbox />
                </ArtsDashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/arts/abonnement"
            element={
              <ProtectedRoute allowedRoles={['ARTS']}>
                <ArtsDashboardLayout>
                  <ArtsAbonnement />
                </ArtsDashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/arts/favorieten"
            element={
              <ProtectedRoute allowedRoles={['ARTS']}>
                <ArtsDashboardLayout>
                  <ArtsFavorieten />
                </ArtsDashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/arts/zoekopdrachten"
            element={
              <ProtectedRoute allowedRoles={['ARTS']}>
                <ArtsDashboardLayout>
                  <ArtsOpdrachten />
                </ArtsDashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/arts/beoordelingen"
            element={
              <ProtectedRoute allowedRoles={['ARTS']}>
                <ArtsDashboardLayout>
                  <ArtsReacties />
                </ArtsDashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/arts/instellingen"
            element={
              <ProtectedRoute allowedRoles={['ARTS']}>
                <ArtsDashboardLayout>
                  <ArtsProfiel />
                </ArtsDashboardLayout>
              </ProtectedRoute>
            }
          />

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
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
