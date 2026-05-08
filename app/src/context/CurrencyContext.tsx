import React, { createContext, useContext, useEffect, useState } from 'react';

type CurrencyInfo = {
  code: string;
  symbol: string;
};

interface CurrencyContextType {
  currency: CurrencyInfo;
  setCurrency: (currency: CurrencyInfo) => void;
  detectedCountry: string;
  isLoading: boolean;
}

const currencyMap: Record<string, CurrencyInfo> = {
  NG: { code: 'NGN', symbol: '₦' },
  GH: { code: 'GHS', symbol: 'GH₵' },
  KE: { code: 'KES', symbol: 'KSh' },
  ZA: { code: 'ZAR', symbol: 'R' },
  GB: { code: 'GBP', symbol: '£' },
  US: { code: 'USD', symbol: '$' },
  CA: { code: 'USD', symbol: '$' },
  EU: { code: 'EUR', symbol: '€' },
  IN: { code: 'INR', symbol: '₹' },
};

const defaultCurrency: CurrencyInfo = { code: 'USD', symbol: '$' };

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyInfo>(() => {
    const saved = localStorage.getItem('screenix_currency');
    return saved ? JSON.parse(saved) : defaultCurrency;
  });
  const [detectedCountry, setDetectedCountry] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const detectCurrency = async () => {
      try {
        const saved = localStorage.getItem('screenix_currency');
        if (saved) {
          setIsLoading(false);
          return;
        }

        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        const countryCode = data.country_code;
        setDetectedCountry(data.country_name);

        const detected = currencyMap[countryCode] || defaultCurrency;
        setCurrencyState(detected);
        localStorage.setItem('screenix_currency', JSON.stringify(detected));
      } catch (error) {
        console.error('Failed to detect currency:', error);
      } finally {
        setIsLoading(false);
      }
    };

    detectCurrency();
  }, []);

  const setCurrency = (newCurrency: CurrencyInfo) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('screenix_currency', JSON.stringify(newCurrency));
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, detectedCountry, isLoading }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
