import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  MessageCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQ = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openQuestions, setOpenQuestions] = useState(new Set(['q1']));

  const categories = [
    { id: 'all', label: t('faq.categories.all') },
    { id: 'basics', label: t('faq.categories.basics') },
    { id: 'health', label: t('faq.categories.health') },
    { id: 'products', label: t('faq.categories.products') },
    { id: 'emotions', label: t('faq.categories.emotions') }
  ];

  const filteredQuestions = useMemo(() => {
    const questions = [
      {
        id: 'q1',
        question: t('faq.questions.q1'),
        answer: t('faq.questions.a1'),
        category: 'basics'
      },
      {
        id: 'q2',
        question: t('faq.questions.q2'),
        answer: t('faq.questions.a2'),
        category: 'basics'
      },
      {
        id: 'q3',
        question: t('faq.questions.q3'),
        answer: t('faq.questions.a3'),
        category: 'health'
      },
      {
        id: 'q4',
        question: t('faq.questions.q4'),
        answer: t('faq.questions.a4'),
        category: 'products'
      },
      {
        id: 'q5',
        question: t('faq.questions.q5'),
        answer: t('faq.questions.a5'),
        category: 'emotions'
      },
      {
        id: 'q6',
        question: t('faq.questions.q6'),
        answer: t('faq.questions.a6'),
        category: 'health'
      },
      {
        id: 'q7',
        question: t('faq.questions.q7'),
        answer: t('faq.questions.a7'),
        category: 'health'
      },
      {
        id: 'q8',
        question: t('faq.questions.q8'),
        answer: t('faq.questions.a8'),
        category: 'basics'
      }
    ];

    return questions.filter((q) => {
      const matchesCategory = activeCategory === 'all' || q.category === activeCategory;
      const matchesSearch = searchQuery === '' ||
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, t]);

  const toggleQuestion = (id) => {
    setOpenQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="page-container animate-fade-in">
      {/* Back Link */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-text-muted hover:text-text-primary mb-4 transition-colors"
      >
        <ArrowLeft size={18} />
        <span className="text-sm">{t('common.backToHome')}</span>
      </Link>

      {/* Header */}
      <header className="bg-gradient-to-r from-secondary-50 to-orange-100 rounded-2xl p-6 md:p-8 mb-6 border border-secondary-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center shadow-lg">
            <HelpCircle className="w-7 h-7 md:w-8 md:h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-secondary-700">
              {t('faq.title')}
            </h1>
            <p className="text-secondary-600/70">{t('faq.subtitle')}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            placeholder={t('faq.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-12"
          />
        </div>
      </header>

      {/* Category Tabs */}
      <div className="mb-6 -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all duration-200 touch-target font-medium text-sm ${
                activeCategory === cat.id
                  ? 'bg-secondary-500 text-white shadow-lg'
                  : 'bg-white text-text-secondary hover:bg-secondary-50 border border-warm-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Questions List */}
        <div className="lg:col-span-2 space-y-3">
          {filteredQuestions.length > 0 ? (
            filteredQuestions.map((q) => (
              <div
                key={q.id}
                className="card cursor-pointer hover:shadow-warm"
                onClick={() => toggleQuestion(q.id)}
              >
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-secondary-500 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-text-primary pr-4">
                        {q.question}
                      </h3>
                      {openQuestions.has(q.id) ? (
                        <ChevronUp className="w-5 h-5 text-text-muted flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-text-muted flex-shrink-0" />
                      )}
                    </div>
                    {openQuestions.has(q.id) && (
                      <div className="mt-3 pt-3 border-t border-warm-200">
                        <p className="text-text-secondary text-sm leading-relaxed">
                          {q.answer}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="card text-center py-8">
              <HelpCircle className="w-12 h-12 text-text-muted mx-auto mb-3" />
              <p className="text-text-secondary">{t('faq.noResults')}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Still Have Questions Card */}
          <div className="card bg-gradient-to-br from-primary-50 to-secondary-50 border border-primary-200">
            <MessageCircle className="w-8 h-8 text-primary-500 mb-3" />
            <h3 className="font-display font-semibold text-text-primary mb-2">
              {t('faq.stillHaveQuestions')}
            </h3>
            <p className="text-sm text-text-secondary mb-4">
              {t('faq.askUs')}
            </p>
            <Link to="/ask" className="btn-primary w-full">
              {t('navigation.ask')}
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="card">
            <h3 className="font-display font-semibold text-text-primary mb-3">
              Quick Facts
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-warm-50 rounded-xl">
                <p className="text-2xl font-bold text-primary-500">3-7</p>
                <p className="text-xs text-text-muted">Days per period (average)</p>
              </div>
              <div className="p-3 bg-warm-50 rounded-xl">
                <p className="text-2xl font-bold text-primary-500">21-35</p>
                <p className="text-xs text-text-muted">Days per cycle</p>
              </div>
              <div className="p-3 bg-warm-50 rounded-xl">
                <p className="text-2xl font-bold text-primary-500">9-16</p>
                <p className="text-xs text-text-muted">Typical age for first period</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
