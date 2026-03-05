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
    isPremium: false
  });
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecentJobs();
  }, [user]);

  const fetchStats = async () => {
    if (!user) return;

    const { data: doctor } = await supabase
      .from('doctors')
      .select('id, verification_status, premium_status')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!doctor) {
      setLoading(false);
      return;
    }

    const [applicationsRes, invitesRes, conversationsRes] = await Promise.all([
      supabase.from('applications').select('id', { count: 'exact' }).eq('doctor_id', doctor.id),
      supabase.from('invites').select('id', { count: 'exact' }).eq('doctor_id', doctor.id).eq('status', 'PENDING'),
      supabase.from('conversations').select('id', { count: 'exact' }).contains('participant_ids', [user.id])
    ]);

    setStats({
      applications: applicationsRes.count || 0,
      invites: invitesRes.count || 0,
      messages: conversationsRes.count || 0,
      verificationStatus: doctor.verification_status,
      profileViews: Math.floor(Math.random() * 50),
      isPremium: doctor.premium_status || false
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
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0F172A]"></div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-[#0F172A]">
          Welkom terug{profile?.full_name ? `, ${profile.full_name}` : ''}
        </h1>
        <p className="text-gray-600 mt-1">Hier is een overzicht van uw account</p>
      </div>

      {stats.verificationStatus !== 'VERIFIED' && (
        <div className={`mb-6 p-4 rounded-lg flex items-start ${
          stats.verificationStatus === 'REJECTED' ? 'bg-red-50 border border-red-200' : 'bg-amber-50 border border-amber-200'
        }`}>
          <AlertCircle className={`w-5 h-5 mr-3 mt-0.5 flex-shrink-0 ${
            stats.verificationStatus === 'REJECTED' ? 'text-red-600' : 'text-amber-600'
          }`} />
          <div className="flex-1">
            <h3 className={`font-semibold mb-1 ${
              stats.verificationStatus === 'REJECTED' ? 'text-red-900' : 'text-amber-900'
            }`}>
              {stats.verificationStatus === 'UNVERIFIED' && 'Profiel nog niet geverifieerd'}
              {stats.verificationStatus === 'PENDING' && 'Verificatie in behandeling'}
              {stats.verificationStatus === 'REJECTED' && 'Verificatie afgewezen'}
            </h3>
            <p className={`text-sm ${
              stats.verificationStatus === 'REJECTED' ? 'text-red-800' : 'text-amber-800'
            }`}>
              {stats.verificationStatus === 'UNVERIFIED' &&
                'Vul uw profiel volledig in inclusief BIG-nummer om geverifieerd te worden.'}
              {stats.verificationStatus === 'PENDING' &&
                'Uw BIG-nummer wordt gecontroleerd. Dit kan enkele werkdagen duren.'}
              {stats.verificationStatus === 'REJECTED' &&
                'Uw verificatie is afgewezen. Controleer uw gegevens en neem contact op met support.'}
            </p>
            {stats.verificationStatus === 'UNVERIFIED' && (
              <Link
                to="/arts/profiel"
                className="inline-flex items-center text-amber-900 font-semibold text-sm mt-2 hover:underline"
              >
                Profiel voltooien <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            )}
          </div>
        </div>
      )}

      {stats.verificationStatus === 'VERIFIED' && (
        <div className="mb-6 bg-green-50 border border-green-200 p-4 rounded-lg flex items-center">
          <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-green-900 font-medium">Uw profiel is geverifieerd</p>
            <p className="text-green-800 text-sm">U kunt nu reageren op opdrachten en uitnodigingen ontvangen.</p>
          </div>
          {!stats.isPremium && (
            <Link
              to="/arts/abonnement"
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition"
            >
              Upgrade naar PRO
            </Link>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link
          to="/arts/reacties"
          className="bg-white p-5 rounded-lg border border-gray-200 hover:border-[#0F172A] hover:shadow-md transition"
        >
          <div className="flex items-center justify-between mb-3">
            <Send className="w-6 h-6 text-[#0F172A]" />
            <span className="text-2xl font-bold text-[#0F172A]">{stats.applications}</span>
          </div>
          <h3 className="font-semibold text-gray-800 text-sm">Verstuurde reacties</h3>
        </Link>

        <Link
          to="/arts/uitnodigingen"
          className="bg-white p-5 rounded-lg border border-gray-200 hover:border-[#16A34A] hover:shadow-md transition"
        >
          <div className="flex items-center justify-between mb-3">
            <Mail className="w-6 h-6 text-[#16A34A]" />
            <span className="text-2xl font-bold text-[#16A34A]">{stats.invites}</span>
          </div>
          <h3 className="font-semibold text-gray-800 text-sm">Uitnodigingen</h3>
        </Link>

        <Link
          to="/arts/inbox"
          className="bg-white p-5 rounded-lg border border-gray-200 hover:border-[#0F172A] hover:shadow-md transition"
        >
          <div className="flex items-center justify-between mb-3">
            <MessageSquare className="w-6 h-6 text-[#0F172A]" />
            <span className="text-2xl font-bold text-[#0F172A]">{stats.messages}</span>
          </div>
          <h3 className="font-semibold text-gray-800 text-sm">Berichten</h3>
        </Link>

        <div className="bg-white p-5 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <Eye className="w-6 h-6 text-gray-500" />
            <span className="text-2xl font-bold text-gray-700">{stats.profileViews}</span>
          </div>
          <h3 className="font-semibold text-gray-800 text-sm">Profielweergaven</h3>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-bold text-[#0F172A]">Nieuwe opdrachten</h2>
            <Link to="/arts/opdrachten" className="text-sm text-[#16A34A] hover:underline font-medium">
              Bekijk alle
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentJobs.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Briefcase className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                <p>Geen nieuwe opdrachten</p>
              </div>
            ) : (
              recentJobs.map((job) => (
                <Link
                  key={job.id}
                  to={`/opdrachten/${job.id}`}
                  className="p-4 flex items-start hover:bg-gray-50 transition"
                >
                  <div className="w-10 h-10 bg-[#16A34A] rounded-lg flex items-center justify-center text-white font-bold text-xs mr-3 flex-shrink-0">
                    PRO
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#0F172A] truncate">{job.title}</h3>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      {job.region && <span className="mr-3">{job.region}</span>}
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(job.created_at).toLocaleDateString('nl-NL')}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="font-bold text-[#0F172A] mb-4">Snelle acties</h2>
            <div className="space-y-2">
              <Link
                to="/arts/opdrachten"
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <span className="font-medium text-gray-800">Zoek opdrachten</span>
                <ArrowRight className="w-4 h-4 text-gray-500" />
              </Link>
              <Link
                to="/arts/profiel"
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <span className="font-medium text-gray-800">Bewerk profiel</span>
                <ArrowRight className="w-4 h-4 text-gray-500" />
              </Link>
              <Link
                to="/arts/abonnement"
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <span className="font-medium text-gray-800">Bekijk abonnement</span>
                <ArrowRight className="w-4 h-4 text-gray-500" />
              </Link>
            </div>
          </div>

          {!stats.isPremium && (
            <div className="bg-gradient-to-br from-[#0F172A] to-[#1e293b] rounded-lg p-5 text-white">
              <Star className="w-8 h-8 text-[#FCD34D] mb-3" />
              <h3 className="font-bold text-lg mb-2">Upgrade naar PRO</h3>
              <p className="text-gray-300 text-sm mb-4">
                Word sneller gevonden door opdrachtgevers met premium zichtbaarheid.
              </p>
              <Link
                to="/arts/abonnement"
                className="block text-center bg-[#16A34A] text-white py-2 rounded-lg font-semibold hover:bg-[#15803d] transition"
              >
                Bekijk voordelen
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
