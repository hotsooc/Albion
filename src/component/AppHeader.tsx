'use client';

import React from 'react';
import { Session } from '@supabase/supabase-js';
import ClientHeader from './ClientHeader';

const AppHeader: React.FC = () => {
  const handleSearch = (value: string) => {
    console.log('Searching for:', value);
  };

  return <ClientHeader onSearch={handleSearch} />;
};

export default AppHeader;