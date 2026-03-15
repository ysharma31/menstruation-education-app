import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Hop as Home, User, Users, CirclePlay as PlayCircle, Circle as HelpCircle, BookOpen, MessageCircle, Bot, Heart } from 'lucide-react';
import LanguageToggle from '../ui/LanguageToggle';
import SearchBar from '../ui/SearchBar';

const DesktopNavigation = () => {
  const { t } = useTranslation();

  const navItems = [
    { path: '/', icon: Home, label: t('navigation.home') },
    { path: '/girls', icon: User, label: t('navigation.girls'), color: 'text-girls-dark' },
    { path: '/boys', icon: Users, label: t('navigation.boys'), color: 'text-boys-dark' },
    { path: '/animated', icon: PlayCircle, label: t('navigation.animated') },
    { path: '/faq', icon: HelpCircle, label: t('navigation.faq') },
    { path: '/parents', icon: BookOpen, label: t('navigation.parents') },
    { path: '/ask', icon: MessageCircle, label: t('navigation.ask') },
    { path: '/chat', icon: Bot, label: t('navigation.chat'), color: 'text-primary-600' },
  ];

  return (
    <aside className="desktop-nav hidden lg:flex" role="navigation" aria-label="Desktop navigation">
      <div className="mb-8">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-full bg-pink-400 flex items-center justify-center shadow-sm">
            <Heart className="w-6 h-6 text-white fill-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-text-primary leading-tight">
              {t('common.appName')}
            </h1>
            <p className="text-xs text-text-muted">
              {t('common.tagline')}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <SearchBar />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
               ${isActive
                 ? 'bg-primary-50 text-primary-600 font-medium'
                 : 'text-text-secondary hover:bg-warm-100 hover:text-text-primary'
               }`
            }
          >
            <item.icon
              size={20}
              className={item.color || ''}
              aria-hidden="true"
            />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-warm-200">
        <LanguageToggle />
      </div>

      {/* Footer Disclaimer */}
      <div className="mt-4 p-3 bg-warm-50 rounded-xl">
        <p className="text-xs text-text-muted leading-relaxed">
          {t('footer.disclaimer')}
        </p>
      </div>
    </aside>
  );
};

export default DesktopNavigation;
