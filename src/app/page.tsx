'use client';

import React, { useState } from 'react';
import { 
  Terminal, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  RefreshCw, 
  Copy, 
  Check, 
  Code2, 
  HelpCircle, 
  Wrench,
  Trash2
} from 'lucide-react';

const SAMPLE_ERRORS = [
  {
    label: 'React / JS Map Error',
    trace: `TypeError: Cannot read properties of undefined (reading 'map')
    at UserList (components/UserList.js:14:22)
    at renderWithHooks (react-dom.development.js:16305:18)`
  },
  {
    label: 'Node.js CORS Error',
    trace: `Access to fetch at 'https://api.example.com/data' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.`
  },
  {
    label: 'Python Key Error',
    trace: `Traceback (most recent call last):
  File "app.py", line 22, in <module>
    user_age = user_data['age']
KeyError: 'age'`
  }
];

export default function Home() {
  const [stackTrace, setStackTrace] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedFix, setCopiedFix] = useState(false);
  const [result, setResult] = useState<{
    summary?: string;
    explanation?: string;
    suggestedFix?: string;
    error?: string;
  } | null>(null);

  const handleTranslate = async () => {
    if (!stackTrace.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stackTrace }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze stack trace');
      }

      setResult(data);
    } catch (err: any) {
      setResult({ error: err.message || 'An unexpected error occurred.' });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFix(true);
    setTimeout(() => setCopiedFix(false), 2000);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center p-4 sm:p-8 md:p-12 font-sans selection:bg-indigo-500 selection:text-white">
      <div className="max-w-4xl w-full space-y-8">
        
        {/* Header */}
        <header className="text-center space-y-4 pt-4">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/30 px-4 py-1.5 rounded-full text-indigo-400 text-sm font-medium shadow-sm">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>AI-Powered Error Debugger</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
            Stack Trace Translator
          </h1>
          
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Transform confusing terminal logs and stack traces into clear, human-readable explanations with ready-to-use code fixes.
          </p>
        </header>

        {/* Input Section */}
        <section className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4">
          
          {/* Top Window Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block"></span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300 font-mono text-xs sm:text-sm pl-2 border-l border-slate-800">
                <Terminal className="w-4 h-4 text-indigo-400" />
                <span>Console Log / Stack Trace</span>
              </div>
            </div>

            {stackTrace && (
              <button
                onClick={() => setStackTrace('')}
                className="inline-flex items-center space-x-1 text-xs text-slate-400 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>

          {/* Textarea */}
          <div className="relative">
            <textarea
              value={stackTrace}
              onChange={(e) => setStackTrace(e.target.value)}
              placeholder={`Paste your error stack trace here...\n\nExample:\nTypeError: Cannot read properties of undefined (reading 'map')\n    at UserList (components/UserList.js:14:22)`}
              className="w-full h-52 bg-slate-950/90 border border-slate-800 rounded-xl p-4 font-mono text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder:text-slate-600 resize-y leading-relaxed"
            />
          </div>

          {/* Quick Preset Buttons */}
          <div className="space-y-2">
            <span className="text-xs text-slate-400 font-medium">Try a sample error:</span>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_ERRORS.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => setStackTrace(sample.trace)}
                  className="text-xs bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-indigo-300 border border-slate-700/60 px-3 py-1.5 rounded-lg transition-all"
                >
                  + {sample.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleTranslate}
            disabled={loading || !stackTrace.trim()}
            className="w-full py-3.5 px-6 rounded-xl font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-600/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Analyzing Error...</span>
              </>
            ) : (
              <>
                <span>Translate Error</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </section>

        {/* Output Section */}
        {result && (
          <section className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
            {result.error ? (
              <div className="flex items-start space-x-3 text-red-400 bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-400" />
                <div>
                  <h3 className="font-semibold text-red-300">Analysis Failed</h3>
                  <p className="text-sm text-red-400/90 mt-1">{result.error}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* 1. Summary */}
                <div className="space-y-2">
                  <div className="inline-flex items-center space-x-2 text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-lg text-sm font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Summary</span>
                  </div>
                  <p className="text-slate-100 bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-sm sm:text-base leading-relaxed">
                    {result.summary}
                  </p>
                </div>

                {/* 2. Detailed Explanation */}
                <div className="space-y-2">
                  <div className="inline-flex items-center space-x-2 text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-lg text-sm font-semibold">
                    <HelpCircle className="w-4 h-4" />
                    <span>What Went Wrong</span>
                  </div>
                  <p className="text-slate-300 bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-sm leading-relaxed">
                    {result.explanation}
                  </p>
                </div>

                {/* 3. Suggested Fix */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center space-x-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg text-sm font-semibold">
                      <Wrench className="w-4 h-4" />
                      <span>Suggested Fix</span>
                    </div>

                    {result.suggestedFix && (
                      <button
                        onClick={() => copyToClipboard(result.suggestedFix || '')}
                        className="inline-flex items-center space-x-1 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-all"
                      >
                        {copiedFix ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Code</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <div className="relative group">
                    <pre className="bg-slate-950 border border-slate-800 p-4 rounded-xl overflow-x-auto text-emerald-400 font-mono text-sm leading-relaxed">
                      <code>{result.suggestedFix}</code>
                    </pre>
                  </div>
                </div>

              </div>
            )}
          </section>
        )}

      </div>
    </main>
  );
}