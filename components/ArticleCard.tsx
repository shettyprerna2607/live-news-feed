
import React from 'react';
import { Article } from '../types';

interface ArticleCardProps {
    article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
    const { title, description, image, url, source, publishedAt } = article;
    const placeholderImage = 'https://picsum.photos/600/400?grayscale';

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="block group">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden h-full flex flex-col transform hover:-translate-y-2 transition-transform duration-300">
                <img 
                    className="w-full h-48 object-cover" 
                    src={image || placeholderImage} 
                    alt={title} 
                    onError={(e) => (e.currentTarget.src = placeholderImage)}
                />
                <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
                        {title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-grow line-clamp-3">
                        {description}
                    </p>
                    <div className="text-xs text-gray-500 dark:text-gray-500 mt-auto">
                        <span>{source.name}</span> &bull; <span>{formatDate(publishedAt)}</span>
                    </div>
                </div>
            </div>
        </a>
    );
};

export default ArticleCard;
