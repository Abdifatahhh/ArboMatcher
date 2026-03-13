import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { getRoleLabel } from '../../lib/roleLabels';
import { demoStats, demoActivity, type ActivityItem } from '../../data/adminDemoData';
import { AdminPage, AdminPageHeader, AdminCard, AdminAlert } from '../../components/Admin/adminUI';
import {
  CheckCircle, Users, Briefcase, CreditCard, User, FileText, AlertCircle,
  ArrowRight, LayoutDashboard, TrendingUp, TrendingDown, Minus,
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
  prevUsersWeek: number;
  prevJobsWeek: number;
  prevApplicationsWeek: number;
};

const defaultStats: Stats = {
  pendingVerifications: 0, totalUsers: 0, totalDoctors: 0, activeJobs: 0,
  totalApplications: 0, activeSubscriptions: 0, draftJobs: 0, closedJobs: 0,
  pendingApplications: 0, newUsersToday: 0, newUsersWeek: 0,
  newJobsToday: 0, newJobsWeek: 0, newApplicationsToday: 0, newApplicationsWeek: 0,
  prevUsersWeek: 0, prevJobsWeek: 0, prevApplicationsWeek: 0,
};

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  if (now.toDateString() === d.toDateString()) return `Vandaag ${d.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}`;
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (yesterday.toDateString() === d.toDateString()) return `Gisteren ${d.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}`;
  return d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

type StatCardProps = { label: string; value: number; icon: React.ElementType; to: string; accent?: boolean; sub?: string };

function StatCard({ label, value, icon: Icon, to, accent, sub }: StatCardProps) {
  return (
    <Link to={to} className={`group relative rounded-xl border p-5 transition-all hover:shadow-md ${accent ? 'border-blue-200 bg-blue-50/40' : 'border-slate-200/80 bg-white'}`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ${accent ? 'bg-blue-100' : 'bg-slate-100'}`}>
          <Icon className={`w-5 h-5 ${accent ? 'text-blue-600' : 'text-slate-600'}`} />
        </span>
        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
      </div>
      <p className="text-2xl font-semibold text-slate-900 tracking-tight">{value}</p>
      <p className="text-sm text-slate-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </Link>
  );
}

function WeekCompare({ label, current, previous }: { label: string; current: number; previous: number }) {
  const diff = current - previous;
  const pct = previous > 0 ? Math.round((diff / previous) * 100) : current > 0 ? 100 : 0;
  const isUp = diff > 0;
  const isDown = diff < 0;
  return (
    <div className="text-center">
      <p className="text-2xl font-semibold text-slate-900">{current}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
      <div className={`flex items-center justify-center gap-1 mt-1.5 text-xs font-medium ${isUp ? 'text-emerald-600' : isDown ? 'text-red-500' : 'text-slate-400'}`}>
        {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : isDown ? <TrendingDown className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
        <span>{isUp ? '+' : ''}{pct}% vs vorige week</span>
      </div>
      <p className="text-[10px] text-slate-400 mt-0.5">vorige: {previous}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const { profile, user } = useAuth();
  const [stats, setStats] = useState<Stats>(defaultStats);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => { (async () => { await fetchStats(); await fetchActivity(); })(); }, [user?.id]);

  const fetchStats = async () => {
    try {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const startOfWeek = new Date(now); startOfWeek.setDate(startOfWeek.getDate() - 7);
      const startOfWeekIso = startOfWeek.toISOString();
      const startOfPrevWeek = new Date(now); startOfPrevWeek.setDate(startOfPrevWeek.getDate() - 14);
      const startOfPrevWeekIso = startOfPrevWeek.toISOString();
      const excludeUserId = user?.id;
      const pendingVerifQuery = excludeUserId
        ? supabase.from('professionals').select('id', { count: 'exact' }).eq('verification_status', 'PENDING').neq('user_id', excludeUserId)
        : supabase.from('professionals').select('id', { count: 'exact' }).eq('verification_status', 'PENDING');
      const totalProfsQuery = excludeUserId
        ? supabase.from('professionals').select('id', { count: 'exact' }).neq('user_id', excludeUserId)
        : supabase.from('professionals').select('id', { count: 'exact' });
      const [verificationsRes, usersRes, doctorsRes, jobsPublishedRes, jobsDraftRes, jobsClosedRes, applicationsRes, applicationsPendingRes, subscriptionsRes, usersTodayRes, usersWeekRes, jobsTodayRes, jobsWeekRes, appsTodayRes, appsWeekRes, prevUsersWeekRes, prevJobsWeekRes, prevAppsWeekRes] = await Promise.all([
        pendingVerifQuery,
        supabase.from('profiles').select('id', { count: 'exact' }),
        totalProfsQuery,
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
        supabase.from('profiles').select('id', { count: 'exact' }).gte('created_at', startOfPrevWeekIso).lt('created_at', startOfWeekIso),
        supabase.from('jobs').select('id', { count: 'exact' }).gte('created_at', startOfPrevWeekIso).lt('created_at', startOfWeekIso),
        supabase.from('applications').select('id', { count: 'exact' }).gte('created_at', startOfPrevWeekIso).lt('created_at', startOfWeekIso),
      ]);
      const real: Stats = {
        pendingVerifications: verificationsRes.count ?? 0, totalUsers: usersRes.count ?? 0, totalDoctors: doctorsRes.count ?? 0,
        activeJobs: jobsPublishedRes.count ?? 0, totalApplications: applicationsRes.count ?? 0, activeSubscriptions: subscriptionsRes.count ?? 0,
        draftJobs: jobsDraftRes.count ?? 0, closedJobs: jobsClosedRes.count ?? 0, pendingApplications: applicationsPendingRes.count ?? 0,
        newUsersToday: usersTodayRes.count ?? 0, newUsersWeek: usersWeekRes.count ?? 0, newJobsToday: jobsTodayRes.count ?? 0,
        newJobsWeek: jobsWeekRes.count ?? 0, newApplicationsToday: appsTodayRes.count ?? 0, newApplicationsWeek: appsWeekRes.count ?? 0,
        prevUsersWeek: prevUsersWeekRes.count ?? 0, prevJobsWeek: prevJobsWeekRes.count ?? 0, prevApplicationsWeek: prevAppsWeekRes.count ?? 0,
      };
      const isEmpty = real.totalUsers === 0 && real.totalDoctors === 0 && real.activeJobs === 0 && real.totalApplications === 0;
      setStats(isEmpty ? (demoStats as Stats) : real);
      setIsDemo(isEmpty);
    } catch { setLoading(false); }
  };

  const fetchActivity = async () => {
    try {
      const excludeUserId = user?.id;
      const pendingProfsQuery = excludeUserId
        ? supabase.from('professionals').select('id, user_id, big_number, created_at, profiles(full_name)').eq('verification_status', 'PENDING').neq('user_id', excludeUserId).order('created_at', { ascending: false }).limit(5)
        : supabase.from('professionals').select('id, user_id, big_number, created_at, profiles(full_name)').eq('verification_status', 'PENDING').order('created_at', { ascending: false }).limit(5);
      const [profilesRes, doctorsRes, jobsRes, applicationsRes] = await Promise.all([
        supabase.from('profiles').select('id, full_name, email, role, created_at').order('created_at', { ascending: false }).limit(5),
        pendingProfsQuery,
        supabase.from('jobs').select('id, title, status, company_name, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('applications').select('id, status, created_at, jobs(title), professionals(profiles(full_name))').order('created_at', { ascending: false }).limit(5),
      ]);
      const items: ActivityItem[] = [];
      (profilesRes.data || []).forEach((p: any) => { items.push({ id: `user-${p.id}`, type: 'user', title: p.full_name || p.email, subtitle: `Nieuwe gebruiker · ${getRoleLabel(p.role)}`, link: `/admin/gebruikers/${p.id}`, created_at: p.created_at }); });
      (doctorsRes.data || []).forEach((d: any) => { const name = d.profiles?.full_name || 'Arts'; items.push({ id: `verification-${d.id}`, type: 'verification', title: `Verificatie: ${name}`, subtitle: `BIG ${d.big_number}`, link: `/admin/professionals/${d.id}`, created_at: d.created_at }); });
      (jobsRes.data || []).forEach((j: any) => { items.push({ id: `job-${j.id}`, type: 'job', title: j.title, subtitle: `${j.status} · ${j.company_name || 'Opdracht'}`, link: '/admin/opdrachten', created_at: j.created_at }); });
      (applicationsRes.data || []).forEach((a: any) => { const docName = a.professionals?.profiles?.full_name || 'Arts'; const jobTitle = a.jobs?.title || 'Opdracht'; items.push({ id: `app-${a.id}`, type: 'application', title: `${docName} → "${jobTitle}"`, subtitle: a.status, link: '/admin/reacties', created_at: a.created_at }); });
      const sorted = items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 12);
      setActivity(sorted.length > 0 ? sorted : demoActivity);
    } catch { setActivity(demoActivity); } finally { setLoading(false); }
  };

  if (loading) {
    return (
      <AdminPage>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-slate-200/80 bg-white p-5 animate-pulse">
              <div className="w-9 h-9 rounded-lg bg-slate-100 mb-3" />
              <div className="h-6 w-12 bg-slate-100 rounded mb-2" />
              <div className="h-4 w-20 bg-slate-50 rounded" />
            </div>
          ))}
        </div>
      </AdminPage>
    );
  }

  const displayName = profile?.full_name?.trim() || profile?.email || 'Admin';
  const hasUrgent = stats.pendingVerifications > 0 || stats.pendingApplications > 0;

  return (
    <AdminPage>
      <AdminPageHeader
        icon={LayoutDashboard}
        title="Dashboard"
        description={`Welkom terug, ${displayName}`}
      />

      {isDemo && (
        <AdminAlert variant="warning">
          Demo-cijfers worden getoond. Zodra er echte data in de database staat, ziet u de echte aantallen.
        </AdminAlert>
      )}

      {hasUrgent && (
        <AdminCard noPadding>
          <div className="flex items-center gap-3 px-5 py-3.5">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100">
              <AlertCircle className="w-4 h-4 text-amber-600" />
            </span>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
              {stats.pendingVerifications > 0 && (
                <Link to="/admin/verificaties" className="text-amber-700 hover:text-amber-900 font-medium hover:underline">
                  {stats.pendingVerifications} verificatie{stats.pendingVerifications !== 1 ? 's' : ''} wachtend
                </Link>
              )}
              {stats.pendingApplications > 0 && (
                <Link to="/admin/reacties" className="text-amber-700 hover:text-amber-900 font-medium hover:underline">
                  {stats.pendingApplications} sollicitatie{stats.pendingApplications !== 1 ? 's' : ''} in behandeling
                </Link>
              )}
            </div>
          </div>
        </AdminCard>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard label="Verificaties" value={stats.pendingVerifications} icon={CheckCircle} to="/admin/verificaties" sub="Wachtend op goedkeuring" />
        <StatCard label="Professionals" value={stats.totalDoctors} icon={User} to="/admin/professionals" />
        <StatCard
          label="Gebruikers" value={stats.totalUsers} icon={Users} to="/admin/gebruikers"
          sub={stats.newUsersWeek > 0 ? `+${stats.newUsersWeek} deze week` : undefined}
        />
        <StatCard
          label="Opdrachten" value={stats.activeJobs} icon={Briefcase} to="/admin/opdrachten"
          sub={`${stats.draftJobs} concept · ${stats.closedJobs} gesloten`}
        />
        <StatCard
          label="Reacties" value={stats.totalApplications} icon={FileText} to="/admin/reacties"
          sub={stats.pendingApplications > 0 ? `${stats.pendingApplications} wachtend` : undefined}
        />
        <StatCard label="Abonnementen" value={stats.activeSubscriptions} icon={CreditCard} to="/admin/abonnementen" sub="Actieve betalingen" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <AdminCard title="Snelle acties" className="lg:col-span-1">
          <div className="space-y-1.5">
            {[
              { to: '/admin/verificaties', label: 'Verificaties beoordelen', icon: CheckCircle },
              { to: '/admin/gebruikers', label: 'Gebruikers bekijken', icon: Users },
              { to: '/admin/opdrachten', label: 'Opdrachten beheren', icon: Briefcase },
              { to: '/admin/reacties', label: 'Sollicitaties bekijken', icon: FileText },
            ].map((a) => (
              <Link key={a.to} to={a.to} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors group">
                <a.icon className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                <span className="font-medium">{a.label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 ml-auto" />
              </Link>
            ))}
          </div>
        </AdminCard>

        <AdminCard title="Recente activiteit" subtitle={`${activity.length} items`} className="lg:col-span-2">
          {activity.length === 0 ? (
            <p className="text-sm text-slate-500 py-4">Nog geen activiteit.</p>
          ) : (
            <div className="divide-y divide-slate-50 -mx-5">
              {activity.map((item) => (
                <Link key={item.id} to={item.link} className="flex items-baseline justify-between gap-3 px-5 py-2.5 hover:bg-slate-50/50 transition-colors">
                  <div className="min-w-0">
                    <span className="text-sm font-medium text-slate-800 truncate block">{item.title}</span>
                    {item.subtitle && <span className="text-xs text-slate-400">{item.subtitle}</span>}
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap shrink-0">{formatDate(item.created_at)}</span>
                </Link>
              ))}
            </div>
          )}
        </AdminCard>
      </div>

      {(stats.newUsersWeek > 0 || stats.newJobsWeek > 0 || stats.newApplicationsWeek > 0) && (
        <AdminCard title="Deze week vs. vorige week" actions={<TrendingUp className="w-4 h-4 text-slate-400" />}>
          <div className="grid grid-cols-3 gap-6">
            <WeekCompare label="Gebruikers" current={stats.newUsersWeek} previous={stats.prevUsersWeek} />
            <WeekCompare label="Opdrachten" current={stats.newJobsWeek} previous={stats.prevJobsWeek} />
            <WeekCompare label="Reacties" current={stats.newApplicationsWeek} previous={stats.prevApplicationsWeek} />
          </div>
        </AdminCard>
      )}
    </AdminPage>
  );
}
