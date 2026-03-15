import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { User, Users, CirclePlay as PlayCircle, Circle as HelpCircle, BookOpen, MessageCircle, Heart, Sparkles, ArrowRight } from 'lucide-react';
import { useSearch } from '../contexts/SearchContext';
import SearchResults from '../components/search/SearchResults';
import { searchGlobalContent } from '../utils/contentIndex';

const Home = () => {
  const { t } = useTranslation();
  const { searchQuery } = useSearch();

  const sections = [
    {
      path: '/girls',
      icon: User,
      title: t('navigation.girls'),
      description: t('girls.intro'),
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-400',
      iconBg: 'bg-pink-500',
      textColor: 'text-pink-700'
    },
    {
      path: '/boys',
      icon: Users,
      title: t('navigation.boys'),
      description: t('boys.intro'),
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-400',
      iconBg: 'bg-blue-500',
      textColor: 'text-blue-700'
    },
    {
      path: '/animated',
      icon: PlayCircle,
      title: t('navigation.animated'),
      description: t('animated.description'),
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-400',
      iconBg: 'bg-purple-500',
      textColor: 'text-purple-700'
    },
    {
      path: '/faq',
      icon: HelpCircle,
      title: t('navigation.faq'),
      description: t('faq.subtitle'),
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-300',
      iconBg: 'bg-blue-500',
      textColor: 'text-blue-700'
    },
    {
      path: '/parents',
      icon: BookOpen,
      title: t('navigation.parents'),
      description: t('parents.intro'),
      bgColor: 'bg-green-50',
      borderColor: 'border-green-400',
      iconBg: 'bg-green-500',
      textColor: 'text-green-700'
    },
    {
      path: '/ask',
      icon: MessageCircle,
      title: t('navigation.ask'),
      description: t('ask.description'),
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-300',
      iconBg: 'bg-pink-500',
      textColor: 'text-pink-700'
    }
  ];

  const searchResults = useMemo(() => {
    return searchGlobalContent(searchQuery, t);
  }, [searchQuery, t]);

  const showSearchResults = searchQuery && searchQuery.trim() !== '';

  return (
    <div className="page-container animate-fade-in">
      <section className="mb-12">
        <div className="text-center max-w-4xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-pink-50 rounded-full shadow-sm">
            <Sparkles className="w-4 h-4 text-pink-500" />
            <span className="text-sm font-medium text-pink-600">
              {t('home.safeSpace')}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-balance leading-tight">
            {t('home.title')}
          </h1>

          <p className="text-lg text-gray-600 mb-3 leading-relaxed max-w-3xl mx-auto">
            {t('home.subtitle')}
          </p>

          <p className="text-base text-gray-500 leading-relaxed max-w-2xl mx-auto">
            {t('home.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl shadow-lg bg-gradient-to-br from-blue-100 via-pink-50 to-pink-100 p-6">
            <img
              src="/hero-group-study.png"
              alt="Diverse students learning together in a supportive environment"
              className="w-full h-auto rounded-xl shadow-md"
            />
          </div>

          <div className="relative overflow-hidden rounded-2xl shadow-lg bg-gradient-to-br from-pink-100 via-blue-50 to-blue-100 p-6">
            <img
              src="/hero-classroom.png"
              alt="Inclusive classroom education about puberty and menstruation"
              className="w-full h-auto rounded-xl shadow-md"
            />
          </div>
        </div>
      </section>

      {showSearchResults ? (
        <section className="mb-12">
          <SearchResults results={searchResults} query={searchQuery} />
        </section>
      ) : (
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {t('home.chooseSection')}
            </h2>
            <p className="text-gray-500">
              Explore resources designed just for you
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <Link
              key={section.path}
              to={section.path}
              className={`group card ${section.bgColor} border-l-4 ${section.borderColor}`}
            >
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${section.iconBg} flex items-center justify-center shadow-sm`}>
                  <section.icon className="w-6 h-6 text-white" />
                </div>

                <div className="flex-1">
                  <h3 className={`font-semibold text-lg ${section.textColor} mb-1`}>
                    {section.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                    {section.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 flex items-center text-sm font-medium text-pink-500">
                <span>{t('common.learnMore')}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          ))}
        </div>
        </section>
      )}

      <section className="mb-8">
        <div className="card bg-pink-50 border-pink-100">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-pink-500 flex items-center justify-center shadow-sm">
              <Heart className="w-7 h-7 text-white" />
            </div>

            <div className="text-center md:text-left flex-1">
              <h3 className="font-bold text-lg text-gray-900 mb-1">
                {t('home.forEveryone')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('home.description')}
              </p>
            </div>

            <Link to="/faq" className="btn-outline flex-shrink-0">
              <HelpCircle className="w-5 h-5 mr-2" />
              Browse FAQ
            </Link>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <div className="card bg-pink-50 border-pink-100">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-pink-500 flex items-center justify-center shadow-sm">
              <Heart className="w-7 h-7 text-white" />
            </div>

            <div className="text-center md:text-left flex-1">
              <h3 className="font-bold text-lg text-gray-900 mb-1">
                {t('home.forEveryone')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('home.description')}
              </p>
            </div>

            <Link to="/faq" className="btn-outline flex-shrink-0">
              <HelpCircle className="w-5 h-5 mr-2" />
              Browse FAQ
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
