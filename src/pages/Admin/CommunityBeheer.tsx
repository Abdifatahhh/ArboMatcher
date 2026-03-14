import { useState, useEffect } from 'react';
import { getCommunityTopics, getCommunityArticles, saveCommunityTopics, saveCommunityArticles, resetTopicsToDefault, resetArticlesToDefault } from '../../services/communityContentService';
import type { CommunityTopic } from '../../data/communityTopics';
import type { CommunityArticle } from '../../data/communityArticles';
import { BookOpen, FileText, Plus, Pencil, Trash2, X, Save, RotateCcw } from 'lucide-react';
import { AdminPage, AdminPageHeader, AdminCard, AdminAlert, AdminLoadingState } from '../../components/Admin/adminUI';

type TabId = 'topics' | 'articles';

function slugify(s: string): string {
  return s.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').replace(/^-|-$/g, '');
}

const DEFAULT_TOPIC: CommunityTopic = { slug: '', title: '', category: 'Voor professionals', description: '', imageUrl: '', imageAlt: '', content: '' };
const DEFAULT_ARTICLE: CommunityArticle = { slug: '', title: '', date: new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' }), category: 'Voor professionals', imageUrl: '', imageAlt: '', content: '' };
const fi = 'w-full h-10 px-3 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition';
const fl = 'block text-sm font-medium text-slate-700 mb-1.5';
const ft = 'w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition resize-y font-mono';

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

  const load = async () => { setLoading(true); try { const [t, a] = await Promise.all([getCommunityTopics(), getCommunityArticles()]); setTopics(t); setArticles(a); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const handleSaveTopics = async () => { setSaveError(null); const ok = await saveCommunityTopics(topics); if (ok) { flash(); setEditingTopic(null); setEditingTopicSlug(null); } else setSaveError('Opslaan mislukt.'); };
  const handleSaveArticles = async () => { setSaveError(null); const ok = await saveCommunityArticles(articles); if (ok) { flash(); setEditingArticle(null); setEditingArticleSlug(null); } else setSaveError('Opslaan mislukt.'); };

  const addTopic = () => { setEditingTopic({ ...DEFAULT_TOPIC }); setEditingTopicSlug(null); };
  const editTopic = (t: CommunityTopic) => { setEditingTopic({ ...t }); setEditingTopicSlug(t.slug); };
  const deleteTopic = async (slug: string) => { if (!window.confirm('Dit onderwerp verwijderen?')) return; setSaveError(null); const n = topics.filter((x) => x.slug !== slug); setTopics(n); const ok = await saveCommunityTopics(n); if (ok) flash(); else setSaveError('Verwijderen mislukt.'); };
  const saveTopicForm = async () => { if (!editingTopic) return; setSaveError(null); const slug = editingTopic.slug.trim() || slugify(editingTopic.title); const next = { ...editingTopic, slug }; const n = editingTopicSlug === null ? [...topics, next] : topics.map((t) => (t.slug === editingTopicSlug ? next : t)); setTopics(n); const ok = await saveCommunityTopics(n); setEditingTopic(null); setEditingTopicSlug(null); if (ok) flash(); else setSaveError('Opslaan mislukt.'); };

  const addArticle = () => { setEditingArticle({ ...DEFAULT_ARTICLE }); setEditingArticleSlug(null); };
  const editArticle = (a: CommunityArticle) => { setEditingArticle({ ...a }); setEditingArticleSlug(a.slug); };
  const deleteArticle = async (slug: string) => { if (!window.confirm('Dit artikel verwijderen?')) return; setSaveError(null); const n = articles.filter((x) => x.slug !== slug); setArticles(n); const ok = await saveCommunityArticles(n); if (ok) flash(); else setSaveError('Verwijderen mislukt.'); };
  const saveArticleForm = async () => { if (!editingArticle) return; setSaveError(null); const slug = editingArticle.slug.trim() || slugify(editingArticle.title); const next = { ...editingArticle, slug }; const n = editingArticleSlug === null ? [...articles, next] : articles.map((a) => (a.slug === editingArticleSlug ? next : a)); setArticles(n); const ok = await saveCommunityArticles(n); setEditingArticle(null); setEditingArticleSlug(null); if (ok) flash(); else setSaveError('Opslaan mislukt.'); };

  const resetTopics = async () => { if (!window.confirm('Onderwerpen terugzetten naar standaard?')) return; setSaveError(null); if (await resetTopicsToDefault()) { await load(); setEditingTopic(null); } else setSaveError('Reset mislukt.'); };
  const resetArticles = async () => { if (!window.confirm('Artikelen terugzetten naar standaard?')) return; setSaveError(null); if (await resetArticlesToDefault()) { await load(); setEditingArticle(null); } else setSaveError('Reset mislukt.'); };

  return (
    <AdminPage className="max-w-5xl">
      <AdminPageHeader icon={BookOpen} title="Community & Artikelen" description="Beheer onderwerpen en artikelen voor de community" />

      {saveError && <AdminAlert variant="error" onClose={() => setSaveError(null)}>{saveError}</AdminAlert>}
      {saved && <AdminAlert variant="success">Opgeslagen.</AdminAlert>}

      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-fit">
        {[{ id: 'topics' as const, label: 'Onderwerpen', icon: BookOpen }, { id: 'articles' as const, label: 'Artikelen', icon: FileText }].map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition ${tab === t.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {loading ? <AdminLoadingState rows={4} /> : tab === 'topics' ? (
        <AdminCard noPadding title="Onderwerpen" actions={
          <div className="flex items-center gap-2">
            <button type="button" onClick={resetTopics} className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"><RotateCcw className="w-3 h-3" /> Reset</button>
            <button type="button" onClick={addTopic} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gradient-to-r from-emerald-500 to-green-400 text-white text-xs font-medium hover:from-emerald-600 hover:to-green-500 transition"><Plus className="w-3.5 h-3.5" /> Nieuw</button>
          </div>
        }>
          <ul className="divide-y divide-slate-50">
            {topics.map((t) => (
              <li key={t.slug} className="px-5 py-3 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900">{t.title}</p>
                  <p className="text-xs text-slate-400">{t.category} · /{t.slug}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button type="button" onClick={() => editTopic(t)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition" title="Bewerken"><Pencil className="w-4 h-4" /></button>
                  <button type="button" onClick={() => deleteTopic(t.slug)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Verwijderen"><Trash2 className="w-4 h-4" /></button>
                </div>
              </li>
            ))}
          </ul>
          <div className="px-5 py-3 border-t border-slate-100 flex justify-end">
            <button type="button" onClick={handleSaveTopics} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-green-400 text-white text-sm font-medium hover:from-emerald-600 hover:to-green-500 transition shadow-lg shadow-emerald-500/20"><Save className="w-4 h-4" /> Opslaan</button>
          </div>
        </AdminCard>
      ) : (
        <AdminCard noPadding title="Artikelen" actions={
          <div className="flex items-center gap-2">
            <button type="button" onClick={resetArticles} className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"><RotateCcw className="w-3 h-3" /> Reset</button>
            <button type="button" onClick={addArticle} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gradient-to-r from-emerald-500 to-green-400 text-white text-xs font-medium hover:from-emerald-600 hover:to-green-500 transition"><Plus className="w-3.5 h-3.5" /> Nieuw</button>
          </div>
        }>
          <ul className="divide-y divide-slate-50">
            {articles.map((a) => (
              <li key={a.slug} className="px-5 py-3 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900">{a.title}</p>
                  <p className="text-xs text-slate-400">{a.date} · {a.category} · /{a.slug}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button type="button" onClick={() => editArticle(a)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition" title="Bewerken"><Pencil className="w-4 h-4" /></button>
                  <button type="button" onClick={() => deleteArticle(a.slug)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Verwijderen"><Trash2 className="w-4 h-4" /></button>
                </div>
              </li>
            ))}
          </ul>
          <div className="px-5 py-3 border-t border-slate-100 flex justify-end">
            <button type="button" onClick={handleSaveArticles} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-green-400 text-white text-sm font-medium hover:from-emerald-600 hover:to-green-500 transition shadow-lg shadow-emerald-500/20"><Save className="w-4 h-4" /> Opslaan</button>
          </div>
        </AdminCard>
      )}

      {editingTopic && <TopicForm topic={editingTopic} onChange={setEditingTopic} onSave={saveTopicForm} onClose={() => { setEditingTopic(null); setEditingTopicSlug(null); }} />}
      {editingArticle && <ArticleForm article={editingArticle} onChange={setEditingArticle} onSave={saveArticleForm} onClose={() => { setEditingArticle(null); setEditingArticleSlug(null); }} />}
    </AdminPage>
  );
}

function TopicForm({ topic, onChange, onSave, onClose }: { topic: CommunityTopic; onChange: (t: CommunityTopic) => void; onSave: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900">Onderwerp bewerken</h3>
          <button type="button" onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 overflow-y-auto space-y-4">
          <div><label className={fl}>Slug (URL)</label><input type="text" value={topic.slug} onChange={(e) => onChange({ ...topic, slug: e.target.value })} className={fi} placeholder="starten-als-arts" /></div>
          <div><label className={fl}>Titel</label><input type="text" value={topic.title} onChange={(e) => onChange({ ...topic, title: e.target.value })} className={fi} /></div>
          <div><label className={fl}>Categorie</label><select value={topic.category} onChange={(e) => onChange({ ...topic, category: e.target.value })} className={fi}><option value="Voor professionals">Voor professionals</option><option value="Voor organisaties">Voor organisaties</option></select></div>
          <div><label className={fl}>Korte beschrijving</label><input type="text" value={topic.description} onChange={(e) => onChange({ ...topic, description: e.target.value })} className={fi} /></div>
          <div><label className={fl}>Afbeelding URL</label><input type="text" value={topic.imageUrl ?? ''} onChange={(e) => onChange({ ...topic, imageUrl: e.target.value || undefined })} className={fi} placeholder="/images/community/..." /></div>
          <div><label className={fl}>Inhoud (Markdown)</label><textarea value={topic.content} onChange={(e) => onChange({ ...topic, content: e.target.value })} rows={12} className={ft} /></div>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50">Annuleren</button>
          <button type="button" onClick={onSave} className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-400 text-white rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-green-500 shadow-lg shadow-emerald-500/20">Opslaan</button>
        </div>
      </div>
    </div>
  );
}

function ArticleForm({ article, onChange, onSave, onClose }: { article: CommunityArticle; onChange: (a: CommunityArticle) => void; onSave: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900">Artikel bewerken</h3>
          <button type="button" onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 overflow-y-auto space-y-4">
          <div><label className={fl}>Slug (URL)</label><input type="text" value={article.slug} onChange={(e) => onChange({ ...article, slug: e.target.value })} className={fi} placeholder="big-verificatie-belangrijk" /></div>
          <div><label className={fl}>Titel</label><input type="text" value={article.title} onChange={(e) => onChange({ ...article, title: e.target.value })} className={fi} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={fl}>Datum</label><input type="text" value={article.date} onChange={(e) => onChange({ ...article, date: e.target.value })} className={fi} placeholder="12 feb 2026" /></div>
            <div><label className={fl}>Categorie</label><select value={article.category} onChange={(e) => onChange({ ...article, category: e.target.value })} className={fi}><option value="Voor professionals">Voor professionals</option><option value="Voor organisaties">Voor organisaties</option><option value="Algemeen">Algemeen</option></select></div>
          </div>
          <div><label className={fl}>Afbeelding URL</label><input type="text" value={article.imageUrl ?? ''} onChange={(e) => onChange({ ...article, imageUrl: e.target.value || undefined })} className={fi} /></div>
          <div><label className={fl}>Inhoud (Markdown)</label><textarea value={article.content ?? ''} onChange={(e) => onChange({ ...article, content: e.target.value })} rows={12} className={ft} /></div>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50">Annuleren</button>
          <button type="button" onClick={onSave} className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-400 text-white rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-green-500 shadow-lg shadow-emerald-500/20">Opslaan</button>
        </div>
      </div>
    </div>
  );
}
