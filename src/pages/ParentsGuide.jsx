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

      <header className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 mb-8">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <div className="flex items-center gap-6 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sage-400 to-sage-600 flex items-center justify-center shadow-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold text-sage-700">
                  {t('parents.title')}
                </h1>
                <p className="text-sage-600 font-medium">{t('parents.subtitle')}</p>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {t('parents.intro')}
            </p>
          </div>

          <div className="flex justify-center mt-6 md:mt-0">
            <img
              src="/parents-child.png"
              alt="Parents and child growing together"
              className="w-full max-w-xs md:max-w-md rounded-2xl"
            />
          </div>
        </div>
      </header>

      <div className="mb-8 -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setActiveTab(topic.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl whitespace-nowrap transition-all duration-300 touch-target ${
                activeTab === topic.id
                  ? 'bg-gradient-to-r from-sage-500 to-sage-600 text-white shadow-lg'
                  : 'bg-white text-text-secondary hover:bg-sage-50 border border-warm-200'
              }`}
            >
              <topic.icon size={18} />
              <span className="font-medium text-sm">{topic.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card">
          <h2 className="text-xl md:text-2xl font-display font-bold text-text-primary mb-4">
            {currentContent.title}
          </h2>
          <p className="text-text-secondary mb-8 leading-relaxed">
            {currentContent.text}
          </p>

          {activeTab === 'resources' ? (
            <div className="space-y-4">
              {currentContent.resources.map((resource, index) => (
                <div
                  key={index}
                  className="flex items-start gap-5 p-5 bg-sage-50/50 rounded-2xl border border-sage-200 hover:shadow-soft transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-sage-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-sage-600" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-sage-600 uppercase tracking-wide">
                      {resource.type}
                    </span>
                    <h4 className="font-semibold text-text-primary mt-1">{resource.title}</h4>
                    <p className="text-sm text-text-muted mt-1">{resource.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {currentContent.tips.map((tip, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-white rounded-xl border border-warm-100 hover:shadow-md transition-all duration-300"
                >
                  <CheckCircle className="w-5 h-5 text-sage-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-text-secondary leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="card bg-green-50 border border-sage-200">
            <Lightbulb className="w-9 h-9 text-sage-600 mb-4" />
            <h3 className="font-display font-bold text-text-primary mb-3">
              {t('parents.prepareKit')}
            </h3>
            <p className="text-sm text-text-secondary mb-5 leading-relaxed">
              {t('parents.prepareKitContent')}
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-sage-500" />
                <span className="text-text-secondary">Pads (various sizes)</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-sage-500" />
                <span className="text-text-secondary">Clean underwear</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-sage-500" />
                <span className="text-text-secondary">Pain relief (if needed)</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-sage-500" />
                <span className="text-text-secondary">Small pouch or bag</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-display font-semibold text-text-primary mb-4">
              Related Resources
            </h3>
            <div className="space-y-3">
              <Link
                to="/girls"
                className="flex items-center justify-between p-4 bg-primary-50/50 rounded-xl hover:bg-primary-50 transition-all duration-300 group"
              >
                <span className="text-sm text-text-secondary group-hover:text-primary-700 font-medium">
                  {t('navigation.girls')}
                </span>
                <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-primary-500 transition-colors" />
              </Link>
              <Link
                to="/boys"
                className="flex items-center justify-between p-4 bg-secondary-50/50 rounded-xl hover:bg-secondary-50 transition-all duration-300 group"
              >
                <span className="text-sm text-text-secondary group-hover:text-secondary-700 font-medium">
                  {t('navigation.boys')}
                </span>
                <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-secondary-500 transition-colors" />
              </Link>
              <Link
                to="/faq"
                className="flex items-center justify-between p-4 bg-warm-50/50 rounded-xl hover:bg-warm-100 transition-all duration-300 group"
              >
                <span className="text-sm text-text-secondary group-hover:text-text-primary font-medium">
                  {t('navigation.faq')}
                </span>
                <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-primary-500 transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentsGuide;
