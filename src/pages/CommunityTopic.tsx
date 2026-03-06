import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTopicBySlug } from '../services/communityContentService';
import { renderContent } from '../lib/communityContent';
import { ArrowLeft } from 'lucide-react';
import type { CommunityTopic } from '../data/communityTopics';

export default function CommunityTopic() {
  const { slug } = useParams<{ slug: string }>();
  const [topic, setTopic] = useState<CommunityTopic | null | undefined>(undefined);

  useEffect(() => {
    if (!slug) {
      setTopic(null);
      return;
    }
    let cancelled = false;
    getTopicBySlug(slug).then((t) => {
      if (!cancelled) setTopic(t ?? null);
    });
    return () => { cancelled = true; };
  }, [slug]);

  if (topic === undefined) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#4FA151] border-t-transparent" />
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <p className="text-gray-600 mb-4">Onderwerp niet gevonden.</p>
        <Link to="/community" className="text-[#4FA151] font-semibold hover:underline inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Terug naar Community
        </Link>
      </div>
    );
  }

  const hasContent = topic.content && topic.content.trim().length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8F5E9] via-[#F4FAF4] to-white">
      <section className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="mb-8">
            <Link
              to="/community"
              className="inline-flex items-center gap-2 text-gray-300 hover:text-white text-sm font-medium transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Terug naar Community
            </Link>
          </div>
          <span className="block text-[#4FA151] font-medium text-sm mb-2">{topic.category}</span>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{topic.title}</h1>
          <p className="text-gray-400">{topic.description}</p>
        </div>
      </section>

      {topic.imageUrl && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
          <figure className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-white">
            <img
              src={topic.imageUrl}
              alt={topic.imageAlt || topic.title}
              className="w-full h-auto object-cover max-h-[420px]"
            />
          </figure>
        </div>
      )}

      <article className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          {hasContent ? (
            <div className="prose prose-gray max-w-none">{renderContent(topic.content)}</div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex items-start gap-4">
              <p className="text-amber-900 font-medium">Deze pagina wordt binnenkort aangevuld.</p>
            </div>
          )}
          <div className="mt-10 pt-8 border-t border-gray-100">
            <Link
              to="/community"
              className="inline-flex items-center gap-2 text-[#4FA151] font-semibold hover:text-[#3E8E45] transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Terug naar Community
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
