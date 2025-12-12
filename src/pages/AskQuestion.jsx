import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MessageCircle,
  Send,
  CheckCircle,
  ArrowLeft,
  Info,
  Shield,
  Mail
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const AskQuestion = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    question: '',
    category: 'general',
    ageGroup: '',
    email: ''
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
    try {
      const { error } = await supabase.from('questions').insert({
        question: formData.question.trim(),
        category: formData.category,
        age_group: formData.ageGroup,
        email: formData.email.trim() || null
      });

      if (error) throw error;
      setIsSubmitted(true);
    } catch (err) {
      console.error('Error submitting question:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      question: '',
      category: 'general',
      ageGroup: '',
      email: ''
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

      <header className="gradient-warm rounded-3xl p-6 md:p-10 mb-8 border border-primary-100">
        <div className="flex items-center gap-5 mb-4">
          <div className="w-16 h-16 md:w-18 md:h-18 rounded-2xl gradient-primary flex items-center justify-center shadow-warm">
            <MessageCircle className="w-8 h-8 md:w-9 md:h-9 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-text-primary">
              {t('ask.title')}
            </h1>
            <p className="text-primary-600 font-medium">{t('ask.subtitle')}</p>
          </div>
        </div>
        <p className="text-text-secondary leading-relaxed">
          {t('ask.description')}
        </p>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="card-glass">
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

            {/* Email Input */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                Email Address
                <span className="text-text-muted font-normal ml-1">(optional)</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="input pl-10"
                />
              </div>
              <p className="text-xs text-text-muted mt-1.5">
                Provide your email if you would like to receive a personal reply to your question.
              </p>
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

        <div className="space-y-6">
          <div className="card-glass gradient-warm border border-warm-200">
            <div className="flex items-center gap-3 mb-4">
              <Info className="w-6 h-6 text-primary-500" />
              <h3 className="font-display font-semibold text-text-primary">
                {t('ask.guidelines')}
              </h3>
            </div>
            <p className="text-sm text-text-secondary mb-5 leading-relaxed">
              {t('ask.guidelinesText')}
            </p>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-sage-500 flex-shrink-0 mt-0.5" />
                Be specific about your question
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-sage-500 flex-shrink-0 mt-0.5" />
                No question is too simple
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-sage-500 flex-shrink-0 mt-0.5" />
                Be respectful in your language
              </li>
            </ul>
          </div>

          <div className="card-glass bg-accent-50/50 border border-accent-200">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-6 h-6 text-accent-500" />
              <h3 className="font-display font-semibold text-text-primary">
                Your Privacy
              </h3>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              Your email is optional and only used to send you a reply.
              Questions can still be submitted anonymously without an email.
            </p>
          </div>

          <div className="card-glass">
            <h3 className="font-display font-semibold text-text-primary mb-3">
              Check the FAQ First
            </h3>
            <p className="text-sm text-text-secondary mb-4 leading-relaxed">
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
