import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearch } from '../contexts/SearchContext';
import {
  GraduationCap, BookOpen, Heart, Users,
  CircleAlert as AlertCircle,
  CircleCheck as CheckCircle,
  Circle as XCircle,
  ChevronRight, ArrowLeft, Award, Lightbulb,
  Activity, ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Teachers = () => {
  const { t } = useTranslation();
  const { searchQuery } = useSearch();
  const [currentSection, setCurrentSection] = useState(0);
  const [expandedCard, setExpandedCard] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [completedSections, setCompletedSections] = useState([]);

  const sections = [
    { id: 'basics', icon: BookOpen, title: t('teachers.basics.title') },
    { id: 'classroom', icon: ShieldCheck, title: t('teachers.classroom.title') },
    { id: 'supporting', icon: Heart, title: t('teachers.supporting.title') },
    { id: 'boys', icon: Users, title: t('teachers.boys.title') },
    { id: 'myths', icon: AlertCircle, title: t('teachers.myths.title') },
    { id: 'quiz', icon: Award, title: t('teachers.quiz.title') }
  ];

  const strategies = [
    { key: 'strategy1', icon: Activity },
    { key: 'strategy2', icon: Heart },
    { key: 'strategy3', icon: ShieldCheck },
    { key: 'strategy4', icon: Lightbulb },
    { key: 'strategy5', icon: Activity }
  ];

  const quizQuestions = [
    { id: 'q1', options: ['q1a', 'q1b', 'q1c', 'q1d'] },
    { id: 'q2', options: ['q2a', 'q2b', 'q2c', 'q2d'] },
    { id: 'q3', options: ['q3a', 'q3b', 'q3c', 'q3d'] },
    { id: 'q4', options: ['q4a', 'q4b', 'q4c', 'q4d'] },
    { id: 'q5', options: ['q5a', 'q5b', 'q5c', 'q5d'] }
  ];

  const markSectionComplete = (sectionIndex) => {
    if (!completedSections.includes(sectionIndex)) {
      setCompletedSections([...completedSections, sectionIndex]);
    }
  };

  const handleNext = () => {
    markSectionComplete(currentSection);
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleQuizSubmit = () => {
    setShowQuizResults(true);
    markSectionComplete(currentSection);
  };

  const calculateScore = () => {
    let correct = 0;
    quizQuestions.forEach((q) => {
      if (quizAnswers[q.id] === t(`teachers.quiz.${q.id}correct`)) {
        correct++;
      }
    });
    return correct;
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setShowQuizResults(false);
  };

  const filteredSections = useMemo(() => {
    if (!searchQuery || !searchQuery.trim()) {
      return sections.map((_, i) => i);
    }
    return sections
      .map((section, index) => {
        const sectionContent = [
          section.title,
          t(`teachers.${section.id}.intro`) || ''
        ].join(' ').toLowerCase();
        if (sectionContent.includes(searchQuery.toLowerCase())) {
          return { index, matches: true };
        }
        return { index, matches: false };
      })
      .filter((s) => s.matches)
      .map((s) => s.index);
  }, [searchQuery, sections, t]);

  useEffect(() => {
    if (filteredSections.length > 0 && !filteredSections.includes(currentSection)) {
      setCurrentSection(filteredSections[0]);
    }
  }, [filteredSections, currentSection]);

  const progress = ((completedSections.length / sections.length) * 100).toFixed(0);

  return (
    <div className="page-container animate-fade-in">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-4 transition-colors"
      >
        <ArrowLeft size={18} />
        <span className="text-sm">{t('common.backToHome')}</span>
      </Link>

      <header className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 mb-8">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <div className="flex items-center gap-6 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-green-600 flex items-center justify-center shadow-lg">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold text-green-700">
                  {t('teachers.title')}
                </h1>
                <p className="text-green-600 font-medium">{t('teachers.subtitle')}</p>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {t('teachers.intro')}
            </p>
          </div>

          <div className="flex justify-center mt-6 md:mt-0">
            <img
              src="/hero-classroom.png"
              alt="Teacher in inclusive classroom supporting students"
              className="w-full max-w-xs md:max-w-md rounded-2xl"
            />
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 space-y-5">
          <div className="card sticky top-4">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-semibold text-gray-900">
                {t('teachers.progress')}
              </h3>
              <span className="text-2xl font-bold text-green-700">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
              <div
                className="bg-green-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <nav className="space-y-2">
              {sections.map((section, index) => {
                const SectionIcon = section.icon;
                const isCompleted = completedSections.includes(index);
                const isCurrent = currentSection === index;
                const isVisible = filteredSections.includes(index);

                if (!isVisible && searchQuery) return null;

                return (
                  <button
                    key={section.id}
                    onClick={() => setCurrentSection(index)}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-xl text-left transition-all duration-300 touch-target ${
                      isCurrent
                        ? 'bg-green-600 text-white shadow-sm'
                        : isCompleted
                        ? 'bg-green-50 text-green-700 hover:bg-green-100'
                        : 'bg-gray-50 text-gray-600 hover:bg-green-50 hover:text-green-700'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle size={20} className="flex-shrink-0" />
                    ) : (
                      <SectionIcon size={20} className="flex-shrink-0" />
                    )}
                    <span className="text-sm font-medium flex-1">{section.title}</span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-6 p-5 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-green-700 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-green-800 leading-relaxed">
                  {t('teachers.whyLearnContent')}
                </p>
              </div>
            </div>
          </div>
        </aside>

        <main className="lg:col-span-3">
          <div className="card mb-8">

            {currentSection === 0 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-3">
                    {t('teachers.basics.title')}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {t('teachers.basics.intro')}
                  </p>
                </div>

                <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-r-2xl">
                  <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                    <BookOpen size={20} className="text-green-600" />
                    {t('teachers.basics.whatIsTitle')}
                  </h3>
                  <p className="text-green-800 text-sm leading-relaxed">
                    {t('teachers.basics.whatIsText')}
                  </p>
                </div>

                <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-2xl">
                  <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                    <Lightbulb size={20} className="text-green-600" />
                    {t('teachers.basics.whyMattersTitle')}
                  </h3>
                  <p className="text-green-800 text-sm leading-relaxed">
                    {t('teachers.basics.whyMattersText')}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle size={20} className="text-green-600" />
                    {t('teachers.basics.keyFacts')}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {['fact1', 'fact2', 'fact3', 'fact4', 'fact5'].map((fact, index) => (
                      <div
                        key={fact}
                        className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 hover:shadow-sm transition-all duration-300"
                      >
                        <div className="w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <span className="text-sm text-gray-600 leading-relaxed">
                          {t(`teachers.basics.${fact}`)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {t('teachers.basics.biologySectionTitle')}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {t('teachers.basics.biologyText')}
                  </p>
                </div>
              </div>
            )}

            {currentSection === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-3">
                    {t('teachers.classroom.title')}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {t('teachers.classroom.intro')}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-green-700 mb-4 flex items-center gap-2">
                      <CheckCircle size={20} />
                      {t('teachers.classroom.doTitle')}
                    </h3>
                    <div className="space-y-3">
                      {['do1', 'do2', 'do3', 'do4', 'do5'].map((item) => (
                        <div key={item} className="p-4 bg-green-50 rounded-xl border border-green-200">
                          <h4 className="font-medium text-green-900 mb-1 text-sm">
                            {t(`teachers.classroom.${item}`)}
                          </h4>
                          <p className="text-xs text-green-700">
                            {t(`teachers.classroom.${item}Desc`)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-red-700 mb-4 flex items-center gap-2">
                      <XCircle size={20} />
                      {t('teachers.classroom.dontTitle')}
                    </h3>
                    <div className="space-y-3">
                      {['dont1', 'dont2', 'dont3', 'dont4'].map((item) => (
                        <div key={item} className="p-4 bg-red-50 rounded-xl border border-red-200">
                          <h4 className="font-medium text-red-900 mb-1 text-sm">
                            {t(`teachers.classroom.${item}`)}
                          </h4>
                          <p className="text-xs text-red-700">
                            {t(`teachers.classroom.${item}Desc`)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-xl border border-green-200">
                  <h3 className="font-semibold text-green-900 mb-4 flex items-center gap-2">
                    <Lightbulb size={20} />
                    {t('teachers.classroom.realLife')}
                  </h3>
                  <div className="space-y-4">
                    {['scenario1', 'scenario2', 'scenario3'].map((scenario) => (
                      <div key={scenario} className="bg-white p-4 rounded-xl">
                        <p className="text-sm font-medium text-green-900 mb-2">
                          {t(`teachers.classroom.${scenario}`)}
                        </p>
                        <div className="flex items-start gap-2">
                          <ChevronRight size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-green-700">
                            {t(`teachers.classroom.${scenario}Action`)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentSection === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-3">
                    {t('teachers.supporting.title')}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {t('teachers.supporting.intro')}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Activity size={20} className="text-green-600" />
                    {t('teachers.supporting.strategiesTitle')}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {strategies.map(({ key, icon: Icon }) => (
                      <div
                        key={key}
                        className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => setExpandedCard(expandedCard === key ? null : key)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                              <Icon size={20} className="text-green-700" />
                            </div>
                            <h4 className="font-semibold text-gray-900">
                              {t(`teachers.supporting.${key}`)}
                            </h4>
                          </div>
                          <ChevronRight
                            size={18}
                            className={`text-gray-400 transition-transform ${
                              expandedCard === key ? 'rotate-90' : ''
                            }`}
                          />
                        </div>
                        <div
                          className={`overflow-hidden transition-all ${
                            expandedCard === key ? 'max-h-40 mt-3' : 'max-h-0'
                          }`}
                        >
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {t(`teachers.supporting.${key}Desc`)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-r-xl">
                  <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                    <ShieldCheck size={20} />
                    {t('teachers.supporting.absenceNote')}
                  </h3>
                  <p className="text-amber-800 text-sm leading-relaxed">
                    {t('teachers.supporting.absenceNoteText')}
                  </p>
                </div>
              </div>
            )}

            {currentSection === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-3">
                    {t('teachers.boys.title')}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {t('teachers.boys.intro')}
                  </p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-2xl">
                  <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <Users size={20} className="text-blue-600" />
                    {t('teachers.boys.whyTitle')}
                  </h3>
                  <p className="text-blue-800 text-sm leading-relaxed">
                    {t('teachers.boys.whyText')}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle size={20} className="text-green-600" />
                    {t('teachers.boys.talkingPoints')}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {['point1', 'point2', 'point3', 'point4', 'point5'].map((point, index) => (
                      <div
                        key={point}
                        className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 hover:shadow-sm transition-all"
                      >
                        <div className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <span className="text-sm text-gray-600 leading-relaxed">
                          {t(`teachers.boys.${point}`)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl border border-blue-200">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Lightbulb size={20} className="text-blue-600" />
                    {t('teachers.boys.activitiesTitle')}
                  </h3>
                  <div className="space-y-4">
                    {['activity1', 'activity2', 'activity3'].map((activity) => (
                      <div key={activity} className="bg-white p-4 rounded-xl">
                        <p className="text-sm font-medium text-gray-900 mb-2">
                          {t(`teachers.boys.${activity}`)}
                        </p>
                        <div className="flex items-start gap-2">
                          <ChevronRight size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-gray-600">
                            {t(`teachers.boys.${activity}Desc`)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentSection === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-3">
                    {t('teachers.myths.title')}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {t('teachers.myths.intro')}
                  </p>
                </div>

                <div className="space-y-4">
                  {['myth1', 'myth2', 'myth3', 'myth4', 'myth5', 'myth6', 'myth7', 'myth8'].map(
                    (myth, index) => (
                      <div key={myth} className="border border-gray-200 rounded-xl overflow-hidden">
                        <div className="flex items-start gap-3 p-4 bg-red-50">
                          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-bold text-red-600 uppercase">
                              Myth #{index + 1}
                            </span>
                            <p className="text-sm text-red-900 font-medium mt-1">
                              {t(`teachers.myths.${myth}`)}
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
                              {t(`teachers.myths.fact${index + 1}`)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {currentSection === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-3 flex items-center gap-3">
                    <Award className="text-green-600" size={32} />
                    {t('teachers.quiz.title')}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {t('teachers.quiz.intro')}
                  </p>
                </div>

                {!showQuizResults ? (
                  <div className="space-y-6">
                    {quizQuestions.map((question, qIndex) => (
                      <div
                        key={question.id}
                        className="p-5 bg-white rounded-xl border border-gray-200"
                      >
                        <h3 className="font-semibold text-gray-900 mb-4">
                          {qIndex + 1}. {t(`teachers.quiz.${question.id}`)}
                        </h3>
                        <div className="space-y-2">
                          {question.options.map((option) => {
                            const optionLetter = option.slice(-1);
                            return (
                              <button
                                key={option}
                                onClick={() =>
                                  setQuizAnswers({ ...quizAnswers, [question.id]: optionLetter })
                                }
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all touch-target ${
                                  quizAnswers[question.id] === optionLetter
                                    ? 'border-green-600 bg-green-50'
                                    : 'border-gray-200 bg-white hover:border-green-300'
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <div
                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                      quizAnswers[question.id] === optionLetter
                                        ? 'border-green-600 bg-green-600'
                                        : 'border-gray-200'
                                    }`}
                                  >
                                    {quizAnswers[question.id] === optionLetter && (
                                      <CheckCircle size={16} className="text-white" />
                                    )}
                                  </div>
                                  <span className="text-sm text-gray-600">
                                    {t(`teachers.quiz.${option}`)}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={handleQuizSubmit}
                      disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                      className="w-full md:w-auto px-8 py-3 bg-green-600 text-white rounded-xl font-semibold shadow-lg hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-target"
                    >
                      {t('teachers.checkAnswer')}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center p-8 bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl border border-green-200">
                      <Award className="w-20 h-20 text-green-600 mx-auto mb-4" />
                      <h3 className="text-3xl font-bold text-green-900 mb-2">
                        {t('teachers.quiz.yourScore')}
                      </h3>
                      <p className="text-5xl font-bold text-green-600 mb-4">
                        {calculateScore()} {t('teachers.quiz.outOf')} {quizQuestions.length}
                      </p>
                      <p className="text-lg text-green-800">
                        {calculateScore() >= 4
                          ? t('teachers.quiz.excellent')
                          : calculateScore() >= 3
                          ? t('teachers.quiz.good')
                          : t('teachers.quiz.needsWork')}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {quizQuestions.map((question, qIndex) => {
                        const userAnswer = quizAnswers[question.id];
                        const correctAnswer = t(`teachers.quiz.${question.id}correct`);
                        const isCorrect = userAnswer === correctAnswer;

                        return (
                          <div
                            key={question.id}
                            className={`p-5 rounded-xl border-2 ${
                              isCorrect
                                ? 'bg-green-50 border-green-300'
                                : 'bg-red-50 border-red-300'
                            }`}
                          >
                            <div className="flex items-start gap-3 mb-3">
                              {isCorrect ? (
                                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                              ) : (
                                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                              )}
                              <div>
                                <h4 className="font-semibold text-gray-900">
                                  {qIndex + 1}. {t(`teachers.quiz.${question.id}`)}
                                </h4>
                                <p
                                  className={`text-sm mt-2 ${
                                    isCorrect ? 'text-green-700' : 'text-red-700'
                                  }`}
                                >
                                  {isCorrect ? t('teachers.correct') : t('teachers.incorrect')}
                                </p>
                                {!isCorrect && (
                                  <p className="text-sm text-green-700 mt-2">
                                    <strong>Correct answer:</strong>{' '}
                                    {t(`teachers.quiz.q${qIndex + 1}${correctAnswer}`)}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <button
                      onClick={resetQuiz}
                      className="w-full md:w-auto px-8 py-3 bg-green-600 text-white rounded-xl font-semibold shadow-lg hover:bg-green-700 transition-all touch-target"
                    >
                      {t('teachers.quiz.retakeQuiz')}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-8 gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentSection === 0}
              className="btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('teachers.previous')}
            </button>

            {currentSection < sections.length - 1 && (
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors shadow-lg"
              >
                {t('teachers.next')}
              </button>
            )}

            {currentSection === sections.length - 1 && showQuizResults && (
              <Link
                to="/"
                className="btn px-8 py-4 bg-green-600 text-white rounded-xl font-semibold shadow-lg hover:bg-green-700 transition-all"
              >
                {t('teachers.completed')}
              </Link>
            )}
          </div>

          <div className="mt-8 p-6 bg-green-50 rounded-2xl border border-green-200">
            <h3 className="font-display font-semibold text-green-800 mb-4 flex items-center gap-2">
              <Heart size={20} className="text-green-600" />
              {t('teachers.summary.title')}
            </h3>
            <div className="space-y-3">
              {['point1', 'point2', 'point3', 'point4', 'point5'].map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-sm text-green-800 leading-relaxed">
                    {t(`teachers.summary.${point}`)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Teachers;
