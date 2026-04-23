'use client';

import React from 'react';
import ClientHeader from './ClientHeader';

interface AppHeaderProps {
    isVantaActive: boolean;
    onToggleVanta: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ isVantaActive, onToggleVanta }) => {
    const handleSearch = (value: string) => {
    };

    return (
        <ClientHeader 
            onSearch={handleSearch} 
            isVantaActive={isVantaActive}
            onToggleVanta={onToggleVanta}
        />
    );
};

export default AppHeader;
