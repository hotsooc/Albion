'use client';

import React from 'react';
import ClientHeader from './ClientHeader'; 
import { supabase } from '@/lib/supabaseClient'; // Import supabase

type AppHeaderProps = {
  loggedIn: boolean;
};

const AppHeader: React.FC<AppHeaderProps> = ({ loggedIn }) => {
  const handleSearch = (value: string) => {
    console.log('Searching for:', value);
  };
  
  const handleLogout = async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
          console.error('Error logging out:', error.message);
      } else {
          console.log('User logged out successfully!');
          window.location.href = '/login'; 
      }
  };

  return (
    <ClientHeader 
      loggedIn={loggedIn} 
      onLogout={handleLogout}
      onSearch={handleSearch} 
    />
  );
};

export default AppHeader;