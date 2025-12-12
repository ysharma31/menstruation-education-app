import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  User,
  Users,
  PlayCircle,
  HelpCircle,
  BookOpen,
  MessageCircle,
  Heart,
  Sparkles
} from 'lucide-react';

const Home = () => {
  const { t } = useTranslation();

  const sections = [
    {
      path: '/girls',
      icon: User,
      title: t('navigation.girls'),
      description: t('girls.intro'),
      color: 'from-pink-400 to-pink-600',
      bgColor: 'bg-girls-light',
      borderColor: 'border-girls',
      textColor: 'text-girls-dark'
    },
    {
      path: '/boys',
      icon: Users,
      title: t('navigation.boys'),
      description: t('boys.intro'),
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-boys-light',
      borderColor: 'border-boys',
      textColor: 'text-boys-dark'
    },
    {
      path: '/animated',
      icon: PlayCircle,
      title: t('navigation.animated'),
      description: t('animated.description'),
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-accent-50',
      borderColor: 'border-accent-300',
      textColor: 'text-accent-700'
    },
    {
      path: '/faq',
      icon: HelpCircle,
      title: t('navigation.faq'),
      description: t('faq.subtitle'),
      color: 'from-secondary-400 to-secondary-600',
      bgColor: 'bg-secondary-50',
      borderColor: 'border-secondary-300',
      textColor: 'text-secondary-700'
    },
    {
      path: '/parents',
      icon: BookOpen,
      title: t('navigation.parents'),
      description: t('parents.intro'),
      color: 'from-warm-400 to-warm-600',
      bgColor: 'bg-warm-50',
      borderColor: 'border-warm-400',
      textColor: 'text-warm-800'
    },
    {
      path: '/ask',
      icon: MessageCircle,
      title: t('navigation.ask'),
      description: t('ask.description'),
      color: 'from-primary-400 to-primary-600',
      bgColor: 'bg-primary-50',
      borderColor: 'border-primary-300',
      textColor: 'text-primary-700'
    }
  ];

  return (
    <div className="page-container animate-fade-in">
      {/* Hero Section */}
      <section className="text-center mb-8 md:mb-12">
        {/* Decorative Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl gradient-primary mb-4 md:mb-6">
          <Heart className="w-8 h-8 md:w-10 md:h-10 text-white" />
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-text-primary mb-3 md:mb-4 text-balance">
          {t('home.title')}
        </h1>

        <p className="text-base md:text-lg text-text-secondary max-w-2xl mx-auto mb-4">
          {t('home.subtitle')}
        </p>

        <p className="text-sm md:text-base text-text-muted max-w-xl mx-auto">
          {t('home.description')}
        </p>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-primary-50 rounded-full">
          <Sparkles className="w-4 h-4 text-primary-500" />
          <span className="text-sm font-medium text-primary-600">
            {t('home.safeSpace')}
          </span>
        </div>
      </section>

      {/* Section Cards */}
      <section>
        <h2 className="text-lg md:text-xl font-display font-semibold text-text-primary mb-4 md:mb-6">
          {t('home.chooseSection')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {sections.map((section) => (
            <Link
              key={section.path}
              to={section.path}
              className={`section-card group ${section.bgColor} border-l-4 ${section.borderColor}`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <section.icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className={`font-display font-semibold text-lg ${section.textColor} mb-1 group-hover:text-primary-600 transition-colors`}>
                    {section.title}
                  </h3>
                  <p className="text-sm text-text-muted line-clamp-2">
                    {section.description}
                  </p>
                </div>
              </div>

              {/* Learn More Arrow */}
              <div className="mt-4 flex items-center text-sm font-medium text-primary-500 group-hover:text-primary-600">
                <span>{t('common.learnMore')}</span>
                <svg
                  className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Note for Everyone */}
      <section className="mt-8 md:mt-12 p-4 md:p-6 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl border border-primary-100">
        <div className="flex items-center gap-3 mb-2">
          <Heart className="w-5 h-5 text-primary-500" />
          <h3 className="font-display font-semibold text-text-primary">
            {t('home.forEveryone')}
          </h3>
        </div>
        <p className="text-sm md:text-base text-text-secondary">
          {t('home.description')}
        </p>
      </section>
    </div>
  );
};

export default Home;
