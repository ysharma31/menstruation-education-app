import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MessageCircle,
  Send,
  Mic,
  MicOff,
  Copy,
  Share2,
  Download,
  Trash2,
  Plus,
  AlertCircle,
  ArrowLeft,
  Check
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const Chat = () => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [lastMessageTime, setLastMessageTime] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  const starterQuestions = [
    t('chat.starterQuestions.q1'),
    t('chat.starterQuestions.q2'),
    t('chat.starterQuestions.q3'),
    t('chat.starterQuestions.q4'),
    t('chat.starterQuestions.q5'),
    t('chat.starterQuestions.q6')
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    initConversation();
  }, []);

  const initConversation = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert([{}])
        .select()
        .maybeSingle();

      if (error) throw error;
      if (data) setConversationId(data.id);
    } catch (err) {
      console.error('Error creating conversation:', err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (messageText = input) => {
    if (!messageText.trim() || isLoading) return;

    const now = Date.now();
    if (now - lastMessageTime < 2000) {
      setError(t('chat.rateLimitWarning'));
      setTimeout(() => setError(null), 3000);
      return;
    }
    setLastMessageTime(now);

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setError(null);
    setIsLoading(true);

    try {
      if (conversationId) {
        await supabase.from('chat_messages').insert([{
          session_id: conversationId,
          role: 'user',
          content: userMessage.content
        }]);
      }

      const apiMessages = messages
        .concat([userMessage])
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            messages: apiMessages,
            language: i18n.language
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (conversationId) {
        await supabase.from('chat_messages').insert([{
          session_id: conversationId,
          role: 'assistant',
          content: assistantMessage.content
        }]);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.message || t('chat.errors.failed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleStarterQuestion = (question) => {
    setInput(question);
    sendMessage(question);
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Voice input is not supported in this browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = i18n.language === 'hi' ? 'hi-IN' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      setError(t('chat.errors.generic'));
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const copyMessage = async (content, id) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(id);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadConversation = () => {
    const conversationText = messages
      .map(msg => `${msg.role === 'user' ? t('chat.you') : t('chat.assistant')}: ${msg.content}\n`)
      .join('\n');

    const blob = new Blob([conversationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-${new Date().toISOString()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareConversation = async () => {
    const conversationText = messages
      .map(msg => `${msg.role === 'user' ? t('chat.you') : t('chat.assistant')}: ${msg.content}`)
      .join('\n\n');

    if (navigator.share) {
      try {
        await navigator.share({
          title: t('chat.title'),
          text: conversationText
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyMessage(conversationText, 'share');
        }
      }
    } else {
      copyMessage(conversationText, 'share');
    }
  };

  const clearChat = async () => {
    setMessages([]);
    setShowConfirmClear(false);

    if (conversationId) {
      await supabase.from('chat_messages').delete().eq('session_id', conversationId);
      await supabase.from('chat_sessions').delete().eq('id', conversationId);
    }

    initConversation();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="page-container flex-1 flex flex-col max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">{t('common.backToHome')}</span>
          </Link>

          <div className="flex gap-2">
            {messages.length > 0 && (
              <>
                <button
                  onClick={downloadConversation}
                  className="p-2 hover:bg-warm-100 rounded-lg transition-colors"
                  title={t('chat.downloadChat')}
                >
                  <Download size={18} className="text-text-muted" />
                </button>
                <button
                  onClick={shareConversation}
                  className="p-2 hover:bg-warm-100 rounded-lg transition-colors"
                  title={t('chat.shareChat')}
                >
                  <Share2 size={18} className="text-text-muted" />
                </button>
                <button
                  onClick={() => setShowConfirmClear(true)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  title={t('chat.clearChat')}
                >
                  <Trash2 size={18} className="text-text-muted hover:text-red-600" />
                </button>
              </>
            )}
          </div>
        </div>

        <header className="gradient-peach rounded-3xl p-6 md:p-8 mb-6 border border-primary-100">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-warm">
              <MessageCircle className="w-7 h-7 md:w-8 md:h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-display font-bold text-text-primary">
                {t('chat.title')}
              </h1>
              <p className="text-primary-600 font-medium text-sm">{t('chat.subtitle')}</p>
            </div>
          </div>
        </header>

        <div className="bg-warm-50 border border-warm-200 rounded-2xl p-4 mb-6 text-sm text-text-muted">
          <div className="flex items-start gap-3">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5 text-primary-400" />
            <div>
              <p className="font-medium mb-1">{t('chat.disclaimer')}</p>
              <p className="text-xs">{t('chat.privacyNotice')}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-white rounded-3xl border border-warm-100 shadow-sm overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-display font-semibold text-text-primary mb-2">
                  {t('chat.empty.title')}
                </h3>
                <p className="text-text-secondary mb-6">
                  {t('chat.empty.subtitle')}
                </p>

                <div className="max-w-2xl mx-auto">
                  <p className="text-sm font-medium text-text-muted mb-3">
                    {t('chat.starterQuestions.title')}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {starterQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleStarterQuestion(question)}
                        className="p-3 text-left text-sm bg-warm-50 hover:bg-warm-100 border border-warm-200 rounded-lg transition-colors"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === 'user'
                          ? 'bg-secondary-100 text-secondary-700'
                          : 'bg-primary-100 text-primary-700'
                      }`}
                    >
                      {message.role === 'user' ? (
                        <span className="text-sm font-semibold">
                          {t('chat.you')[0]}
                        </span>
                      ) : (
                        <MessageCircle size={16} />
                      )}
                    </div>

                    <div
                      className={`flex-1 max-w-[85%] md:max-w-[75%] ${
                        message.role === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`rounded-2xl p-4 ${
                          message.role === 'user'
                            ? 'bg-secondary-500 text-white rounded-tr-sm'
                            : 'bg-warm-100 text-text-primary rounded-tl-sm'
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 mt-2 px-2">
                        <span className="text-xs text-text-muted">
                          {new Date(message.timestamp).toLocaleTimeString(i18n.language, {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        {message.role === 'assistant' && (
                          <button
                            onClick={() => copyMessage(message.content, message.id)}
                            className="p-1 hover:bg-warm-100 rounded transition-colors"
                            title={t('chat.copyMessage')}
                          >
                            {copiedMessageId === message.id ? (
                              <Check size={12} className="text-green-600" />
                            ) : (
                              <Copy size={12} className="text-text-muted" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center flex-shrink-0">
                      <MessageCircle size={16} />
                    </div>
                    <div className="bg-warm-100 rounded-2xl rounded-tl-sm p-4">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {error && (
            <div className="px-4 py-2 bg-red-50 border-t border-red-200">
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}

          <div className="border-t border-warm-200 p-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('chat.placeholder')}
                  disabled={isLoading}
                  className="w-full resize-none rounded-xl border border-warm-300 px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-warm-50 disabled:cursor-not-allowed"
                  rows={1}
                  style={{
                    minHeight: '48px',
                    maxHeight: '120px',
                    height: 'auto'
                  }}
                  onInput={(e) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                  }}
                />
                {isListening && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>

              <button
                onClick={isListening ? stopVoiceInput : startVoiceInput}
                className={`p-3 rounded-xl transition-colors touch-target ${
                  isListening
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-warm-100 text-text-muted hover:bg-warm-200'
                }`}
                title={isListening ? t('chat.stopListening') : t('chat.voiceInput')}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>

              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                className="p-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:bg-warm-300 disabled:cursor-not-allowed transition-colors touch-target"
                title={t('chat.send')}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showConfirmClear && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              {t('chat.clearChat')}
            </h3>
            <p className="text-sm text-text-secondary mb-6">
              {t('chat.confirmClear')}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmClear(false)}
                className="flex-1 px-4 py-2 border border-warm-300 rounded-lg hover:bg-warm-50 transition-colors"
              >
                {t('chat.no')}
              </button>
              <button
                onClick={clearChat}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                {t('chat.yes')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
