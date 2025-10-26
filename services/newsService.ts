import { Article, FetchArticlesParams } from '../types';

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;

const mapGNewsArticle = (item: any): Article => ({
  source: {
    name: item.source?.name || "Unknown Source",
    url: item.source?.url || item.url
  },
  title: item.title,
  description: item.description,
  url: item.url,
  image: item.image,
  publishedAt: item.publishedAt,
  content: item.content || item.description
});

export const fetchArticles = async (
  params: FetchArticlesParams
): Promise<{ articles: Article[]; totalResults: number }> => {
  const {
    query = '',
    category = '',
    page = 1,
    pageSize = 10
  } = params;

  const q = query || category || "news";

  const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(
    q
  )}&token=${API_KEY}&lang=en&max=${pageSize}&page=${page}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch articles');
  }
  const data = await response.json();

  const articles: Article[] = (data.articles || []).map(mapGNewsArticle);
  const totalResults = data.totalArticles || articles.length;

  return { articles, totalResults };
};
