import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Users,
  BookOpen,
  Heart,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  CheckCircle,
  XCircle,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Boys = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('basics');

  const topics = [
    { id: 'basics', icon: BookOpen, label: t('boys.topics.basics') },
    { id: 'support', icon: Heart, label: t('boys.topics.support') },
    { id: 'myths', icon: AlertCircle, label: t('boys.topics.myths') },
    { id: 'questions', icon: HelpCircle, label: t('boys.topics.questions') }
  ];

  const mythsAndFacts = [
    {
      myth: 'Periods are dirty or impure',
      fact: 'Periods are a completely natural and healthy biological process.',
      isMyth: true
    },
    {
      myth: 'Girls can\'t do normal activities during their period',
      fact: 'Most people can do everything they normally do, including sports and swimming.',
      isMyth: true
    },
    {
      myth: 'Talking about periods is embarrassing',
      fact: 'Periods are a normal part of life. Open conversations help everyone.',
      isMyth: true
    },
    {
      myth: 'Only girls need to learn about periods',
      fact: 'Everyone benefits from understanding menstruation - it helps build supportive communities.',
      isMyth: true
    }
  ];

  const content = {
    basics: {
      title: t('boys.whatIs'),
      text: t('boys.whatIsContent'),
      points: [
        'Menstruation is a monthly biological process',
        'It\'s a sign of a healthy body',
        'The average period lasts 3-7 days',
        'It happens to about half the population',
        'It starts during puberty, usually between ages 9-16'
      ]
    },
    support: {
      title: t('boys.howToHelp'),
      text: t('boys.howToHelpContent'),
      points: [
        'Be understanding and patient',
        'Don\'t make jokes or tease about periods',
        'Offer help if someone seems unwell',
        'Keep period products available if asked',
        'Treat it as a normal topic, not something shameful'
      ]
    },
    myths: {
      title: t('boys.mythBusters'),
      text: 'Let\'s separate facts from fiction. Many myths about periods have been around for a long time, but they\'re not true.',
      items: mythsAndFacts
    },
    questions: {
      title: 'Common Questions',
      text: 'Here are some questions boys often have about menstruation:',
      faqs: [
        {
          q: 'Why do girls sometimes feel unwell during their period?',
          a: 'Hormonal changes can cause cramps, tiredness, and mood changes. This is completely normal.'
        },
        {
          q: 'Can I ask my sister/friend about her period?',
          a: 'It\'s best to let them bring it up if they want to. You can be supportive without asking personal questions.'
        },
        {
          q: 'What should I do if someone has a period accident?',
          a: 'Be discreet and helpful. Offer to help them get to a bathroom or provide a jacket to tie around their waist.'
        },
        {
          q: 'Is it okay to buy period products?',
          a: 'Absolutely! It\'s just like buying any other health product. It shows you\'re supportive and mature.'
        }
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
      <header className="bg-gradient-to-r from-boys-light to-blue-100 rounded-2xl p-6 md:p-8 mb-6 border border-boys/20">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
            <Users className="w-7 h-7 md:w-8 md:h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-boys-dark">
              {t('boys.title')}
            </h1>
            <p className="text-boys-dark/70">{t('boys.subtitle')}</p>
          </div>
        </div>
        <p className="text-text-secondary text-sm md:text-base">
          {t('boys.intro')}
        </p>
      </header>

      {/* Why Learn Section */}
      <div className="card bg-gradient-to-r from-warm-50 to-secondary-50 border border-warm-200 mb-6">
        <h2 className="text-lg font-display font-semibold text-text-primary mb-2 flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary-500" />
          {t('boys.whyLearn')}
        </h2>
        <p className="text-text-secondary text-sm md:text-base">
          {t('boys.whyLearnContent')}
        </p>
      </div>

      {/* Topic Tabs */}
      <div className="mb-6 -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setActiveTab(topic.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all duration-200 touch-target ${
                activeTab === topic.id
                  ? 'bg-boys text-white shadow-lg'
                  : 'bg-white text-text-secondary hover:bg-boys-light border border-warm-200'
              }`}
            >
              <topic.icon size={18} />
              <span className="font-medium text-sm">{topic.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <h2 className="text-xl md:text-2xl font-display font-semibold text-text-primary mb-4">
            {currentContent.title}
          </h2>
          <p className="text-text-secondary mb-6 leading-relaxed">
            {currentContent.text}
          </p>

          {/* Render different content based on tab */}
          {activeTab === 'myths' ? (
            <div className="space-y-4">
              {currentContent.items.map((item, index) => (
                <div key={index} className="border border-warm-200 rounded-xl overflow-hidden">
                  <div className="flex items-start gap-3 p-4 bg-red-50">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-medium text-red-600 uppercase">Myth</span>
                      <p className="text-sm text-text-primary font-medium">{item.myth}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-green-50">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-medium text-green-600 uppercase">Fact</span>
                      <p className="text-sm text-text-secondary">{item.fact}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : activeTab === 'questions' ? (
            <div className="space-y-4">
              {currentContent.faqs.map((faq, index) => (
                <div key={index} className="p-4 bg-boys-light/50 rounded-xl">
                  <h4 className="font-medium text-text-primary mb-2 flex items-start gap-2">
                    <HelpCircle className="w-5 h-5 text-boys-dark flex-shrink-0 mt-0.5" />
                    {faq.q}
                  </h4>
                  <p className="text-sm text-text-secondary ml-7">{faq.a}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {currentContent.points.map((point, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-boys-light/50 rounded-xl"
                >
                  <CheckCircle className="w-5 h-5 text-boys-dark flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-text-secondary">{point}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="card bg-gradient-to-br from-boys-light to-blue-100 border border-boys/20">
            <h3 className="font-display font-semibold text-boys-dark mb-2">
              Be an Ally
            </h3>
            <p className="text-sm text-text-secondary">
              Understanding and respecting menstruation makes you a better friend,
              brother, and person. Knowledge breaks down barriers!
            </p>
          </div>

          <div className="card">
            <h3 className="font-display font-semibold text-text-primary mb-3">
              Learn More
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

export default Boys;
