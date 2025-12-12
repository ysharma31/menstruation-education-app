import { useState, useMemo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Share2,
  ArrowUp,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQ = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openQuestions, setOpenQuestions] = useState(new Set(['q1']));
  const [expandedAnswers, setExpandedAnswers] = useState(new Set());
  const [feedback, setFeedback] = useState({});
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const topRef = useRef(null);

  const categories = [
    { id: 'all', label: t('faq.categories.all') },
    { id: 'basics', label: t('faq.categories.basics') },
    { id: 'health', label: t('faq.categories.health') },
    { id: 'hygiene', label: t('faq.categories.hygiene') },
    { id: 'school', label: t('faq.categories.school') },
    { id: 'emotions', label: t('faq.categories.emotions') },
    { id: 'myths', label: t('faq.categories.myths') }
  ];

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Back to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const allQuestions = useMemo(() => [
    // Basics
    { id: 'q1', question: t('faq.questions.q1'), answer: t('faq.questions.a1'), category: 'basics' },
    { id: 'q2', question: t('faq.questions.q2'), answer: t('faq.questions.a2'), category: 'basics' },
    { id: 'q3', question: t('faq.questions.q3'), answer: t('faq.questions.a3'), category: 'basics' },
    { id: 'q4', question: t('faq.questions.q4'), answer: t('faq.questions.a4'), category: 'basics' },
    { id: 'q18', question: t('faq.questions.q18'), answer: t('faq.questions.a18'), category: 'basics' },

    // Health
    { id: 'q5', question: t('faq.questions.q5'), answer: t('faq.questions.a5'), category: 'health' },
    { id: 'q6', question: t('faq.questions.q6'), answer: t('faq.questions.a6'), category: 'health' },
    { id: 'q7', question: t('faq.questions.q7'), answer: t('faq.questions.a7'), category: 'health' },
    { id: 'q8', question: t('faq.questions.q8'), answer: t('faq.questions.a8'), category: 'health' },
    { id: 'q17', question: t('faq.questions.q17'), answer: t('faq.questions.a17'), category: 'health' },
    { id: 'q23', question: t('faq.questions.q23'), answer: t('faq.questions.a23'), category: 'health' },
    { id: 'q30', question: t('faq.questions.q30'), answer: t('faq.questions.a30'), category: 'health' },
    { id: 'q31', question: t('faq.questions.q31'), answer: t('faq.questions.a31'), category: 'health' },
    { id: 'q32', question: t('faq.questions.q32'), answer: t('faq.questions.a32'), category: 'health' },
    { id: 'q34', question: t('faq.questions.q34'), answer: t('faq.questions.a34'), category: 'health' },

    // Hygiene
    { id: 'q9', question: t('faq.questions.q9'), answer: t('faq.questions.a9'), category: 'hygiene' },
    { id: 'q10', question: t('faq.questions.q10'), answer: t('faq.questions.a10'), category: 'hygiene' },
    { id: 'q11', question: t('faq.questions.q11'), answer: t('faq.questions.a11'), category: 'hygiene' },
    { id: 'q12', question: t('faq.questions.q12'), answer: t('faq.questions.a12'), category: 'hygiene' },
    { id: 'q13', question: t('faq.questions.q13'), answer: t('faq.questions.a13'), category: 'hygiene' },
    { id: 'q15', question: t('faq.questions.q15'), answer: t('faq.questions.a15'), category: 'hygiene' },
    { id: 'q16', question: t('faq.questions.q16'), answer: t('faq.questions.a16'), category: 'hygiene' },
    { id: 'q27', question: t('faq.questions.q27'), answer: t('faq.questions.a27'), category: 'hygiene' },
    { id: 'q33', question: t('faq.questions.q33'), answer: t('faq.questions.a33'), category: 'hygiene' },
    { id: 'q35', question: t('faq.questions.q35'), answer: t('faq.questions.a35'), category: 'hygiene' },
    { id: 'q36', question: t('faq.questions.q36'), answer: t('faq.questions.a36'), category: 'hygiene' },

    // School & Activities
    { id: 'q14', question: t('faq.questions.q14'), answer: t('faq.questions.a14'), category: 'school' },
    { id: 'q19', question: t('faq.questions.q19'), answer: t('faq.questions.a19'), category: 'school' },
    { id: 'q20', question: t('faq.questions.q20'), answer: t('faq.questions.a20'), category: 'school' },
    { id: 'q21', question: t('faq.questions.q21'), answer: t('faq.questions.a21'), category: 'school' },
    { id: 'q22', question: t('faq.questions.q22'), answer: t('faq.questions.a22'), category: 'school' },

    // Emotions
    { id: 'q24', question: t('faq.questions.q24'), answer: t('faq.questions.a24'), category: 'emotions' },
    { id: 'q25', question: t('faq.questions.q25'), answer: t('faq.questions.a25'), category: 'emotions' },
    { id: 'q26', question: t('faq.questions.q26'), answer: t('faq.questions.a26'), category: 'emotions' },

    // Myths
    { id: 'q28', question: t('faq.questions.q28'), answer: t('faq.questions.a28'), category: 'myths' },
    { id: 'q29', question: t('faq.questions.q29'), answer: t('faq.questions.a29'), category: 'myths' }
  ], [t]);

  const filteredQuestions = useMemo(() => {
    return allQuestions.filter((q) => {
      const matchesCategory = activeCategory === 'all' || q.category === activeCategory;
      const matchesSearch = debouncedSearch === '' ||
        q.question.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        q.answer.toLowerCase().includes(debouncedSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, debouncedSearch, allQuestions]);

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

  const toggleExpandAnswer = (id) => {
    setExpandedAnswers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleFeedback = (id, helpful) => {
    setFeedback((prev) => ({ ...prev, [id]: helpful }));
    // Could send to analytics/database here
  };

  const handleShare = async (id, question) => {
    const url = `${window.location.href}#${id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: question,
          url: url
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      } catch (err) {
        console.error('Failed to copy', err);
      }
    }
  };

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const highlightText = (text, search) => {
    if (!search) return text;

    const parts = text.split(new RegExp(`(${search})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <mark key={i} className="bg-warm-200 text-text-primary rounded px-1">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const getRelatedQuestions = (currentId, currentCategory) => {
    return allQuestions
      .filter(q => q.id !== currentId && q.category === currentCategory)
      .slice(0, 3);
  };

  const shouldTruncate = (text) => text.length > 300;

  return (
    <div className="page-container animate-fade-in" ref={topRef}>
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
            className="input pl-12 pr-12"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
              aria-label={t('faq.clearSearch')}
            >
              <X size={20} />
            </button>
          )}
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

      {/* Results count */}
      {filteredQuestions.length > 0 && (
        <div className="text-sm text-text-muted mb-4">
          {t('faq.showingResults', { count: filteredQuestions.length })}
        </div>
      )}

      {/* FAQ Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Questions List */}
        <div className="lg:col-span-2 space-y-3">
          {filteredQuestions.length > 0 ? (
            filteredQuestions.map((q) => {
              const isOpen = openQuestions.has(q.id);
              const isExpanded = expandedAnswers.has(q.id);
              const answerText = q.answer;
              const needsTruncation = shouldTruncate(answerText);
              const displayText = needsTruncation && !isExpanded ? answerText.slice(0, 300) + '...' : answerText;
              const relatedQuestions = getRelatedQuestions(q.id, q.category);

              return (
                <div
                  key={q.id}
                  id={q.id}
                  className="card hover:shadow-warm transition-shadow"
                >
                  <div
                    className="flex items-start gap-3 cursor-pointer"
                    onClick={() => toggleQuestion(q.id)}
                  >
                    <HelpCircle className="w-5 h-5 text-secondary-500 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="font-medium text-text-primary">
                          {highlightText(q.question, debouncedSearch)}
                        </h3>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-text-muted flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-text-muted flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="mt-3 pt-3 border-t border-warm-200 ml-8">
                      <p className="text-text-secondary text-sm leading-relaxed">
                        {highlightText(displayText, debouncedSearch)}
                      </p>

                      {needsTruncation && (
                        <button
                          onClick={() => toggleExpandAnswer(q.id)}
                          className="text-secondary-500 hover:text-secondary-600 text-sm font-medium mt-2 transition-colors"
                        >
                          {isExpanded ? t('faq.readLess') : t('faq.readMore')}
                        </button>
                      )}

                      {/* Feedback */}
                      <div className="mt-4 pt-4 border-t border-warm-100">
                        {feedback[q.id] === undefined ? (
                          <div className="flex items-center gap-4">
                            <span className="text-xs text-text-muted">
                              {t('faq.helpful')}
                            </span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleFeedback(q.id, true)}
                                className="p-2 hover:bg-green-50 rounded-lg transition-colors group"
                                aria-label={t('faq.yes')}
                              >
                                <ThumbsUp size={16} className="text-text-muted group-hover:text-green-600" />
                              </button>
                              <button
                                onClick={() => handleFeedback(q.id, false)}
                                className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                                aria-label={t('faq.no')}
                              >
                                <ThumbsDown size={16} className="text-text-muted group-hover:text-red-600" />
                              </button>
                            </div>
                            <button
                              onClick={() => handleShare(q.id, q.question)}
                              className="ml-auto p-2 hover:bg-secondary-50 rounded-lg transition-colors group"
                              aria-label={t('faq.share')}
                            >
                              <Share2 size={16} className="text-text-muted group-hover:text-secondary-600" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-green-600 font-medium">
                              {t('faq.thanksForFeedback')}
                            </span>
                            <button
                              onClick={() => handleShare(q.id, q.question)}
                              className="p-2 hover:bg-secondary-50 rounded-lg transition-colors group"
                              aria-label={t('faq.share')}
                            >
                              <Share2 size={16} className="text-text-muted group-hover:text-secondary-600" />
                            </button>
                          </div>
                        )}
                        {copiedId === q.id && (
                          <span className="text-xs text-secondary-600 mt-2 block">
                            {t('faq.copied')}
                          </span>
                        )}
                      </div>

                      {/* Related Questions */}
                      {relatedQuestions.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-warm-100">
                          <h4 className="text-xs font-semibold text-text-muted mb-2">
                            {t('faq.relatedQuestions')}
                          </h4>
                          <div className="space-y-1">
                            {relatedQuestions.map((rq) => (
                              <button
                                key={rq.id}
                                onClick={() => {
                                  toggleQuestion(rq.id);
                                  document.getElementById(rq.id)?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="text-xs text-secondary-600 hover:text-secondary-700 hover:underline text-left block"
                              >
                                → {rq.question}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
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
          <div className="card bg-gradient-to-br from-primary-50 to-secondary-50 border border-primary-200 sticky top-4">
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
          <div className="card hidden lg:block">
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

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-secondary-500 text-white rounded-full shadow-lg hover:bg-secondary-600 transition-all duration-200 z-50 touch-target"
          aria-label={t('faq.backToTop')}
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
};

export default FAQ;
