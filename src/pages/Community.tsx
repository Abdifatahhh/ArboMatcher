import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Stethoscope,
  Building2,
  Shield,
  FileText,
  ArrowRight,
  Sparkles,
  Users,
  Briefcase,
  CheckCircle,
  Calendar,
} from 'lucide-react';
import { getCommunityTopics, getCommunityArticles } from '../services/communityContentService';
import { COMMUNITY_TOPICS } from '../data/communityTopics';
import { COMMUNITY_ARTICLES } from '../data/communityArticles';
import type { CommunityTopic } from '../data/communityTopics';
import type { CommunityArticle } from '../data/communityArticles';

type TabId = 'professionals' | 'organisaties';

const ICON_BY_SLUG: Record<string, typeof Stethoscope> = {
  'starten-als-arts': Stethoscope,
  'big-verificatie-kwaliteit': Shield,
  'solliciteren-opdrachten': Briefcase,
  'tarieven-administratie': FileText,
  'tips-voor-artsen': Sparkles,
  'opdrachten-plaatsen': Building2,
  'artsen-vinden-matchen': Users,
  'verificatie-kwaliteitsborging': Shield,
  'inzet-contractvormen': Calendar,
};

export default function Community() {
  const [activeTab, setActiveTab] = useState<TabId>('professionals');
  const [topics, setTopics] = useState<CommunityTopic[]>(COMMUNITY_TOPICS);
  const [articles, setArticles] = useState<CommunityArticle[]>(COMMUNITY_ARTICLES);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getCommunityTopics(), getCommunityArticles()]).then(([t, a]) => {
      if (!cancelled) {
        if (Array.isArray(t) && t.length > 0 && t[0]?.category) setTopics(t);
        if (Array.isArray(a) && a.length > 0) setArticles(a);
      }
    }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const expectedCat = activeTab === 'professionals' ? 'Voor professionals' : 'Voor organisaties';
  const categories = topics.filter((t) => t.category === expectedCat);
  const fallbackCategories = categories.length > 0 ? categories : COMMUNITY_TOPICS.filter((t) => t.category === expectedCat);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-slate-400" />
            <span className="text-slate-400 font-semibold text-sm uppercase tracking-wider">Kennis & support</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Community</h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Handige informatie, tips en uitleg voor professionals en organisaties. Alles over het platform, BIG-verificatie en succesvol matchen.
          </p>
        </div>
      </section>

      {/* Tabs + Content */}
      <section className="py-12 sm:py-16 border-b border-gray-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 mb-10">
            <button
              type="button"
              onClick={() => setActiveTab('professionals')}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition flex items-center gap-2 ${
                activeTab === 'professionals'
                  ? 'bg-[#0F172A] text-white shadow-lg shadow-slate-900/10'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              Voor professionals
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('organisaties')}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition flex items-center gap-2 ${
                activeTab === 'organisaties'
                  ? 'bg-[#0F172A] text-white shadow-lg shadow-slate-900/10'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Voor organisaties
            </button>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
            {fallbackCategories.map((cat) => {
              const Icon = ICON_BY_SLUG[cat.slug] ?? FileText;
              const topicPath = `/community/onderwerp/${cat.slug}`;
              return (
                <article
                  key={cat.slug}
                  className="group bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200"
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-slate-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link to={topicPath} className="block">
                          <h2 className="text-xl font-bold text-[#0F172A] mb-2 group-hover:text-[#0F172A] transition">
                            {cat.title}
                          </h2>
                        </Link>
                        <p className="text-slate-600 mb-4 leading-relaxed">{cat.description}</p>
                        <Link
                          to={topicPath}
                          className="inline-flex items-center gap-2 mt-2 text-[#0F172A] font-semibold text-sm hover:text-slate-700 transition"
                        >
                          Lees meer
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent articles / tips */}
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-2">Recente artikelen & tips</h2>
          <p className="text-gray-600 mb-8">Handige kennis en updates voor op het platform.</p>
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {articles.map((art) => (
                <Link
                  key={art.slug}
                  to={`/community/artikel/${art.slug}`}
                  className="block bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-md shadow-sm transition group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-[#0F172A] group-hover:text-[#0F172A] transition line-clamp-2">
                        {art.title}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{art.date}</p>
                      <span className="inline-block mt-2 text-xs font-medium text-[#0F172A] bg-slate-100 px-2 py-1 rounded-lg">
                        {art.category}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#0F172A] flex-shrink-0 mt-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-8 text-center">
            <span className="inline-flex items-center gap-2 text-gray-500 text-sm">
              Meer artikelen volgen binnenkort.
            </span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-slate-50 rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/30 p-8 sm:p-10 hover:shadow-slate-200/50 hover:border-slate-300 transition-all duration-300">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-slate-700" />
            <h2 className="text-2xl font-bold text-[#0F172A] mb-2">Nog vragen?</h2>
            <p className="text-slate-600 mb-6">
              Bekijk de veelgestelde vragen of neem contact met ons op. We helpen je graag verder.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-[#0F172A] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1E293B] transition"
              >
                Contact opnemen
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/opdrachten"
                className="inline-flex items-center gap-2 bg-[#0F172A] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1E293B] transition"
              >
                Opdrachten bekijken
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
