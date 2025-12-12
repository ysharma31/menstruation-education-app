import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MessageCircle,
  Send,
  CheckCircle,
  ArrowLeft,
  Info,
  Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AskQuestion = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    question: '',
    category: 'general',
    ageGroup: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: 'general', label: t('ask.categories.general') },
    { value: 'health', label: t('ask.categories.health') },
    { value: 'products', label: t('ask.categories.products') },
    { value: 'emotions', label: t('ask.categories.emotions') },
    { value: 'other', label: t('ask.categories.other') }
  ];

  const ageGroups = [
    { value: 'under10', label: t('ask.ageGroups.under10') },
    { value: '10to12', label: t('ask.ageGroups.10to12') },
    { value: '13to15', label: t('ask.ageGroups.13to15') },
    { value: '16plus', label: t('ask.ageGroups.16plus') },
    { value: 'parent', label: t('ask.ageGroups.parent') }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.question.trim() || !formData.ageGroup) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const resetForm = () => {
    setFormData({
      question: '',
      category: 'general',
      ageGroup: ''
    });
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="page-container animate-fade-in">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-text-muted hover:text-text-primary mb-4 transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">{t('common.backToHome')}</span>
        </Link>

        <div className="max-w-lg mx-auto text-center">
          <div className="card py-12">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-display font-bold text-text-primary mb-3">
              {t('ask.thankYou')}
            </h2>
            <p className="text-text-secondary mb-6">
              {t('ask.responseNote')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={resetForm} className="btn-primary">
                Ask Another Question
              </button>
              <Link to="/faq" className="btn-outline">
                Browse FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
      <header className="bg-gradient-to-r from-primary-50 to-pink-100 rounded-2xl p-6 md:p-8 mb-6 border border-primary-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg">
            <MessageCircle className="w-7 h-7 md:w-8 md:h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-primary-700">
              {t('ask.title')}
            </h1>
            <p className="text-primary-600/70">{t('ask.subtitle')}</p>
          </div>
        </div>
        <p className="text-text-secondary text-sm md:text-base">
          {t('ask.description')}
        </p>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="card">
            {/* Question Input */}
            <div className="mb-6">
              <label htmlFor="question" className="block text-sm font-medium text-text-primary mb-2">
                Your Question
              </label>
              <textarea
                id="question"
                name="question"
                value={formData.question}
                onChange={handleChange}
                placeholder={t('ask.placeholder')}
                className="textarea h-32"
                required
              />
            </div>

            {/* Category Select */}
            <div className="mb-6">
              <label htmlFor="category" className="block text-sm font-medium text-text-primary mb-2">
                {t('ask.categoryLabel')}
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Age Group */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-text-primary mb-3">
                {t('ask.ageLabel')}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ageGroups.map((age) => (
                  <button
                    key={age.value}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, ageGroup: age.value }))}
                    className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      formData.ageGroup === age.value
                        ? 'bg-primary-500 text-white shadow-warm'
                        : 'bg-warm-100 text-text-secondary hover:bg-warm-200'
                    }`}
                  >
                    {age.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!formData.question.trim() || !formData.ageGroup || isSubmitting}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Submitting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send size={18} />
                  {t('ask.submitButton')}
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Guidelines Card */}
          <div className="card bg-warm-50 border border-warm-200">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-5 h-5 text-warm-600" />
              <h3 className="font-display font-semibold text-text-primary">
                {t('ask.guidelines')}
              </h3>
            </div>
            <p className="text-sm text-text-secondary mb-4">
              {t('ask.guidelinesText')}
            </p>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                Be specific about your question
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                No question is too simple
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                Be respectful in your language
              </li>
            </ul>
          </div>

          {/* Privacy Note */}
          <div className="card bg-accent-50 border border-accent-200">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-accent-600" />
              <h3 className="font-display font-semibold text-text-primary">
                Your Privacy
              </h3>
            </div>
            <p className="text-sm text-text-secondary">
              All questions are submitted anonymously. We don't collect any personal
              information that could identify you.
            </p>
          </div>

          {/* FAQ Link */}
          <div className="card">
            <h3 className="font-display font-semibold text-text-primary mb-2">
              Check the FAQ First
            </h3>
            <p className="text-sm text-text-secondary mb-3">
              Your question might already be answered!
            </p>
            <Link to="/faq" className="btn-outline w-full">
              Browse FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskQuestion;
