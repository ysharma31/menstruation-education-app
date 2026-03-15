import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Image, Video, Upload, Link, Loader, Check, X, GraduationCap } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

const MAX_FILE_SIZE = 50 * 1024 * 1024;

const MaterialUpload = ({ onUploaded, classes = [] }) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const fileInputRef = useRef(null);

  const TYPE_OPTIONS = [
    { value: 'pdf', label: t('teacherPortal.typePdf'), icon: FileText, color: 'red' },
    { value: 'image', label: t('teacherPortal.typeImage'), icon: Image, color: 'blue' },
    { value: 'video', label: t('teacherPortal.typeVideo'), icon: Video, color: 'teal' }
  ];

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [classId, setClassId] = useState('');
  const [type, setType] = useState('');
  const [file, setFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    if (selected.size > MAX_FILE_SIZE) {
      setError('File exceeds the 50 MB limit.');
      return;
    }
    setError('');
    setFile(selected);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setClassId('');
    setType('');
    setFile(null);
    setVideoUrl('');
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!classId) { setError(t('teacherPortal.errorSelectClass')); return; }
    if (!title.trim()) { setError(t('teacherPortal.errorTitleRequired')); return; }
    if (!type) { setError(t('teacherPortal.errorSelectType')); return; }
    if ((type === 'pdf' || type === 'image') && !file) { setError(t('teacherPortal.errorSelectFile')); return; }
    if (type === 'video' && !videoUrl.trim()) { setError(t('teacherPortal.errorEnterVideoUrl')); return; }

    const selectedClass = classes.find((c) => c.id === classId);

    setSubmitting(true);
    try {
      let url = videoUrl.trim();
      let filePath = null;

      if (type === 'pdf' || type === 'image') {
        const ext = file.name.split('.').pop();
        filePath = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('course-materials')
          .upload(filePath, file, { cacheControl: '3600', upsert: false });
        if (uploadError) throw uploadError;
        const { data: publicData } = supabase.storage
          .from('course-materials')
          .getPublicUrl(filePath);
        url = publicData.publicUrl;
      }

      const { data, error: insertError } = await supabase
        .from('course_materials')
        .insert({
          teacher_id: user.id,
          class_id: classId,
          title: title.trim(),
          description: description.trim() || null,
          type,
          url,
          file_name: filePath,
          grade: selectedClass?.grade ?? null,
          class_name: selectedClass?.class_name ?? null
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setSuccess(true);
      onUploaded(data);
      setTimeout(() => {
        setSuccess(false);
        resetForm();
      }, 2000);
    } catch (err) {
      setError(err.message || t('teacherPortal.errorUploadFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  const acceptAttr = type === 'pdf' ? 'application/pdf' : 'image/png,image/jpeg,image/gif,image/webp';

  return (
    <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center">
          <Upload className="w-5 h-5 text-green-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">{t('teacherPortal.uploadMaterial')}</h2>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
      )}

      {classes.length === 0 && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
          {t('teacherPortal.needClassFirst')}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {t('teacherPortal.class')} <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <GraduationCap size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              disabled={classes.length === 0}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 text-sm bg-white disabled:opacity-50"
            >
              <option value="">{t('teacherPortal.selectClass')}</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.class_name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {t('teacherPortal.title')} <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('teacherPortal.titlePlaceholder')}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('teacherPortal.description')}</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder={t('teacherPortal.descriptionPlaceholder')}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 text-sm resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {t('teacherPortal.materialType')} <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {TYPE_OPTIONS.map(({ value, label, icon: Icon, color }) => {
              const isSelected = type === value;
              const colorMap = {
                red: isSelected ? 'border-red-400 bg-red-50 text-red-700' : 'border-gray-200 text-gray-600 hover:border-red-200',
                blue: isSelected ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-blue-200',
                teal: isSelected ? 'border-teal-400 bg-teal-50 text-teal-700' : 'border-gray-200 text-gray-600 hover:border-teal-200'
              };
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => { setType(value); setFile(null); setVideoUrl(''); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                  className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border-2 text-xs font-medium transition-all ${colorMap[color]}`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {(type === 'pdf' || type === 'image') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('teacherPortal.file')}</label>
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptAttr}
              onChange={handleFileChange}
              className="hidden"
            />
            {file ? (
              <div className="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-xl">
                <FileText size={16} className="text-green-600 flex-shrink-0" />
                <span className="text-sm text-green-800 truncate flex-1">{file.name}</span>
                <button
                  type="button"
                  onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                  className="text-green-600 hover:text-red-500"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-green-300 hover:bg-green-50 transition-all"
              >
                <Upload size={22} className="text-gray-400" />
                <p className="text-sm text-gray-600 font-medium">{t('teacherPortal.clickToSelect')}</p>
                <p className="text-xs text-gray-400">{t('teacherPortal.maxFileSize')}</p>
              </div>
            )}
          </div>
        )}

        {type === 'video' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('teacherPortal.videoUrl')}</label>
            <div className="relative">
              <Link size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder={t('teacherPortal.videoUrlPlaceholder')}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 text-sm"
              />
            </div>
            <p className="mt-1 text-xs text-gray-400">{t('teacherPortal.videoUrlHint')}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || success || classes.length === 0}
          className={`w-full py-3 font-semibold rounded-xl transition-all text-sm flex items-center justify-center gap-2 ${
            success
              ? 'bg-green-500 text-white'
              : 'bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white'
          }`}
        >
          {submitting ? (
            <><Loader size={16} className="animate-spin" /> {t('teacherPortal.uploading')}</>
          ) : success ? (
            <><Check size={16} /> {t('teacherPortal.uploaded')}</>
          ) : (
            t('teacherPortal.uploadMaterialButton')
          )}
        </button>
      </form>
    </div>
  );
};

export default MaterialUpload;
