import { lazy } from 'react';

export const LazyOver = lazy(() => import('../pages/Over'));
export const LazyOpdrachten = lazy(() => import('../pages/Opdrachten'));
export const LazyOpdrachtDetail = lazy(() => import('../pages/OpdrachtDetail'));
export const LazyPrijzen = lazy(() => import('../pages/Prijzen'));
export const LazyLogin = lazy(() => import('../pages/Login'));
export const LazyRegister = lazy(() => import('../pages/Register'));
export const LazyOnboarding = lazy(() => import('../pages/Onboarding'));
export const LazyWachtwoordVergeten = lazy(() => import('../pages/WachtwoordVergeten'));
export const LazyEmailVerificatie = lazy(() => import('../pages/EmailVerificatie'));
export const LazyRegistratieGelukt = lazy(() => import('../pages/RegistratieGelukt'));
export const LazyVerificatieGelukt = lazy(() => import('../pages/VerificatieGelukt'));
export const LazyPrivacy = lazy(() => import('../pages/Privacy'));
export const LazyTerms = lazy(() => import('../pages/Terms'));
export const LazyContact = lazy(() => import('../pages/Contact'));
export const LazyCommunity = lazy(() => import('../pages/Community'));
export const LazyCommunityArticle = lazy(() => import('../pages/CommunityArticle'));
export const LazyCommunityTopic = lazy(() => import('../pages/CommunityTopic'));
export const LazyOplossingen = lazy(() => import('../pages/Oplossingen'));
export const LazyFAQ = lazy(() => import('../pages/FAQ'));

export const LazyArtsDashboard = lazy(() => import('../pages/Arts/Dashboard'));
export const LazyArtsProfiel = lazy(() => import('../pages/Arts/Profiel'));
export const LazyArtsOpdrachten = lazy(() => import('../pages/Arts/Opdrachten'));
export const LazyArtsReacties = lazy(() => import('../pages/Arts/Reacties'));
export const LazyArtsUitnodigingen = lazy(() => import('../pages/Arts/Uitnodigingen'));
export const LazyArtsInbox = lazy(() => import('../pages/Arts/Inbox'));
export const LazyArtsAbonnement = lazy(() => import('../pages/Arts/Abonnement'));
export const LazyArtsFavorieten = lazy(() => import('../pages/Arts/Favorieten'));

export const LazyOpdrachtgeverDashboard = lazy(() => import('../pages/Opdrachtgever/Dashboard'));
export const LazyOpdrachtgeverProfiel = lazy(() => import('../pages/Opdrachtgever/Profiel'));
export const LazyOpdrachtgeverOpdrachten = lazy(() => import('../pages/Opdrachtgever/Opdrachten'));
export const LazyOpdrachtgeverKandidaten = lazy(() => import('../pages/Opdrachtgever/Kandidaten'));
export const LazyOpdrachtgeverFavorieten = lazy(() => import('../pages/Opdrachtgever/Favorieten'));
export const LazyOpdrachtgeverInbox = lazy(() => import('../pages/Opdrachtgever/Inbox'));
export const LazyOpdrachtgeverAbonnement = lazy(() => import('../pages/Opdrachtgever/Abonnement'));

export const LazyAdminDashboard = lazy(() => import('../pages/Admin/Dashboard'));
export const LazyAdminVerificaties = lazy(() => import('../pages/Admin/Verificaties'));
export const LazyAdminGebruikers = lazy(() => import('../pages/Admin/Gebruikers'));
export const LazyAdminOpdrachten = lazy(() => import('../pages/Admin/Opdrachten'));
export const LazyAdminJobsReview = lazy(() => import('../pages/Admin/JobsReview'));
export const LazyAdminAbonnementen = lazy(() => import('../pages/Admin/Abonnementen'));
export const LazyAdminInstellingen = lazy(() => import('../pages/Admin/Instellingen'));
export const LazyAdminGebruikerDetail = lazy(() => import('../pages/Admin/GebruikerDetail'));
export const LazyAdminArtsen = lazy(() => import('../pages/Admin/Artsen'));
export const LazyAdminArtsDetail = lazy(() => import('../pages/Admin/ArtsDetail'));
export const LazyAdminReacties = lazy(() => import('../pages/Admin/Reacties'));
export const LazyAdminOpdrachtgevers = lazy(() => import('../pages/Admin/Opdrachtgevers'));
export const LazyAdminOpdrachtgeverDetail = lazy(() => import('../pages/Admin/OpdrachtgeverDetail'));
export const LazyAdminCommunityBeheer = lazy(() => import('../pages/Admin/CommunityBeheer'));
export const LazyAdminMatches = lazy(() => import('../pages/Admin/Matches'));

const preload = (fn: () => Promise<{ default: unknown }>) => {
  fn().catch(() => {});
};

export function preloadMarketingRoutes() {
  preload(() => import('../pages/Over'));
  preload(() => import('../pages/Opdrachten'));
  preload(() => import('../pages/Prijzen'));
  preload(() => import('../pages/Login'));
  preload(() => import('../pages/Register'));
  preload(() => import('../pages/Oplossingen'));
  preload(() => import('../pages/FAQ'));
  preload(() => import('../pages/Contact'));
}

const pathPreloaders: Record<string, () => Promise<unknown>> = {
  '/over': () => import('../pages/Over'),
  '/opdrachten': () => import('../pages/Opdrachten'),
  '/prijzen': () => import('../pages/Prijzen'),
  '/login': () => import('../pages/Login'),
  '/register': () => import('../pages/Register'),
  '/oplossingen': () => import('../pages/Oplossingen'),
  '/community': () => import('../pages/Community'),
  '/contact': () => import('../pages/Contact'),
  '/faq': () => import('../pages/FAQ'),
};
export function preloadRoute(path: string) {
  const fn = pathPreloaders[path];
  if (fn) fn().catch(() => {});
}
