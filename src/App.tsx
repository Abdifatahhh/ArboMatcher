import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { RedirectToDashboard, RedirectToProfiel } from './components/auth/RedirectByRole';
import { MaintenanceGate } from './components/MaintenanceGate';
import { EnvBanner } from './components/EnvBanner';
import { RequireMarketingSite } from './components/RequireMarketingSite';
import { PortalPrefetch } from './components/PortalPrefetch';
import { isPortal } from './config/portal';

import {
  LazyOver, LazyOpdrachten, LazyOpdrachtDetail, LazyPrijzen, LazyLogin, LazyRegister,
  LazyOnboarding, LazyWachtwoordVergeten, LazyEmailVerificatie, LazyRegistratieGelukt, LazyVerificatieGelukt,
  LazyPrivacy, LazyTerms, LazyContact, LazyCommunity, LazyCommunityArticle, LazyCommunityTopic,
  LazyOplossingen, LazyFAQ,
  LazyProfessionalDashboard, LazyProfessionalProfiel, LazyProfessionalOpdrachten, LazyProfessionalZoekopdrachten, LazyProfessionalReacties, LazyProfessionalReactieDetail, LazyProfessionalUitnodigingen,
  LazyProfessionalInbox, LazyProfessionalAbonnement, LazyProfessionalFavorieten,
  LazyOpdrachtgeverDashboard, LazyOpdrachtgeverProfiel, LazyOpdrachtgeverOpdrachten, LazyOpdrachtgeverKandidaten,
  LazyOpdrachtgeverFavorieten, LazyOpdrachtgeverInbox, LazyOpdrachtgeverAbonnement,
  LazyAdminDashboard, LazyAdminVerificaties, LazyAdminGebruikers, LazyAdminOpdrachten, LazyAdminJobsReview,
  LazyAdminAbonnementen, LazyAdminInstellingen, LazyAdminGebruikerDetail, LazyAdminProfessionals, LazyAdminArtsDetail,
  LazyAdminReacties, LazyAdminOpdrachtgevers, LazyAdminOpdrachtgeverDetail, LazyAdminCommunityBeheer, LazyAdminMatches,
} from './routes/lazyPages';

const PublicLayout = lazy(async () => {
  const mod = await import('./components/Layout/PublicLayout');
  return { default: mod.PublicLayout };
});

const AdminDashboardLayout = lazy(async () => {
  const mod = await import('./components/Layout/AdminDashboardLayout');
  return { default: mod.AdminDashboardLayout };
});

const OrganisatieDashboardLayout = lazy(async () => {
  const mod = await import('./components/Layout/OrganisatieDashboardLayout');
  return { default: mod.OrganisatieDashboardLayout };
});

const ProfessionalDashboardLayout = lazy(async () => {
  const mod = await import('./components/Layout/ProfessionalDashboardLayout');
  return { default: mod.ProfessionalDashboardLayout };
});

const Home = lazy(() => import('./pages/Home'));

const PortalRoot = lazy(async () => {
  const mod = await import('./components/PortalRoot');
  return { default: mod.PortalRoot };
});

const CookieBanner = lazy(async () => {
  const mod = await import('./components/CookieBanner');
  return { default: mod.CookieBanner };
});

function OpdrachtRedirect() {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={id ? `/opdrachten/${id}` : '/opdrachten'} replace />;
}

function App() {
  return (
    <Router>
      <PortalPrefetch />
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
            <Route path="/opdrachten/:id" element={<PublicLayout><LazyOpdrachtDetail /></PublicLayout>} />
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

            <Route path="/professional" element={<ProtectedRoute allowedRoles={['professional']}><ProfessionalDashboardLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/professional/dashboard" replace />} />
              <Route path="dashboard" element={<LazyProfessionalDashboard />} />
              <Route path="profiel" element={<LazyProfessionalProfiel />} />
              <Route path="opdrachten" element={<LazyProfessionalOpdrachten />} />
              <Route path="reacties" element={<LazyProfessionalReacties />} />
              <Route path="reacties/:id" element={<LazyProfessionalReactieDetail />} />
              <Route path="uitnodigingen" element={<LazyProfessionalUitnodigingen />} />
              <Route path="inbox" element={<LazyProfessionalInbox />} />
              <Route path="abonnement" element={<LazyProfessionalAbonnement />} />
              <Route path="favorieten" element={<LazyProfessionalFavorieten />} />
              <Route path="zoekopdrachten" element={<LazyProfessionalZoekopdrachten />} />
              <Route path="beoordelingen" element={<LazyProfessionalReacties />} />
              <Route path="instellingen" element={<LazyProfessionalProfiel />} />
              <Route path=":id" element={<Navigate to="/professional/dashboard" replace />} />
            </Route>

            <Route
            path="/organisatie/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ORGANISATIE']}>
                <OrganisatieDashboardLayout>
                  <LazyOpdrachtgeverDashboard />
                </OrganisatieDashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/organisatie/profiel"
            element={
              <ProtectedRoute allowedRoles={['ORGANISATIE']}>
                <OrganisatieDashboardLayout>
                  <LazyOpdrachtgeverProfiel />
                </OrganisatieDashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/organisatie/opdrachten"
            element={
              <ProtectedRoute allowedRoles={['ORGANISATIE']}>
                <OrganisatieDashboardLayout>
                  <LazyOpdrachtgeverOpdrachten />
                </OrganisatieDashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/organisatie/kandidaten"
            element={
              <ProtectedRoute allowedRoles={['ORGANISATIE']}>
                <OrganisatieDashboardLayout>
                  <LazyOpdrachtgeverKandidaten />
                </OrganisatieDashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/organisatie/favorieten"
            element={
              <ProtectedRoute allowedRoles={['ORGANISATIE']}>
                <OrganisatieDashboardLayout>
                  <LazyOpdrachtgeverFavorieten />
                </OrganisatieDashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/organisatie/inbox"
            element={
              <ProtectedRoute allowedRoles={['ORGANISATIE']}>
                <OrganisatieDashboardLayout>
                  <LazyOpdrachtgeverInbox />
                </OrganisatieDashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/organisatie/abonnement"
            element={
              <ProtectedRoute allowedRoles={['ORGANISATIE']}>
                <OrganisatieDashboardLayout>
                  <LazyOpdrachtgeverAbonnement />
                </OrganisatieDashboardLayout>
              </ProtectedRoute>
            }
          />

            <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboardLayout>
                  <LazyAdminDashboard />
                </AdminDashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/admin/verificaties"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboardLayout>
                  <LazyAdminVerificaties />
                </AdminDashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/admin/gebruikers"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboardLayout>
                  <LazyAdminGebruikers />
                </AdminDashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/admin/gebruikers/:id"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboardLayout>
                  <LazyAdminGebruikerDetail />
                </AdminDashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/admin/professionals"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboardLayout>
                  <LazyAdminProfessionals />
                </AdminDashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/admin/professionals/:id"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboardLayout>
                  <LazyAdminArtsDetail />
                </AdminDashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/admin/reacties"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboardLayout>
                  <LazyAdminReacties />
                </AdminDashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/admin/organisaties"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboardLayout>
                  <LazyAdminOpdrachtgevers />
                </AdminDashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/admin/organisaties/:id"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboardLayout>
                  <LazyAdminOpdrachtgeverDetail />
                </AdminDashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/admin/opdrachten"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboardLayout>
                  <LazyAdminOpdrachten />
                </AdminDashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/admin/matches"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboardLayout>
                  <LazyAdminMatches />
                </AdminDashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/admin/jobs/review"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboardLayout>
                  <LazyAdminJobsReview />
                </AdminDashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/admin/abonnementen"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboardLayout>
                  <LazyAdminAbonnementen />
                </AdminDashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/admin/instellingen"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboardLayout>
                  <LazyAdminInstellingen />
                </AdminDashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/admin/community"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboardLayout>
                  <LazyAdminCommunityBeheer />
                </AdminDashboardLayout>
              </ProtectedRoute>
            }
          />

            <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            </Suspense>
          {!isPortal() && (
            <Suspense fallback={null}>
              <CookieBanner />
            </Suspense>
          )}
          </MaintenanceGate>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
