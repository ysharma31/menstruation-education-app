import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  PlayCircle,
  Clock,
  ArrowLeft,
  Star,
  Download,
  BookOpen,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { VideoPlayer } from '../components/video';

const AnimatedExplainer = () => {
  const { t, i18n } = useTranslation();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoLanguage, setVideoLanguage] = useState(i18n.language);

  const videos = [
    {
      id: 'intro',
      title: t('animated.videos.intro'),
      description: t('animated.videoDescriptions.intro'),
      duration: '3-4 min',
      category: 'basics',
      forAudience: t('animated.audienceLabels.everyone'),
      videoUrl: null,
      thumbnailUrl: null,
      transcript: t('animated.transcripts.intro')
    },
    {
      id: 'cycle',
      title: t('animated.videos.cycle'),
      description: t('animated.videoDescriptions.cycle'),
      duration: '4-5 min',
      category: 'education',
      forAudience: t('animated.audienceLabels.everyone'),
      videoUrl: null,
      thumbnailUrl: null,
      transcript: t('animated.transcripts.cycle')
    },
    {
      id: 'products',
      title: t('animated.videos.products'),
      description: t('animated.videoDescriptions.products'),
      duration: '5-6 min',
      category: 'practical',
      forAudience: t('animated.audienceLabels.girls'),
      videoUrl: null,
      thumbnailUrl: null,
      transcript: t('animated.transcripts.products')
    },
    {
      id: 'myths',
      title: t('animated.videos.myths'),
      description: t('animated.videoDescriptions.myths'),
      duration: '3-4 min',
      category: 'education',
      forAudience: t('animated.audienceLabels.everyone'),
      videoUrl: null,
      thumbnailUrl: null,
      transcript: t('animated.transcripts.myths')
    },
    {
      id: 'hygiene',
      title: t('animated.videos.hygiene'),
      description: t('animated.videoDescriptions.hygiene'),
      duration: '4-5 min',
      category: 'practical',
      forAudience: t('animated.audienceLabels.girls'),
      videoUrl: null,
      thumbnailUrl: null,
      transcript: t('animated.transcripts.hygiene')
    },
    {
      id: 'support',
      title: t('animated.videos.support'),
      description: t('animated.videoDescriptions.support'),
      duration: '3-4 min',
      category: 'education',
      forAudience: t('animated.audienceLabels.boys'),
      videoUrl: null,
      thumbnailUrl: null,
      transcript: t('animated.transcripts.support')
    }
  ];

  const categories = [
    { id: 'all', label: t('animated.categories.all') },
    { id: 'basics', label: t('animated.categories.basics') },
    { id: 'education', label: t('animated.categories.education') },
    { id: 'practical', label: t('animated.categories.practical') }
  ];

  const [activeCategory, setActiveCategory] = useState('all');

  const filteredVideos = activeCategory === 'all'
    ? videos
    : videos.filter(v => v.category === activeCategory);

  const handleVideoLanguageChange = (lang) => {
    setVideoLanguage(lang);
  };

  return (
    <div className="page-container animate-fade-in">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-text-muted hover:text-text-primary mb-4 transition-colors"
      >
        <ArrowLeft size={18} />
        <span className="text-sm">{t('common.backToHome')}</span>
      </Link>

      <header className="bg-gradient-to-r from-violet-50 to-fuchsia-50 rounded-2xl p-6 md:p-8 mb-6 border border-violet-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg">
            <PlayCircle className="w-7 h-7 md:w-8 md:h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-violet-900">
              {t('animated.title')}
            </h1>
            <p className="text-violet-700">{t('animated.subtitle')}</p>
          </div>
        </div>
        <p className="text-text-secondary text-sm md:text-base">
          {t('animated.description')}
        </p>
      </header>

      <div className="mb-6 -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all duration-200 touch-target font-medium text-sm ${
                activeCategory === cat.id
                  ? 'bg-violet-500 text-white shadow-lg'
                  : 'bg-white text-text-secondary hover:bg-violet-50 border border-warm-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="card group cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedVideo(video)}
          >
            <div className="relative aspect-video bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <PlayCircle className="w-16 h-16 text-violet-400 opacity-60" />
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                  <PlayCircle className="w-7 h-7 text-violet-600" />
                </div>
              </div>
              <div className="absolute top-2 right-2 bg-violet-500 text-white text-xs px-2 py-1 rounded-md">
                {t('animated.comingSoonBadge')}
              </div>
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                <Clock size={12} />
                {video.duration}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-1 bg-warm-100 text-text-secondary rounded-full">
                  {video.forAudience}
                </span>
                <span className="text-xs px-2 py-1 bg-violet-100 text-violet-700 rounded-full">
                  {video.category}
                </span>
              </div>
              <h3 className="font-display font-semibold text-text-primary mb-2 group-hover:text-violet-600 transition-colors">
                {video.title}
              </h3>
              <p className="text-sm text-text-muted line-clamp-2">
                {video.description}
              </p>
            </div>

            <div className="mt-4 text-sm font-medium text-violet-500 group-hover:text-violet-600 flex items-center">
              <span>{t('animated.watchNow')}</span>
              <span className="ml-1 transform group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="card bg-gradient-to-br from-violet-50 to-fuchsia-50 border border-violet-200">
          <div className="flex items-start gap-3 mb-3">
            <Star className="w-6 h-6 text-violet-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-violet-900 mb-2">
                {t('animated.comingSoon')}
              </h3>
              <p className="text-sm text-violet-800">
                {t('animated.comingSoonDescription')}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start gap-3 mb-3">
            <BookOpen className="w-6 h-6 text-primary-500 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-text-primary mb-2">
                {t('animated.alternativeContent')}
              </h3>
              <p className="text-sm text-text-secondary mb-3">
                {t('animated.alternativeContentDescription')}
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  to="/boys"
                  className="text-xs px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  {t('navigation.boys')}
                </Link>
                <Link
                  to="/girls"
                  className="text-xs px-3 py-2 bg-pink-50 text-pink-700 rounded-lg hover:bg-pink-100 transition-colors"
                >
                  {t('navigation.girls')}
                </Link>
                <Link
                  to="/faq"
                  className="text-xs px-3 py-2 bg-warm-50 text-text-secondary rounded-lg hover:bg-warm-100 transition-colors"
                >
                  {t('navigation.faq')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-5xl w-full my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-warm-200 px-4 md:px-6 py-4 rounded-t-2xl flex items-center justify-between">
              <h2 className="text-lg md:text-xl font-display font-semibold text-text-primary">
                {selectedVideo.title}
              </h2>
              <button
                onClick={() => setSelectedVideo(null)}
                className="p-2 hover:bg-warm-100 rounded-lg transition-colors touch-target"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 md:p-6">
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <VideoPlayer
                    videoUrl={selectedVideo.videoUrl}
                    thumbnailUrl={selectedVideo.thumbnailUrl}
                    title={selectedVideo.title}
                    description={selectedVideo.description}
                    duration={selectedVideo.duration}
                    language={videoLanguage}
                    aspectRatio="16/9"
                    onLanguageChange={handleVideoLanguageChange}
                  />

                  <div className="mt-6 p-4 bg-warm-50 rounded-xl">
                    <h3 className="font-semibold text-text-primary mb-2 flex items-center gap-2">
                      <BookOpen size={18} />
                      {t('animated.transcript')}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {selectedVideo.transcript}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="card bg-warm-50">
                    <h3 className="font-semibold text-text-primary mb-3">
                      {t('animated.videoInfo')}
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-text-muted">{t('animated.duration')}</span>
                        <span className="text-text-primary font-medium">{selectedVideo.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">{t('animated.audience')}</span>
                        <span className="text-text-primary font-medium">{selectedVideo.forAudience}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">{t('animated.category')}</span>
                        <span className="text-text-primary font-medium">{selectedVideo.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <h3 className="font-semibold text-text-primary mb-3">
                      {t('animated.relatedTopics')}
                    </h3>
                    <div className="space-y-2">
                      <Link
                        to="/faq"
                        className="block p-3 bg-warm-50 rounded-lg hover:bg-warm-100 transition-colors text-sm"
                      >
                        {t('navigation.faq')}
                      </Link>
                      <Link
                        to="/ask"
                        className="block p-3 bg-warm-50 rounded-lg hover:bg-warm-100 transition-colors text-sm"
                      >
                        {t('navigation.ask')}
                      </Link>
                    </div>
                  </div>

                  <button
                    className="w-full btn-outline flex items-center justify-center gap-2"
                    disabled
                  >
                    <Download size={18} />
                    {t('animated.downloadPDF')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimatedExplainer;
