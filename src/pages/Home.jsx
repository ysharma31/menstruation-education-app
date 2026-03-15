import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMemo, useState, useEffect } from 'react';
import { User, Users, CirclePlay as PlayCircle, Circle as HelpCircle, BookOpen, MessageCircle, Heart, Sparkles, ArrowRight, GraduationCap, CircleCheck as CheckCircle, X, CircleAlert as AlertCircle } from 'lucide-react';
import { useSearch } from '../contexts/SearchContext';
import SearchResults from '../components/search/SearchResults';
import { searchGlobalContent } from '../utils/contentIndex';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const savePendingCode = (code) => {
  localStorage.setItem('pendingClassCode', code);
  sessionStorage.setItem('pendingClassCode', code);
};

const clearPendingCode = () => {
  localStorage.removeItem('pendingClassCode');
  sessionStorage.removeItem('pendingClassCode');
};

const getPendingCode = () =>
  localStorage.getItem('pendingClassCode') || sessionStorage.getItem('pendingClassCode');

const UnauthBanner = ({ code, onDismiss }) => (
  <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-8 relative">
    <button
      onClick={onDismiss}
      className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white transition-colors"
      aria-label="Dismiss"
    >
      <X size={16} />
    </button>
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center flex-shrink-0">
        <GraduationCap className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="font-bold text-gray-900 text-sm">Your teacher shared this app</p>
        <p className="text-xs text-gray-500">Create an account or sign in to join the class</p>
      </div>
    </div>
    <div className="mb-4">
      <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Class code</p>
      <p className="text-2xl font-mono font-bold text-green-700 tracking-widest">{code}</p>
    </div>
    <div className="flex gap-3 mb-3">
      <Link
        to="/auth"
        className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl text-sm text-center transition-colors"
      >
        Create account
      </Link>
      <Link
        to="/auth"
        className="flex-1 py-2.5 border border-green-600 text-green-700 hover:bg-green-50 font-semibold rounded-xl text-sm text-center transition-colors"
      >
        Sign in
      </Link>
    </div>
    <p className="text-xs text-gray-500 leading-relaxed">
      Create a free account to join your teacher's class and see their notices.
    </p>
    <p className="mt-1 text-xs text-gray-400">
      Joining is optional. You can use the app without joining a class.
    </p>
  </div>
);

const SuccessCard = ({ className, schoolName, onDismiss }) => (
  <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-8 relative">
    <button
      onClick={onDismiss}
      className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white transition-colors"
      aria-label="Dismiss"
    >
      <X size={16} />
    </button>
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
        <CheckCircle className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="font-bold text-gray-900 text-sm mb-1">
          You have joined {className}{schoolName ? ` at ${schoolName}` : ''}.
        </p>
        <p className="text-xs text-gray-600 leading-relaxed mb-3">
          You can now see notices from your teacher and ask questions anonymously.
        </p>
        <button
          onClick={onDismiss}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl text-xs transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  </div>
);

const ErrorCard = ({ onDismiss }) => (
  <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-8">
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
        <AlertCircle className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="font-bold text-gray-900 text-sm mb-1">Class code not found</p>
        <p className="text-xs text-gray-600 leading-relaxed mb-3">
          This class is no longer active or the code is incorrect. Check with your teacher.
        </p>
        <button
          onClick={onDismiss}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl text-xs transition-colors"
        >
          OK
        </button>
      </div>
    </div>
  </div>
);

const ManualCodePrompt = () => {
  const [expanded, setExpanded] = useState(false);
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  const handleJoin = async () => {
    if (!code.trim() || !user) return;
    setStatus('loading');
    setMessage('');
    try {
      const { data: cls, error } = await supabase
        .from('teacher_classes')
        .select('id, class_name')
        .eq('class_code', code.trim().toUpperCase())
        .eq('is_active', true)
        .maybeSingle();
      if (error || !cls) {
        setMessage('Class code not found or no longer active.');
        setStatus('error');
        return;
      }
      const { error: enrollErr } = await supabase
        .from('class_enrollments')
        .insert({ class_id: cls.id, student_id: user.id });
      if (enrollErr && enrollErr.code !== '23505') {
        setMessage('Could not join. Please try again.');
        setStatus('error');
        return;
      }
      setStatus('success');
      setMessage(`You have joined "${cls.class_name}"!`);
    } catch {
      setMessage('Something went wrong.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-2 text-green-700 text-sm">
        <CheckCircle size={16} /> {message}
      </div>
    );
  }

  if (!expanded) {
    return (
      <div className="mt-6 text-center">
        <button
          onClick={() => setExpanded(true)}
          className="text-xs text-gray-400 hover:text-green-600 transition-colors underline underline-offset-2"
        >
          Have a class code from your teacher? Enter code
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-2xl">
      <p className="text-sm font-medium text-gray-700 mb-3">Enter your class code</p>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          maxLength={6}
          placeholder="CLASS CODE"
          className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300 text-sm font-mono uppercase tracking-widest"
        />
        <button
          onClick={handleJoin}
          disabled={status === 'loading' || !code.trim()}
          className="px-5 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-semibold rounded-xl text-sm transition-colors"
        >
          {status === 'loading' ? 'Joining...' : 'Join'}
        </button>
        <button
          onClick={() => setExpanded(false)}
          className="p-2.5 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>
      {message && (
        <p className={`mt-2 text-xs ${status === 'error' ? 'text-red-600' : 'text-green-700'}`}>{message}</p>
      )}
    </div>
  );
};

const Home = () => {
  const { t } = useTranslation();
  const { searchQuery } = useSearch();
  const { user } = useAuth();

  const [bannerState, setBannerState] = useState('idle');
  const [joinedClass, setJoinedClass] = useState(null);
  const [showManualPrompt, setShowManualPrompt] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const joinCode = params.get('join');
    if (joinCode) {
      savePendingCode(joinCode.toUpperCase());
      window.history.replaceState({}, '', '/');
    }
  }, []);

  useEffect(() => {
    const code = getPendingCode();
    const bannerDismissed = localStorage.getItem('joinBannerDismissed') === 'true';
    if (!code || bannerDismissed) return;

    if (!user) {
      setBannerState('unauthenticated');
      return;
    }

    const attemptEnroll = async () => {
      setBannerState('enrolling');
      try {
        const { data: cls, error } = await supabase
          .from('teacher_classes')
          .select('id, class_name, school_name')
          .eq('class_code', code)
          .eq('is_active', true)
          .maybeSingle();
        if (error || !cls) {
          clearPendingCode();
          setBannerState('error');
          return;
        }
        const { error: enrollErr } = await supabase
          .from('class_enrollments')
          .insert({ class_id: cls.id, student_id: user.id });
        if (enrollErr && enrollErr.code !== '23505') {
          clearPendingCode();
          setBannerState('error');
          return;
        }
        clearPendingCode();
        setJoinedClass(cls);
        setBannerState('success');
      } catch {
        clearPendingCode();
        setBannerState('error');
      }
    };

    attemptEnroll();
  }, [user]);

  useEffect(() => {
    if (!user || getPendingCode()) return;
    const checkEnrollments = async () => {
      const { data } = await supabase
        .from('class_enrollments')
        .select('id')
        .eq('student_id', user.id)
        .limit(1);
      if (!data || data.length === 0) {
        setShowManualPrompt(true);
      }
    };
    checkEnrollments();
  }, [user]);

  const handleDismissUnauthBanner = () => {
    localStorage.setItem('joinBannerDismissed', 'true');
    setBannerState('idle');
  };

  const sections = [
    { path: '/girls', icon: User, title: t('navigation.girls'), description: t('girls.intro'), bgColor: 'bg-pink-50', borderColor: 'border-pink-400', iconBg: 'bg-pink-500', textColor: 'text-pink-700' },
    { path: '/boys', icon: Users, title: t('navigation.boys'), description: t('boys.intro'), bgColor: 'bg-blue-50', borderColor: 'border-blue-400', iconBg: 'bg-blue-500', textColor: 'text-blue-700' },
    { path: '/animated', icon: PlayCircle, title: t('navigation.animated'), description: t('animated.description'), bgColor: 'bg-sky-50', borderColor: 'border-sky-400', iconBg: 'bg-sky-500', textColor: 'text-sky-700' },
    { path: '/faq', icon: HelpCircle, title: t('navigation.faq'), description: t('faq.subtitle'), bgColor: 'bg-blue-50', borderColor: 'border-blue-300', iconBg: 'bg-blue-500', textColor: 'text-blue-700' },
    { path: '/parents', icon: BookOpen, title: t('navigation.parents'), description: t('parents.intro'), bgColor: 'bg-green-50', borderColor: 'border-green-400', iconBg: 'bg-green-500', textColor: 'text-green-700' },
    { path: '/ask', icon: MessageCircle, title: t('navigation.ask'), description: t('ask.description'), bgColor: 'bg-pink-50', borderColor: 'border-pink-300', iconBg: 'bg-pink-500', textColor: 'text-pink-700' }
  ];

  const searchResults = useMemo(() => searchGlobalContent(searchQuery, t), [searchQuery, t]);
  const showSearchResults = searchQuery && searchQuery.trim() !== '';
  const pendingCode = getPendingCode();
  const bannerDismissed = localStorage.getItem('joinBannerDismissed') === 'true';

  return (
    <div className="page-container animate-fade-in">
      {bannerState === 'unauthenticated' && !bannerDismissed && pendingCode && (
        <UnauthBanner code={pendingCode} onDismiss={handleDismissUnauthBanner} />
      )}
      {bannerState === 'success' && joinedClass && (
        <SuccessCard
          className={joinedClass.class_name}
          schoolName={joinedClass.school_name}
          onDismiss={() => setBannerState('idle')}
        />
      )}
      {bannerState === 'error' && (
        <ErrorCard onDismiss={() => setBannerState('idle')} />
      )}

      <section className="mb-12">
        <div className="text-center max-w-4xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-pink-50 rounded-full shadow-sm">
            <Sparkles className="w-4 h-4 text-pink-500" />
            <span className="text-sm font-medium text-pink-600">{t('home.safeSpace')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-balance leading-tight">
            {t('home.title')}
          </h1>
          <p className="text-lg text-gray-600 mb-3 leading-relaxed max-w-3xl mx-auto">{t('home.subtitle')}</p>
          <p className="text-base text-gray-500 leading-relaxed max-w-2xl mx-auto">{t('home.description')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl shadow-lg bg-gradient-to-br from-blue-100 via-pink-50 to-pink-100 p-6">
            <img src="/hero-group-study.png" alt="Diverse students learning together in a supportive environment" className="w-full h-auto rounded-xl shadow-md" />
          </div>
          <div className="relative overflow-hidden rounded-2xl shadow-lg bg-gradient-to-br from-pink-100 via-blue-50 to-blue-100 p-6">
            <img src="/hero-classroom.png" alt="Inclusive classroom education about puberty and menstruation" className="w-full h-auto rounded-xl shadow-md" />
          </div>
        </div>
      </section>

      {showSearchResults ? (
        <section className="mb-12">
          <SearchResults results={searchResults} query={searchQuery} />
        </section>
      ) : (
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{t('home.chooseSection')}</h2>
            <p className="text-gray-500">Explore resources designed just for you</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section) => (
              <Link key={section.path} to={section.path} className={`group card ${section.bgColor} border-l-4 ${section.borderColor}`}>
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${section.iconBg} flex items-center justify-center shadow-sm`}>
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold text-lg ${section.textColor} mb-1`}>{section.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{section.description}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center text-sm font-medium text-pink-500">
                  <span>{t('common.learnMore')}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mb-8">
        <div className="card bg-pink-50 border-pink-100">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-pink-500 flex items-center justify-center shadow-sm">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <div className="text-center md:text-left flex-1">
              <h3 className="font-bold text-lg text-gray-900 mb-1">{t('home.forEveryone')}</h3>
              <p className="text-gray-600 leading-relaxed">{t('home.description')}</p>
            </div>
            <Link to="/faq" className="btn-outline flex-shrink-0">
              <HelpCircle className="w-5 h-5 mr-2" />
              Browse FAQ
            </Link>
          </div>
        </div>
      </section>

      {showManualPrompt && <ManualCodePrompt />}
    </div>
  );
};

export default Home;
