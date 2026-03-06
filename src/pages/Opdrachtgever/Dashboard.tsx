import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Users, MessageSquare, Plus } from 'lucide-react';

export default function OpdrachtgeverDashboard() {
  const { user } = useAuth();
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F172A]"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#0F172A]">Dashboard</h1>
        <Link
          to="/opdrachtgever/opdrachten"
          className="flex items-center bg-[#4FA151] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#3E8E45] transition"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nieuwe opdracht
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/opdrachtgever/opdrachten"
          className="bg-white p-6 rounded-lg shadow-lg border-2 border-transparent hover:border-[#0F172A] transition"
        >
          <div className="flex items-center justify-between mb-4">
            <Briefcase className="w-8 h-8 text-[#0F172A]" />
            <span className="text-3xl font-bold text-[#0F172A]">{stats.activeJobs}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-700">Actieve opdrachten</h3>
          <p className="text-sm text-gray-600">Uw openstaande vacatures</p>
        </Link>

        <Link
          to="/opdrachtgever/kandidaten"
          className="bg-white p-6 rounded-lg shadow-lg border-2 border-transparent hover:border-[#0F172A] transition"
        >
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-[#4FA151]" />
            <span className="text-3xl font-bold text-[#4FA151]">{stats.applications}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-700">Kandidaten</h3>
          <p className="text-sm text-gray-600">Totaal aantal reacties</p>
        </Link>

        <Link
          to="/opdrachtgever/inbox"
          className="bg-white p-6 rounded-lg shadow-lg border-2 border-transparent hover:border-[#0F172A] transition"
        >
          <div className="flex items-center justify-between mb-4">
            <MessageSquare className="w-8 h-8 text-[#0F172A]" />
            <span className="text-3xl font-bold text-[#0F172A]">{stats.messages}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-700">Berichten</h3>
          <p className="text-sm text-gray-600">Conversaties met artsen</p>
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-[#0F172A] mb-4">Snelle acties</h2>
        <div className="space-y-3">
          <Link
            to="/artsen"
            className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            <h3 className="font-semibold text-[#0F172A]">Zoek artsen</h3>
            <p className="text-sm text-gray-600">Bekijk geverifieerde bedrijfsartsen</p>
          </Link>
          <Link
            to="/opdrachtgever/profiel"
            className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            <h3 className="font-semibold text-[#0F172A]">Bedrijfsprofiel</h3>
            <p className="text-sm text-gray-600">Beheer uw bedrijfsgegevens</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
