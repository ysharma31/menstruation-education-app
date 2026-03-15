import { useState } from 'react';
import { Copy, Check, Link as LinkIcon } from 'lucide-react';

const SharePanel = ({ classCode }) => {
  const [codeCopied, setCodeCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const origin = window.location.origin;
  const joinUrl = `${origin}/?join=${classCode}`;

  const copyText = async (text, setter) => {
    try {
      await navigator.clipboard.writeText(text);
      setter(true);
      setTimeout(() => setter(false), 2000);
    } catch {
      /* clipboard not available */
    }
  };

  return (
    <div className="bg-green-600 rounded-2xl p-6 text-white">
      <p className="text-green-100 text-sm font-medium mb-3">Class Code</p>
      <div className="flex items-center gap-3 mb-5">
        <span className="text-5xl font-mono font-black tracking-widest">{classCode}</span>
        <button
          onClick={() => copyText(classCode, setCodeCopied)}
          className="ml-auto flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition-colors"
        >
          {codeCopied ? <Check size={16} /> : <Copy size={16} />}
          {codeCopied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <div className="bg-white/10 rounded-xl p-4">
        <div className="flex items-start gap-2 mb-3">
          <LinkIcon size={15} className="text-green-200 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-green-100 font-medium">Shareable link — students tap this to auto-fill the code</p>
        </div>
        <div className="flex items-center gap-2">
          <code className="flex-1 text-xs bg-white/10 rounded-lg px-3 py-2 truncate text-green-50 font-mono">
            {joinUrl}
          </code>
          <button
            onClick={() => copyText(joinUrl, setLinkCopied)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-medium transition-colors"
          >
            {linkCopied ? <Check size={13} /> : <Copy size={13} />}
            {linkCopied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <p className="mt-4 text-xs text-green-200 leading-relaxed">
        Share this code or link with your students. They can join from the app home page. Joining is optional and voluntary.
      </p>
    </div>
  );
};

export default SharePanel;
