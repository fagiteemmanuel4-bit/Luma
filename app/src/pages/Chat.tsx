import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, Settings, BarChart3, X, ChevronUp, ChevronDown, MessageSquare, BookOpen, Zap } from 'lucide-react';
import { fanOutSearch, getDualSynthesis, API_REGISTRY } from '@/api/fanOut';
import { useSettings } from '@/context/SettingsContext';
import Navbar from '@/components/Navbar';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: string[];
  mode?: string;
}

interface ResourceUsage {
  apiCalls: number;
  tokensUsed: number;
  responseTime: number;
  modelsUsed: string[];
}

const MODES = {
  general: { name: 'General', icon: MessageSquare, color: 'var(--accent-primary)' },
  study: { name: 'Study Mode', icon: BookOpen, color: '#3b82f6' },
  research: { name: 'Research', icon: Zap, color: '#f59e0b' },
};

export default function ChatPage() {
  const { readingLevel } = useSettings();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentMode, setCurrentMode] = useState('general');
  const [showResourcePanel, setShowResourcePanel] = useState(false);
  const [resourceUsage, setResourceUsage] = useState<ResourceUsage>({
    apiCalls: 0,
    tokensUsed: 0,
    responseTime: 0,
    modelsUsed: [],
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const buildFileContext = async (files: File[]) => {
    const fileSummaries: string[] = [];

    for (const file of files) {
      const isText = file.type.startsWith('text/') || /\.(txt|md|json|csv)$/i.test(file.name);
      if (isText) {
        const text = await file.text();
        fileSummaries.push(`File: ${file.name}\n${text.slice(0, 2500)}`);
      } else {
        fileSummaries.push(`File: ${file.name} (${file.type || 'unknown'}) attached.`);
      }
    }

    return fileSummaries.join('\n\n');
  };

  const handleSend = async () => {
    if (!input.trim() && uploadedFiles.length === 0) return;

    const fileContext = await buildFileContext(uploadedFiles);
    const promptText = [input.trim(), fileContext].filter(Boolean).join('\n\n');

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input || 'Uploaded files for review',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const startTime = performance.now();

      const { results } = await fanOutSearch(input || fileContext, [], (api, status) => {
        // Update progress if needed
      });

      const refinedResponse = await getDualSynthesis(promptText, results, readingLevel, currentMode);

      const endTime = performance.now();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: refinedResponse,
        timestamp: new Date(),
        sources: Object.entries(results)
          .filter(([, result]) => result?.data)
          .map(([key]) => key),
        mode: currentMode,
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Update resource usage
      setResourceUsage(prev => ({
        apiCalls: prev.apiCalls + Object.keys(results).length,
        tokensUsed: prev.tokensUsed + Math.floor(refinedResponse.length / 4), // Rough estimate
        responseTime: endTime - startTime,
        modelsUsed: ['Gemma', 'Grok'], // Two models
      }));

    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setUploadedFiles([]);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatMessage = (content: string) => {
    if (!content) return '';

    let html = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/^###\s*(.*)$/gm, '<div class="text-sm font-semibold mt-3 mb-1">$1</div>')
      .replace(/^##\s*(.*)$/gm, '<div class="text-sm font-semibold mt-3 mb-1">$1</div>')
      .replace(/^[-*]\s+(.*)$/gm, '<div class="flex gap-2"><span>•</span><span>$1</span></div>');

    html = html.replace(/\n/g, '<br>');
    return html;
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />

      <div className="flex-1 flex flex-col pt-20">
        {/* Chat Header */}
        <div className="px-4 py-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
              <h1 className="font-display text-2xl" style={{ color: 'var(--text-primary)' }}>
                Luma Chat
              </h1>
              <div className="flex gap-2">
                {Object.entries(MODES).map(([key, mode]) => (
                  <button
                    key={key}
                    onClick={() => setCurrentMode(key)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      currentMode === key ? 'ring-2 ring-offset-2' : ''
                    }`}
                    style={{
                      backgroundColor: currentMode === key ? mode.color : 'var(--bg-secondary)',
                      color: currentMode === key ? 'var(--text-inverse)' : 'var(--text-secondary)',
                      borderColor: currentMode === key ? mode.color : 'transparent',
                    }}
                  >
                    <mode.icon size={12} className="inline mr-1" />
                    {mode.name}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => setShowResourcePanel(!showResourcePanel)}
              className="p-2 rounded-lg transition-colors"
              style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)' }}
            >
              <BarChart3 size={16} />
            </button>
          </div>
        </div>

        {/* Resource Panel */}
        <AnimatePresence>
          {showResourcePanel && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-b overflow-hidden"
              style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-secondary)' }}
            >
              <div className="px-4 py-3 max-w-4xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {resourceUsage.apiCalls}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>API Calls</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {resourceUsage.tokensUsed.toLocaleString()}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Tokens Used</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {Math.round(resourceUsage.responseTime)}ms
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Response Time</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {resourceUsage.modelsUsed.length}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Models Used</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 max-w-4xl mx-auto w-full">
          <div className="space-y-6">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare size={48} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
                <h3 className="font-display text-xl mb-2" style={{ color: 'var(--text-primary)' }}>
                  Start a conversation
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Ask me anything! I can help with research, study materials, or general questions.
                </p>
              </div>
            )}

            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'rounded-br-md'
                        : 'rounded-bl-md'
                    }`}
                    style={{
                      backgroundColor: message.role === 'user' ? 'var(--accent-primary)' : 'var(--bg-card)',
                      color: message.role === 'user' ? 'var(--text-inverse)' : 'var(--text-primary)',
                      border: message.role === 'assistant' ? '1px solid var(--border-subtle)' : 'none',
                    }}
                  >
                    <div
                      className="text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                    />
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                        <div className="text-xs text-muted-foreground mb-2">Sources:</div>
                        <div className="flex flex-wrap gap-1">
                          {message.sources.slice(0, 3).map((source, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 rounded text-xs"
                              style={{
                                backgroundColor: 'var(--bg-secondary)',
                                color: 'var(--text-muted)',
                              }}
                            >
                              {API_REGISTRY[source as keyof typeof API_REGISTRY]?.name || source}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div
                  className="max-w-[80%] rounded-2xl rounded-bl-md px-4 py-3"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-accent-primary animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-accent-primary animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 rounded-full bg-accent-primary animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      Thinking with two models...
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>

        {/* Floating Input */}
        <div className="sticky bottom-0 px-4 py-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
          <div className="max-w-4xl mx-auto">
            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <Paperclip size={14} style={{ color: 'var(--text-muted)' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{file.name}</span>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 rounded hover:bg-red-100"
                    >
                      <X size={12} style={{ color: 'var(--text-muted)' }} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input Box */}
            <div
              className="flex items-end gap-3 rounded-2xl px-4 py-3 shadow-lg"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-lg transition-colors"
                style={{ color: 'var(--text-muted)' }}
              >
                <Paperclip size={18} />
              </button>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask me anything..."
                className="flex-1 bg-transparent outline-none resize-y min-h-[68px] max-h-40 text-sm"
                style={{ color: 'var(--text-primary)' }}
                rows={3}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() && uploadedFiles.length === 0}
                className="p-2 rounded-lg transition-all disabled:opacity-50"
                style={{
                  backgroundColor: 'var(--accent-primary)',
                  color: 'var(--text-inverse)',
                }}
              >
                <Send size={18} />
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*,.pdf,.txt,.doc,.docx"
            />
          </div>
        </div>
      </div>
    </div>
  );
}