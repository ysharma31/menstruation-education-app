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

      <header className="gradient-warm rounded-3xl p-6 md:p-10 mb-8 border border-primary-100">
        <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 md:w-18 md:h-18 rounded-2xl gradient-primary flex items-center justify-center shadow-warm">
              <Heart className="w-8 h-8 md:w-9 md:h-9 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-text-primary">
                {t('girls.title')}
              </h1>
              <p className="text-primary-600 font-medium">{t('girls.subtitle')}</p>
            </div>
          </div>
          <div className="hidden md:block w-48 h-40 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center ml-auto">
            <p className="text-xs text-primary-600/70 text-center p-4">Illustration: Confident girl feeling empowered</p>
          </div>
        </div>
        <p className="text-text-secondary mt-5 leading-relaxed max-w-3xl">
          {t('girls.intro')}
        </p>
      </header>

      <div className="grid lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 space-y-5">
          <div className="card-glass sticky top-4">
            <h3 className="font-display font-semibold text-text-primary mb-5">
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
                    className={`w-full flex items-center gap-3 p-3.5 rounded-xl text-left transition-all duration-300 touch-target ${
                      isCurrent
                        ? 'gradient-primary text-white shadow-warm'
                        : 'bg-warm-50 text-text-secondary hover:bg-primary-50 hover:text-primary-700'
                    }`}
                  >
                    <SectionIcon size={20} className="flex-shrink-0" />
                    <span className="text-sm font-medium">{section.title}</span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-6 p-5 gradient-warm rounded-xl border border-primary-100">
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-primary-700 text-sm mb-1">
                    {t('girls.empowerment')}
                  </h4>
                  <p className="text-xs text-primary-600/80 leading-relaxed">
                    {t('girls.empowermentText')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="lg:col-span-3">
          <div className="card-glass mb-8">
            {currentSection === 0 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-text-primary mb-3">
                    {t('girls.understanding.title')}
                  </h2>
                </div>

                <div className="space-y-5">
                  <div className="bg-primary-50 border-l-4 border-primary-500 p-6 rounded-r-2xl">
                    <h3 className="font-semibold text-primary-800 mb-2 flex items-center gap-2">
                      <Info size={20} className="text-primary-500" />
                      {t('girls.understanding.whatIs')}
                    </h3>
                    <p className="text-primary-700 text-sm leading-relaxed">
                      {t('girls.understanding.whatIsText')}
                    </p>
                  </div>

                  <div className="bg-primary-50/70 border-l-4 border-primary-400 p-6 rounded-r-2xl">
                    <h3 className="font-semibold text-primary-800 mb-2 flex items-center gap-2">
                      <Sparkles size={20} className="text-primary-500" />
                      {t('girls.understanding.whyHappens')}
                    </h3>
                    <p className="text-primary-700 text-sm leading-relaxed">
                      {t('girls.understanding.whyHappensText')}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-warm-100 shadow-soft">
                      <h3 className="font-semibold text-text-primary mb-2 flex items-center gap-2">
                        <Calendar size={20} className="text-primary-500" />
                        {t('girls.understanding.howLong')}
                      </h3>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {t('girls.understanding.howLongText')}
                      </p>
                    </div>

                    <div className="p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-warm-100 shadow-soft">
                      <h3 className="font-semibold text-text-primary mb-2 flex items-center gap-2">
                        <Heart size={20} className="text-primary-500" />
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

                <div className="grid md:grid-cols-2 gap-5">
                  {bodyParts.map(({ key, icon: Icon }) => {
                    const isSelected = selectedBodyPart === key;
                    return (
                      <div
                        key={key}
                        className={`p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                          isSelected
                            ? 'bg-primary-50 border-primary-400 shadow-warm'
                            : 'bg-white/60 border-warm-200 hover:border-primary-300 hover:shadow-soft'
                        }`}
                        onClick={() => setSelectedBodyPart(isSelected ? null : key)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                              isSelected ? 'bg-primary-100' : 'bg-warm-50'
                            }`}>
                              <Icon size={20} className={isSelected ? 'text-primary-600' : 'text-text-muted'} />
                            </div>
                            <h3 className="font-semibold text-text-primary">
                              {t(`girls.bodyChanges.${key}`)}
                            </h3>
                          </div>
                          <ChevronDown
                            size={20}
                            className={`text-text-muted transition-transform duration-300 ${
                              isSelected ? 'rotate-180' : ''
                            }`}
                          />
                        </div>
                        <div
                          className={`overflow-hidden transition-all duration-300 ${
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
                        className="border border-warm-200 rounded-2xl overflow-hidden hover:shadow-soft transition-all duration-300"
                      >
                        <button
                          onClick={() => setSelectedProduct(isSelected ? null : key)}
                          className="w-full p-5 gradient-warm flex items-center justify-between touch-target"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-xl bg-primary-100 flex items-center justify-center">
                              <Icon size={20} className="text-primary-600" />
                            </div>
                            <h3 className="font-semibold text-text-primary text-left">
                              {t(`girls.products.${key}`)}
                            </h3>
                          </div>
                          <ChevronDown
                            size={20}
                            className={`text-text-muted transition-transform duration-300 ${
                              isSelected ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        {isSelected && (
                          <div className="p-5 bg-white/80">
                            <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                              {t(`girls.products.${key}Desc`)}
                            </p>
                            <div className="p-4 bg-warm-50 rounded-xl">
                              <p className="text-sm text-text-secondary leading-relaxed">
                                {t(`girls.products.${key}How`)}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="gradient-warm p-6 rounded-2xl border border-primary-100">
                  <h3 className="font-semibold text-primary-700 mb-2">
                    {t('girls.products.choosing')}
                  </h3>
                  <p className="text-sm text-primary-600/90 leading-relaxed">
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

                <div className="grid md:grid-cols-2 gap-5">
                  {painManagementTips.map(({ key, icon: Icon }) => (
                    <div
                      key={key}
                      className="p-5 bg-white/60 backdrop-blur-sm rounded-2xl border border-warm-100 hover:shadow-soft transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                          <Icon size={20} className="text-primary-600" />
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

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                      <Info size={20} className="text-primary-500" />
                      {t('girls.tracking.whyTrack')}
                    </h3>
                    <ul className="space-y-3">
                      {['reason1', 'reason2', 'reason3', 'reason4'].map((reason) => (
                        <li key={reason} className="flex items-start gap-3">
                          <CheckCircle size={16} className="text-primary-500 flex-shrink-0 mt-1" />
                          <span className="text-sm text-text-secondary leading-relaxed">
                            {t(`girls.tracking.${reason}`)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                      <Calendar size={20} className="text-primary-500" />
                      {t('girls.tracking.howToTrack')}
                    </h3>
                    <ul className="space-y-3">
                      {['method1', 'method2', 'method3', 'method4'].map((method) => (
                        <li key={method} className="flex items-start gap-3">
                          <ChevronRight size={16} className="text-primary-500 flex-shrink-0 mt-1" />
                          <span className="text-sm text-text-secondary leading-relaxed">
                            {t(`girls.tracking.${method}`)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-6 gradient-warm rounded-2xl border border-primary-100">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-semibold text-primary-700">
                      {t('girls.tracking.calendarTitle')}
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigateMonth(-1)}
                        className="p-2.5 hover:bg-primary-100 rounded-xl transition-colors touch-target"
                      >
                        <ChevronLeft size={20} className="text-primary-600" />
                      </button>
                      <span className="text-sm font-medium text-primary-700 min-w-[120px] text-center">
                        {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </span>
                      <button
                        onClick={() => navigateMonth(1)}
                        className="p-2.5 hover:bg-primary-100 rounded-xl transition-colors touch-target"
                      >
                        <ChevronRight size={20} className="text-primary-600" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-primary-600/80 mb-5">
                    {t('girls.tracking.calendarDesc')}
                  </p>

                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="text-center text-xs font-semibold text-primary-600 p-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1.5">
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
                          className={`aspect-square rounded-xl text-sm font-medium transition-all duration-300 touch-target ${
                            isPeriodDay
                              ? 'gradient-primary text-white shadow-warm'
                              : isToday
                              ? 'bg-primary-100 text-primary-700 border-2 border-primary-400'
                              : 'bg-white text-text-secondary hover:bg-primary-50'
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

          <div className="flex items-center justify-between mb-8 gap-4">
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
                className="btn-primary"
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

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="card-glass gradient-warm border border-primary-100">
              <h3 className="font-display font-semibold text-primary-700 mb-4 flex items-center gap-2">
                <Sparkles size={20} className="text-primary-500" />
                {t('girls.empowermentSection.title')}
              </h3>
              <div className="space-y-3">
                {['message1', 'message2', 'message3', 'message4', 'message5'].map((msg) => (
                  <p key={msg} className="text-sm text-primary-600/90 leading-relaxed">
                    {t(`girls.empowermentSection.${msg}`)}
                  </p>
                ))}
              </div>
            </div>

            <div className="card-glass">
              <h3 className="font-display font-semibold text-text-primary mb-4 flex items-center gap-2">
                <CheckCircle size={20} className="text-primary-500" />
                {t('girls.quickTips.title')}
              </h3>
              <ul className="space-y-3">
                {['tip1', 'tip2', 'tip3', 'tip4', 'tip5'].map((tip) => (
                  <li key={tip} className="flex items-start gap-3">
                    <Heart size={16} className="text-primary-500 flex-shrink-0 mt-1" />
                    <span className="text-sm text-text-secondary leading-relaxed">
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
