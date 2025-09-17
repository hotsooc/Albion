import { navItems } from '@/store/data';
import React from 'react';

type SidebarProps = {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
};

export const Sidebar2: React.FC<SidebarProps> = ({ activeCategory, onSelectCategory }) => {
  return (
    <div className="p-5 rounded-xl shadow-xl flex-shrink-0">
      <div className="relative mb-5">
        <input 
          type="text" 
          placeholder=" " 
          className="w-full p-2.5 pl-10 rounded-[25px] border-2 border-transparent outline-none bg-white text-base shadow-inner transition-all duration-300 focus:border-accent-blue focus:shadow-[0_0_0_3px_rgba(0,119,194,0.2)]" 
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#aaa]">🔍</span>
      </div>
      <div className="flex flex-col">
        {navItems.map((item) => (
          <button
            key={item}
            className={`
              w-full py-3 px-5 mb-2.5 bg-sidebar-bg border-none rounded-[10px] text-text-color text-base font-semibold text-left cursor-pointer transition-colors duration-300 transform hover:bg-[#a0d8e8] 
              ${activeCategory === item ? '!bg-sky-500 !text-white' : ''}
            `}
            onClick={() => onSelectCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar2;