import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Hop as Home, User, Users, CirclePlay as PlayCircle, Circle as HelpCircle, BookOpen, MessageCircle, Bot, Heart, LogIn, LogOut, GraduationCap, CalendarCheck } from 'lucide-react';
import LanguageToggle from '../ui/LanguageToggle';
import SearchBar from '../ui/SearchBar';
import { useAuth } from '../../contexts/AuthContext';

const DesktopNavigation = () => {
  const { t, i18n } = useTranslation();
  const { user, signOut } = useAuth();
  const isHindi = i18n.language === 'hi';

  const displayName = () => {
    const meta = user?.user_metadata;
    if (!meta) return '';
    if (isHindi && meta.full_name_hi) return meta.full_name_hi;
    return meta.full_name || user.email?.split('@')[0] || '';
  };

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

      <div className="mt-auto pt-4 border-t border-warm-200 space-y-3">
        <LanguageToggle />
        {user ? (
          <div className="flex items-center justify-between px-2 py-2 bg-pink-50 rounded-xl">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-pink-200 flex items-center justify-center flex-shrink-0">
                <User size={14} className="text-pink-600" />
              </div>
              <span className="text-xs text-pink-700 truncate">
                {t('auth.greeting', { name: displayName() })}
              </span>
            </div>
            <button
              onClick={signOut}
              className="p-1.5 hover:bg-pink-100 rounded-lg transition-colors flex-shrink-0"
              title={t('auth.signOut')}
            >
              <LogOut size={14} className="text-pink-500" />
            </button>
          </div>
        ) : (
          <Link
            to="/auth"
            className="flex items-center gap-3 px-3 py-2 bg-pink-50 hover:bg-pink-100 text-pink-600 rounded-xl transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-pink-200 flex items-center justify-center flex-shrink-0">
              <CalendarCheck size={14} className="text-pink-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-pink-700 leading-tight">{t('auth.signInNav')}</p>
              <p className="text-xs text-pink-500 leading-tight truncate">{t('auth.signInNavHint')}</p>
            </div>
            <LogIn size={14} className="text-pink-400 flex-shrink-0 ml-auto" />
          </Link>
        )}
      </div>

      {/* Footer Disclaimer */}
      <div className="mt-4 p-3 bg-warm-50 rounded-xl">
        <p className="text-xs text-text-muted leading-relaxed">
          {t('footer.disclaimer')}
        </p>
      </div>

      <Link
        to="/teacher"
        className="mt-3 flex items-center gap-2 px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl transition-colors text-xs font-medium"
      >
        <GraduationCap size={14} />
        Teacher / School Portal
      </Link>
    </aside>
  );
};

export default DesktopNavigation;
