import { useState, useEffect, useRef } from 'react';
import { 
  Languages, 
  History, 
  Copy, 
  Check, 
  Trash2, 
  ArrowRightLeft, 
  Loader2,
  Trash,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { translateText, languages, TranslationResult } from './services/gemini';

export default function App() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('zh');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<TranslationResult[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(true);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('translation_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('translation_history', JSON.stringify(history));
  }, [history]);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    try {
      const result = await translateText(inputText, targetLang, sourceLang);
      setTranslatedText(result);
      
      const newEntry: TranslationResult = {
        originalText: inputText,
        translatedText: result,
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
        timestamp: Date.now(),
      };
      
      setHistory(prev => [newEntry, ...prev].slice(0, 50)); // Keep last 50
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const deleteHistoryItem = (timestamp: number) => {
    setHistory(prev => prev.filter(item => item.timestamp !== timestamp));
  };

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear all history?')) {
      setHistory([]);
    }
  };

  const swapLanguages = () => {
    if (sourceLang === 'auto') {
      setSourceLang(targetLang);
      setTargetLang('en'); // Default to English if source was auto
    } else {
      setSourceLang(targetLang);
      setTargetLang(sourceLang);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-bg">
      {/* Main Translation Area */}
      <main className="flex-1 p-6 md:p-10 flex flex-col max-w-4xl mx-auto w-full">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white shadow-lg shadow-accent/20">
              <Languages size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">LinguaFlow</h1>
              <p className="text-xs text-muted font-medium uppercase tracking-wider">AI Powered Studio</p>
            </div>
          </div>
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="md:hidden p-2 rounded-full hover:bg-line transition-colors"
          >
            <History size={20} />
          </button>
        </header>

        <section className="space-y-6">
          {/* Controls */}
          <div className="flex items-center gap-2 bg-line/30 p-1.5 rounded-2xl w-fit self-center md:self-start">
            <select 
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="bg-transparent text-sm font-medium px-4 py-2 rounded-xl focus:outline-none cursor-pointer hover:bg-surface/50 transition-colors appearance-none"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
            
            <button 
              onClick={swapLanguages}
              className="p-2 hover:bg-surface rounded-full transition-all text-muted hover:text-accent disabled:opacity-30"
              disabled={sourceLang === 'auto'}
            >
              <ArrowRightLeft size={16} />
            </button>

            <select 
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="bg-transparent text-sm font-medium px-4 py-2 rounded-xl focus:outline-none cursor-pointer hover:bg-surface/50 transition-colors appearance-none"
            >
              {languages.filter(l => l.code !== 'auto').map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>

          {/* Interaction Box */}
          <div className="grid md:grid-cols-2 gap-px bg-line rounded-3xl overflow-hidden shadow-sm border border-line">
            {/* Input */}
            <div className="bg-surface p-6 flex flex-col min-h-[300px]">
              <div className="flex-1 flex flex-col">
                <textarea
                  ref={textareaRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste text to translate..."
                  className="w-full h-full bg-transparent border-none focus:ring-0 resize-none text-lg placeholder:text-muted/40 font-normal leading-relaxed overflow-auto"
                />
              </div>
              <div className="flex items-center justify-between pt-4">
                <span className="text-xs text-muted font-mono">{inputText.length} characters</span>
                <button
                  onClick={handleTranslate}
                  disabled={isLoading || !inputText.trim()}
                  className="bg-accent text-white px-6 py-2.5 rounded-2xl font-medium shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:grayscale disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Translate'}
                </button>
              </div>
            </div>

            {/* Output */}
            <div className="bg-surface/50 p-6 flex flex-col min-h-[300px] border-t md:border-t-0 md:border-l border-line">
              <div className="flex-1 flex flex-col">
                <div className="w-full h-full text-lg font-normal leading-relaxed whitespace-pre-wrap overflow-auto">
                  {isLoading ? (
                    <div className="h-full flex items-center justify-center opacity-40">
                      <Loader2 size={32} className="animate-spin" />
                    </div>
                  ) : translatedText ? (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {translatedText}
                    </motion.div>
                  ) : (
                    <span className="text-muted/30 italic">Result will appear here</span>
                  )}
                </div>
              </div>
              {translatedText && !isLoading && (
                <div className="flex items-center justify-end pt-4">
                  <button 
                    onClick={() => copyToClipboard(translatedText, 'main')}
                    className="p-3 bg-surface rounded-2xl hover:bg-line transition-all border border-line flex items-center gap-2 text-sm font-medium"
                  >
                    {copied === 'main' ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                    {copied === 'main' ? 'Copied' : 'Copy'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* History Side Panel */}
      <AnimatePresence>
        {showHistory && (
          <motion.aside 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-full md:w-[380px] bg-surface border-l border-line flex flex-col h-[50vh] md:h-screen md:sticky md:top-0 shadow-2xl md:shadow-none"
          >
            <div className="p-6 border-bottom border-line flex items-center justify-between sticky top-0 bg-surface z-10">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted">
                <Clock size={16} />
                History
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={clearHistory}
                  title="Clear All"
                  className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors text-muted grayscale hover:grayscale-0"
                >
                  <Trash size={16} />
                </button>
                <button 
                  onClick={() => setShowHistory(false)}
                  className="md:hidden p-2 hover:bg-line rounded-lg"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-10 space-y-4">
              {history.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40 grayscale">
                  <History size={48} className="mb-4 stroke-1" />
                  <p className="text-sm">Your translation history will appear here.</p>
                </div>
              ) : (
                history.map((item) => (
                  <motion.div 
                    layout
                    key={item.timestamp}
                    className="group bg-bg p-4 rounded-2xl border border-line hover:border-accent/30 transition-all relative"
                  >
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-[10px] font-bold text-muted/60 uppercase tracking-tighter">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => copyToClipboard(item.translatedText, item.timestamp.toString())}
                          className="p-1.5 hover:bg-surface rounded-lg text-muted hover:text-accent"
                        >
                          {copied === item.timestamp.toString() ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                        </button>
                        <button 
                          onClick={() => deleteHistoryItem(item.timestamp)}
                          className="p-1.5 hover:bg-red-50 rounded-lg text-muted hover:text-red-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-muted line-clamp-2 italic">{item.originalText}</p>
                      <p className="text-sm font-medium line-clamp-3">{item.translatedText}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile Toggle Overlay Button (if history hidden) */}
      {!showHistory && (
        <button
          onClick={() => setShowHistory(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-accent text-white rounded-full shadow-xl flex items-center justify-center md:hidden z-50"
        >
          <History size={24} />
        </button>
      )}
    </div>
  );
}
