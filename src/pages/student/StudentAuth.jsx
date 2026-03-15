import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  BookOpen, ArrowLeft, User, Mail, Lock, Eye, EyeOff, GraduationCap
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { INDIAN_SCHOOLS } from '../../config/indianSchools';

const GRADES = Array.from({ length: 9 }, (_, i) => i + 4);

const SchoolIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const StudentAuth = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const GENDER_OPTIONS = [
    { value: 'female', label: t('studentPortal.genderFemale') },
    { value: 'male', label: t('studentPortal.genderMale') },
    { value: 'other', label: t('studentPortal.genderOther') },
    { value: 'prefer_not_to_say', label: t('studentPortal.genderPreferNotToSay') }
  ];
  const [tab, setTab] = useState('signin');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [fullName, setFullName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [grade, setGrade] = useState('');
  const [className, setClassName] = useState('');
  const [gender, setGender] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const switchTab = (t) => {
    setTab(t);
    setError('');
    setSignupSuccess(false);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      if (data.user?.user_metadata?.role === 'teacher') {
        await supabase.auth.signOut();
        setError(t('studentPortal.errorNotStudentAccount'));
        setLoading(false);
        return;
      }
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.message || t('studentPortal.errorSignInFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) { setError(t('studentPortal.errorFullNameRequired')); return; }
    if (!grade) { setError(t('studentPortal.errorGradeRequired')); return; }
    if (!className.trim()) { setError(t('studentPortal.errorClassNameRequired')); return; }
    if (!gender) { setError(t('studentPortal.errorGenderRequired')); return; }
    if (signupPassword.length < 6) { setError(t('studentPortal.errorPasswordTooShort')); return; }
    if (signupPassword !== confirmPassword) { setError(t('studentPortal.errorPasswordsNoMatch')); return; }

    setLoading(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          data: {
            full_name: fullName.trim(),
            role: 'student',
            grade: parseInt(grade),
            class_name: className.trim(),
            gender,
            school_name: schoolName.trim() || null
          }
        }
      });
      if (signUpError) throw signUpError;
      if (data.user) {
        await supabase.from('student_profiles').upsert({
          id: data.user.id,
          full_name: fullName.trim(),
          school_name: schoolName.trim() || null,
          grade: parseInt(grade),
          class_name: className.trim(),
          gender
        });
        await supabase.auth.signOut();
      }
      setFullName(''); setSchoolName(''); setGrade(''); setClassName(''); setGender('');
      setSignupEmail(''); setSignupPassword(''); setConfirmPassword('');
      setTab('signin');
      setSignupSuccess(true);
    } catch (err) {
      if (err.message?.toLowerCase().includes('already registered') || err.message?.toLowerCase().includes('already exists')) {
        setError(t('studentPortal.errorAlreadyRegistered'));
      } else {
        setError(err.message || t('studentPortal.errorSignUpFailed'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 mb-6 transition-colors">
          <ArrowLeft size={16} />
          {t('studentPortal.backToHome')}
        </Link>

        <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">{t('studentPortal.title')}</h1>
            <p className="text-indigo-200 text-sm mt-1">{t('studentPortal.subtitle')}</p>
          </div>

          <div className="p-6">
            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
              {['signin', 'signup'].map((tabVal) => (
                <button
                  key={tabVal}
                  onClick={() => switchTab(tabVal)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    tab === tabVal ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
                  }`}
                >
                  {tabVal === 'signin' ? t('studentPortal.signIn') : t('studentPortal.signUp')}
                </button>
              ))}
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
            )}
            {signupSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
                {t('studentPortal.accountCreated')}
              </div>
            )}

            {tab === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('studentPortal.email')}</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('studentPortal.password')}</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t('studentPortal.passwordPlaceholder')}
                      className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
                    />
                    <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold rounded-xl transition-colors text-sm"
                >
                  {loading ? t('studentPortal.signingIn') : t('studentPortal.signInButton')}
                </button>
              </form>
            )}

            {tab === 'signup' && (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('studentPortal.fullName')} <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={t('studentPortal.fullNamePlaceholder')}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('studentPortal.schoolName')} <span className="text-gray-400 font-normal">{t('studentPortal.schoolNameOptional')}</span></label>
                  <div className="relative">
                    <SchoolIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm bg-white appearance-none"
                    >
                      <option value="">{t('studentPortal.schoolNamePlaceholder')}</option>
                      {INDIAN_SCHOOLS.map((school) => (
                        <option key={school} value={school}>{school}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('studentPortal.grade')} <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <GraduationCap size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm bg-white appearance-none"
                    >
                      <option value="">{t('studentPortal.gradeSelectPlaceholder')}</option>
                      {GRADES.map((g) => <option key={g} value={g}>{t('studentPortal.gradeLabel', { grade: g })}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('studentPortal.className')} <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <BookOpen size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                      placeholder={t('studentPortal.classNamePlaceholder')}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-400">{t('studentPortal.classNameHint')}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('studentPortal.gender')} <span className="text-red-400">*</span></label>
                  <div className="grid grid-cols-2 gap-2">
                    {GENDER_OPTIONS.map(({ value, label }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setGender(value)}
                        className={`py-2 px-3 rounded-xl border text-sm font-medium transition-all ${
                          gender === value
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-indigo-300'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('studentPortal.email')} <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('studentPortal.password')} <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder={t('studentPortal.passwordNewPlaceholder')}
                      className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
                    />
                    <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('studentPortal.confirmPassword')} <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={t('studentPortal.confirmPasswordPlaceholder')}
                      className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
                    />
                    <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold rounded-xl transition-colors text-sm"
                >
                  {loading ? t('studentPortal.creatingAccount') : t('studentPortal.createAccountButton')}
                </button>
              </form>
            )}

            <div className="mt-6 pt-4 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500">
                {t('studentPortal.areYouTeacher')}{' '}
                <Link to="/teacher" className="text-indigo-500 hover:text-indigo-700 font-medium">
                  {t('studentPortal.teacherPortalLink')}
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link to="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
            {t('studentPortal.backToApp')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentAuth;
