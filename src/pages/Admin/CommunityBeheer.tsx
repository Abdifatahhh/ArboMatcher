import { useState, useEffect } from 'react';
import {
  getCommunityTopics,
  getCommunityArticles,
  saveCommunityTopics,
  saveCommunityArticles,
  resetTopicsToDefault,
  resetArticlesToDefault,
} from '../../services/communityContentService';
import type { CommunityTopic } from '../../data/communityTopics';
import type { CommunityArticle } from '../../data/communityArticles';
import { BookOpen, FileText, Plus, Pencil, Trash2, X, Save } from 'lucide-react';

type TabId = 'topics' | 'articles';

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-|-$/g, '');
}

const DEFAULT_TOPIC: CommunityTopic = {
  slug: '',
  title: '',
  category: 'Voor professionals',
  description: '',
  imageUrl: '',
  imageAlt: '',
  content: '',
};

const DEFAULT_ARTICLE: CommunityArticle = {
  slug: '',
  title: '',
  date: new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' }),
  category: 'Voor professionals',
  imageUrl: '',
  imageAlt: '',
  content: '',
};

export default function AdminCommunityBeheer() {
  const [tab, setTab] = useState<TabId>('topics');
  const [topics, setTopics] = useState<CommunityTopic[]>([]);
  const [articles, setArticles] = useState<CommunityArticle[]>([]);
  const [editingTopic, setEditingTopic] = useState<CommunityTopic | null>(null);
  const [editingArticle, setEditingArticle] = useState<CommunityArticle | null>(null);
  const [editingTopicSlug, setEditingTopicSlug] = useState<string | null>(null);
  const [editingArticleSlug, setEditingArticleSlug] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveError, setSaveError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [t, a] = await Promise.all([getCommunityTopics(), getCommunityArticles()]);
      setTopics(t);
      setArticles(a);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSaveTopics = async () => {
    setSaveError(null);
    const ok = await saveCommunityTopics(topics);
    if (ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      setEditingTopic(null);
      setEditingTopicSlug(null);
    } else setSaveError('Opslaan mislukt.');
  };

  const handleSaveArticles = async () => {
    setSaveError(null);
    const ok = await saveCommunityArticles(articles);
    if (ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      setEditingArticle(null);
      setEditingArticleSlug(null);
    } else setSaveError('Opslaan mislukt.');
  };

  const addTopic = () => {
    setEditingTopic({ ...DEFAULT_TOPIC });
    setEditingTopicSlug(null);
  };

  const editTopic = (t: CommunityTopic) => {
    setEditingTopic({ ...t });
    setEditingTopicSlug(t.slug);
  };

  const deleteTopic = async (slug: string) => {
    if (!window.confirm('Dit onderwerp verwijderen?')) return;
    setSaveError(null);
    const newList = topics.filter((x) => x.slug !== slug);
    setTopics(newList);
    const ok = await saveCommunityTopics(newList);
    if (ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else setSaveError('Verwijderen mislukt.');
  };

  const saveTopicForm = async () => {
    if (!editingTopic) return;
    setSaveError(null);
    const slug = editingTopic.slug.trim() || slugify(editingTopic.title);
    const next = { ...editingTopic, slug };
    const newList =
      editingTopicSlug === null
        ? [...topics, next]
        : topics.map((t) => (t.slug === editingTopicSlug ? next : t));
    setTopics(newList);
    const ok = await saveCommunityTopics(newList);
    setEditingTopic(null);
    setEditingTopicSlug(null);
    if (ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else setSaveError('Opslaan mislukt.');
  };

  const addArticle = () => {
    setEditingArticle({ ...DEFAULT_ARTICLE });
    setEditingArticleSlug(null);
  };

  const editArticle = (a: CommunityArticle) => {
    setEditingArticle({ ...a });
    setEditingArticleSlug(a.slug);
  };

  const deleteArticle = async (slug: string) => {
    if (!window.confirm('Dit artikel verwijderen?')) return;
    setSaveError(null);
    const newList = articles.filter((x) => x.slug !== slug);
    setArticles(newList);
    const ok = await saveCommunityArticles(newList);
    if (ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else setSaveError('Verwijderen mislukt.');
  };

  const saveArticleForm = async () => {
    if (!editingArticle) return;
    setSaveError(null);
    const slug = editingArticle.slug.trim() || slugify(editingArticle.title);
    const next = { ...editingArticle, slug };
    const newList =
      editingArticleSlug === null
        ? [...articles, next]
        : articles.map((a) => (a.slug === editingArticleSlug ? next : a));
    setArticles(newList);
    const ok = await saveCommunityArticles(newList);
    setEditingArticle(null);
    setEditingArticleSlug(null);
    if (ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else setSaveError('Opslaan mislukt.');
  };

  const resetTopics = async () => {
    if (!window.confirm('Onderwerpen terugzetten naar standaard? Bewerkte data gaat verloren.')) return;
    setSaveError(null);
    const ok = await resetTopicsToDefault();
    if (ok) {
      await load();
      setEditingTopic(null);
    } else setSaveError('Reset mislukt.');
  };

  const resetArticles = async () => {
    if (!window.confirm('Artikelen terugzetten naar standaard? Bewerkte data gaat verloren.')) return;
    setSaveError(null);
    const ok = await resetArticlesToDefault();
    if (ok) {
      await load();
      setEditingArticle(null);
    } else setSaveError('Reset mislukt.');
  };

  return (
    <div className="p-6 max-w-5xl">
      <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Community & Artikelen</h1>
      <p className="text-gray-600 text-sm mb-6">Beheer onderwerpen en artikelen. Nieuw of bewerkt wordt direct in de database opgeslagen.</p>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          type="button"
          onClick={() => setTab('topics')}
          className={`px-4 py-2 rounded-xl font-medium text-sm flex items-center gap-2 ${tab === 'topics' ? 'bg-[#4FA151] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          <BookOpen className="w-4 h-4" />
          Onderwerpen
        </button>
        <button
          type="button"
          onClick={() => setTab('articles')}
          className={`px-4 py-2 rounded-xl font-medium text-sm flex items-center gap-2 ${tab === 'articles' ? 'bg-[#4FA151] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          <FileText className="w-4 h-4" />
          Artikelen
        </button>
      </div>

      {loading && (
        <div className="mb-4 flex items-center gap-2 text-gray-600">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#4FA151] border-t-transparent" />
          Laden...
        </div>
      )}
      {saveError && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
          {saveError}
        </div>
      )}
      {saved && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">
          Opgeslagen.
        </div>
      )}

      {tab === 'topics' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#3E8E45] bg-[#4FA151] flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Onderwerpen</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={resetTopics}
                className="text-white/90 hover:text-white text-sm"
              >
                Reset naar standaard
              </button>
              <button
                type="button"
                onClick={addTopic}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 text-white text-sm font-medium hover:bg-white/30"
              >
                <Plus className="w-4 h-4" />
                Nieuw
              </button>
            </div>
          </div>
          <ul className="divide-y divide-gray-100">
            {topics.map((t) => (
              <li key={t.slug} className="px-6 py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-[#0F172A]">{t.title}</p>
                  <p className="text-sm text-gray-500">{t.category} · /{t.slug}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => editTopic(t)}
                    className="p-2 text-gray-500 hover:text-[#4FA151] hover:bg-emerald-50 rounded-lg"
                    title="Bewerken"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteTopic(t.slug)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    title="Verwijderen"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
            <button
              type="button"
              onClick={handleSaveTopics}
              className="inline-flex items-center gap-2 bg-[#4FA151] text-white px-4 py-2 rounded-xl font-medium hover:bg-[#3E8E45]"
            >
              <Save className="w-4 h-4" />
              Onderwerpen opslaan
            </button>
          </div>
        </div>
      )}

      {tab === 'articles' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#3E8E45] bg-[#4FA151] flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Artikelen</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={resetArticles}
                className="text-white/90 hover:text-white text-sm"
              >
                Reset naar standaard
              </button>
              <button
                type="button"
                onClick={addArticle}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 text-white text-sm font-medium hover:bg-white/30"
              >
                <Plus className="w-4 h-4" />
                Nieuw
              </button>
            </div>
          </div>
          <ul className="divide-y divide-gray-100">
            {articles.map((a) => (
              <li key={a.slug} className="px-6 py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-[#0F172A]">{a.title}</p>
                  <p className="text-sm text-gray-500">{a.date} · {a.category} · /{a.slug}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => editArticle(a)}
                    className="p-2 text-gray-500 hover:text-[#4FA151] hover:bg-emerald-50 rounded-lg"
                    title="Bewerken"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteArticle(a.slug)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    title="Verwijderen"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
            <button
              type="button"
              onClick={handleSaveArticles}
              className="inline-flex items-center gap-2 bg-[#4FA151] text-white px-4 py-2 rounded-xl font-medium hover:bg-[#3E8E45]"
            >
              <Save className="w-4 h-4" />
              Artikelen opslaan
            </button>
          </div>
        </div>
      )}

      {editingTopic && (
        <TopicForm
          topic={editingTopic}
          onChange={setEditingTopic}
          onSave={saveTopicForm}
          onClose={() => { setEditingTopic(null); setEditingTopicSlug(null); }}
        />
      )}
      {editingArticle && (
        <ArticleForm
          article={editingArticle}
          onChange={setEditingArticle}
          onSave={saveArticleForm}
          onClose={() => { setEditingArticle(null); setEditingArticleSlug(null); }}
        />
      )}
    </div>
  );
}

function TopicForm({
  topic,
  onChange,
  onSave,
  onClose,
}: {
  topic: CommunityTopic;
  onChange: (t: CommunityTopic) => void;
  onSave: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Onderwerp bewerken</h3>
          <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 overflow-y-auto space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
            <input
              type="text"
              value={topic.slug}
              onChange={(e) => onChange({ ...topic, slug: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl"
              placeholder="bijv. starten-als-arts"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titel</label>
            <input
              type="text"
              value={topic.title}
              onChange={(e) => onChange({ ...topic, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categorie</label>
            <select
              value={topic.category}
              onChange={(e) => onChange({ ...topic, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl"
            >
              <option value="Voor professionals">Voor professionals</option>
              <option value="Voor organisaties">Voor organisaties</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Korte beschrijving</label>
            <input
              type="text"
              value={topic.description}
              onChange={(e) => onChange({ ...topic, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Afbeelding URL (optioneel)</label>
            <input
              type="text"
              value={topic.imageUrl ?? ''}
              onChange={(e) => onChange({ ...topic, imageUrl: e.target.value || undefined })}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl"
              placeholder="/images/community/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Inhoud (Markdown)</label>
            <textarea
              value={topic.content}
              onChange={(e) => onChange({ ...topic, content: e.target.value })}
              rows={12}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl font-mono text-sm"
            />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-xl">Annuleren</button>
          <button type="button" onClick={onSave} className="px-4 py-2 bg-[#4FA151] text-white rounded-xl hover:bg-[#3E8E45]">Opslaan</button>
        </div>
      </div>
    </div>
  );
}

function ArticleForm({
  article,
  onChange,
  onSave,
  onClose,
}: {
  article: CommunityArticle;
  onChange: (a: CommunityArticle) => void;
  onSave: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Artikel bewerken</h3>
          <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 overflow-y-auto space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
            <input
              type="text"
              value={article.slug}
              onChange={(e) => onChange({ ...article, slug: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl"
              placeholder="bijv. big-verificatie-belangrijk"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titel</label>
            <input
              type="text"
              value={article.title}
              onChange={(e) => onChange({ ...article, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Datum</label>
              <input
                type="text"
                value={article.date}
                onChange={(e) => onChange({ ...article, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                placeholder="12 feb 2026"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categorie</label>
              <select
                value={article.category}
                onChange={(e) => onChange({ ...article, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl"
              >
                <option value="Voor professionals">Voor professionals</option>
                <option value="Voor organisaties">Voor organisaties</option>
                <option value="Algemeen">Algemeen</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Afbeelding URL (optioneel)</label>
            <input
              type="text"
              value={article.imageUrl ?? ''}
              onChange={(e) => onChange({ ...article, imageUrl: e.target.value || undefined })}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Inhoud (Markdown)</label>
            <textarea
              value={article.content ?? ''}
              onChange={(e) => onChange({ ...article, content: e.target.value })}
              rows={12}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl font-mono text-sm"
            />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-xl">Annuleren</button>
          <button type="button" onClick={onSave} className="px-4 py-2 bg-[#4FA151] text-white rounded-xl hover:bg-[#3E8E45]">Opslaan</button>
        </div>
      </div>
    </div>
  );
}
