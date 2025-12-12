import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageToggle = ({ compact = false }) => {
  const { t, i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' }
  ];

  const currentLang = i18n.language;

  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLang);
  };

  if (compact) {
    return (
      <button
        onClick={toggleLanguage}
        className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-warm-100 hover:bg-warm-200 transition-colors text-sm font-medium text-text-secondary"
        aria-label={`Switch to ${currentLang === 'en' ? 'Hindi' : 'English'}`}
      >
        <Globe size={16} />
        <span>{currentLang === 'en' ? 'हि' : 'En'}</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Globe size={18} className="text-text-muted" aria-hidden="true" />
      <span className="text-sm text-text-muted">{t('common.language')}:</span>
      <div className="flex rounded-lg bg-warm-100 p-1">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
              currentLang === lang.code
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-text-muted hover:text-text-secondary'
            }`}
            aria-pressed={currentLang === lang.code}
            aria-label={`Switch to ${lang.name}`}
          >
            {lang.nativeName}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageToggle;
