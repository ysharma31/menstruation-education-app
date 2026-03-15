import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Hop as Home, User, Users, Bot, Circle as HelpCircle, LogIn } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const MobileNavigation = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const isHindi = i18n.language === 'hi';

  const displayName = () => {
    const meta = user?.user_metadata;
    if (!meta) return '';
    if (isHindi && meta.full_name_hi) return meta.full_name_hi;
    return meta.full_name || user.email?.split('@')[0] || '';
  };

  const navItems = [
    { path: '/', icon: Home, label: t('navigation.home') },
    { path: '/girls', icon: User, label: t('navigation.girls') },
    { path: '/boys', icon: Users, label: t('navigation.boys') },
    { path: '/chat', icon: Bot, label: t('navigation.chat') },
    { path: user ? '/girls' : '/auth', icon: user ? User : LogIn, label: user ? t('auth.greeting', { name: displayName() }) : t('auth.signInNavTracker') },
  ];

  return (
    <nav className="mobile-nav lg:hidden" role="navigation" aria-label="Mobile navigation">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `nav-item flex-1 ${isActive ? 'active' : ''}`
          }
        >
          <item.icon
            size={22}
            className="mb-1"
            aria-hidden="true"
          />
          <span className="text-[10px] sm:text-xs font-medium truncate max-w-full">
            {item.label}
          </span>
        </NavLink>
      ))}
    </nav>
  );
};

export default MobileNavigation;
