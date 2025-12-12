import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BookOpen,
  MessageSquare,
  Heart,
  Stethoscope,
  FileText,
  ChevronRight,
  CheckCircle,
  ArrowLeft,
  Lightbulb
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ParentsGuide = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('talking');

  const topics = [
    { id: 'talking', icon: MessageSquare, label: t('parents.topics.talking') },
    { id: 'signs', icon: Heart, label: t('parents.topics.signs') },
    { id: 'support', icon: Heart, label: t('parents.topics.support') },
    { id: 'medical', icon: Stethoscope, label: t('parents.topics.medical') },
    { id: 'resources', icon: FileText, label: t('parents.topics.resources') }
  ];

  const content = {
    talking: {
      title: t('parents.startConversation'),
      text: t('parents.startConversationContent'),
      tips: [
        'Start conversations early, before puberty begins',
        'Use correct anatomical terms',
        'Answer questions honestly and age-appropriately',
        'Share your own experiences if comfortable',
        'Make it a series of small conversations, not one big talk',
        'Use books, videos, or this app as conversation starters'
      ]
    },
    signs: {
      title: 'Signs of Puberty to Watch For',
      text: 'Puberty typically begins between ages 8-13 for girls. Here are some signs that your child may be entering puberty:',
      tips: [
        'Breast development (usually the first sign)',
        'Growth of pubic and underarm hair',
        'Growth spurt (rapid increase in height)',
        'Widening of hips',
        'Skin becoming oilier, possible acne',
        'Body odor changes',
        'Mood swings and emotional changes'
      ]
    },
    support: {
      title: t('parents.createSafe'),
      text: t('parents.createSafeContent'),
      tips: [
        'Listen without judgment',
        'Validate their feelings and concerns',
        'Share that what they\'re experiencing is normal',
        'Be patient with mood swings',
        'Offer comfort during painful periods',
        'Respect their privacy',
        'Check in regularly but don\'t hover'
      ]
    },
    medical: {
      title: 'When to See a Doctor',
      text: 'While most period experiences are normal, there are times when you should consult a healthcare provider:',
      tips: [
        'First period before age 8 or no period by age 16',
        'Periods that last longer than 7 days',
        'Extremely heavy bleeding (soaking through products hourly)',
        'Severe pain that interferes with daily activities',
        'Periods suddenly becoming irregular after being regular',
        'Missed periods (especially after the first 2-3 years)',
        'Signs of infection or unusual symptoms'
      ]
    },
    resources: {
      title: t('parents.resources'),
      text: t('parents.resourcesContent'),
      resources: [
        { type: 'Book', title: 'The Care and Keeping of You', description: 'Age-appropriate guide for girls' },
        { type: 'Book', title: 'Guy Stuff: The Body Book for Boys', description: 'Puberty guide for boys' },
        { type: 'Website', title: 'KidsHealth.org', description: 'Trusted health information for families' },
        { type: 'Healthcare', title: 'Your Pediatrician', description: 'For personalized medical advice' }
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
      <header className="bg-gradient-to-r from-warm-50 to-orange-50 rounded-2xl p-6 md:p-8 mb-6 border border-warm-300">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-warm-400 to-warm-600 flex items-center justify-center shadow-lg">
            <BookOpen className="w-7 h-7 md:w-8 md:h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-warm-800">
              {t('parents.title')}
            </h1>
            <p className="text-warm-700/70">{t('parents.subtitle')}</p>
          </div>
        </div>
        <p className="text-text-secondary text-sm md:text-base">
          {t('parents.intro')}
        </p>
      </header>

      {/* Topic Tabs */}
      <div className="mb-6 -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setActiveTab(topic.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all duration-200 touch-target ${
                activeTab === topic.id
                  ? 'bg-warm-500 text-white shadow-lg'
                  : 'bg-white text-text-secondary hover:bg-warm-100 border border-warm-200'
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

          {/* Tips or Resources */}
          {activeTab === 'resources' ? (
            <div className="space-y-4">
              {currentContent.resources.map((resource, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-warm-50 rounded-xl border border-warm-200"
                >
                  <div className="w-12 h-12 rounded-lg bg-warm-200 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-warm-700" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-warm-600 uppercase">
                      {resource.type}
                    </span>
                    <h4 className="font-medium text-text-primary">{resource.title}</h4>
                    <p className="text-sm text-text-muted">{resource.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {currentContent.tips.map((tip, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-warm-50 rounded-xl"
                >
                  <CheckCircle className="w-5 h-5 text-warm-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-text-secondary">{tip}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Period Kit Card */}
          <div className="card bg-gradient-to-br from-primary-50 to-warm-50 border border-primary-200">
            <Lightbulb className="w-8 h-8 text-primary-500 mb-3" />
            <h3 className="font-display font-semibold text-text-primary mb-2">
              {t('parents.prepareKit')}
            </h3>
            <p className="text-sm text-text-secondary mb-4">
              {t('parents.prepareKitContent')}
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary-500" />
                <span className="text-text-secondary">Pads (various sizes)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary-500" />
                <span className="text-text-secondary">Clean underwear</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary-500" />
                <span className="text-text-secondary">Pain relief (if needed)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary-500" />
                <span className="text-text-secondary">Small pouch or bag</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="card">
            <h3 className="font-display font-semibold text-text-primary mb-3">
              Related Resources
            </h3>
            <div className="space-y-2">
              <Link
                to="/girls"
                className="flex items-center justify-between p-3 bg-warm-50 rounded-xl hover:bg-warm-100 transition-colors group"
              >
                <span className="text-sm text-text-secondary group-hover:text-text-primary">
                  {t('navigation.girls')}
                </span>
                <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-primary-500" />
              </Link>
              <Link
                to="/boys"
                className="flex items-center justify-between p-3 bg-warm-50 rounded-xl hover:bg-warm-100 transition-colors group"
              >
                <span className="text-sm text-text-secondary group-hover:text-text-primary">
                  {t('navigation.boys')}
                </span>
                <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-primary-500" />
              </Link>
              <Link
                to="/faq"
                className="flex items-center justify-between p-3 bg-warm-50 rounded-xl hover:bg-warm-100 transition-colors group"
              >
                <span className="text-sm text-text-secondary group-hover:text-text-primary">
                  {t('navigation.faq')}
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

export default ParentsGuide;
