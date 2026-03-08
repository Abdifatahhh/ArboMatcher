import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { RedirectToDashboard, RedirectToProfiel } from './components/auth/RedirectByRole';
import { MaintenanceGate } from './components/MaintenanceGate';
import { CookieBanner } from './components/CookieBanner';
import { PublicLayout } from './components/Layout/PublicLayout';
import { DashboardLayout } from './components/Layout/DashboardLayout';
import { ArtsDashboardLayout } from './components/Layout/ArtsDashboardLayout';

const Home = lazy(() => import('./pages/Home'));
const Over = lazy(() => import('./pages/Over'));
const Opdrachten = lazy(() => import('./pages/Opdrachten'));
const OpdrachtDetail = lazy(() => import('./pages/OpdrachtDetail'));
const Prijzen = lazy(() => import('./pages/Prijzen'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const WachtwoordVergeten = lazy(() => import('./pages/WachtwoordVergeten'));
const EmailVerificatie = lazy(() => import('./pages/EmailVerificatie'));
const RegistratieGelukt = lazy(() => import('./pages/RegistratieGelukt'));
const VerificatieGelukt = lazy(() => import('./pages/VerificatieGelukt'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Contact = lazy(() => import('./pages/Contact'));
const Community = lazy(() => import('./pages/Community'));
const CommunityArticle = lazy(() => import('./pages/CommunityArticle'));
const CommunityTopic = lazy(() => import('./pages/CommunityTopic'));
const Oplossingen = lazy(() => import('./pages/Oplossingen'));
const FAQ = lazy(() => import('./pages/FAQ'));

const ArtsDashboard = lazy(() => import('./pages/Arts/Dashboard'));
const ArtsProfiel = lazy(() => import('./pages/Arts/Profiel'));
const ArtsOpdrachten = lazy(() => import('./pages/Arts/Opdrachten'));
const ArtsReacties = lazy(() => import('./pages/Arts/Reacties'));
const ArtsUitnodigingen = lazy(() => import('./pages/Arts/Uitnodigingen'));
const ArtsInbox = lazy(() => import('./pages/Arts/Inbox'));
const ArtsAbonnement = lazy(() => import('./pages/Arts/Abonnement'));
const ArtsFavorieten = lazy(() => import('./pages/Arts/Favorieten'));

const OpdrachtgeverDashboard = lazy(() => import('./pages/Opdrachtgever/Dashboard'));
const OpdrachtgeverProfiel = lazy(() => import('./pages/Opdrachtgever/Profiel'));
const IntermediairDashboard = lazy(() => import('./pages/Intermediair/Dashboard'));
const OpdrachtgeverOpdrachten = lazy(() => import('./pages/Opdrachtgever/Opdrachten'));
const OpdrachtgeverKandidaten = lazy(() => import('./pages/Opdrachtgever/Kandidaten'));
const OpdrachtgeverFavorieten = lazy(() => import('./pages/Opdrachtgever/Favorieten'));
const OpdrachtgeverInbox = lazy(() => import('./pages/Opdrachtgever/Inbox'));
const OpdrachtgeverAbonnement = lazy(() => import('./pages/Opdrachtgever/Abonnement'));

const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));
const AdminVerificaties = lazy(() => import('./pages/Admin/Verificaties'));
const AdminGebruikers = lazy(() => import('./pages/Admin/Gebruikers'));
const AdminOpdrachten = lazy(() => import('./pages/Admin/Opdrachten'));
const AdminAbonnementen = lazy(() => import('./pages/Admin/Abonnementen'));
const AdminInstellingen = lazy(() => import('./pages/Admin/Instellingen'));
const AdminGebruikerDetail = lazy(() => import('./pages/Admin/GebruikerDetail'));
const AdminArtsen = lazy(() => import('./pages/Admin/Artsen'));
const AdminArtsDetail = lazy(() => import('./pages/Admin/ArtsDetail'));
const AdminReacties = lazy(() => import('./pages/Admin/Reacties'));
const AdminOpdrachtgevers = lazy(() => import('./pages/Admin/Opdrachtgevers'));
const AdminOpdrachtgeverDetail = lazy(() => import('./pages/Admin/OpdrachtgeverDetail'));
const AdminIntermediairs = lazy(() => import('./pages/Admin/Intermediairs'));
const AdminCommunityBeheer = lazy(() => import('./pages/Admin/CommunityBeheer'));

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F172A]" />
    </div>
  );
}

function OpdrachtRedirect() {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={id ? `/opdrachten/${id}` : '/opdrachten'} replace />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <MaintenanceGate>
          <Suspense fallback={<PageLoader />}>
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
            path="/faq"
            element={
              <PublicLayout>
                <FAQ />
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
            path="/community"
            element={
              <PublicLayout>
                <Community />
              </PublicLayout>
            }
          />
            <Route
            path="/community/artikel/:slug"
            element={
              <PublicLayout>
                <CommunityArticle />
              </PublicLayout>
            }
          />
            <Route
            path="/community/onderwerp/:slug"
            element={
              <PublicLayout>
                <CommunityTopic />
              </PublicLayout>
            }
          />

            <Route path="/arts" element={<ProtectedRoute allowedRoles={['ARTS', 'professional']}><ArtsDashboardLayout /></ProtectedRoute>}>
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
              <ProtectedRoute allowedRoles={['OPDRACHTGEVER', 'company', 'intermediary']}>
                <DashboardLayout>
                  <OpdrachtgeverDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/opdrachtgever/profiel"
            element={
              <ProtectedRoute allowedRoles={['OPDRACHTGEVER', 'company', 'intermediary']}>
                <DashboardLayout>
                  <OpdrachtgeverProfiel />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/opdrachtgever/opdrachten"
            element={
              <ProtectedRoute allowedRoles={['OPDRACHTGEVER', 'company', 'intermediary']}>
                <DashboardLayout>
                  <OpdrachtgeverOpdrachten />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/opdrachtgever/kandidaten"
            element={
              <ProtectedRoute allowedRoles={['OPDRACHTGEVER', 'company', 'intermediary']}>
                <DashboardLayout>
                  <OpdrachtgeverKandidaten />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/opdrachtgever/favorieten"
            element={
              <ProtectedRoute allowedRoles={['OPDRACHTGEVER', 'company', 'intermediary']}>
                <DashboardLayout>
                  <OpdrachtgeverFavorieten />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/opdrachtgever/inbox"
            element={
              <ProtectedRoute allowedRoles={['OPDRACHTGEVER', 'company', 'intermediary']}>
                <DashboardLayout>
                  <OpdrachtgeverInbox />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/opdrachtgever/abonnement"
            element={
              <ProtectedRoute allowedRoles={['OPDRACHTGEVER', 'company', 'intermediary']}>
                <DashboardLayout>
                  <OpdrachtgeverAbonnement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

            <Route
            path="/intermediair/dashboard"
            element={
              <ProtectedRoute allowedRoles={['intermediary']}>
                <DashboardLayout>
                  <IntermediairDashboard />
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
            path="/admin/intermediairs"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout>
                  <AdminIntermediairs />
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
          </Suspense>
          <CookieBanner />
          </MaintenanceGate>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
