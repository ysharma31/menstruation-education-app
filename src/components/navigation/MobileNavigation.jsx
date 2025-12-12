import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Home,
  User,
  Users,
  Bot,
  HelpCircle,
  MessageCircle
} from 'lucide-react';

const MobileNavigation = () => {
  const { t } = useTranslation();

  const navItems = [
    { path: '/', icon: Home, label: t('navigation.home') },
    { path: '/girls', icon: User, label: t('navigation.girls') },
    { path: '/boys', icon: Users, label: t('navigation.boys') },
    { path: '/chat', icon: Bot, label: t('navigation.chat') },
    { path: '/faq', icon: HelpCircle, label: t('navigation.faq') },
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
