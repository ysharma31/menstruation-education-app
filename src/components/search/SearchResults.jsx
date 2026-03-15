import { Link } from 'react-router-dom';
import { User, Users, BookOpen, Circle as HelpCircle, ChevronRight, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const iconMap = {
  User,
  Users,
  BookOpen,
  HelpCircle
};

const colorMap = {
  pink: 'bg-pink-50 text-pink-600 border-pink-200',
  blue: 'bg-blue-50 text-blue-600 border-blue-200',
  green: 'bg-green-50 text-green-600 border-green-200',
  purple: 'bg-purple-50 text-purple-600 border-purple-200'
};

const SearchResults = ({ results, query }) => {
  const { t } = useTranslation();

  if (!query || query.trim() === '') {
    return null;
  }

  if (results.length === 0) {
    return (
      <div className="card text-center py-12">
        <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          {t('search.noResults')}
        </h3>
        <p className="text-gray-500">
          {t('search.tryDifferent')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-display font-semibold text-gray-800">
          {t('search.resultsFor')} "{query}"
        </h2>
        <span className="text-sm text-gray-500">
          {results.length} {results.length === 1 ? t('search.result') : t('search.results')}
        </span>
      </div>

      <div className="grid gap-4">
        {results.map((result, index) => {
          const Icon = iconMap[result.icon] || HelpCircle;
          const colorClass = colorMap[result.color] || colorMap.purple;

          return (
            <Link
              key={`${result.page}-${result.id}-${index}`}
              to={result.path}
              className="card hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl ${colorClass} border flex items-center justify-center flex-shrink-0`}>
                  <Icon size={20} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      {result.pageName}
                    </span>
                    <ChevronRight size={12} className="text-gray-400" />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-pink-600 transition-colors mb-1">
                    {result.title}
                  </h3>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {result.keywords.slice(0, 4).map((keyword, i) => {
                      const isMatch = query.toLowerCase().split(/\s+/).some(term =>
                        keyword.toLowerCase().includes(term)
                      );
                      return (
                        <span
                          key={i}
                          className={`text-xs px-2 py-1 rounded-full ${
                            isMatch
                              ? 'bg-yellow-100 text-yellow-800 font-medium'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {keyword}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <ChevronRight className="text-gray-400 group-hover:text-pink-600 transition-colors flex-shrink-0" size={20} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SearchResults;
