import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageCircle, Send, CircleCheck as CheckCircle, ArrowLeft, Info, Shield, Mail, Sparkles, ThumbsUp, ThumbsDown, CircleAlert as AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import i18n from '../i18n';

const SPINNER = (
  <svg className="animate-spin h-5 w-5 text-red-400" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

const buildAiPrompt = ({ question, category, ageGroup, language }) => {
  if (language === 'hi') {
    return `आप 10-18 वर्ष के युवाओं के लिए एक मित्रवत शैक्षिक स्वास्थ्य साथी हैं। पीरियड्स, यौवन या प्रजनन स्वास्थ्य के बारे में इस प्रश्न का उत्तर गर्मजोशी, स्पष्ट और उम्र के अनुकूल तरीके से दें। उत्तर 3-5 वाक्यों तक सीमित रखें। कभी भी चिकित्सीय निदान न दें। यदि प्रश्न के लिए डॉक्टर की सलाह की आवश्यकता है, तो किसी विश्वसनीय वयस्क या डॉक्टर से बात करने को प्रोत्साहित करें। प्रश्न श्रेणी: ${category}. आयु वर्ग: ${ageGroup}. प्रश्न: ${question}`;
  }
  return `You are a friendly, educational health companion for young people aged 10–18. Answer this question about periods, puberty, or reproductive health in a warm, clear, age-appropriate way. Keep the answer to 3–5 sentences. Never provide medical diagnoses. If the question needs a doctor's input, gently say so and encourage speaking with a trusted adult or doctor. Question category: ${category}. User age group: ${ageGroup}. Question: ${question}. Respond in English.`;
};

const AskQuestion = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    question: '',
    category: 'general',
    ageGroup: '',
    email: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiAnswer, setAiAnswer] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState(null);
  const [submittedData, setSubmittedData] = useState(null);

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

  const fetchAiAnswer = async (data) => {
    setAiLoading(true);
    setAiError(false);
    try {
      const language = i18n.language === 'hi' ? 'hi' : 'en';
      const prompt = buildAiPrompt({
        question: data.question,
        category: data.category,
        ageGroup: data.ageGroup,
        language
      });

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            messages: [{ role: 'user', content: prompt }],
            language
          })
        }
      );

      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || 'AI call failed');
      setAiAnswer(json.message);
    } catch {
      setAiError(true);
    } finally {
      setAiLoading(false);
    }
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

      const snapshot = { ...formData, question: formData.question.trim() };
      setSubmittedData(snapshot);
      setIsSubmitted(true);
      fetchAiAnswer(snapshot);
    } catch (err) {
      console.error('Error submitting question:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFeedback = async (helpful) => {
    if (feedbackGiven !== null) return;
    setFeedbackGiven(helpful);
    if (!user) return;
    try {
      await supabase.from('question_feedback').insert({
        question_text: submittedData.question,
        ai_answer: aiAnswer,
        helpful,
        user_id: user.id
      });
    } catch {
      /* silently ignore */
    }
  };

  const resetForm = () => {
    setFormData({ question: '', category: 'general', ageGroup: '', email: '' });
    setIsSubmitted(false);
    setAiAnswer(null);
    setAiLoading(false);
    setAiError(false);
    setFeedbackGiven(null);
    setSubmittedData(null);
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

        <div className="max-w-2xl mx-auto space-y-4">
          <div className="card py-8 text-center">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-7 h-7 text-green-500" />
            </div>
            <h2 className="text-2xl font-display font-bold text-text-primary mb-2">
              {t('ask.thankYou')}
            </h2>
            <p className="text-text-secondary text-sm">{t('ask.responseNote')}</p>
          </div>

          <div className="card border-2 border-red-200 bg-red-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-red-400 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-red-400">AI Answer</p>
                <p className="text-sm font-medium text-gray-700">Instant educational response</p>
              </div>
            </div>

            {aiLoading && (
              <div className="flex items-center gap-3 py-4">
                {SPINNER}
                <span className="text-sm text-gray-500 italic">Finding an answer for you...</span>
              </div>
            )}

            {!aiLoading && aiAnswer && (
              <>
                <p className="text-gray-700 leading-relaxed text-sm mb-5">{aiAnswer}</p>

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm text-gray-600 font-medium">Was this helpful?</span>
                  <button
                    onClick={() => handleFeedback(true)}
                    disabled={feedbackGiven !== null}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      feedbackGiven === true
                        ? 'bg-green-100 text-green-600 border border-green-300'
                        : feedbackGiven !== null
                        ? 'opacity-40 bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-green-50 hover:border-green-300 hover:text-green-600'
                    }`}
                  >
                    <ThumbsUp size={14} />
                    Yes
                  </button>
                  <button
                    onClick={() => handleFeedback(false)}
                    disabled={feedbackGiven !== null}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      feedbackGiven === false
                        ? 'bg-red-100 text-red-500 border border-red-300'
                        : feedbackGiven !== null
                        ? 'opacity-40 bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-300 hover:text-red-500'
                    }`}
                  >
                    <ThumbsDown size={14} />
                    No
                  </button>
                  {feedbackGiven !== null && (
                    <span className="text-xs text-gray-400 ml-1">Thanks for your feedback!</span>
                  )}
                </div>

                <div className="flex items-start gap-2 p-3 bg-orange-50 rounded-xl border border-orange-100">
                  <AlertCircle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-orange-700 leading-relaxed">
                    This is an educational AI response, not medical advice. For health concerns, always speak with a doctor or trusted adult.
                  </p>
                </div>
              </>
            )}

            {!aiLoading && aiError && (
              <p className="text-sm text-gray-500 italic py-2">
                We couldn't fetch an AI answer right now, but your question has been received and our team will review it.
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={resetForm} className="btn-primary flex-1">
              Ask Another Question
            </button>
            <Link
              to={`/faq?category=${submittedData?.category || 'general'}`}
              className="btn-outline flex-1 text-center"
            >
              Browse Similar Questions in FAQ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container animate-fade-in">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-text-muted hover:text-text-primary mb-4 transition-colors"
      >
        <ArrowLeft size={18} />
        <span className="text-sm">{t('common.backToHome')}</span>
      </Link>

      <header className="bg-red-50 rounded-3xl p-6 md:p-10 mb-8 border border-red-100">
        <div className="flex items-center gap-5 mb-4">
          <div className="w-16 h-16 md:w-18 md:h-18 rounded-2xl bg-red-400 flex items-center justify-center shadow-lg">
            <MessageCircle className="w-8 h-8 md:w-9 md:h-9 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-red-500">
              {t('ask.title')}
            </h1>
            <p className="text-red-400 font-medium">{t('ask.subtitle')}</p>
          </div>
        </div>
        <p className="text-gray-600 leading-relaxed">{t('ask.description')}</p>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="card">
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
                        ? 'bg-red-400 text-white shadow-lg'
                        : 'bg-orange-50 text-gray-700 hover:bg-orange-100'
                    }`}
                  >
                    {age.label}
                  </button>
                ))}
              </div>
            </div>

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

            <button
              type="submit"
              disabled={!formData.question.trim() || !formData.ageGroup || isSubmitting}
              className="w-full px-6 py-3 bg-red-400 text-white rounded-xl font-medium hover:bg-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Send size={18} />
                  {t('ask.submitButton')}
                </span>
              )}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="card bg-white border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Info className="w-6 h-6 text-orange-400" />
              <h3 className="font-display font-semibold text-gray-800">
                {t('ask.guidelines')}
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-5 leading-relaxed">
              {t('ask.guidelinesText')}
            </p>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                Be specific about your question
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                No question is too simple
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                Be respectful in your language
              </li>
            </ul>
          </div>

          <div className="card bg-white border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-6 h-6 text-gray-400" />
              <h3 className="font-display font-semibold text-gray-800">Your Privacy</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Your email is optional and only used to send you a reply.
              Questions can still be submitted anonymously without an email.
            </p>
          </div>

          <div className="card bg-white border border-gray-200">
            <h3 className="font-display font-semibold text-gray-800 mb-3">
              Check the FAQ First
            </h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Your question might already be answered!
            </p>
            <Link
              to="/faq"
              className="block w-full text-center px-4 py-3 border-2 border-red-400 text-red-500 rounded-xl font-medium hover:bg-red-50 transition-colors"
            >
              Browse FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskQuestion;
