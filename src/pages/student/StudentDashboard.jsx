import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookOpen, FileText, Image, Video, GraduationCap, User, X, CircleAlert as AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { INDIAN_SCHOOLS } from '../../config/indianSchools';

const GRADES = Array.from({ length: 9 }, (_, i) => i + 4);

const SchoolIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const TYPE_CONFIG = {
  pdf: { icon: FileText, iconBg: 'bg-red-100', iconColor: 'text-red-600', bar: 'bg-red-400', badge: 'bg-red-50 text-red-600', actionKey: 'studentPortal.actionOpen' },
  image: { icon: Image, iconBg: 'bg-blue-100', iconColor: 'text-blue-600', bar: 'bg-blue-400', badge: 'bg-blue-50 text-blue-600', actionKey: 'studentPortal.actionView' },
  video: { icon: Video, iconBg: 'bg-purple-100', iconColor: 'text-purple-600', bar: 'bg-purple-400', badge: 'bg-purple-50 text-purple-600', actionKey: 'studentPortal.actionWatch' }
};

const StudentDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const FILTER_OPTIONS = [
    { key: 'All', label: t('studentPortal.filterAll') },
    { key: 'PDF', label: t('studentPortal.filterPdf') },
    { key: 'Image', label: t('studentPortal.filterImage') },
    { key: 'Video', label: t('studentPortal.filterVideo') }
  ];

  const [profile, setProfile] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [accessedIds, setAccessedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [lightboxMaterial, setLightboxMaterial] = useState(null);

  const [profileGrade, setProfileGrade] = useState('');
  const [profileClassName, setProfileClassName] = useState('');
  const [profileGender, setProfileGender] = useState('');
  const [profileSchool, setProfileSchool] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/student');
      return;
    }
    if (!authLoading && user?.user_metadata?.role === 'teacher') {
      navigate('/teacher/dashboard');
      return;
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);

      const { data: profileData } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      let resolvedProfile = profileData;

      if (!resolvedProfile && user.user_metadata?.full_name) {
        const fallback = {
          id: user.id,
          full_name: user.user_metadata.full_name,
          grade: user.user_metadata.grade ? parseInt(user.user_metadata.grade) : null,
          class_name: user.user_metadata.class_name ?? null,
          gender: user.user_metadata.gender ?? null,
          school_name: user.user_metadata.school_name ?? null
        };
        await supabase.from('student_profiles').upsert(fallback);
        resolvedProfile = fallback;
      }

      if (!resolvedProfile) {
        resolvedProfile = {
          full_name: user.user_metadata?.full_name,
          grade: user.user_metadata?.grade ? parseInt(user.user_metadata.grade) : null,
          class_name: user.user_metadata?.class_name ?? null,
          gender: user.user_metadata?.gender ?? null,
          school_name: user.user_metadata?.school_name ?? null
        };
      }

      setProfile(resolvedProfile);

      if (resolvedProfile.grade) resolvedProfile.grade = parseInt(resolvedProfile.grade);

      if (resolvedProfile.grade) {
        let query = supabase
          .from('course_materials')
          .select('*')
          .eq('grade', resolvedProfile.grade);

        if (resolvedProfile.class_name) {
          query = query.eq('class_name', resolvedProfile.class_name);
        }

        if (resolvedProfile.school_name) {
          query = query.eq('school_name', resolvedProfile.school_name);
        }

        const { data: mats } = await query.order('created_at', { ascending: false });
        setMaterials(mats ?? []);

        const { data: accessData } = await supabase
          .from('material_access')
          .select('material_id')
          .eq('student_id', user.id);
        setAccessedIds(new Set((accessData ?? []).map((r) => r.material_id)));
      }

      setLoading(false);
    };
    load();
  }, [user]);

  const handleCompleteProfile = async (e) => {
    e.preventDefault();
    if (!profileGrade || !profileClassName.trim() || !profileGender) return;
    setProfileSaving(true);
    setProfileError('');
    const updates = {
      id: user.id,
      full_name: profile?.full_name || user.user_metadata?.full_name || user.email,
      grade: parseInt(profileGrade),
      class_name: profileClassName.trim(),
      gender: profileGender,
      school_name: profileSchool.trim() || null
    };
    const { error } = await supabase.from('student_profiles').upsert(updates);
    if (error) {
      setProfileError(t('studentPortal.completeProfileError'));
      setProfileSaving(false);
      return;
    }
    setProfile((prev) => ({ ...prev, ...updates }));
    setProfileSaving(false);
  };

  const handleOpen = async (material) => {
    await supabase.from('material_access').upsert(
      { material_id: material.id, student_id: user.id },
      { onConflict: 'material_id,student_id' }
    );
    setAccessedIds((prev) => new Set([...prev, material.id]));

    if (material.type === 'image') {
      setLightboxMaterial(material);
    } else {
      window.open(material.url, '_blank', 'noopener,noreferrer');
    }
  };

  const filteredMaterials = filter === 'All'
    ? materials
    : materials.filter((m) => m.type === filter.toLowerCase());

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-500">{t('studentPortal.loadingMaterials')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
            <User className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-xl font-bold">{t('studentPortal.welcome', { name: profile?.full_name ?? 'Student' })}</p>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {profile?.grade && (
                <span className="flex items-center gap-1 text-xs text-indigo-100 bg-white/10 rounded-full px-2.5 py-0.5">
                  <GraduationCap size={12} />
                  {t('studentPortal.gradeLabel', { grade: profile.grade })}
                </span>
              )}
              {profile?.class_name && (
                <span className="flex items-center gap-1 text-xs text-indigo-100 bg-white/10 rounded-full px-2.5 py-0.5">
                  <BookOpen size={12} />
                  {profile.class_name}
                </span>
              )}
              {profile?.school_name && (
                <span className="flex items-center gap-1 text-xs text-indigo-100 bg-white/10 rounded-full px-2.5 py-0.5">
                  <SchoolIcon size={12} />
                  {profile.school_name}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">{accessedIds.size}</p>
          <p className="text-xs text-indigo-200">{t('studentPortal.materialsViewed')}</p>
        </div>
      </div>

      {!profile?.grade ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-md mx-auto shadow-sm">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <AlertCircle size={20} className="text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">{t('studentPortal.completeProfileTitle')}</h3>
              <p className="text-sm text-gray-500">{t('studentPortal.completeProfileSubtitle')}</p>
            </div>
          </div>

          {profileError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{profileError}</div>
          )}

          <form onSubmit={handleCompleteProfile} className="mt-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t('studentPortal.grade')} <span className="text-red-400">*</span>
              </label>
              <select
                value={profileGrade}
                onChange={(e) => setProfileGrade(e.target.value)}
                required
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm bg-white"
              >
                <option value="">{t('studentPortal.gradeSelectPlaceholder')}</option>
                {GRADES.map((g) => <option key={g} value={g}>{t('studentPortal.gradeLabel', { grade: g })}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t('studentPortal.className')} <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={profileClassName}
                onChange={(e) => setProfileClassName(e.target.value)}
                required
                placeholder={t('studentPortal.classNamePlaceholder')}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t('studentPortal.gender')} <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'female', label: t('studentPortal.genderFemale') },
                  { value: 'male', label: t('studentPortal.genderMale') },
                  { value: 'other', label: t('studentPortal.genderOther') },
                  { value: 'prefer_not_to_say', label: t('studentPortal.genderPreferNotToSay') }
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setProfileGender(value)}
                    className={`py-2 px-3 rounded-xl border text-sm font-medium transition-all ${
                      profileGender === value
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-rose-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t('studentPortal.schoolName')} <span className="text-gray-400 font-normal">{t('studentPortal.schoolNameOptional')}</span>
              </label>
              <select
                value={profileSchool}
                onChange={(e) => setProfileSchool(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm bg-white"
              >
                <option value="">{t('studentPortal.schoolNamePlaceholder')}</option>
                {INDIAN_SCHOOLS.map((school) => (
                  <option key={school} value={school}>{school}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={profileSaving || !profileGrade || !profileClassName.trim() || !profileGender}
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              {profileSaving ? t('studentPortal.completeProfileSaving') : t('studentPortal.completeProfileSave')}
            </button>
          </form>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-gray-900">
              {profile.class_name
                ? t('studentPortal.gradeMaterialsTitle', { grade: profile.grade, className: profile.class_name })
                : t('studentPortal.gradeLabel', { grade: profile.grade })}
            </h2>
              <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2.5 py-0.5">{filteredMaterials.length}</span>
            </div>
            <div className="bg-gray-100 p-1 rounded-xl flex gap-1">
              {FILTER_OPTIONS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filter === key ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {filteredMaterials.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="font-semibold text-gray-500">{t('studentPortal.noMaterialsYet')}</p>
              <p className="text-sm text-gray-400 mt-1">
                {filter !== 'All'
                  ? t('studentPortal.noMaterialsForFilter', { filter: filter.toLowerCase() })
                  : t('studentPortal.noMaterialsFromTeacher', { grade: profile.grade, className: profile.class_name ?? t('studentPortal.gradeLabel', { grade: profile.grade }) })}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMaterials.map((material) => {
                const cfg = TYPE_CONFIG[material.type] ?? TYPE_CONFIG.pdf;
                const Icon = cfg.icon;
                const viewed = accessedIds.has(material.id);
                return (
                  <div
                    key={material.id}
                    className="bg-white rounded-2xl border border-gray-200 hover:border-indigo-200 hover:shadow-md transition-all overflow-hidden"
                  >
                    <div className={`h-2 w-full ${cfg.bar}`} />
                    <div className="p-5">
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-xl ${cfg.iconBg} flex items-center justify-center flex-shrink-0`}>
                          <Icon size={18} className={cfg.iconColor} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm leading-snug">{material.title}</p>
                          <span className={`inline-block mt-1 text-xs rounded-full px-2 py-0.5 font-medium ${cfg.badge}`}>
                            {material.type.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {material.description && (
                        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{material.description}</p>
                      )}

                      <div className="flex items-center justify-between mt-auto">
                        <div>
                          {viewed && (
                            <span className="flex items-center gap-1 text-xs text-green-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                              {t('studentPortal.viewed')}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleOpen(material)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg px-3 py-2 transition-colors"
                        >
                          {t(cfg.actionKey)}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {lightboxMaterial && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxMaterial(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <p className="font-semibold text-gray-900 truncate">{lightboxMaterial.title}</p>
              <button onClick={() => setLightboxMaterial(null)} className="text-gray-400 hover:text-gray-700 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 flex items-center justify-center bg-gray-50">
              <img
                src={lightboxMaterial.url}
                alt={lightboxMaterial.title}
                className="max-h-[70vh] object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
