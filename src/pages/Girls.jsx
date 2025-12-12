import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Heart,
  Calendar,
  Sparkles,
  Activity,
  ShoppingBag,
  ChevronRight,
  CheckCircle,
  ArrowLeft,
  XCircle,
  Info,
  User,
  Droplet,
  Sun,
  Wind,
  Smile,
  ChevronDown,
  AlertCircle,
  ChevronLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Girls = () => {
  const { t } = useTranslation();
  const [currentSection, setCurrentSection] = useState(0);
  const [selectedBodyPart, setSelectedBodyPart] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [periodDates, setPeriodDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

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

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const togglePeriodDate = (date) => {
    const dateStr = date.toDateString();
    if (periodDates.includes(dateStr)) {
      setPeriodDates(periodDates.filter(d => d !== dateStr));
    } else {
      setPeriodDates([...periodDates, dateStr]);
    }
  };

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

  const navigateMonth = (direction) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentMonth(newDate);
  };

  return (
    <div className="page-container animate-fade-in">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-text-muted hover:text-text-primary mb-4 transition-colors"
      >
        <ArrowLeft size={18} />
        <span className="text-sm">{t('common.backToHome')}</span>
      </Link>

      <header className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-6 md:p-8 mb-6 border border-pink-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-lg">
            <Heart className="w-7 h-7 md:w-8 md:h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-pink-900">
              {t('girls.title')}
            </h1>
            <p className="text-pink-700">{t('girls.subtitle')}</p>
          </div>
        </div>
        <p className="text-text-secondary text-sm md:text-base">
          {t('girls.intro')}
        </p>
      </header>

      <div className="grid lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1 space-y-4">
          <div className="card sticky top-4">
            <h3 className="font-display font-semibold text-text-primary mb-4">
              Sections
            </h3>
            <nav className="space-y-2">
              {sections.map((section, index) => {
                const SectionIcon = section.icon;
                const isCurrent = currentSection === index;

                return (
                  <button
                    key={section.id}
                    onClick={() => setCurrentSection(index)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all touch-target ${
                      isCurrent
                        ? 'bg-pink-500 text-white shadow-lg'
                        : 'bg-warm-50 text-text-secondary hover:bg-warm-100'
                    }`}
                  >
                    <SectionIcon size={20} className="flex-shrink-0" />
                    <span className="text-sm font-medium">{section.title}</span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-6 p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl border border-pink-200">
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-pink-900 text-sm mb-1">
                    {t('girls.empowerment')}
                  </h4>
                  <p className="text-xs text-pink-800">
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
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-text-primary mb-3">
                    {t('girls.understanding.title')}
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="bg-pink-50 border-l-4 border-pink-500 p-5 rounded-r-xl">
                    <h3 className="font-semibold text-pink-900 mb-2 flex items-center gap-2">
                      <Info size={20} />
                      {t('girls.understanding.whatIs')}
                    </h3>
                    <p className="text-pink-800 text-sm leading-relaxed">
                      {t('girls.understanding.whatIsText')}
                    </p>
                  </div>

                  <div className="bg-rose-50 border-l-4 border-rose-500 p-5 rounded-r-xl">
                    <h3 className="font-semibold text-rose-900 mb-2 flex items-center gap-2">
                      <Sparkles size={20} />
                      {t('girls.understanding.whyHappens')}
                    </h3>
                    <p className="text-rose-800 text-sm leading-relaxed">
                      {t('girls.understanding.whyHappensText')}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-5 bg-gradient-to-br from-warm-50 to-secondary-50 rounded-xl border border-warm-200">
                      <h3 className="font-semibold text-text-primary mb-2 flex items-center gap-2">
                        <Calendar size={20} className="text-pink-600" />
                        {t('girls.understanding.howLong')}
                      </h3>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {t('girls.understanding.howLongText')}
                      </p>
                    </div>

                    <div className="p-5 bg-gradient-to-br from-warm-50 to-secondary-50 rounded-xl border border-warm-200">
                      <h3 className="font-semibold text-text-primary mb-2 flex items-center gap-2">
                        <Heart size={20} className="text-pink-600" />
                        {t('girls.understanding.firstPeriod')}
                      </h3>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {t('girls.understanding.firstPeriodText')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentSection === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-text-primary mb-2">
                    {t('girls.bodyChanges.title')}
                  </h2>
                  <p className="text-text-secondary">{t('girls.bodyChanges.subtitle')}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {bodyParts.map(({ key, icon: Icon }) => {
                    const isSelected = selectedBodyPart === key;
                    return (
                      <div
                        key={key}
                        className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-pink-50 border-pink-500'
                            : 'bg-warm-50 border-warm-200 hover:border-pink-300'
                        }`}
                        onClick={() => setSelectedBodyPart(isSelected ? null : key)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              isSelected ? 'bg-pink-100' : 'bg-white'
                            }`}>
                              <Icon size={20} className={isSelected ? 'text-pink-600' : 'text-text-muted'} />
                            </div>
                            <h3 className="font-semibold text-text-primary">
                              {t(`girls.bodyChanges.${key}`)}
                            </h3>
                          </div>
                          <ChevronDown
                            size={20}
                            className={`text-text-muted transition-transform ${
                              isSelected ? 'rotate-180' : ''
                            }`}
                          />
                        </div>
                        <div
                          className={`overflow-hidden transition-all ${
                            isSelected ? 'max-h-40 mt-3' : 'max-h-0'
                          }`}
                        >
                          <p className="text-sm text-text-secondary leading-relaxed">
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
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-text-primary mb-3">
                    {t('girls.products.title')}
                  </h2>
                  <p className="text-text-secondary leading-relaxed">
                    {t('girls.products.intro')}
                  </p>
                </div>

                <div className="space-y-4">
                  {products.map(({ key, icon: Icon }) => {
                    const isSelected = selectedProduct === key;
                    return (
                      <div
                        key={key}
                        className="border border-warm-200 rounded-xl overflow-hidden hover:shadow-md transition-all"
                      >
                        <button
                          onClick={() => setSelectedProduct(isSelected ? null : key)}
                          className="w-full p-4 bg-gradient-to-r from-pink-50 to-rose-50 flex items-center justify-between touch-target"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
                              <Icon size={20} className="text-pink-600" />
                            </div>
                            <h3 className="font-semibold text-text-primary text-left">
                              {t(`girls.products.${key}`)}
                            </h3>
                          </div>
                          <ChevronDown
                            size={20}
                            className={`text-text-muted transition-transform ${
                              isSelected ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        {isSelected && (
                          <div className="p-4 bg-white">
                            <p className="text-sm text-text-secondary mb-3 leading-relaxed">
                              {t(`girls.products.${key}Desc`)}
                            </p>
                            <div className="p-3 bg-warm-50 rounded-lg">
                              <p className="text-xs text-text-secondary leading-relaxed">
                                {t(`girls.products.${key}How`)}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-5 rounded-xl border border-pink-200">
                  <h3 className="font-semibold text-pink-900 mb-2">
                    {t('girls.products.choosing')}
                  </h3>
                  <p className="text-sm text-pink-800 leading-relaxed">
                    {t('girls.products.choosingText')}
                  </p>
                </div>
              </div>
            )}

            {currentSection === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-text-primary mb-3">
                    {t('girls.painManagement.title')}
                  </h2>
                  <p className="text-text-secondary leading-relaxed">
                    {t('girls.painManagement.intro')}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {painManagementTips.map(({ key, icon: Icon }) => (
                    <div
                      key={key}
                      className="p-4 bg-gradient-to-br from-warm-50 to-secondary-50 rounded-xl border border-warm-200 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center flex-shrink-0">
                          <Icon size={20} className="text-pink-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-text-primary mb-1">
                            {t(`girls.painManagement.${key}`)}
                          </h3>
                          <p className="text-sm text-text-secondary leading-relaxed">
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
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-text-primary mb-3">
                    {t('girls.tracking.title')}
                  </h2>
                  <p className="text-text-secondary leading-relaxed">
                    {t('girls.tracking.intro')}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                      <Info size={20} className="text-pink-600" />
                      {t('girls.tracking.whyTrack')}
                    </h3>
                    <ul className="space-y-2">
                      {['reason1', 'reason2', 'reason3', 'reason4'].map((reason) => (
                        <li key={reason} className="flex items-start gap-2">
                          <CheckCircle size={16} className="text-pink-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-text-secondary">
                            {t(`girls.tracking.${reason}`)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                      <Calendar size={20} className="text-pink-600" />
                      {t('girls.tracking.howToTrack')}
                    </h3>
                    <ul className="space-y-2">
                      {['method1', 'method2', 'method3', 'method4'].map((method) => (
                        <li key={method} className="flex items-start gap-2">
                          <ChevronRight size={16} className="text-pink-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-text-secondary">
                            {t(`girls.tracking.${method}`)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-5 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl border border-pink-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-pink-900">
                      {t('girls.tracking.calendarTitle')}
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigateMonth(-1)}
                        className="p-2 hover:bg-pink-100 rounded-lg transition-colors touch-target"
                      >
                        <ChevronLeft size={20} className="text-pink-600" />
                      </button>
                      <span className="text-sm font-medium text-pink-900 min-w-[120px] text-center">
                        {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </span>
                      <button
                        onClick={() => navigateMonth(1)}
                        className="p-2 hover:bg-pink-100 rounded-lg transition-colors touch-target"
                      >
                        <ChevronRight size={20} className="text-pink-600" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-pink-800 mb-4">
                    {t('girls.tracking.calendarDesc')}
                  </p>

                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="text-center text-xs font-semibold text-pink-700 p-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {getDaysInMonth(currentMonth).map((date, index) => {
                      if (!date) {
                        return <div key={`empty-${index}`} className="aspect-square" />;
                      }

                      const isToday = date.toDateString() === new Date().toDateString();
                      const isPeriodDay = periodDates.includes(date.toDateString());

                      return (
                        <button
                          key={date.toDateString()}
                          onClick={() => togglePeriodDate(date)}
                          className={`aspect-square rounded-lg text-sm font-medium transition-all touch-target ${
                            isPeriodDay
                              ? 'bg-pink-500 text-white shadow-md'
                              : isToday
                              ? 'bg-pink-100 text-pink-900 border-2 border-pink-500'
                              : 'bg-white text-text-secondary hover:bg-pink-50'
                          }`}
                        >
                          {date.getDate()}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {currentSection === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-text-primary mb-3">
                    {t('girls.myths.title')}
                  </h2>
                  <p className="text-text-secondary leading-relaxed">
                    {t('girls.myths.intro')}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {['myth1', 'myth2', 'myth3', 'myth4', 'myth5', 'myth6', 'myth7', 'myth8'].map(
                    (myth, index) => (
                      <div key={myth} className="border border-warm-200 rounded-xl overflow-hidden">
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

          <div className="flex items-center justify-between mb-6 gap-4">
            <button
              onClick={handlePrevSection}
              disabled={currentSection === 0}
              className="px-6 py-3 bg-warm-100 text-text-primary rounded-xl font-medium hover:bg-warm-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-target"
            >
              {t('boys.previous')}
            </button>

            {currentSection < sections.length - 1 ? (
              <button
                onClick={handleNextSection}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all touch-target"
              >
                {t('boys.next')}
              </button>
            ) : (
              <Link
                to="/"
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all touch-target"
              >
                {t('boys.completed')}
              </Link>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="card bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-200">
              <h3 className="font-display font-semibold text-pink-900 mb-3 flex items-center gap-2">
                <Sparkles size={20} />
                {t('girls.empowermentSection.title')}
              </h3>
              <div className="space-y-3">
                {['message1', 'message2', 'message3', 'message4', 'message5'].map((msg) => (
                  <p key={msg} className="text-sm text-pink-800 leading-relaxed">
                    {t(`girls.empowermentSection.${msg}`)}
                  </p>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="font-display font-semibold text-text-primary mb-3 flex items-center gap-2">
                <CheckCircle size={20} className="text-pink-600" />
                {t('girls.quickTips.title')}
              </h3>
              <ul className="space-y-2">
                {['tip1', 'tip2', 'tip3', 'tip4', 'tip5'].map((tip) => (
                  <li key={tip} className="flex items-start gap-2">
                    <Heart size={16} className="text-pink-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-text-secondary">
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
