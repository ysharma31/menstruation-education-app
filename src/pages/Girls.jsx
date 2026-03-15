import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearch } from '../contexts/SearchContext';
import { Heart, Calendar, Sparkles, Activity, ShoppingBag, ChevronRight, CircleCheck as CheckCircle, ArrowLeft, Circle as XCircle, Info, User, Droplet, Sun, Wind, Smile, ChevronDown, CircleAlert as AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import PeriodTracker from '../components/tracker/PeriodTracker';
import AnatomyExplorer from '../components/education/AnatomyExplorer';

const Girls = () => {
  const { t } = useTranslation();
  const { searchQuery } = useSearch();
  const [currentSection, setCurrentSection] = useState(0);
  const [selectedBodyPart, setSelectedBodyPart] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const sections = [
    { id: 'understanding', icon: Sparkles, title: t('girls.understanding.title') },
    { id: 'bodyChanges', icon: User, title: t('girls.bodyChanges.title') },
    { id: 'products', icon: ShoppingBag, title: t('girls.products.title') },
    { id: 'painManagement', icon: Heart, title: t('girls.painManagement.title') },
    { id: 'tracking', icon: Calendar, title: t('girls.tracking.title') },
    { id: 'myths', icon: AlertCircle, title: t('girls.myths.title') }
  ];

  const bodyParts = [
    { key: 'breasts', icon: Heart },
    { key: 'hair', icon: Wind },
    { key: 'skin', icon: Sun },
    { key: 'height', icon: Activity },
    { key: 'hips', icon: User },
    { key: 'emotions', icon: Smile }
  ];

  const products = [
    { key: 'pads', icon: Droplet },
    { key: 'clothPads', icon: Droplet },
    { key: 'tampons', icon: Droplet },
    { key: 'cups', icon: Droplet },
    { key: 'underwear', icon: Droplet }
  ];

  const painManagementTips = [
    { key: 'heat', icon: Sun },
    { key: 'exercise', icon: Activity },
    { key: 'hydration', icon: Droplet },
    { key: 'rest', icon: Smile },
    { key: 'food', icon: Heart },
    { key: 'medicine', icon: AlertCircle }
  ];

  const handlePrevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const matchesSearch = (text) => {
    if (!searchQuery || !searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const searchText = String(text || '').toLowerCase();
    return searchText.includes(query);
  };

  const filteredSections = useMemo(() => {
    if (!searchQuery || !searchQuery.trim()) {
      return sections.map((_, i) => i);
    }

    return sections
      .map((section, index) => {
        const sectionContent = [
          section.title,
          t(`girls.${section.id}.subtitle`) || '',
          t(`girls.${section.id}.intro`) || '',
        ].join(' ').toLowerCase();

        if (sectionContent.includes(searchQuery.toLowerCase())) {
          return { index, matches: true };
        }
        return { index, matches: false };
      })
      .filter(s => s.matches)
      .map(s => s.index);
  }, [searchQuery, sections, t]);

  useEffect(() => {
    if (filteredSections.length > 0 && !filteredSections.includes(currentSection)) {
      setCurrentSection(filteredSections[0]);
    }
  }, [filteredSections, currentSection]);

  return (
    <div className="page-container animate-fade-in">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-4 transition-colors"
      >
        <ArrowLeft size={18} />
        <span className="text-sm">{t('common.backToHome')}</span>
      </Link>

      <header className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-8 mb-8">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <div className="flex items-center gap-6 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-pink-500 flex items-center justify-center shadow-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold text-pink-600">
                  {t('girls.title')}
                </h1>
                <p className="text-pink-500 font-medium">{t('girls.subtitle')}</p>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {t('girls.intro')}
            </p>
          </div>

          <div className="flex justify-center mt-6 md:mt-0">
            <img
              src="/girl-empowerment.png"
              alt="Confident teenage girl with books representing learning and empowerment"
              className="w-full max-w-xs md:max-w-md"
            />
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1">
          <div className="card sticky top-4">
            <h3 className="font-display font-semibold text-gray-900 mb-5">
              Sections
            </h3>
            <nav className="space-y-3">
              {sections.map((section, index) => {
                const SectionIcon = section.icon;
                const isCurrent = currentSection === index;
                const isVisible = filteredSections.includes(index);

                if (!isVisible && searchQuery) return null;

                return (
                  <button
                    key={section.id}
                    onClick={() => setCurrentSection(index)}
                    className={`w-full flex items-center gap-3 rounded-2xl text-left transition-all duration-300 ${
                      isCurrent
                        ? 'bg-pink-500 text-white shadow-md p-4'
                        : 'text-gray-600 hover:text-pink-600 px-4 py-3'
                    }`}
                  >
                    <SectionIcon size={20} className="flex-shrink-0" />
                    <span className="text-sm font-medium leading-snug">{section.title}</span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-6 p-5 bg-pink-50 rounded-2xl">
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-pink-700 text-sm mb-2">
                    {t('girls.empowerment')}
                  </h4>
                  <p className="text-xs text-pink-700/80 leading-relaxed">
                    {t('girls.empowermentText')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="lg:col-span-3">
          <div className="card mb-6">
            {currentSection === 0 && (
              <div className="space-y-8">
                <h2 className="text-3xl font-display font-bold text-gray-900">
                  {t('girls.understanding.title')}
                </h2>

                <div className="space-y-6">
                  <div className="bg-white border-l-4 border-pink-500 p-5 rounded-r-2xl">
                    <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <User size={20} className="text-pink-500" />
                      {t('girls.understanding.whatIsUterus')}
                    </h3>
                    <p className="text-pink-700 text-sm leading-relaxed">
                      {t('girls.understanding.whatIsUterusText')}
                    </p>
                  </div>

                  <div className="bg-white border-l-4 border-pink-500 p-5 rounded-r-2xl">
                    <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Info size={20} className="text-pink-500" />
                      {t('girls.understanding.whatIs')}
                    </h3>
                    <p className="text-pink-700 text-sm leading-relaxed">
                      {t('girls.understanding.whatIsText')}
                    </p>
                  </div>

                  <div className="bg-white border-l-4 border-pink-500 p-5 rounded-r-2xl">
                    <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Sparkles size={20} className="text-pink-500" />
                      {t('girls.understanding.whyHappens')}
                    </h3>
                    <p className="text-pink-700 text-sm leading-relaxed">
                      {t('girls.understanding.whyHappensText')}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-5 bg-white rounded-2xl border border-gray-200">
                      <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Calendar size={20} className="text-pink-500" />
                        {t('girls.understanding.howLong')}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {t('girls.understanding.howLongText')}
                      </p>
                    </div>

                    <div className="p-5 bg-white rounded-2xl border border-gray-200">
                      <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Heart size={20} className="text-pink-500" />
                        {t('girls.understanding.firstPeriod')}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {t('girls.understanding.firstPeriodText')}
                      </p>
                    </div>
                  </div>
                </div>

                <AnatomyExplorer />
              </div>
            )}

            {currentSection === 1 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-display font-bold text-gray-900 mb-3">
                    {t('girls.bodyChanges.title')}
                  </h2>
                  <p className="text-gray-600">{t('girls.bodyChanges.subtitle')}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {bodyParts.map(({ key, icon: Icon }) => {
                    const isSelected = selectedBodyPart === key;
                    return (
                      <div
                        key={key}
                        className={`p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                          isSelected
                            ? 'bg-pink-50 border-pink-400 shadow-sm'
                            : 'bg-white border-gray-200 hover:border-pink-300 hover:shadow-sm'
                        }`}
                        onClick={() => setSelectedBodyPart(isSelected ? null : key)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                              isSelected ? 'bg-pink-100' : 'bg-gray-50'
                            }`}>
                              <Icon size={20} className={isSelected ? 'text-pink-600' : 'text-gray-500'} />
                            </div>
                            <h3 className="font-semibold text-gray-900">
                              {t(`girls.bodyChanges.${key}`)}
                            </h3>
                          </div>
                          <ChevronDown
                            size={20}
                            className={`text-gray-500 transition-transform duration-300 ${
                              isSelected ? 'rotate-180' : ''
                            }`}
                          />
                        </div>
                        <div
                          className={`overflow-hidden transition-all duration-300 ${
                            isSelected ? 'max-h-40 mt-3' : 'max-h-0'
                          }`}
                        >
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {t(`girls.bodyChanges.${key}Desc`)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {currentSection === 2 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-display font-bold text-gray-900 mb-3">
                    {t('girls.products.title')}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {t('girls.products.intro')}
                  </p>
                </div>

                <div className="space-y-4">
                  {products.map(({ key, icon: Icon }) => {
                    const isSelected = selectedProduct === key;
                    return (
                      <div
                        key={key}
                        className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-sm transition-all duration-300"
                      >
                        <button
                          onClick={() => setSelectedProduct(isSelected ? null : key)}
                          className="w-full p-5 bg-pink-50 flex items-center justify-between touch-target"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-xl bg-pink-100 flex items-center justify-center">
                              <Icon size={20} className="text-pink-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 text-left">
                              {t(`girls.products.${key}`)}
                            </h3>
                          </div>
                          <ChevronDown
                            size={20}
                            className={`text-gray-500 transition-transform duration-300 ${
                              isSelected ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        {isSelected && (
                          <div className="p-5 bg-white">
                            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                              {t(`girls.products.${key}Desc`)}
                            </p>
                            <div className="p-4 bg-gray-50 rounded-xl">
                              <p className="text-sm text-gray-600 leading-relaxed">
                                {t(`girls.products.${key}How`)}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="bg-pink-50 p-6 rounded-2xl border border-pink-200">
                  <h3 className="font-semibold text-pink-700 mb-2">
                    {t('girls.products.choosing')}
                  </h3>
                  <p className="text-sm text-pink-600/90 leading-relaxed">
                    {t('girls.products.choosingText')}
                  </p>
                </div>
              </div>
            )}

            {currentSection === 3 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-display font-bold text-gray-900 mb-3">
                    {t('girls.painManagement.title')}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {t('girls.painManagement.intro')}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {painManagementTips.map(({ key, icon: Icon }) => (
                    <div
                      key={key}
                      className="p-5 bg-white rounded-2xl border border-gray-200 hover:shadow-sm transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-xl bg-pink-100 flex items-center justify-center flex-shrink-0">
                          <Icon size={20} className="text-pink-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {t(`girls.painManagement.${key}`)}
                          </h3>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {t(`girls.painManagement.${key}Desc`)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-r-xl">
                  <h3 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                    <AlertCircle size={20} />
                    {t('girls.painManagement.whenToTalk')}
                  </h3>
                  <ul className="space-y-2">
                    {['severe', 'heavy', 'long', 'irregular', 'other'].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-amber-800">
                          {t(`girls.painManagement.${item}`)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {currentSection === 4 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-display font-bold text-gray-900 mb-3">
                    {t('girls.tracking.title')}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {t('girls.tracking.intro')}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Info size={20} className="text-pink-500" />
                      {t('girls.tracking.whyTrack')}
                    </h3>
                    <ul className="space-y-3">
                      {['reason1', 'reason2', 'reason3', 'reason4'].map((reason) => (
                        <li key={reason} className="flex items-start gap-3">
                          <CheckCircle size={16} className="text-pink-500 flex-shrink-0 mt-1" />
                          <span className="text-sm text-gray-600 leading-relaxed">
                            {t(`girls.tracking.${reason}`)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Calendar size={20} className="text-pink-500" />
                      {t('girls.tracking.howToTrack')}
                    </h3>
                    <ul className="space-y-3">
                      {['method1', 'method2', 'method3', 'method4'].map((method) => (
                        <li key={method} className="flex items-start gap-3">
                          <ChevronRight size={16} className="text-pink-500 flex-shrink-0 mt-1" />
                          <span className="text-sm text-gray-600 leading-relaxed">
                            {t(`girls.tracking.${method}`)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <PeriodTracker />
              </div>
            )}

            {currentSection === 5 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-display font-bold text-gray-900 mb-3">
                    {t('girls.myths.title')}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {t('girls.myths.intro')}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {['myth1', 'myth2', 'myth3', 'myth4', 'myth5', 'myth6', 'myth7', 'myth8'].map(
                    (myth, index) => (
                      <div key={myth} className="border border-gray-200 rounded-xl overflow-hidden">
                        <div className="flex items-start gap-3 p-4 bg-red-50">
                          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-bold text-red-600 uppercase">
                              Myth
                            </span>
                            <p className="text-sm text-red-900 font-medium mt-1">
                              {t(`girls.myths.${myth}`)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-green-50">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-bold text-green-600 uppercase">
                              Fact
                            </span>
                            <p className="text-sm text-green-900 mt-1">
                              {t(`girls.myths.fact${index + 1}`)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-8 gap-4">
            <button
              onClick={handlePrevSection}
              disabled={currentSection === 0}
              className="btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('boys.previous')}
            </button>

            {currentSection < sections.length - 1 ? (
              <button
                onClick={handleNextSection}
                className="px-8 py-3 bg-pink-500 text-white rounded-xl font-medium hover:bg-pink-600 transition-colors shadow-lg"
              >
                {t('boys.next')}
              </button>
            ) : (
              <Link
                to="/"
                className="btn px-8 py-4 bg-gradient-to-r from-sage-500 to-sage-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                {t('boys.completed')}
              </Link>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="card bg-pink-50 border border-pink-200">
              <h3 className="font-display font-semibold text-pink-700 mb-4 flex items-center gap-2">
                <Sparkles size={20} className="text-pink-500" />
                {t('girls.empowermentSection.title')}
              </h3>
              <div className="space-y-3">
                {['message1', 'message2', 'message3', 'message4', 'message5'].map((msg) => (
                  <p key={msg} className="text-sm text-pink-600/90 leading-relaxed">
                    {t(`girls.empowermentSection.${msg}`)}
                  </p>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="font-display font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle size={20} className="text-pink-500" />
                {t('girls.quickTips.title')}
              </h3>
              <ul className="space-y-3">
                {['tip1', 'tip2', 'tip3', 'tip4', 'tip5'].map((tip) => (
                  <li key={tip} className="flex items-start gap-3">
                    <Heart size={16} className="text-pink-500 flex-shrink-0 mt-1" />
                    <span className="text-sm text-gray-600 leading-relaxed">
                      {t(`girls.quickTips.${tip}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Girls;
