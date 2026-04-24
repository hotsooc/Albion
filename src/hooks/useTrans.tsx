import React, { createContext, useContext, useCallback, useEffect, useState, ReactNode } from "react";
import { VnScript } from "./vi";
import { EnglishScript } from "./en";
import moment from "moment";
import 'moment/locale/vi';

type Language = 'vi' | 'en';

interface TransContextType {
    lang: Language;
    trans: typeof VnScript;
    changeLanguage: (newLang: Language) => void;
}

const TransContext = createContext<TransContextType | undefined>(undefined);

function getTrans(locale: string) {
    switch (locale) {
        case 'vi': return VnScript;
        case 'en': return EnglishScript;
        default: return VnScript;
    }
}

export const TransProvider = ({ children }: { children: ReactNode }) => {
    const [lang, setLang] = useState<Language>('vi');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedLang = localStorage.getItem('lang') as Language;
            if (savedLang) {
                setLang(savedLang);
            }
            setIsLoaded(true);
        }
    }, []);

    useEffect(() => {
        moment.locale(lang);
    }, [lang]);

    const changeLanguage = useCallback((newLang: Language) => {
        setLang(newLang);
        localStorage.setItem('lang', newLang);
        moment.locale(newLang);
    }, []);

    const trans = getTrans(lang);

    // Tránh hydration mismatch bằng cách không render cho đến khi client-side state được load
    // Tuy nhiên, để UX tốt hơn, ta có thể render với default 'vi' nhưng update sau.
    // Nếu app yêu cầu SEO tốt thì dùng locale-based routing sẽ tốt hơn.
    
    return (
        <TransContext.Provider value={{ lang, trans, changeLanguage }}>
            {children}
        </TransContext.Provider>
    );
};

const useTrans = () => {
    const context = useContext(TransContext);
    if (context === undefined) {
        // Fallback cho trường hợp không có Provider (để không break các component cũ ngay lập tức)
        // Tuy nhiên, mục tiêu là bọc toàn bộ app.
        return {
            lang: 'vi' as Language,
            trans: VnScript,
            changeLanguage: (newLang: Language) => {
                localStorage.setItem('lang', newLang);
                window.location.reload(); // Fallback nếu không có context
            }
        };
    }
    return context;
};

export default useTrans;
