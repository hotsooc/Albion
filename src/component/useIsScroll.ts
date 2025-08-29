import { useEffect, useState } from 'react';

function useScrollThreshold(threshold: number) {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;

            if (scrollTop >= threshold && !isScrolled) {
                setIsScrolled(true);
            } else if (scrollTop < threshold && isScrolled) {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isScrolled, threshold]);

    return isScrolled;
}

export default useScrollThreshold;