import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Heart,
  Calendar,
  Sparkles,
  Smile,
  ShoppingBag,
  ChevronRight,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Girls = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('puberty');

  const topics = [
    { id: 'puberty', icon: Sparkles, label: t('girls.topics.puberty') },
    { id: 'cycle', icon: Calendar, label: t('girls.topics.cycle') },
    { id: 'products', icon: ShoppingBag, label: t('girls.topics.products') },
    { id: 'selfCare', icon: Heart, label: t('girls.topics.selfCare') },
    { id: 'emotions', icon: Smile, label: t('girls.topics.emotions') }
  ];

  const content = {
    puberty: {
      title: t('girls.whatToExpect'),
      text: t('girls.whatToExpectContent'),
      tips: [
        'Your body will grow and change shape',
        'Breast development usually happens first',
        'You may notice more body hair',
        'Skin might become oilier',
        'Growth spurts are normal'
      ]
    },
    cycle: {
      title: t('girls.yourCycle'),
      text: t('girls.yourCycleContent'),
      tips: [
        'Day 1 is the first day of your period',
        'Cycles can be 21-35 days long',
        'Periods typically last 3-7 days',
        'It\'s normal for cycles to be irregular at first',
        'Tracking your cycle can help you understand your body'
      ]
    },
    products: {
      title: 'Period Products',
      text: t('faq.questions.a4'),
      tips: [
        'Pads are the most common choice for beginners',
        'Tampons can be used once you\'re comfortable',
        'Menstrual cups are reusable and eco-friendly',
        'Period underwear is a backup option',
        'Change products every 4-6 hours'
      ]
    },
    selfCare: {
      title: t('girls.takingCare'),
      text: t('girls.takingCareContent'),
      tips: [
        'Stay hydrated - drink plenty of water',
        'Light exercise can help with cramps',
        'Use a heating pad for comfort',
        'Get enough sleep',
        'Eat nutritious foods'
      ]
    },
    emotions: {
      title: t('girls.feelingGood'),
      text: t('girls.feelingGoodContent'),
      tips: [
        'Mood changes are completely normal',
        'Talk to someone you trust about how you feel',
        'Practice self-care activities you enjoy',
        'Remember that this is temporary',
        'Be kind to yourself'
      ]
    }
  };

  const currentContent = content[activeTab];

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
      <header className="bg-gradient-to-r from-girls-light to-pink-100 rounded-2xl p-6 md:p-8 mb-6 border border-girls/20">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center shadow-lg">
            <Heart className="w-7 h-7 md:w-8 md:h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-girls-dark">
              {t('girls.title')}
            </h1>
            <p className="text-girls-dark/70">{t('girls.subtitle')}</p>
          </div>
        </div>
        <p className="text-text-secondary text-sm md:text-base">
          {t('girls.intro')}
        </p>
      </header>

      {/* Topic Tabs - Horizontal scrolling on mobile */}
      <div className="mb-6 -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setActiveTab(topic.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all duration-200 touch-target ${
                activeTab === topic.id
                  ? 'bg-girls text-white shadow-warm'
                  : 'bg-white text-text-secondary hover:bg-girls-light border border-warm-200'
              }`}
            >
              <topic.icon size={18} />
              <span className="font-medium text-sm">{topic.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Content Card - Takes 2 columns on desktop */}
        <div className="lg:col-span-2 card">
          <h2 className="text-xl md:text-2xl font-display font-semibold text-text-primary mb-4">
            {currentContent.title}
          </h2>
          <p className="text-text-secondary mb-6 leading-relaxed">
            {currentContent.text}
          </p>

          {/* Tips List */}
          <div className="space-y-3">
            <h3 className="font-medium text-text-primary flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-girls" />
              Key Points
            </h3>
            {currentContent.tips.map((tip, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-girls-light/50 rounded-xl"
              >
                <CheckCircle className="w-5 h-5 text-girls-dark flex-shrink-0 mt-0.5" />
                <span className="text-sm text-text-secondary">{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar - Quick Links */}
        <div className="space-y-4">
          {/* Quick Tip Card */}
          <div className="card bg-gradient-to-br from-girls-light to-pink-100 border border-girls/20">
            <h3 className="font-display font-semibold text-girls-dark mb-2">
              Remember
            </h3>
            <p className="text-sm text-text-secondary">
              Every body is different, and that's perfectly okay! If you have concerns,
              talk to a parent, guardian, or healthcare provider.
            </p>
          </div>

          {/* Related Links */}
          <div className="card">
            <h3 className="font-display font-semibold text-text-primary mb-3">
              Related Topics
            </h3>
            <div className="space-y-2">
              <Link
                to="/faq"
                className="flex items-center justify-between p-3 bg-warm-50 rounded-xl hover:bg-warm-100 transition-colors group"
              >
                <span className="text-sm text-text-secondary group-hover:text-text-primary">
                  {t('navigation.faq')}
                </span>
                <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-primary-500" />
              </Link>
              <Link
                to="/ask"
                className="flex items-center justify-between p-3 bg-warm-50 rounded-xl hover:bg-warm-100 transition-colors group"
              >
                <span className="text-sm text-text-secondary group-hover:text-text-primary">
                  {t('navigation.ask')}
                </span>
                <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-primary-500" />
              </Link>
              <Link
                to="/animated"
                className="flex items-center justify-between p-3 bg-warm-50 rounded-xl hover:bg-warm-100 transition-colors group"
              >
                <span className="text-sm text-text-secondary group-hover:text-text-primary">
                  {t('navigation.animated')}
                </span>
                <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-primary-500" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Girls;
