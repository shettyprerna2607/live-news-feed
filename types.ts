
export interface Article {
  source: {
    name: string;
    url: string;
  };
  title: string;
  description: string;
  url: string;
  image: string | null;
  publishedAt: string;
  content: string;
}

export interface FetchArticlesParams {
  query?: string;
  category?: string;
  page: number;
  pageSize: number;
}

export interface NewsApiResponse {
  totalArticles: number;
  articles: Article[];
}
