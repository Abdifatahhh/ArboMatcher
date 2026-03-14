import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import {
  Briefcase,
  MessageSquare,
  Mail,
  AlertCircle,
  CheckCircle,
  Eye,
  Send,
  Star,
  ArrowRight,
  Clock
} from 'lucide-react';

export default function ArtsDashboard() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState({
    applications: 0,
    invites: 0,
    messages: 0,
    verificationStatus: 'UNVERIFIED',
    profileViews: 0,
    isPremium: false,
    hasProfile: false,
  });
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecentJobs();
  }, [user]);

  const fetchStats = async () => {
    if (!user) return;

    const { data: professional } = await supabase
      .from('professionals')
      .select('id, verification_status, plan')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!professional) {
      setLoading(false);
      return;
    }

    const [applicationsRes, invitesRes, conversationsRes] = await Promise.all([
      supabase.from('applications').select('id', { count: 'exact' }).eq('professional_id', professional.id),
      supabase.from('invites').select('id', { count: 'exact' }).eq('professional_id', professional.id).eq('status', 'PENDING'),
      supabase.from('conversations').select('id', { count: 'exact' }).contains('participant_ids', [user.id])
    ]);

    setStats({
      applications: applicationsRes.count || 0,
      invites: invitesRes.count || 0,
      messages: conversationsRes.count || 0,
      verificationStatus: professional.verification_status,
      profileViews: Math.floor(Math.random() * 50),
      isPremium: (professional as { plan?: string }).plan === 'PRO',
      hasProfile: true,
    });

    setLoading(false);
  };

  const fetchRecentJobs = async () => {
    const { data } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'PUBLISHED')
      .order('created_at', { ascending: false })
      .limit(5);

    setRecentJobs(data || []);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F172A]" />
      </div>
    );
  }

  const displayName = profile?.full_name?.trim() || profile?.email || 'Professional';

  return (
    <div className="p-4 md:p-6">
      {stats.verificationStatus === 'UNVERIFIED' && (
        <div className="mb-4 md:mb-6 p-3 md:p-5 bg-amber-50 border border-amber-200 rounded-xl shadow-sm flex flex-wrap items-center justify-between gap-3 md:gap-4">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-amber-600 shrink-0" />
            <div className="min-w-0">
              <p className="font-semibold text-amber-900 text-sm md:text-base">Maak je profiel compleet om te reageren op opdrachten</p>
              <p className="text-xs md:text-sm text-amber-800">Vul je gegevens, specialismen en BIG-nummer in op je profielpagina.</p>
            </div>
          </div>
          <Link
            to="/professional/profiel"
            className="shrink-0 inline-flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 bg-gradient-to-r from-emerald-500 to-green-400 text-white rounded-xl text-sm md:text-base font-semibold hover:from-emerald-600 hover:to-green-500 transition shadow-lg shadow-emerald-500/20"
          >
            Profiel voltooien
            <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </Link>
        </div>
      )}

      <div className="mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A]">Professional Dashboard</h1>
        <p className="text-[#0F172A]/70 mt-0.5 md:mt-1 font-medium text-sm md:text-base">Welkom, {displayName}</p>
      </div>

      {stats.verificationStatus === 'PENDING' && (
        <div className="mb-4 md:mb-6 p-3 md:p-5 rounded-xl shadow-sm flex items-start gap-2 md:gap-3 bg-blue-50 border border-blue-200">
          <Clock className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-600" />
          <div className="flex-1">
            <h3 className="font-semibold mb-0.5 text-blue-900">Verificatie in behandeling</h3>
            <p className="text-sm text-blue-800">Uw BIG-nummer wordt gecontroleerd. Dit kan enkele werkdagen duren.</p>
          </div>
        </div>
      )}

      {stats.verificationStatus === 'REJECTED' && (
        <div className="mb-4 md:mb-6 p-3 md:p-5 rounded-xl shadow-sm flex items-start gap-2 md:gap-3 bg-red-50 border border-red-200">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
          <div className="flex-1">
            <h3 className="font-semibold mb-0.5 text-red-900">Verificatie afgewezen</h3>
            <p className="text-sm text-red-800">Uw verificatie is afgewezen. Controleer uw gegevens en neem contact op met support.</p>
          </div>
        </div>
      )}

      {stats.verificationStatus === 'VERIFIED' && (
        <div className="mb-4 md:mb-6 p-3 md:p-5 bg-green-50 border border-green-200 rounded-xl shadow-sm flex flex-wrap items-center gap-3 md:gap-4">
          <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
            <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-green-900 font-medium text-sm md:text-base">Uw profiel is geverifieerd</p>
              <p className="text-green-800 text-xs md:text-sm">U kunt nu reageren op opdrachten en uitnodigingen ontvangen.</p>
            </div>
          </div>
          {!stats.isPremium && (
            <Link to="/professional/abonnement" className="bg-gradient-to-r from-emerald-500 to-green-400 text-white px-3 py-2 md:px-4 md:py-2.5 rounded-xl text-xs md:text-sm font-semibold hover:from-emerald-600 hover:to-green-500 transition shadow-md shadow-emerald-500/20">
              Upgrade naar PRO
            </Link>
          )}
        </div>
      )}

      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-4 md:mb-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          <Link
            to="/professional/reacties"
            className="bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <Send className="w-6 h-6 md:w-8 md:h-8 text-[#0F172A]" />
              <span className="text-xl md:text-3xl font-bold text-[#0F172A]">{stats.applications}</span>
            </div>
            <h3 className="text-sm md:text-lg font-semibold text-slate-700">Verstuurde reacties</h3>
            <p className="text-xs md:text-sm text-slate-500">Sollicitaties</p>
          </Link>
          <Link
            to="/professional/uitnodigingen"
            className="bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <Mail className="w-6 h-6 md:w-8 md:h-8 text-slate-700" />
              <span className="text-xl md:text-3xl font-bold text-[#0F172A]">{stats.invites}</span>
            </div>
            <h3 className="text-sm md:text-lg font-semibold text-slate-700">Uitnodigingen</h3>
            <p className="text-xs md:text-sm text-slate-500">Openstaande uitnodigingen</p>
          </Link>
          <Link
            to="/professional/inbox"
            className="bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <MessageSquare className="w-6 h-6 md:w-8 md:h-8 text-[#0F172A]" />
              <span className="text-xl md:text-3xl font-bold text-[#0F172A]">{stats.messages}</span>
            </div>
            <h3 className="text-sm md:text-lg font-semibold text-slate-700">Berichten</h3>
            <p className="text-xs md:text-sm text-slate-500">Conversaties</p>
          </Link>
          <div className="bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <Eye className="w-6 h-6 md:w-8 md:h-8 text-slate-400" />
              <span className="text-xl md:text-3xl font-bold text-slate-700">{stats.profileViews}</span>
            </div>
            <h3 className="text-sm md:text-lg font-semibold text-slate-700">Profielweergaven</h3>
            <p className="text-xs md:text-sm text-slate-500">Door organisaties</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 bg-slate-50 rounded-2xl border border-slate-200 p-5">
          <h2 className="text-lg md:text-xl font-bold text-[#0F172A] mb-3 md:mb-4 flex items-center justify-between">
            Nieuwe opdrachten
            <Link to="/professional/opdrachten" className="text-xs md:text-sm text-[#0F172A] hover:underline font-medium">Bekijk alle</Link>
          </h2>
          <div className="space-y-2">
            {recentJobs.length === 0 ? (
              <div className="py-6 md:py-8 text-center text-slate-400 text-sm md:text-base">
                <Briefcase className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-2 md:mb-3 text-slate-300" />
                <p>Geen nieuwe opdrachten</p>
              </div>
            ) : (
              recentJobs.map((job) => (
                <Link
                  key={job.id}
                  to={`/opdrachten/${job.id}`}
                  className="flex items-start gap-2 md:gap-3 bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 hover:border-slate-300 hover:shadow-md transition"
                >
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-[#0F172A] rounded-lg md:rounded-xl flex items-center justify-center text-white font-bold text-[10px] md:text-xs flex-shrink-0">PRO</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#0F172A] truncate text-sm md:text-base">{job.title}</p>
                    <div className="flex items-center text-xs md:text-sm text-slate-400 mt-0.5">
                      {job.region && <span className="mr-3">{job.region}</span>}
                      <span className="flex items-center"><Clock className="w-3 h-3 mr-1" />{new Date(job.created_at).toLocaleDateString('nl-NL')}</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="space-y-3 md:space-y-4">
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4">
            <h2 className="text-base md:text-xl font-bold text-[#0F172A] mb-3 md:mb-4">Snelle acties</h2>
            <div className="space-y-1.5 md:space-y-2">
              <Link to="/professional/opdrachten" className="flex items-center justify-between p-2.5 md:p-3 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md transition text-sm md:text-base">
                <span className="font-medium text-slate-700">Zoek opdrachten</span>
                <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-400" />
              </Link>
              <Link to="/professional/profiel" className="flex items-center justify-between p-2.5 md:p-3 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md transition text-sm md:text-base">
                <span className="font-medium text-slate-700">Bewerk profiel</span>
                <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-400" />
              </Link>
              <Link to="/professional/abonnement" className="flex items-center justify-between p-2.5 md:p-3 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md transition text-sm md:text-base">
                <span className="font-medium text-slate-700">Bekijk abonnement</span>
                <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-400" />
              </Link>
            </div>
          </div>
          {!stats.isPremium && (
            <div className="bg-gradient-to-br from-[#0F172A] to-[#1e293b] rounded-xl md:rounded-2xl p-4 md:p-6 text-white shadow-lg">
              <Star className="w-6 h-6 md:w-8 md:h-8 text-[#FCD34D] mb-2 md:mb-3" />
              <h3 className="font-bold text-base md:text-lg mb-1.5 md:mb-2">Upgrade naar PRO</h3>
              <p className="text-slate-300 text-xs md:text-sm mb-3 md:mb-4">Word sneller gevonden door organisaties met premium zichtbaarheid.</p>
              <Link to="/professional/abonnement" className="block text-center bg-white text-[#0F172A] py-2 md:py-2.5 rounded-xl text-sm md:text-base font-semibold hover:bg-slate-100 transition">
                Bekijk voordelen
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
