import { useCallback, useEffect, useState } from "react";
import { VnScript } from "./vi";
import { EnglishScript } from "./en";

function getTrans(locale: string) {
    switch (locale) {
        case 'vi': return VnScript;
        case 'en': return EnglishScript;
        default: return VnScript;
    }
}

const useTrans = () => {
    const [lang, setLang] = useState<string>(() => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('lang') || 'vi';
    }
    return 'vi';
});

    const trans = getTrans(lang);

    const changeLanguage = useCallback((newLang: 'vi' | 'en') => {
        setLang(newLang);
        localStorage.setItem('lang', newLang);
    }, []);

    return { lang, trans, changeLanguage };
}

export default useTrans;
