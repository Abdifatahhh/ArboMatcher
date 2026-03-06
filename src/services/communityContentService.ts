import { supabase } from '../lib/supabase';
import type { CommunityTopic } from '../data/communityTopics';
import type { CommunityArticle } from '../data/communityArticles';
import { COMMUNITY_TOPICS, getTopicBySlug as getStaticTopic } from '../data/communityTopics';
import { COMMUNITY_ARTICLES, getArticleBySlug as getStaticArticle } from '../data/communityArticles';

const KEY_TOPICS = 'community_topics';
const KEY_ARTICLES = 'community_articles';

async function fetchContent<T>(key: string): Promise<T | null> {
  const { data, error } = await supabase
    .from('content_store')
    .select('value')
    .eq('key', key)
    .maybeSingle();
  if (error || !data) return null;
  const value = data.value as T;
  return value ?? null;
}

async function putContent(key: string, value: unknown): Promise<boolean> {
  const { error } = await supabase
    .from('content_store')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  return !error;
}

export async function getCommunityTopics(): Promise<CommunityTopic[]> {
  const stored = await fetchContent<CommunityTopic[]>(KEY_TOPICS);
  if (stored && Array.isArray(stored) && stored.length > 0) return stored;
  return COMMUNITY_TOPICS;
}

export async function getCommunityArticles(): Promise<CommunityArticle[]> {
  const stored = await fetchContent<CommunityArticle[]>(KEY_ARTICLES);
  if (stored && Array.isArray(stored) && stored.length > 0) return stored;
  return COMMUNITY_ARTICLES;
}

export async function getTopicBySlug(slug: string): Promise<CommunityTopic | undefined> {
  const topics = await getCommunityTopics();
  const found = topics.find((t) => t.slug === slug);
  if (found) return found;
  return getStaticTopic(slug);
}

export async function getArticleBySlug(slug: string): Promise<CommunityArticle | undefined> {
  const articles = await getCommunityArticles();
  const found = articles.find((a) => a.slug === slug);
  if (found) return found;
  return getStaticArticle(slug);
}

export async function saveCommunityTopics(topics: CommunityTopic[]): Promise<boolean> {
  return putContent(KEY_TOPICS, topics);
}

export async function saveCommunityArticles(articles: CommunityArticle[]): Promise<boolean> {
  return putContent(KEY_ARTICLES, articles);
}

export async function resetTopicsToDefault(): Promise<boolean> {
  const { error } = await supabase.from('content_store').delete().eq('key', KEY_TOPICS);
  return !error;
}

export async function resetArticlesToDefault(): Promise<boolean> {
  const { error } = await supabase.from('content_store').delete().eq('key', KEY_ARTICLES);
  return !error;
}
