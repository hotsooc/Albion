import React from 'react';

type PaginationProps = {
  onPrev: () => void;
  onNext: () => void;
  isPrevDisabled: boolean;
  isNextDisabled: boolean;
};

const Pagination: React.FC<PaginationProps> = ({ onPrev, onNext, isPrevDisabled, isNextDisabled }) => {
  return (
    <div className="flex justify-end gap-2.5 mt-5">
      <button 
        onClick={onPrev} 
        disabled={isPrevDisabled} 
        className="bg-[#97DDD9] rounded-xl w-[60px] h-[39px] flex items-center justify-center border-none text-4xl text-accent-blue cursor-pointer opacity-60 transition-opacity duration-300 hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <img src='/left-icon.png' alt='' width={20} height={20} />
      </button>
      <button 
        onClick={onNext} 
        disabled={isNextDisabled}
        className="bg-[#97DDD9] rounded-xl w-[60px] h-[39px] flex items-center justify-center border-none text-4xl text-accent-blue cursor-pointer opacity-60 transition-opacity duration-300 hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <img src='/right_icon.png' alt='' width={20} height={20} />
      </button>
    </div>
  );
};

export default Pagination;