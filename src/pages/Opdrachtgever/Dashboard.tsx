import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Users, MessageSquare, Plus, ArrowRight, User } from 'lucide-react';

export default function OpdrachtgeverDashboard() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState({
    activeJobs: 0,
    applications: 0,
    messages: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    if (!user) return;

    const { data: employer } = await supabase
      .from('employers')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!employer) {
      setLoading(false);
      return;
    }

    const [jobsRes, applicationsRes, conversationsRes] = await Promise.all([
      supabase.from('jobs').select('id', { count: 'exact' }).eq('employer_id', employer.id).neq('status', 'CLOSED'),
      supabase
        .from('applications')
        .select('id', { count: 'exact' })
        .in('job_id',
          (await supabase.from('jobs').select('id').eq('employer_id', employer.id)).data?.map(j => j.id) || []
        ),
      supabase.from('conversations').select('id', { count: 'exact' }).contains('participant_ids', [user.id])
    ]);

    setStats({
      activeJobs: jobsRes.count || 0,
      applications: applicationsRes.count || 0,
      messages: conversationsRes.count || 0
    });

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F172A]" />
      </div>
    );
  }

  const displayName = profile?.full_name?.trim() || profile?.email || 'Opdrachtgever';

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4 md:mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A]">Bedrijf Dashboard</h1>
          <p className="text-[#0F172A]/70 mt-0.5 md:mt-1 font-medium text-sm md:text-base">Welkom, {displayName}</p>
        </div>
        <Link
          to="/opdrachtgever/opdrachten"
          className="inline-flex items-center gap-1.5 md:gap-2 px-3 py-2 md:px-4 md:py-2.5 bg-[#4FA151] text-white rounded-xl text-xs md:text-sm font-medium hover:bg-[#3E8E45] shadow-md shadow-[#4FA151]/20 transition"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
          Nieuwe opdracht
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-4 md:mb-6">
        <Link
          to="/opdrachtgever/opdrachten"
          className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg shadow-slate-200/30 border border-slate-100 hover:border-[#4FA151]/25 hover:shadow-[#4FA151]/10 transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-2 md:mb-4">
            <Briefcase className="w-6 h-6 md:w-8 md:h-8 text-[#0F172A]" />
            <span className="text-xl md:text-3xl font-bold text-[#0F172A]">{stats.activeJobs}</span>
          </div>
          <h3 className="text-sm md:text-lg font-semibold text-gray-800">Actieve opdrachten</h3>
          <p className="text-xs md:text-sm text-gray-600">Uw openstaande vacatures</p>
        </Link>
        <Link
          to="/opdrachtgever/kandidaten"
          className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg shadow-slate-200/30 border border-slate-100 hover:border-[#4FA151]/25 hover:shadow-[#4FA151]/10 transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-2 md:mb-4">
            <Users className="w-6 h-6 md:w-8 md:h-8 text-[#4FA151]" />
            <span className="text-xl md:text-3xl font-bold text-[#4FA151]">{stats.applications}</span>
          </div>
          <h3 className="text-sm md:text-lg font-semibold text-gray-800">Kandidaten</h3>
          <p className="text-xs md:text-sm text-gray-600">Totaal aantal reacties</p>
        </Link>
        <Link
          to="/opdrachtgever/inbox"
          className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg shadow-slate-200/30 border border-slate-100 hover:border-[#4FA151]/25 hover:shadow-[#4FA151]/10 transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-2 md:mb-4">
            <MessageSquare className="w-6 h-6 md:w-8 md:h-8 text-[#0F172A]" />
            <span className="text-xl md:text-3xl font-bold text-[#0F172A]">{stats.messages}</span>
          </div>
          <h3 className="text-sm md:text-lg font-semibold text-gray-800">Berichten</h3>
          <p className="text-xs md:text-sm text-gray-600">Conversaties met artsen</p>
        </Link>
        <Link
          to="/opdrachtgever/profiel"
          className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg shadow-slate-200/30 border border-slate-100 hover:border-[#4FA151]/25 hover:shadow-[#4FA151]/10 transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-2 md:mb-4">
            <User className="w-6 h-6 md:w-8 md:h-8 text-gray-500" />
            <span className="text-xl md:text-3xl font-bold text-gray-700">—</span>
          </div>
          <h3 className="text-sm md:text-lg font-semibold text-gray-800">Bedrijfsprofiel</h3>
          <p className="text-xs md:text-sm text-gray-600">Gegevens beheren</p>
        </Link>
      </div>

      <div className="mb-4 md:mb-6 flex flex-wrap gap-2 md:gap-3">
        <Link
          to="/opdrachtgever/opdrachten"
          className="inline-flex items-center gap-1.5 md:gap-2 px-3 py-2 md:px-4 md:py-2.5 bg-[#4FA151] text-white rounded-xl text-xs md:text-sm font-medium hover:bg-[#3E8E45] shadow-md shadow-[#4FA151]/20 transition"
        >
          <Briefcase className="w-3.5 h-3.5 md:w-4 md:h-4" />
          Nieuwe opdracht
        </Link>
        <Link
          to="/opdrachtgever/profiel"
          className="inline-flex items-center gap-1.5 md:gap-2 px-3 py-2 md:px-4 md:py-2.5 bg-white border border-slate-200 text-[#0F172A] rounded-xl text-xs md:text-sm font-medium hover:bg-slate-50 hover:border-[#4FA151]/30 transition"
        >
          <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
          Bedrijfsprofiel
        </Link>
        <Link
          to="/professional"
          className="inline-flex items-center gap-1.5 md:gap-2 px-3 py-2 md:px-4 md:py-2.5 bg-white border border-slate-200 text-[#0F172A] rounded-xl text-xs md:text-sm font-medium hover:bg-slate-50 hover:border-[#4FA151]/30 transition"
        >
          <User className="w-3.5 h-3.5 md:w-4 md:h-4" />
          Zoek artsen
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg shadow-slate-200/30 border border-slate-100">
          <h2 className="text-base md:text-xl font-bold text-[#0F172A] mb-3 md:mb-4 flex items-center justify-between">
            Snelle acties
            <Link to="/opdrachtgever/opdrachten" className="text-xs md:text-sm text-[#4FA151] hover:underline font-medium">Alle opdrachten</Link>
          </h2>
          <div className="space-y-1.5 md:space-y-2">
            <Link to="/opdrachtgever/opdrachten" className="flex items-center justify-between p-2.5 md:p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition text-sm md:text-base">
              <span className="font-medium text-gray-800">Nieuwe opdracht plaatsen</span>
              <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500" />
            </Link>
            <Link to="/opdrachtgever/profiel" className="flex items-center justify-between p-2.5 md:p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition text-sm md:text-base">
              <span className="font-medium text-gray-800">Bedrijfsprofiel bewerken</span>
              <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500" />
            </Link>
            <Link to="/professional" className="flex items-center justify-between p-2.5 md:p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition text-sm md:text-base">
              <span className="font-medium text-gray-800">Zoek artsen</span>
              <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500" />
            </Link>
          </div>
        </div>
        <div className="space-y-3 md:space-y-4">
          <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg shadow-slate-200/30 border border-slate-100">
            <h2 className="text-base md:text-xl font-bold text-[#0F172A] mb-3 md:mb-4">Overzicht</h2>
            <p className="text-xs md:text-sm text-gray-600">
              Beheer uw opdrachten, bekijk kandidaten en voer gesprekken met artsen vanuit dit dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
