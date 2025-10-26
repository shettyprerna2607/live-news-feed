
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Article } from './types';
import { fetchArticles } from './services/newsService';
import { NEWS_CATEGORIES } from './constants';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import CategoryFilter from './components/CategoryFilter';
import ArticleCard from './components/ArticleCard';
import Spinner from './components/Spinner';

const App: React.FC = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>(NEWS_CATEGORIES[0]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
            if (storedTheme) {
                setTheme(storedTheme);
            }
            isInitialMount.current = false;
        }

        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const loadArticles = useCallback(async (page: number, category: string, query: string, append: boolean = false) => {
        setLoading(true);
        setError(null);
        try {
            const { articles: newArticles, totalResults } = await fetchArticles({
                query,
                category,
                page,
                pageSize: 12
            });
            setArticles(prev => append ? [...prev, ...newArticles] : newArticles);
            setHasMore((page * 12) < totalResults);
        } catch (err) {
            setError('Failed to fetch news articles. Please try again later.');
            setArticles([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Fetch when category or search term changes
        loadArticles(1, selectedCategory, searchTerm, false);
        setCurrentPage(1); // Reset page
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCategory, searchTerm]);

    const handleSearch = (query: string) => {
        setSearchTerm(query);
    };

    const handleSelectCategory = (category: string) => {
        setSelectedCategory(category);
        setSearchTerm(''); // Clear search on category change
    };

    const handleLoadMore = () => {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        loadArticles(nextPage, selectedCategory, searchTerm, true);
    };

    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <Header theme={theme} toggleTheme={toggleTheme} />
            <main className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <SearchBar onSearch={handleSearch} />
                </div>
                <CategoryFilter
                    categories={NEWS_CATEGORIES}
                    selectedCategory={selectedCategory}
                    onSelectCategory={handleSelectCategory}
                />

                {loading && articles.length === 0 ? (
                    <div className="flex justify-center items-center h-64">
                        <Spinner />
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 text-xl py-10">{error}</div>
                ) : articles.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {articles.map((article, index) => (
                                <ArticleCard key={`${article.url}-${index}`} article={article} />
                            ))}
                        </div>
                        {hasMore && (
                            <div className="text-center mt-10">
                                <button
                                    onClick={handleLoadMore}
                                    disabled={loading}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-8 rounded-full transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
                                >
                                    {loading ? 'Loading...' : 'Load More'}
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400 text-xl py-10">
                        No articles found. Try a different search or category.
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;
