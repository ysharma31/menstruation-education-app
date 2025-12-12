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
  Sparkles,
  ArrowRight
} from 'lucide-react';

const IllustrationPlaceholder = ({ text, gradient, width, height, className = '' }) => (
  <div
    className={`illustration-placeholder shadow-soft ${className}`}
    style={{ width, height, minHeight: height }}
  >
    <div className={`w-full h-full rounded-2xl ${gradient} flex items-center justify-center p-6`}>
      <p className="text-sm font-medium text-text-secondary/80 text-center leading-relaxed">
        {text}
      </p>
    </div>
  </div>
);

const Home = () => {
  const { t } = useTranslation();

  const sections = [
    {
      path: '/girls',
      icon: User,
      title: t('navigation.girls'),
      description: t('girls.intro'),
      gradient: 'gradient-primary',
      bgColor: 'bg-primary-50/50',
      borderColor: 'border-primary-400',
      textColor: 'text-primary-700',
      hoverBg: 'hover:bg-primary-50'
    },
    {
      path: '/boys',
      icon: Users,
      title: t('navigation.boys'),
      description: t('boys.intro'),
      gradient: 'gradient-secondary',
      bgColor: 'bg-secondary-50/50',
      borderColor: 'border-secondary-400',
      textColor: 'text-secondary-700',
      hoverBg: 'hover:bg-secondary-50'
    },
    {
      path: '/animated',
      icon: PlayCircle,
      title: t('navigation.animated'),
      description: t('animated.description'),
      gradient: 'bg-gradient-to-br from-accent-400 to-accent-500',
      bgColor: 'bg-accent-50/50',
      borderColor: 'border-accent-400',
      textColor: 'text-accent-700',
      hoverBg: 'hover:bg-accent-50'
    },
    {
      path: '/faq',
      icon: HelpCircle,
      title: t('navigation.faq'),
      description: t('faq.subtitle'),
      gradient: 'bg-gradient-to-br from-secondary-400 to-secondary-500',
      bgColor: 'bg-secondary-50/50',
      borderColor: 'border-secondary-300',
      textColor: 'text-secondary-700',
      hoverBg: 'hover:bg-secondary-50'
    },
    {
      path: '/parents',
      icon: BookOpen,
      title: t('navigation.parents'),
      description: t('parents.intro'),
      gradient: 'gradient-sage',
      bgColor: 'bg-sage-50/50',
      borderColor: 'border-sage-400',
      textColor: 'text-sage-700',
      hoverBg: 'hover:bg-sage-50'
    },
    {
      path: '/ask',
      icon: MessageCircle,
      title: t('navigation.ask'),
      description: t('ask.description'),
      gradient: 'gradient-primary',
      bgColor: 'bg-primary-50/50',
      borderColor: 'border-primary-300',
      textColor: 'text-primary-700',
      hoverBg: 'hover:bg-primary-50'
    }
  ];

  return (
    <div className="page-container animate-fade-in">
      <section className="mb-16 md:mb-20">
        <div className="gradient-peach rounded-3xl p-6 md:p-10 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-2 lg:order-1 flex justify-center lg:justify-start">
              <IllustrationPlaceholder
                text="Illustration: Diverse students learning together"
                gradient="bg-gradient-to-br from-primary-100 via-primary-50 to-secondary-100"
                width="100%"
                height="320px"
                className="max-w-md lg:max-w-lg"
              />
            </div>

            <div className="order-1 lg:order-2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-soft">
                <Sparkles className="w-4 h-4 text-primary-500" />
                <span className="text-sm font-medium text-primary-600">
                  {t('home.safeSpace')}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-text-primary mb-5 text-balance leading-tight">
                {t('home.title')}
              </h1>

              <p className="text-lg md:text-xl text-text-secondary mb-4 leading-relaxed">
                {t('home.subtitle')}
              </p>

              <p className="text-base text-text-muted mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                {t('home.description')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/girls" className="btn-primary">
                  <User className="w-5 h-5 mr-2" />
                  {t('navigation.girls')}
                </Link>
                <Link to="/boys" className="btn-secondary">
                  <Users className="w-5 h-5 mr-2" />
                  {t('navigation.boys')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16 md:mb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-text-primary mb-3">
            {t('home.chooseSection')}
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto">
            Explore resources designed just for you
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {sections.map((section) => (
            <Link
              key={section.path}
              to={section.path}
              className={`group card-glass ${section.bgColor} border-l-4 ${section.borderColor} ${section.hoverBg}`}
            >
              <div className="flex items-start gap-5">
                <div className={`flex-shrink-0 w-14 h-14 rounded-2xl ${section.gradient} flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300`}>
                  <section.icon className="w-7 h-7 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className={`font-display font-semibold text-xl ${section.textColor} mb-2 group-hover:text-primary-600 transition-colors`}>
                    {section.title}
                  </h3>
                  <p className="text-sm text-text-muted line-clamp-2 leading-relaxed">
                    {section.description}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-warm-100 flex items-center text-sm font-medium text-primary-500 group-hover:text-primary-600 transition-colors">
                <span>{t('common.learnMore')}</span>
                <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <div className="card-glass gradient-warm border border-primary-100/50">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-warm">
              <Heart className="w-8 h-8 text-white" />
            </div>

            <div className="text-center md:text-left flex-1">
              <h3 className="font-display font-bold text-xl text-text-primary mb-2">
                {t('home.forEveryone')}
              </h3>
              <p className="text-text-secondary leading-relaxed">
                {t('home.description')}
              </p>
            </div>

            <Link
              to="/faq"
              className="btn-outline flex-shrink-0"
            >
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
