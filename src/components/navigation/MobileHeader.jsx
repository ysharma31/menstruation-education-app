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
      {/* Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-warm-200 z-50 safe-area-inset-top">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-text-primary">
              {t('common.appName')}
            </span>
          </NavLink>

          {/* Right side: Language + Menu */}
          <div className="flex items-center gap-2">
            <LanguageToggle compact />
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg hover:bg-warm-100 transition-colors touch-target"
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

      {/* Slide-out Menu */}
      <div
        className={`lg:hidden fixed top-0 right-0 h-full w-72 bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile menu"
      >
        <div className="flex flex-col h-full safe-area-inset-top">
          {/* Menu Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-warm-200">
            <span className="font-display font-semibold text-text-primary">
              {t('common.appName')}
            </span>
            <button
              onClick={closeMenu}
              className="p-2 rounded-lg hover:bg-warm-100 transition-colors"
              aria-label="Close menu"
            >
              <X size={20} className="text-text-secondary" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-4 px-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 mb-1
                   ${isActive
                     ? 'bg-primary-50 text-primary-600 font-medium'
                     : 'text-text-secondary hover:bg-warm-100'
                   }`
                }
              >
                <item.icon size={20} aria-hidden="true" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-warm-200">
            <LanguageToggle />
            <p className="mt-3 text-xs text-text-muted">
              {t('footer.disclaimer')}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileHeader;
