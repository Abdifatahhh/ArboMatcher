import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { demoStats, demoActivity, type ActivityItem } from '../../data/adminDemoData';
import {
  CheckCircle,
  Users,
  Briefcase,
  CreditCard,
  User,
  FileText,
  Info,
  AlertCircle,
  UserPlus,
  ClipboardList,
  Zap,
} from 'lucide-react';

type Stats = {
  pendingVerifications: number;
  totalUsers: number;
  totalDoctors: number;
  activeJobs: number;
  totalApplications: number;
  activeSubscriptions: number;
  draftJobs: number;
  closedJobs: number;
  pendingApplications: number;
  newUsersToday: number;
  newUsersWeek: number;
  newJobsToday: number;
  newJobsWeek: number;
  newApplicationsToday: number;
  newApplicationsWeek: number;
};

const defaultStats: Stats = {
  pendingVerifications: 0,
  totalUsers: 0,
  totalDoctors: 0,
  activeJobs: 0,
  totalApplications: 0,
  activeSubscriptions: 0,
  draftJobs: 0,
  closedJobs: 0,
  pendingApplications: 0,
  newUsersToday: 0,
  newUsersWeek: 0,
  newJobsToday: 0,
  newJobsWeek: 0,
  newApplicationsToday: 0,
  newApplicationsWeek: 0,
};

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const today = now.toDateString() === d.toDateString();
  if (today) return `Vandaag ${d.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}`;
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (yesterday.toDateString() === d.toDateString()) return `Gisteren ${d.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}`;
  return d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function AdminDashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<Stats>(defaultStats);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    (async () => {
      await fetchStats();
      await fetchActivity();
    })();
  }, []);

  const fetchStats = async () => {
    try {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(startOfWeek.getDate() - 7);
      const startOfWeekIso = startOfWeek.toISOString();

      const [
        verificationsRes,
        usersRes,
        doctorsRes,
        jobsPublishedRes,
        jobsDraftRes,
        jobsClosedRes,
        applicationsRes,
        applicationsPendingRes,
        subscriptionsRes,
        usersTodayRes,
        usersWeekRes,
        jobsTodayRes,
        jobsWeekRes,
        appsTodayRes,
        appsWeekRes,
      ] = await Promise.all([
        supabase.from('doctors').select('id', { count: 'exact' }).eq('verification_status', 'PENDING'),
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('doctors').select('id', { count: 'exact' }),
        supabase.from('jobs').select('id', { count: 'exact' }).eq('status', 'PUBLISHED'),
        supabase.from('jobs').select('id', { count: 'exact' }).eq('status', 'DRAFT'),
        supabase.from('jobs').select('id', { count: 'exact' }).eq('status', 'CLOSED'),
        supabase.from('applications').select('id', { count: 'exact' }),
        supabase.from('applications').select('id', { count: 'exact' }).eq('status', 'PENDING'),
        supabase.from('subscriptions').select('id', { count: 'exact' }).eq('status', 'ACTIVE'),
        supabase.from('profiles').select('id', { count: 'exact' }).gte('created_at', startOfToday),
        supabase.from('profiles').select('id', { count: 'exact' }).gte('created_at', startOfWeekIso),
        supabase.from('jobs').select('id', { count: 'exact' }).gte('created_at', startOfToday),
        supabase.from('jobs').select('id', { count: 'exact' }).gte('created_at', startOfWeekIso),
        supabase.from('applications').select('id', { count: 'exact' }).gte('created_at', startOfToday),
        supabase.from('applications').select('id', { count: 'exact' }).gte('created_at', startOfWeekIso),
      ]);

      const real: Stats = {
        pendingVerifications: verificationsRes.count ?? 0,
        totalUsers: usersRes.count ?? 0,
        totalDoctors: doctorsRes.count ?? 0,
        activeJobs: jobsPublishedRes.count ?? 0,
        totalApplications: applicationsRes.count ?? 0,
        activeSubscriptions: subscriptionsRes.count ?? 0,
        draftJobs: jobsDraftRes.count ?? 0,
        closedJobs: jobsClosedRes.count ?? 0,
        pendingApplications: applicationsPendingRes.count ?? 0,
        newUsersToday: usersTodayRes.count ?? 0,
        newUsersWeek: usersWeekRes.count ?? 0,
        newJobsToday: jobsTodayRes.count ?? 0,
        newJobsWeek: jobsWeekRes.count ?? 0,
        newApplicationsToday: appsTodayRes.count ?? 0,
        newApplicationsWeek: appsWeekRes.count ?? 0,
      };
      const isEmpty = real.totalUsers === 0 && real.totalDoctors === 0 && real.activeJobs === 0 && real.totalApplications === 0;
      setStats(isEmpty ? (demoStats as Stats) : real);
      setIsDemo(isEmpty);
    } catch {
      setLoading(false);
    }
  };

  const fetchActivity = async () => {
    try {
      const [profilesRes, doctorsRes, jobsRes, applicationsRes] = await Promise.all([
        supabase.from('profiles').select('id, full_name, email, role, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('doctors').select('id, user_id, big_number, created_at, profiles(full_name)').eq('verification_status', 'PENDING').order('created_at', { ascending: false }).limit(5),
        supabase.from('jobs').select('id, title, status, company_name, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('applications').select('id, status, created_at, jobs(title), doctors(profiles(full_name))').order('created_at', { ascending: false }).limit(5),
      ]);

      const items: ActivityItem[] = [];
      const profiles = (profilesRes.data || []) as { id: string; full_name: string | null; email: string; role: string; created_at: string }[];
      profiles.forEach((p) => {
        items.push({
          id: `user-${p.id}`,
          type: 'user',
          title: p.full_name || p.email,
          subtitle: `Nieuwe gebruiker · ${p.role}`,
          link: `/admin/gebruikers/${p.id}`,
          created_at: p.created_at,
        });
      });
      const doctors = (doctorsRes.data || []) as { id: string; big_number: string; created_at: string; profiles: { full_name: string | null } | null }[];
      doctors.forEach((d) => {
        const name = (d.profiles as { full_name: string | null } | null)?.full_name || 'Arts';
        items.push({
          id: `verification-${d.id}`,
          type: 'verification',
          title: `Verificatie aangevraagd: ${name}`,
          subtitle: `BIG ${d.big_number}`,
          link: `/admin/artsen/${d.id}`,
          created_at: d.created_at,
        });
      });
      const jobs = (jobsRes.data || []) as { id: string; title: string; status: string; company_name: string | null; created_at: string }[];
      jobs.forEach((j) => {
        items.push({
          id: `job-${j.id}`,
          type: 'job',
          title: j.title,
          subtitle: `${j.status} · ${j.company_name || 'Opdracht'}`,
          link: '/admin/opdrachten',
          created_at: j.created_at,
        });
      });
      const applications = (applicationsRes.data || []) as {
        id: string;
        status: string;
        created_at: string;
        jobs: { title: string } | null;
        doctors: { profiles: { full_name: string | null } | null } | null;
      }[];
      applications.forEach((a) => {
        const docName = (a.doctors?.profiles as { full_name: string | null } | undefined)?.full_name || 'Arts';
        const jobTitle = a.jobs?.title || 'Opdracht';
        items.push({
          id: `app-${a.id}`,
          type: 'application',
          title: `Sollicitatie: ${docName} op "${jobTitle}"`,
          subtitle: a.status,
          link: '/admin/reacties',
          created_at: a.created_at,
        });
      });
      const sorted = items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 12);
      if (sorted.length > 0) {
        setActivity(sorted);
      } else {
        setActivity(demoActivity);
      }
    } catch {
      setActivity(demoActivity);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F172A]"></div>
      </div>
    );
  }

  const displayName = profile?.full_name?.trim() || profile?.email || 'Admin';

  return (
    <div className="p-6">
      {isDemo && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 shadow-sm">
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-amber-900 text-sm">Demo-cijfers worden getoond. Zodra er echte data in de database staat, ziet u de echte aantallen.</p>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#0F172A]">Admin Dashboard</h1>
        <p className="text-[#0F172A]/70 mt-1 font-medium">Welkom, {displayName}</p>
      </div>

      <div className="mb-6 p-5 bg-amber-50 border border-amber-200 rounded-xl shadow-sm">
        <h2 className="font-semibold text-amber-900 flex items-center gap-2 mb-2">
          <AlertCircle className="w-5 h-5" />
          Aandacht nodig
        </h2>
        <ul className="flex flex-wrap gap-4 text-sm">
          <li>
            <Link to="/admin/verificaties" className="text-amber-800 underline font-medium hover:text-amber-900">
              {stats.pendingVerifications} verificatie{stats.pendingVerifications !== 1 ? 's' : ''} wachtend op goedkeuring
            </Link>
          </li>
          <li>
            <Link to="/admin/reacties" className="text-amber-800 underline font-medium hover:text-amber-900">
              {stats.pendingApplications} sollicitatie{stats.pendingApplications !== 1 ? 's' : ''} in behandeling
            </Link>
          </li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mb-6">
        <Link
          to="/admin/verificaties"
          className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/30 border border-slate-100 hover:border-[#4FA151]/25 hover:shadow-[#4FA151]/10 transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8 text-[#4FA151]" />
            <span className="text-3xl font-bold text-[#4FA151]">{stats.pendingVerifications}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Verificaties</h3>
          <p className="text-sm text-gray-600">Wachtend op goedkeuring</p>
        </Link>

        <Link
          to="/admin/artsen"
          className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/30 border border-slate-100 hover:border-[#4FA151]/25 hover:shadow-[#4FA151]/10 transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <User className="w-8 h-8 text-[#0F172A]" />
            <span className="text-3xl font-bold text-[#0F172A]">{stats.totalDoctors}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Artsen</h3>
          <p className="text-sm text-gray-600">Totaal geregistreerd</p>
        </Link>

        <Link
          to="/admin/gebruikers"
          className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/30 border border-slate-100 hover:border-[#4FA151]/25 hover:shadow-[#4FA151]/10 transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-[#0F172A]" />
            <span className="text-3xl font-bold text-[#0F172A]">{stats.totalUsers}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Gebruikers</h3>
          <p className="text-sm text-gray-600">
            Totaal geregistreerd
            {(stats.newUsersToday > 0 || stats.newUsersWeek > 0) && (
              <span className="block text-xs text-gray-500 mt-0.5">
                Vandaag: {stats.newUsersToday} · Deze week: {stats.newUsersWeek}
              </span>
            )}
          </p>
        </Link>

        <Link
          to="/admin/opdrachten"
          className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/30 border border-slate-100 hover:border-[#4FA151]/25 hover:shadow-[#4FA151]/10 transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <Briefcase className="w-8 h-8 text-[#0F172A]" />
            <span className="text-3xl font-bold text-[#0F172A]">{stats.activeJobs}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Opdrachten</h3>
          <p className="text-sm text-gray-600">
            Actief gepubliceerd
            <span className="block text-xs text-gray-500 mt-0.5">
              {stats.draftJobs} concept · {stats.closedJobs} gesloten
            </span>
            {(stats.newJobsToday > 0 || stats.newJobsWeek > 0) && (
              <span className="block text-xs text-gray-500">Vandaag: {stats.newJobsToday} · Week: {stats.newJobsWeek}</span>
            )}
          </p>
        </Link>

        <Link
          to="/admin/reacties"
          className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/30 border border-slate-100 hover:border-[#4FA151]/25 hover:shadow-[#4FA151]/10 transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <FileText className="w-8 h-8 text-[#0F172A]" />
            <span className="text-3xl font-bold text-[#0F172A]">{stats.totalApplications}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Reacties</h3>
          <p className="text-sm text-gray-600">
            Sollicitaties
            {stats.pendingApplications > 0 && (
              <span className="block text-xs text-amber-600 font-medium mt-0.5">{stats.pendingApplications} wachtend</span>
            )}
            {(stats.newApplicationsToday > 0 || stats.newApplicationsWeek > 0) && (
              <span className="block text-xs text-gray-500">Vandaag: {stats.newApplicationsToday} · Week: {stats.newApplicationsWeek}</span>
            )}
          </p>
        </Link>

        <Link
          to="/admin/abonnementen"
          className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/30 border border-slate-100 hover:border-[#4FA151]/25 hover:shadow-[#4FA151]/10 transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <CreditCard className="w-8 h-8 text-[#4FA151]" />
            <span className="text-3xl font-bold text-[#4FA151]">{stats.activeSubscriptions}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Abonnementen</h3>
          <p className="text-sm text-gray-600">Actieve betalingen</p>
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <Link
          to="/admin/verificaties"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#4FA151] text-white rounded-xl text-sm font-medium hover:bg-[#3E8E45] shadow-md shadow-[#4FA151]/20 transition"
        >
          <CheckCircle className="w-4 h-4" />
          Verificaties beoordelen
        </Link>
        <Link
          to="/admin/gebruikers"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-[#0F172A] rounded-xl text-sm font-medium hover:bg-slate-50 hover:border-[#4FA151]/30 transition"
        >
          <UserPlus className="w-4 h-4" />
          Gebruikers bekijken
        </Link>
        <Link
          to="/admin/opdrachten"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-[#0F172A] rounded-xl text-sm font-medium hover:bg-slate-50 hover:border-[#4FA151]/30 transition"
        >
          <ClipboardList className="w-4 h-4" />
          Open opdrachten
        </Link>
        <Link
          to="/admin/reacties"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-[#0F172A] rounded-xl text-sm font-medium hover:bg-slate-50 hover:border-[#4FA151]/30 transition"
        >
          <Zap className="w-4 h-4" />
          Sollicitaties bekijken
        </Link>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/30 border border-slate-100">
        <h2 className="text-xl font-bold text-[#0F172A] mb-4">Recent activiteit</h2>
        {activity.length === 0 ? (
          <p className="text-gray-600">Nog geen activiteit.</p>
        ) : (
          <ul className="space-y-3">
            {activity.map((item) => (
              <li key={item.id} className="flex flex-wrap items-baseline justify-between gap-2 py-2 border-b border-slate-100 last:border-0">
                <div>
                  <Link to={item.link} className="font-medium text-[#0F172A] hover:underline">
                    {item.title}
                  </Link>
                  {item.subtitle && <span className="text-gray-500 text-sm ml-2">{item.subtitle}</span>}
                </div>
                <span className="text-gray-400 text-sm">{formatDate(item.created_at)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
