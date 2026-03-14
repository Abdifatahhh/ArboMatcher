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
  LazyProfessionalDashboard, LazyProfessionalProfiel, LazyProfessionalOpdrachten, LazyProfessionalReacties, LazyProfessionalUitnodigingen,
  LazyProfessionalInbox, LazyProfessionalAbonnement, LazyProfessionalFavorieten,
  LazyOpdrachtgeverDashboard, LazyOpdrachtgeverProfiel, LazyOpdrachtgeverOpdrachten, LazyOpdrachtgeverKandidaten,
  LazyOpdrachtgeverFavorieten, LazyOpdrachtgeverInbox, LazyOpdrachtgeverAbonnement,
  LazyAdminDashboard, LazyAdminVerificaties, LazyAdminGebruikers, LazyAdminOpdrachten, LazyAdminJobsReview,
  LazyAdminAbonnementen, LazyAdminInstellingen, LazyAdminGebruikerDetail, LazyAdminProfessionals, LazyAdminArtsDetail,
  LazyAdminReacties, LazyAdminOpdrachtgevers, LazyAdminOpdrachtgeverDetail, LazyAdminCommunityBeheer, LazyAdminMatches,
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
            <Suspense fallback={
              <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-emerald-500 border-t-transparent" />
              </div>
            }>
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
            path="/organisatie"
            element={
              <ProtectedRoute allowedRoles={['ORGANISATIE']}>
                <Navigate to="/organisatie/dashboard" replace />
              </ProtectedRoute>
            }
          />
            <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Navigate to="/admin/dashboard" replace />
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
            element={<PublicLayout><LazyPrivacy /></PublicLayout>}
          />
            <Route
            path="/terms"
            element={<PublicLayout><LazyTerms /></PublicLayout>}
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
              <Route path="dashboard" element={<LazyProfessionalDashboard />} />
              <Route path="profiel" element={<LazyProfessionalProfiel />} />
              <Route path="opdrachten" element={<LazyProfessionalOpdrachten />} />
              <Route path="reacties" element={<LazyProfessionalReacties />} />
              <Route path="uitnodigingen" element={<LazyProfessionalUitnodigingen />} />
              <Route path="inbox" element={<LazyProfessionalInbox />} />
              <Route path="abonnement" element={<LazyProfessionalAbonnement />} />
              <Route path="favorieten" element={<LazyProfessionalFavorieten />} />
              <Route path="zoekopdrachten" element={<LazyProfessionalOpdrachten />} />
              <Route path="beoordelingen" element={<LazyProfessionalReacties />} />
              <Route path="instellingen" element={<LazyProfessionalProfiel />} />
              <Route path=":id" element={<Navigate to="/professional/dashboard" replace />} />
            </Route>

            <Route
            path="/organisatie/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ORGANISATIE']}>
                <DashboardLayout>
                  <LazyOpdrachtgeverDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/organisatie/profiel"
            element={
              <ProtectedRoute allowedRoles={['ORGANISATIE']}>
                <DashboardLayout>
                  <LazyOpdrachtgeverProfiel />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/organisatie/opdrachten"
            element={
              <ProtectedRoute allowedRoles={['ORGANISATIE']}>
                <DashboardLayout>
                  <LazyOpdrachtgeverOpdrachten />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/organisatie/kandidaten"
            element={
              <ProtectedRoute allowedRoles={['ORGANISATIE']}>
                <DashboardLayout>
                  <LazyOpdrachtgeverKandidaten />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/organisatie/favorieten"
            element={
              <ProtectedRoute allowedRoles={['ORGANISATIE']}>
                <DashboardLayout>
                  <LazyOpdrachtgeverFavorieten />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/organisatie/inbox"
            element={
              <ProtectedRoute allowedRoles={['ORGANISATIE']}>
                <DashboardLayout>
                  <LazyOpdrachtgeverInbox />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/organisatie/abonnement"
            element={
              <ProtectedRoute allowedRoles={['ORGANISATIE']}>
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
            path="/admin/professionals"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout>
                  <LazyAdminProfessionals />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/admin/professionals/:id"
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
            path="/admin/organisaties"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout>
                  <LazyAdminOpdrachtgevers />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/admin/organisaties/:id"
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
            path="/admin/matches"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout>
                  <LazyAdminMatches />
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

            <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            </Suspense>
          {!isPortal() && <CookieBanner />}
          </MaintenanceGate>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
