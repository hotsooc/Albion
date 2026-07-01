'use client';

import React from 'react';
import ClientHeader from './ClientHeader';

const AppHeader: React.FC = () => {
    const handleSearch = (_value: string) => {
    };

    return (
        <ClientHeader 
            onSearch={handleSearch} 
        />
    );
};

export default AppHeader;

