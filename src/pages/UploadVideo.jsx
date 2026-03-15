import { useState } from 'react';
import { Upload, CircleCheck as CheckCircle, Circle as XCircle, Loader, Copy } from 'lucide-react';
import { supabase } from '../lib/supabase';

const UploadVideo = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');

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

      const { data, error: uploadError } = await supabase.storage
        .from('videos')
        .upload(generatedName, file, {
          cacheControl: '3600',
          upsert: false,
          duplex: 'half',
          onUploadProgress: (progress) => {
            const pct = Math.round((progress.loaded / progress.total) * 100);
            setUploadProgress(pct);
          },
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(generatedName);

      setVideoUrl(publicUrl);
      setUploadStatus('success');
    } catch (err) {
      console.error('Upload error:', err);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Upload Video</h1>
          <p className="text-gray-600 mb-8">
            Upload your educational videos to the storage bucket
          </p>

          <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-pink-400 transition-colors">
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
                className={`cursor-pointer flex flex-col items-center ${
                  uploading ? 'opacity-50' : ''
                }`}
              >
                {uploading ? (
                  <Loader className="w-16 h-16 text-pink-500 animate-spin mb-4" />
                ) : (
                  <Upload className="w-16 h-16 text-pink-500 mb-4" />
                )}
                <span className="text-lg font-medium text-gray-700 mb-2">
                  {uploading ? `Uploading... ${uploadProgress}%` : 'Click to upload video'}
                </span>
                <span className="text-sm text-gray-500">
                  MP4, WebM, OGG (Max 500MB)
                </span>
              </label>
            </div>

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
                    <p className="font-medium text-green-800 text-lg">
                      Upload Successful!
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      Your video has been uploaded successfully
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mt-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      File Name (for videoUrls.js):
                    </label>
                    <div className="flex items-center bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <code className="text-sm text-gray-800 flex-1 font-mono">
                        {fileName}
                      </code>
                      <button
                        onClick={() => copyToClipboard(fileName)}
                        className="ml-2 p-2 text-gray-600 hover:text-pink-600 transition-colors"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      Full URL:
                    </label>
                    <div className="flex items-center bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <code className="text-sm text-gray-800 flex-1 break-all font-mono">
                        {videoUrl}
                      </code>
                      <button
                        onClick={() => copyToClipboard(videoUrl)}
                        className="ml-2 p-2 text-gray-600 hover:text-pink-600 transition-colors"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                    <p className="text-sm font-medium text-blue-800 mb-2">
                      Next Steps:
                    </p>
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
            <h2 className="font-semibold text-gray-800 mb-3">Video ID Mapping:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-mono bg-white px-2 py-1 rounded">intro</span>
                <span className="text-gray-600 ml-2">→ Introduction to Puberty</span>
              </div>
              <div>
                <span className="font-mono bg-white px-2 py-1 rounded">cycle</span>
                <span className="text-gray-600 ml-2">→ Understanding the Cycle</span>
              </div>
              <div>
                <span className="font-mono bg-white px-2 py-1 rounded">products</span>
                <span className="text-gray-600 ml-2">→ Hygiene & Products</span>
              </div>
              <div>
                <span className="font-mono bg-white px-2 py-1 rounded">myths</span>
                <span className="text-gray-600 ml-2">→ Myths & Facts</span>
              </div>
              <div>
                <span className="font-mono bg-white px-2 py-1 rounded">hygiene</span>
                <span className="text-gray-600 ml-2">→ Hygiene Practices</span>
              </div>
              <div>
                <span className="font-mono bg-white px-2 py-1 rounded">support</span>
                <span className="text-gray-600 ml-2">→ Being Supportive</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadVideo;
