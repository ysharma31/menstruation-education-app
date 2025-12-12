import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  PlayCircle,
  Clock,
  ChevronRight,
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AnimatedExplainer = () => {
  const { t } = useTranslation();
  const [selectedVideo, setSelectedVideo] = useState(null);

  const videos = [
    {
      id: 'intro',
      title: t('animated.videos.intro'),
      description: 'Learn about the changes that happen during puberty in a fun and friendly way.',
      duration: '4:32',
      thumbnail: '🌱',
      category: 'basics',
      forAudience: 'Everyone'
    },
    {
      id: 'cycle',
      title: t('animated.videos.cycle'),
      description: 'Understand what happens during the menstrual cycle with clear, simple animations.',
      duration: '5:15',
      thumbnail: '🔄',
      category: 'education',
      forAudience: 'Everyone'
    },
    {
      id: 'products',
      title: t('animated.videos.products'),
      description: 'A complete guide to different period products and how to use them.',
      duration: '6:20',
      thumbnail: '📦',
      category: 'practical',
      forAudience: 'Girls'
    },
    {
      id: 'myths',
      title: t('animated.videos.myths'),
      description: 'Discover the truth behind common myths and misconceptions about periods.',
      duration: '3:45',
      thumbnail: '💡',
      category: 'education',
      forAudience: 'Everyone'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Videos' },
    { id: 'basics', label: 'Basics' },
    { id: 'education', label: 'Educational' },
    { id: 'practical', label: 'Practical Tips' }
  ];

  const [activeCategory, setActiveCategory] = useState('all');

  const filteredVideos = activeCategory === 'all'
    ? videos
    : videos.filter(v => v.category === activeCategory);

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
      <header className="bg-gradient-to-r from-accent-50 to-purple-100 rounded-2xl p-6 md:p-8 mb-6 border border-accent-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg">
            <PlayCircle className="w-7 h-7 md:w-8 md:h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-accent-700">
              {t('animated.title')}
            </h1>
            <p className="text-accent-600/70">{t('animated.subtitle')}</p>
          </div>
        </div>
        <p className="text-text-secondary text-sm md:text-base">
          {t('animated.description')}
        </p>
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
                  ? 'bg-accent-500 text-white shadow-lg'
                  : 'bg-white text-text-secondary hover:bg-accent-50 border border-warm-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="card group cursor-pointer hover:shadow-warm"
            onClick={() => setSelectedVideo(video)}
          >
            {/* Video Thumbnail */}
            <div className="relative aspect-video bg-gradient-to-br from-accent-100 to-purple-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
              <span className="text-5xl">{video.thumbnail}</span>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                  <Play className="w-5 h-5 text-accent-600 ml-1" />
                </div>
              </div>
              {/* Duration Badge */}
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                <Clock size={12} />
                {video.duration}
              </div>
            </div>

            {/* Video Info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="badge-secondary text-xs">{video.forAudience}</span>
              </div>
              <h3 className="font-display font-semibold text-text-primary mb-1 group-hover:text-accent-600 transition-colors">
                {video.title}
              </h3>
              <p className="text-sm text-text-muted line-clamp-2">
                {video.description}
              </p>
            </div>

            {/* Watch Button */}
            <div className="mt-4 flex items-center text-sm font-medium text-accent-500 group-hover:text-accent-600">
              <span>{t('animated.watchNow')}</span>
              <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Coming Soon Note */}
      <div className="mt-8 p-4 md:p-6 bg-warm-50 rounded-2xl border border-warm-200 text-center">
        <Star className="w-8 h-8 text-secondary-500 mx-auto mb-2" />
        <p className="text-text-secondary font-medium">
          {t('animated.comingSoon')}
        </p>
        <p className="text-sm text-text-muted mt-1">
          We're working on more educational content to help you learn.
        </p>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Video Player Placeholder */}
            <div className="aspect-video bg-gradient-to-br from-accent-100 to-purple-200 flex items-center justify-center relative">
              <span className="text-8xl">{selectedVideo.thumbnail}</span>
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-xl hover:scale-105 transition-transform">
                  <Play className="w-8 h-8 text-accent-600 ml-1" />
                </button>
              </div>
              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <div className="flex items-center gap-4 text-white">
                  <button className="hover:scale-110 transition-transform">
                    <Play size={20} />
                  </button>
                  <div className="flex-1 h-1 bg-white/30 rounded-full">
                    <div className="h-full w-0 bg-white rounded-full" />
                  </div>
                  <span className="text-sm">{selectedVideo.duration}</span>
                  <button className="hover:scale-110 transition-transform">
                    <Volume2 size={20} />
                  </button>
                  <button className="hover:scale-110 transition-transform">
                    <Maximize size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Video Info */}
            <div className="p-4 md:p-6">
              <h2 className="text-xl font-display font-semibold text-text-primary mb-2">
                {selectedVideo.title}
              </h2>
              <p className="text-text-secondary mb-4">
                {selectedVideo.description}
              </p>
              <div className="flex items-center gap-4">
                <span className="badge-secondary">{selectedVideo.forAudience}</span>
                <span className="text-sm text-text-muted flex items-center gap-1">
                  <Clock size={14} />
                  {selectedVideo.duration}
                </span>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="btn-outline w-full mt-4"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimatedExplainer;
