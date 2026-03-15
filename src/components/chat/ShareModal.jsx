import { useState } from 'react';
import { X, Mail, MessageSquare, Copy, Check } from 'lucide-react';

const ShareModal = ({ messages, onClose, youLabel, assistantLabel }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [copied, setCopied] = useState(false);

  const buildText = () =>
    messages
      .map(m => `${m.role === 'user' ? youLabel : assistantLabel}: ${m.content}`)
      .join('\n\n');

  const handleEmailShare = () => {
    const subject = encodeURIComponent('Period Education – Chat Conversation');
    const body = encodeURIComponent(buildText());
    window.location.href = `mailto:${encodeURIComponent(email)}?subject=${subject}&body=${body}`;
  };

  const handleSmsShare = () => {
    const body = encodeURIComponent(buildText());
    const number = phone.replace(/\D/g, '');
    const sep = /iPhone|iPad|iPod/i.test(navigator.userAgent) ? '&' : '?';
    window.location.href = `sms:${number}${sep}body=${body}`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* silently fail */
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-900">Share Conversation</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <Mail size={14} className="inline mr-1.5 text-gray-500" />
              Share via Email
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="recipient@example.com"
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleEmailShare}
                disabled={!email.trim()}
                className="px-4 py-2 bg-red-400 text-white rounded-lg text-sm font-medium hover:bg-red-500 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors"
              >
                Send
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">Opens your default email app with the conversation pre-filled.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <MessageSquare size={14} className="inline mr-1.5 text-gray-500" />
              Share via Text Message
            </label>
            <div className="flex gap-2">
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+1 555 123 4567"
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleSmsShare}
                disabled={!phone.trim()}
                className="px-4 py-2 bg-red-400 text-white rounded-lg text-sm font-medium hover:bg-red-500 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors"
              >
                Send
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">Opens your messaging app with the conversation pre-filled.</p>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={handleCopy}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {copied ? (
                <>
                  <Check size={16} className="text-green-500" />
                  <span className="text-green-600">Copied to clipboard!</span>
                </>
              ) : (
                <>
                  <Copy size={16} />
                  Copy conversation text
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
