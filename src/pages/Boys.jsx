import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Users,
  BookOpen,
  Heart,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronRight,
  ChevronDown,
  ArrowLeft,
  Award,
  Lightbulb,
  Activity,
  ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Boys = () => {
  const { t } = useTranslation();
  const [currentSection, setCurrentSection] = useState(0);
  const [expandedCard, setExpandedCard] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [completedSections, setCompletedSections] = useState([]);

  const sections = [
    { id: 'basics', icon: BookOpen, title: t('boys.basics.title') },
    { id: 'whyMiss', icon: Activity, title: t('boys.whyMiss.title') },
    { id: 'support', icon: Heart, title: t('boys.support.title') },
    { id: 'myths', icon: AlertCircle, title: t('boys.myths.title') },
    { id: 'quiz', icon: Award, title: t('boys.quiz.title') }
  ];

  const symptoms = [
    { key: 'cramps', icon: Activity },
    { key: 'tiredness', icon: Activity },
    { key: 'headaches', icon: Activity },
    { key: 'moodChanges', icon: Heart },
    { key: 'backPain', icon: Activity }
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
      if (quizAnswers[q.id] === t(`boys.quiz.${q.id}correct`)) {
        correct++;
      }
    });
    return correct;
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setShowQuizResults(false);
  };

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

      <header className="bg-blue-50 rounded-3xl p-6 md:p-10 mb-8 border border-secondary-200">
        <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 md:w-18 md:h-18 rounded-2xl bg-blue-500 flex items-center justify-center shadow-sm">
              <Users className="w-8 h-8 md:w-9 md:h-9 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-gray-900">
                {t('boys.title')}
              </h1>
              <p className="text-secondary-600 font-medium">{t('boys.subtitle')}</p>
            </div>
          </div>
          <div className="hidden md:block w-48 h-40 rounded-2xl bg-white flex items-center justify-center ml-auto">
            <p className="text-xs text-secondary-600/70 text-center p-4">Illustration: Supportive boy helping classmate</p>
          </div>
        </div>
        <p className="text-gray-600 mt-5 leading-relaxed max-w-3xl">
          {t('boys.intro')}
        </p>
      </header>

      <div className="grid lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 space-y-5">
          <div className="card sticky top-4">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-semibold text-gray-900">
                {t('boys.progress')}
              </h3>
              <span className="text-2xl font-bold text-secondary-600">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
              <div
                className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <nav className="space-y-2">
              {sections.map((section, index) => {
                const SectionIcon = section.icon;
                const isCompleted = completedSections.includes(index);
                const isCurrent = currentSection === index;

                return (
                  <button
                    key={section.id}
                    onClick={() => setCurrentSection(index)}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-xl text-left transition-all duration-300 touch-target ${
                      isCurrent
                        ? 'bg-blue-500 text-white shadow-sm'
                        : isCompleted
                        ? 'bg-sage-50 text-sage-700 hover:bg-sage-100'
                        : 'bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-secondary-700'
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

            <div className="mt-6 p-5 bg-blue-50 rounded-xl border border-secondary-200">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-secondary-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-secondary-700 leading-relaxed">
                  {t('boys.whyLearnContent')}
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
                    {t('boys.basics.title')}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {t('boys.basics.intro')}
                  </p>
                </div>

                <div className="bg-blue-50 border-l-4 border-secondary-500 p-6 rounded-r-2xl">
                  <h3 className="font-semibold text-secondary-800 mb-2 flex items-center gap-2">
                    <BookOpen size={20} className="text-secondary-500" />
                    {t('boys.basics.whatIsTitle')}
                  </h3>
                  <p className="text-secondary-700 text-sm leading-relaxed">
                    {t('boys.basics.whatIsText')}
                  </p>
                </div>

                <div className="bg-blue-50 border-l-4 border-secondary-400 p-6 rounded-r-2xl">
                  <h3 className="font-semibold text-secondary-800 mb-2 flex items-center gap-2">
                    <Lightbulb size={20} className="text-secondary-500" />
                    {t('boys.basics.whyHappensTitle')}
                  </h3>
                  <p className="text-secondary-700 text-sm leading-relaxed">
                    {t('boys.basics.whyHappensText')}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle size={20} className="text-secondary-500" />
                    {t('boys.basics.keyFacts')}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {['fact1', 'fact2', 'fact3', 'fact4', 'fact5'].map((fact, index) => (
                      <div
                        key={fact}
                        className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 hover:shadow-sm transition-all duration-300"
                      >
                        <div className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <span className="text-sm text-gray-600 leading-relaxed">
                          {t(`boys.basics.${fact}`)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-2xl border border-secondary-100">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {t('boys.basics.biologySectionTitle')}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {t('boys.basics.biologyText')}
                  </p>
                </div>
              </div>
            )}

            {currentSection === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-3">
                    {t('boys.whyMiss.title')}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {t('boys.whyMiss.intro')}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Activity size={20} className="text-blue-600" />
                    {t('boys.whyMiss.symptomsTitle')}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {symptoms.map(({ key, icon: Icon }) => (
                      <div
                        key={key}
                        className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => setExpandedCard(expandedCard === key ? null : key)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                              <Icon size={20} className="text-blue-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900">
                              {t(`boys.whyMiss.${key}`)}
                            </h4>
                          </div>
                          <ChevronDown
                            size={20}
                            className={`text-gray-500 transition-transform ${
                              expandedCard === key ? 'rotate-180' : ''
                            }`}
                          />
                        </div>
                        <div
                          className={`overflow-hidden transition-all ${
                            expandedCard === key ? 'max-h-40 mt-3' : 'max-h-0'
                          }`}
                        >
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {t(`boys.whyMiss.${key}Desc`)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-r-xl">
                  <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                    <ShieldCheck size={20} />
                    {t('boys.whyMiss.understanding')}
                  </h3>
                  <p className="text-amber-800 text-sm leading-relaxed">
                    {t('boys.whyMiss.understandingText')}
                  </p>
                </div>
              </div>
            )}

            {currentSection === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-3">
                    {t('boys.support.title')}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {t('boys.support.intro')}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-green-700 mb-4 flex items-center gap-2">
                      <CheckCircle size={20} />
                      {t('boys.support.doTitle')}
                    </h3>
                    <div className="space-y-3">
                      {['do1', 'do2', 'do3', 'do4', 'do5'].map((item) => (
                        <div
                          key={item}
                          className="p-4 bg-green-50 rounded-xl border border-green-200"
                        >
                          <h4 className="font-medium text-green-900 mb-1 text-sm">
                            {t(`boys.support.${item}`)}
                          </h4>
                          <p className="text-xs text-green-700">
                            {t(`boys.support.${item}Desc`)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-red-700 mb-4 flex items-center gap-2">
                      <XCircle size={20} />
                      {t('boys.support.dontTitle')}
                    </h3>
                    <div className="space-y-3">
                      {['dont1', 'dont2', 'dont3', 'dont4'].map((item) => (
                        <div
                          key={item}
                          className="p-4 bg-red-50 rounded-xl border border-red-200"
                        >
                          <h4 className="font-medium text-red-900 mb-1 text-sm">
                            {t(`boys.support.${item}`)}
                          </h4>
                          <p className="text-xs text-red-700">
                            {t(`boys.support.${item}Desc`)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
                    <Lightbulb size={20} />
                    {t('boys.support.realLife')}
                  </h3>
                  <div className="space-y-4">
                    {['scenario1', 'scenario2', 'scenario3'].map((scenario) => (
                      <div key={scenario} className="bg-white p-4 rounded-xl">
                        <p className="text-sm font-medium text-blue-900 mb-2">
                          {t(`boys.support.${scenario}`)}
                        </p>
                        <div className="flex items-start gap-2">
                          <ChevronRight size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-blue-700">
                            {t(`boys.support.${scenario}Action`)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentSection === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-3">
                    {t('boys.myths.title')}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {t('boys.myths.intro')}
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
                              {t(`boys.myths.${myth}`)}
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
                              {t(`boys.myths.fact${index + 1}`)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {currentSection === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-3 flex items-center gap-3">
                    <Award className="text-blue-600" size={32} />
                    {t('boys.quiz.title')}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {t('boys.quiz.intro')}
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
                          {qIndex + 1}. {t(`boys.quiz.${question.id}`)}
                        </h3>
                        <div className="space-y-2">
                          {question.options.map((option) => {
                            const optionLetter = option.slice(-2, -1);
                            return (
                              <button
                                key={option}
                                onClick={() =>
                                  setQuizAnswers({ ...quizAnswers, [question.id]: optionLetter })
                                }
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all touch-target ${
                                  quizAnswers[question.id] === optionLetter
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 bg-white hover:border-blue-300'
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <div
                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                      quizAnswers[question.id] === optionLetter
                                        ? 'border-blue-500 bg-blue-500'
                                        : 'border-gray-200'
                                    }`}
                                  >
                                    {quizAnswers[question.id] === optionLetter && (
                                      <CheckCircle size={16} className="text-white" />
                                    )}
                                  </div>
                                  <span className="text-sm text-gray-600">
                                    {t(`boys.quiz.${option}`)}
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
                      className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-target"
                    >
                      {t('boys.checkAnswer')}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200">
                      <Award className="w-20 h-20 text-blue-600 mx-auto mb-4" />
                      <h3 className="text-3xl font-bold text-blue-900 mb-2">
                        {t('boys.quiz.yourScore')}
                      </h3>
                      <p className="text-5xl font-bold text-blue-600 mb-4">
                        {calculateScore()} {t('boys.quiz.outOf')} {quizQuestions.length}
                      </p>
                      <p className="text-lg text-blue-800">
                        {calculateScore() >= 4
                          ? t('boys.quiz.excellent')
                          : calculateScore() >= 3
                          ? t('boys.quiz.good')
                          : t('boys.quiz.needsWork')}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {quizQuestions.map((question, qIndex) => {
                        const userAnswer = quizAnswers[question.id];
                        const correctAnswer = t(`boys.quiz.${question.id}correct`);
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
                                  {qIndex + 1}. {t(`boys.quiz.${question.id}`)}
                                </h4>
                                <p
                                  className={`text-sm mt-2 ${
                                    isCorrect ? 'text-green-700' : 'text-red-700'
                                  }`}
                                >
                                  {isCorrect ? t('boys.correct') : t('boys.incorrect')}
                                </p>
                                {!isCorrect && (
                                  <p className="text-sm text-green-700 mt-2">
                                    <strong>Correct answer:</strong>{' '}
                                    {t(`boys.quiz.q${qIndex + 1}${correctAnswer}`)}
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
                      className="w-full md:w-auto px-8 py-3 bg-blue-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all touch-target"
                    >
                      {t('boys.quiz.retakeQuiz')}
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
              {t('boys.previous')}
            </button>

            {currentSection < sections.length - 1 && (
              <button
                onClick={handleNext}
                className="btn-secondary"
              >
                {t('boys.next')}
              </button>
            )}

            {currentSection === sections.length - 1 && showQuizResults && (
              <Link
                to="/"
                className="btn px-8 py-4 bg-gradient-to-r from-sage-500 to-sage-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                {t('boys.completed')}
              </Link>
            )}
          </div>

          <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-secondary-200">
            <h3 className="font-display font-semibold text-secondary-700 mb-4 flex items-center gap-2">
              <Heart size={20} className="text-secondary-500" />
              {t('boys.summary.title')}
            </h3>
            <div className="space-y-3">
              {['point1', 'point2', 'point3', 'point4', 'point5'].map((point, index) => (
                <div key={point} className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-secondary-500 flex-shrink-0 mt-1" />
                  <span className="text-sm text-secondary-700 leading-relaxed">{t(`boys.summary.${point}`)}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Boys;
