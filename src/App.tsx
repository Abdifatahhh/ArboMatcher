import { Suspense } from 'react';
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
import { PortalPrefetch, RoutePreloader } from './components/PortalPrefetch';
import { isPortal } from './config/portal';

import Home from './pages/Home';
import {
  LazyOver, LazyOpdrachten, LazyOpdrachtDetail, LazyPrijzen, LazyLogin, LazyRegister,
  LazyOnboarding, LazyWachtwoordVergeten, LazyEmailVerificatie, LazyRegistratieGelukt, LazyVerificatieGelukt,
  LazyPrivacy, LazyTerms, LazyContact, LazyCommunity, LazyCommunityArticle, LazyCommunityTopic,
  LazyOplossingen, LazyFAQ,
  LazyArtsDashboard, LazyArtsProfiel, LazyArtsOpdrachten, LazyArtsReacties, LazyArtsUitnodigingen,
  LazyArtsInbox, LazyArtsAbonnement, LazyArtsFavorieten,
  LazyOpdrachtgeverDashboard, LazyOpdrachtgeverProfiel, LazyOpdrachtgeverOpdrachten, LazyOpdrachtgeverKandidaten,
  LazyOpdrachtgeverFavorieten, LazyOpdrachtgeverInbox, LazyOpdrachtgeverAbonnement,
  LazyAdminDashboard, LazyAdminVerificaties, LazyAdminGebruikers, LazyAdminOpdrachten, LazyAdminJobsReview,
  LazyAdminAbonnementen, LazyAdminInstellingen, LazyAdminGebruikerDetail, LazyAdminArtsen, LazyAdminArtsDetail,
  LazyAdminReacties, LazyAdminOpdrachtgevers, LazyAdminOpdrachtgeverDetail, LazyAdminCommunityBeheer,
} from './routes/lazyPages';

function OpdrachtRedirect() {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={id ? `/opdrachten/${id}` : '/opdrachten'} replace />;
}

function App() {
  return (
    <Router>
      <PortalPrefetch />
      <RoutePreloader />
      <AuthProvider>
        <EnvBanner />
        <ToastProvider>
          <MaintenanceGate>
            <Suspense fallback={null}>
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
                <PublicLayout><LazyOver /></PublicLayout>
              </RequireMarketingSite>
            }
          />
            <Route
            path="/opdrachten"
            element={
              <RequireMarketingSite>
                <PublicLayout><LazyOpdrachten /></PublicLayout>
              </RequireMarketingSite>
            }
          />
            <Route
            path="/opdrachten/:id"
            element={
              <RequireMarketingSite>
                <PublicLayout><LazyOpdrachtDetail /></PublicLayout>
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
                <PublicLayout><LazyPrijzen /></PublicLayout>
              </RequireMarketingSite>
            }
          />
            <Route
            path="/login"
            element={isPortal() ? <Navigate to="/" replace /> : <LazyLogin />}
          />
            <Route
            path="/register"
            element={<LazyRegister />}
          />
            <Route
            path="/email-verificatie"
            element={<LazyEmailVerificatie />}
          />
            <Route
            path="/registratie-gelukt"
            element={<LazyRegistratieGelukt />}
          />
            <Route
            path="/verificatie-gelukt"
            element={<LazyVerificatieGelukt />}
          />
            <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <LazyOnboarding />
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
            element={<LazyWachtwoordVergeten />}
          />
            <Route
            path="/privacy"
            element={
              <RequireMarketingSite>
                <PublicLayout><LazyPrivacy /></PublicLayout>
              </RequireMarketingSite>
            }
          />
            <Route
            path="/terms"
            element={
              <RequireMarketingSite>
                <PublicLayout><LazyTerms /></PublicLayout>
              </RequireMarketingSite>
            }
          />
            <Route
            path="/contact"
            element={
              <RequireMarketingSite>
                <PublicLayout><LazyContact /></PublicLayout>
              </RequireMarketingSite>
            }
          />
            <Route
            path="/faq"
            element={
              <RequireMarketingSite>
                <PublicLayout><LazyFAQ /></PublicLayout>
              </RequireMarketingSite>
            }
          />
            <Route
            path="/oplossingen"
            element={
              <RequireMarketingSite>
                <PublicLayout><LazyOplossingen /></PublicLayout>
              </RequireMarketingSite>
            }
          />
            <Route
            path="/community"
            element={
              <RequireMarketingSite>
                <PublicLayout><LazyCommunity /></PublicLayout>
              </RequireMarketingSite>
            }
          />
            <Route
            path="/community/artikel/:slug"
            element={
              <RequireMarketingSite>
                <PublicLayout><LazyCommunityArticle /></PublicLayout>
              </RequireMarketingSite>
            }
          />
            <Route
            path="/community/onderwerp/:slug"
            element={
              <RequireMarketingSite>
                <PublicLayout><LazyCommunityTopic /></PublicLayout>
              </RequireMarketingSite>
            }
          />

            <Route path="/professional" element={<ProtectedRoute allowedRoles={['professional']}><ArtsDashboardLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/professional/dashboard" replace />} />
              <Route path="dashboard" element={<LazyArtsDashboard />} />
              <Route path="profiel" element={<LazyArtsProfiel />} />
              <Route path="opdrachten" element={<LazyArtsOpdrachten />} />
              <Route path="reacties" element={<LazyArtsReacties />} />
              <Route path="uitnodigingen" element={<LazyArtsUitnodigingen />} />
              <Route path="inbox" element={<LazyArtsInbox />} />
              <Route path="abonnement" element={<LazyArtsAbonnement />} />
              <Route path="favorieten" element={<LazyArtsFavorieten />} />
              <Route path="zoekopdrachten" element={<LazyArtsOpdrachten />} />
              <Route path="beoordelingen" element={<LazyArtsReacties />} />
              <Route path="instellingen" element={<LazyArtsProfiel />} />
              <Route path=":id" element={<Navigate to="/professional/dashboard" replace />} />
            </Route>

            <Route
            path="/opdrachtgever/dashboard"
            element={
              <ProtectedRoute allowedRoles={['OPDRACHTGEVER']}>
                <DashboardLayout>
                  <LazyOpdrachtgeverDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/opdrachtgever/profiel"
            element={
              <ProtectedRoute allowedRoles={['OPDRACHTGEVER']}>
                <DashboardLayout>
                  <LazyOpdrachtgeverProfiel />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/opdrachtgever/opdrachten"
            element={
              <ProtectedRoute allowedRoles={['OPDRACHTGEVER']}>
                <DashboardLayout>
                  <LazyOpdrachtgeverOpdrachten />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/opdrachtgever/kandidaten"
            element={
              <ProtectedRoute allowedRoles={['OPDRACHTGEVER']}>
                <DashboardLayout>
                  <LazyOpdrachtgeverKandidaten />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/opdrachtgever/favorieten"
            element={
              <ProtectedRoute allowedRoles={['OPDRACHTGEVER']}>
                <DashboardLayout>
                  <LazyOpdrachtgeverFavorieten />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/opdrachtgever/inbox"
            element={
              <ProtectedRoute allowedRoles={['OPDRACHTGEVER']}>
                <DashboardLayout>
                  <LazyOpdrachtgeverInbox />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/opdrachtgever/abonnement"
            element={
              <ProtectedRoute allowedRoles={['OPDRACHTGEVER']}>
                <DashboardLayout>
                  <LazyOpdrachtgeverAbonnement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

            <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout>
                  <LazyAdminDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/admin/verificaties"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout>
                  <LazyAdminVerificaties />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/admin/gebruikers"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout>
                  <LazyAdminGebruikers />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/admin/gebruikers/:id"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout>
                  <LazyAdminGebruikerDetail />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/admin/artsen"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout>
                  <LazyAdminArtsen />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/admin/artsen/:id"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout>
                  <LazyAdminArtsDetail />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/admin/reacties"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout>
                  <LazyAdminReacties />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/admin/opdrachtgevers"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout>
                  <LazyAdminOpdrachtgevers />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/admin/opdrachtgevers/:id"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout>
                  <LazyAdminOpdrachtgeverDetail />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/admin/opdrachten"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout>
                  <LazyAdminOpdrachten />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/admin/jobs/review"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout>
                  <LazyAdminJobsReview />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/admin/abonnementen"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout>
                  <LazyAdminAbonnementen />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/admin/instellingen"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout>
                  <LazyAdminInstellingen />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/admin/community"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout>
                  <LazyAdminCommunityBeheer />
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
