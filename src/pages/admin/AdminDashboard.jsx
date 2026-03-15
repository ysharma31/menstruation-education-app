import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Upload, LogOut, Loader, CircleCheck as CheckCircle, Circle as XCircle, Copy } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const uploadWithTus = async (file, fileName, onProgress) => {
  const { Upload } = await import('tus-js-client');

  return new Promise((resolve, reject) => {
    const upload = new Upload(file, {
      endpoint: `${SUPABASE_URL}/storage/v1/upload/resumable`,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      headers: {
        authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'x-upsert': 'false',
      },
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true,
      metadata: {
        bucketName: 'videos',
        objectName: fileName,
        contentType: file.type,
        cacheControl: '3600',
      },
      chunkSize: 6 * 1024 * 1024,
      onError: (error) => reject(error),
      onProgress: (bytesUploaded, bytesTotal) => {
        const pct = Math.round((bytesUploaded / bytesTotal) * 100);
        onProgress(pct);
      },
      onSuccess: () => resolve(),
    });

    upload.findPreviousUploads().then((previousUploads) => {
      if (previousUploads.length > 0) {
        upload.resumeFromPreviousUpload(previousUploads[0]);
      }
      upload.start();
    });
  });
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/admin'); return; }

      const { data: adminRow } = await supabase
        .from('admins')
        .select('id, email')
        .eq('id', session.user.id)
        .maybeSingle();

      if (!adminRow) {
        await supabase.auth.signOut();
        navigate('/admin');
        return;
      }

      setAdminEmail(adminRow.email);
      setCheckingAuth(false);
    };

    checkAdmin();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const handleFileUpload = async (event) => {
    try {
      setUploading(true);
      setError('');
      setUploadStatus(null);
      setVideoUrl('');
      setUploadProgress(0);

      const file = event.target.files[0];
      if (!file) return;

      if (file.size > 500 * 1024 * 1024) {
        setError('File size must be less than 500MB');
        setUploading(false);
        return;
      }

      const fileExt = file.name.split('.').pop();
      const generatedName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      setFileName(generatedName);

      await uploadWithTus(file, generatedName, setUploadProgress);

      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(generatedName);

      setVideoUrl(publicUrl);
      setUploadStatus('success');
    } catch (err) {
      setError(err.message || 'Failed to upload video');
      setUploadStatus('error');
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="w-8 h-8 text-gray-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gray-800 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-sm">Admin Dashboard</h1>
              <p className="text-xs text-gray-500">{adminEmail}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
              View Site
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 transition-colors"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <Upload className="w-6 h-6 text-gray-700" />
            <h2 className="text-xl font-bold text-gray-800">Upload Lesson Video</h2>
          </div>

          <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                accept="video/mp4,video/webm,video/ogg,video/quicktime"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
                id="video-upload"
              />
              <label
                htmlFor="video-upload"
                className={`cursor-pointer flex flex-col items-center ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {uploading ? (
                  <Loader className="w-16 h-16 text-gray-500 animate-spin mb-4" />
                ) : (
                  <Upload className="w-16 h-16 text-gray-400 mb-4" />
                )}
                <span className="text-lg font-medium text-gray-700 mb-2">
                  {uploading ? `Uploading... ${uploadProgress}%` : 'Click to upload video'}
                </span>
                <span className="text-sm text-gray-400">MP4, WebM, OGG (Max 500MB)</span>
              </label>
            </div>

            {uploading && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gray-700 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                <XCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-800">Upload Failed</p>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
              </div>
            )}

            {uploadStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-start mb-4">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-green-800 text-lg">Upload Successful!</p>
                    <p className="text-sm text-green-600 mt-1">Your video has been uploaded successfully</p>
                  </div>
                </div>

                <div className="space-y-4 mt-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">File Name (for videoUrls.js):</label>
                    <div className="flex items-center bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <code className="text-sm text-gray-800 flex-1 font-mono">{fileName}</code>
                      <button
                        onClick={() => copyToClipboard(fileName)}
                        className="ml-2 p-2 text-gray-600 hover:text-gray-800 transition-colors"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Full URL:</label>
                    <div className="flex items-center bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <code className="text-sm text-gray-800 flex-1 break-all font-mono">{videoUrl}</code>
                      <button
                        onClick={() => copyToClipboard(videoUrl)}
                        className="ml-2 p-2 text-gray-600 hover:text-gray-800 transition-colors"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                    <p className="text-sm font-medium text-blue-800 mb-2">Next Steps:</p>
                    <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                      <li>Copy the file name above</li>
                      <li>Open <code className="bg-blue-100 px-1 rounded">src/config/videoUrls.js</code></li>
                      <li>Add the file name to the appropriate video ID</li>
                      <li>Save the file and your video will appear!</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-3">Video ID Mapping:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {[
                ['intro', 'Introduction to Puberty'],
                ['cycle', 'Understanding the Cycle'],
                ['products', 'Hygiene & Products'],
                ['myths', 'Myths & Facts'],
                ['hygiene', 'Hygiene Practices'],
                ['support', 'Being Supportive'],
              ].map(([id, label]) => (
                <div key={id}>
                  <span className="font-mono bg-white px-2 py-1 rounded border border-gray-200">{id}</span>
                  <span className="text-gray-600 ml-2">→ {label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
