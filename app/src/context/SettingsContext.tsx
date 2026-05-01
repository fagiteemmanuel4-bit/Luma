import { createContext, useContext, useEffect, useState } from 'react';

type ReadingLevel = 'simple' | 'standard' | 'technical';

interface SettingsContextType {
  readingLevel: ReadingLevel;
  setReadingLevel: (level: ReadingLevel) => void;
  voiceEnabled: boolean;
  setVoiceEnabled: (enabled: boolean) => void;
  autoSubmitVoice: boolean;
  setAutoSubmitVoice: (enabled: boolean) => void;
  searchHistoryEnabled: boolean;
  setSearchHistoryEnabled: (enabled: boolean) => void;
  fontSize: 'small' | 'medium' | 'large';
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  clearHistory: () => void;
  clearCache: () => void;
}

const SettingsContext = createContext<SettingsContextType>({
  readingLevel: 'standard',
  setReadingLevel: () => {},
  voiceEnabled: true,
  setVoiceEnabled: () => {},
  autoSubmitVoice: true,
  setAutoSubmitVoice: () => {},
  searchHistoryEnabled: true,
  setSearchHistoryEnabled: () => {},
  fontSize: 'medium',
  setFontSize: () => {},
  clearHistory: () => {},
  clearCache: () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [readingLevel, setReadingLevel] = useState<ReadingLevel>(() => {
    return (localStorage.getItem('luma_reading_level') as ReadingLevel) || 'standard';
  });
  const [voiceEnabled, setVoiceEnabled] = useState(() => {
    return localStorage.getItem('luma_voice_enabled') !== 'false';
  });
  const [autoSubmitVoice, setAutoSubmitVoice] = useState(() => {
    return localStorage.getItem('luma_auto_submit_voice') !== 'false';
  });
  const [searchHistoryEnabled, setSearchHistoryEnabled] = useState(() => {
    return localStorage.getItem('luma_history_enabled') !== 'false';
  });
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>(() => {
    return (localStorage.getItem('luma_font_size') as 'small' | 'medium' | 'large') || 'medium';
  });

  useEffect(() => {
    localStorage.setItem('luma_reading_level', readingLevel);
  }, [readingLevel]);

  useEffect(() => {
    localStorage.setItem('luma_voice_enabled', voiceEnabled.toString());
  }, [voiceEnabled]);

  useEffect(() => {
    localStorage.setItem('luma_auto_submit_voice', autoSubmitVoice.toString());
  }, [autoSubmitVoice]);

  useEffect(() => {
    localStorage.setItem('luma_history_enabled', searchHistoryEnabled.toString());
  }, [searchHistoryEnabled]);

  useEffect(() => {
    localStorage.setItem('luma_font_size', fontSize);
    const scale = fontSize === 'small' ? 0.9 : fontSize === 'large' ? 1.1 : 1;
    document.documentElement.style.setProperty('--font-scale', scale.toString());
  }, [fontSize]);

  const clearHistory = () => {
    localStorage.removeItem('luma_search_history');
  };

  const clearCache = () => {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('luma-results-'));
    keys.forEach(k => localStorage.removeItem(k));
  };

  return (
    <SettingsContext.Provider value={{
      readingLevel, setReadingLevel,
      voiceEnabled, setVoiceEnabled,
      autoSubmitVoice, setAutoSubmitVoice,
      searchHistoryEnabled, setSearchHistoryEnabled,
      fontSize, setFontSize,
      clearHistory, clearCache,
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
