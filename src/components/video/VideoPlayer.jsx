import { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipBack,
  SkipForward,
  Settings,
  RefreshCw,
  Subtitles
} from 'lucide-react';

const VideoPlayer = ({
  videoUrl = null,
  thumbnailUrl = null,
  title = 'Educational Video',
  description = 'Learn about menstruation in this friendly animated video.',
  duration = '2-3 min',
  language = 'en',
  aspectRatio = '16/9',
  onLanguageChange = null
}) => {
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration_, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCaptions, setShowCaptions] = useState(false);

  const isVideoAvailable = videoUrl !== null && videoUrl !== '';

  useEffect(() => {
    const savedTime = localStorage.getItem(`video-time-${title}`);
    if (savedTime && videoRef.current) {
      videoRef.current.currentTime = parseFloat(savedTime);
    }
  }, [title]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      localStorage.removeItem(`video-time-${title}`);
    };
    const handleError = () => setHasError(true);
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [title]);

  useEffect(() => {
    if (isPlaying && currentTime > 0) {
      localStorage.setItem(`video-time-${title}`, currentTime.toString());
    }
  }, [currentTime, isPlaying, title]);

  const togglePlay = () => {
    if (!videoRef.current || !isVideoAvailable) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    if (!videoRef.current) return;
    const newVolume = parseFloat(e.target.value);
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
      videoRef.current.muted = false;
    }
  };

  const handleProgressClick = (e) => {
    if (!videoRef.current || !progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * duration_;
  };

  const skip = (seconds) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime += seconds;
  };

  const changeSpeed = (speed) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = speed;
    setPlaybackSpeed(speed);
    setShowSpeedMenu(false);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;

    if (!document.fullscreenElement) {
      videoRef.current.parentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const retry = () => {
    setHasError(false);
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  if (!isVideoAvailable) {
    return (
      <div className="space-y-4">
        <div
          className="relative rounded-xl overflow-hidden bg-gradient-to-br from-warm-50 to-secondary-50 border-2 border-warm-200"
          style={{ aspectRatio }}
        >
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-primary-500/10 flex items-center justify-center mb-4">
                <Play className="w-10 h-10 text-primary-500" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
              <p className="text-sm text-text-secondary mb-4 max-w-md">{description}</p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-warm-200 rounded-full">
                <span className="text-xs font-medium text-text-secondary">Coming Soon</span>
                <span className="text-xs text-text-muted">•</span>
                <span className="text-xs text-text-muted">{duration}</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-white rounded-xl border border-warm-200">
          <h4 className="font-semibold text-text-primary mb-2">{title}</h4>
          <p className="text-sm text-text-secondary">{description}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className="relative rounded-xl overflow-hidden bg-black"
        style={{ aspectRatio }}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        {hasError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-warm-100">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <RefreshCw className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">Unable to load video</h3>
            <p className="text-sm text-text-secondary mb-4">Please check your connection and try again</p>
            <button
              onClick={retry}
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              src={videoUrl}
              poster={thumbnailUrl}
              className="w-full h-full"
              onClick={togglePlay}
              muted={isMuted}
            />

            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent" />
              </div>
            )}

            <div
              className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 transition-opacity ${
                showControls ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {!isPlaying && !isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={togglePlay}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white flex items-center justify-center hover:bg-gray-50 transition-all shadow-lg touch-target"
                  >
                    <Play className="w-8 h-8 md:w-10 md:h-10 text-primary-500 ml-1" />
                  </button>
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
                <div
                  ref={progressRef}
                  className="w-full h-1.5 bg-white/30 rounded-full cursor-pointer touch-target"
                  onClick={handleProgressClick}
                >
                  <div
                    className="h-full bg-primary-500 rounded-full transition-all"
                    style={{ width: `${(currentTime / duration_) * 100}%` }}
                  />
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={togglePlay}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors touch-target"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5 text-white" />
                      ) : (
                        <Play className="w-5 h-5 text-white" />
                      )}
                    </button>

                    <button
                      onClick={() => skip(-10)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors touch-target hidden md:block"
                    >
                      <SkipBack className="w-5 h-5 text-white" />
                    </button>

                    <button
                      onClick={() => skip(10)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors touch-target hidden md:block"
                    >
                      <SkipForward className="w-5 h-5 text-white" />
                    </button>

                    <button
                      onClick={toggleMute}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors touch-target"
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5 text-white" />
                      ) : (
                        <Volume2 className="w-5 h-5 text-white" />
                      )}
                    </button>

                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-16 hidden md:block"
                    />

                    <span className="text-xs text-white font-medium hidden md:block">
                      {formatTime(currentTime)} / {formatTime(duration_)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowCaptions(!showCaptions)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors touch-target"
                      title="Captions (Coming Soon)"
                    >
                      <Subtitles className={`w-5 h-5 ${showCaptions ? 'text-primary-400' : 'text-white'}`} />
                    </button>

                    <div className="relative">
                      <button
                        onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors touch-target"
                      >
                        <Settings className="w-5 h-5 text-white" />
                      </button>

                      {showSpeedMenu && (
                        <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-lg overflow-hidden">
                          {[0.75, 1, 1.25, 1.5, 2].map((speed) => (
                            <button
                              key={speed}
                              onClick={() => changeSpeed(speed)}
                              className={`block w-full px-4 py-2 text-sm text-left hover:bg-warm-50 transition-colors ${
                                playbackSpeed === speed ? 'bg-primary-50 text-primary-600 font-medium' : 'text-text-primary'
                              }`}
                            >
                              {speed}x
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={toggleFullscreen}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors touch-target"
                    >
                      <Maximize className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="p-4 bg-white rounded-xl border border-warm-200">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h4 className="font-semibold text-text-primary mb-2">{title}</h4>
            <p className="text-sm text-text-secondary">{description}</p>
          </div>
          {onLanguageChange && (
            <div className="flex-shrink-0">
              <select
                value={language}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="px-3 py-2 border border-warm-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
