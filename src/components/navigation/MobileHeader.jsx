import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Menu,
  X,
  Home,
  User,
  Users,
  PlayCircle,
  HelpCircle,
  BookOpen,
  MessageCircle,
  Heart
} from 'lucide-react';
import LanguageToggle from '../ui/LanguageToggle';

const MobileHeader = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: '/', icon: Home, label: t('navigation.home') },
    { path: '/girls', icon: User, label: t('navigation.girls') },
    { path: '/boys', icon: Users, label: t('navigation.boys') },
    { path: '/animated', icon: PlayCircle, label: t('navigation.animated') },
    { path: '/faq', icon: HelpCircle, label: t('navigation.faq') },
    { path: '/parents', icon: BookOpen, label: t('navigation.parents') },
    { path: '/ask', icon: MessageCircle, label: t('navigation.ask') },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-warm-100 z-50 safe-area-inset-top shadow-soft">
        <div className="flex items-center justify-between px-4 py-3">
          <NavLink to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-warm">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-text-primary">
              {t('common.appName')}
            </span>
          </NavLink>

          <div className="flex items-center gap-2">
            <LanguageToggle compact />
            <button
              onClick={toggleMenu}
              className="p-2.5 rounded-xl hover:bg-warm-50 transition-all duration-300 touch-target"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X size={24} className="text-text-primary" />
              ) : (
                <Menu size={24} className="text-text-primary" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Backdrop */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      <div
        className={`lg:hidden fixed top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-md z-50 transform transition-transform duration-300 ease-in-out shadow-lift ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile menu"
      >
        <div className="flex flex-col h-full safe-area-inset-top">
          <div className="flex items-center justify-between px-5 py-4 border-b border-warm-100">
            <span className="font-display font-semibold text-text-primary">
              {t('common.appName')}
            </span>
            <button
              onClick={closeMenu}
              className="p-2.5 rounded-xl hover:bg-warm-50 transition-all duration-300"
              aria-label="Close menu"
            >
              <X size={20} className="text-text-secondary" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-5 px-3">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 mb-1.5
                   ${isActive
                     ? 'bg-primary-50 text-primary-600 font-medium shadow-sm'
                     : 'text-text-secondary hover:bg-warm-50'
                   }`
                }
              >
                <item.icon size={20} aria-hidden="true" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="p-5 border-t border-warm-100 bg-warm-50/50">
            <LanguageToggle />
            <p className="mt-4 text-xs text-text-muted leading-relaxed">
              {t('footer.disclaimer')}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileHeader;
