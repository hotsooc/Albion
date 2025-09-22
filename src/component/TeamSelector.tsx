'use client';

type TeamSelectorProps = {
  teamNames: string[];
  openTeamIndex: number;
  handlePrevTeam: () => void;
  handleNextTeam: () => void;
  handleToggleTeam: (index: number) => void;
};

export const TeamSelector = ({
  teamNames,
  openTeamIndex,
  handlePrevTeam,
  handleNextTeam,
  handleToggleTeam,
}: TeamSelectorProps) => {
  return (
    <div className='flex flex-row gap-4 w-full justify-center overflow-auto items-center p-2'>
      <button className='bg-transparent border-none p-0 cursor-pointer' onClick={handlePrevTeam}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src='/left-icon.png' alt='' width={20} height={20} />
      </button>
      {teamNames.map((name, index) => (
        <div
          key={index}
          onClick={() => handleToggleTeam(index)}
          className={`flex-1 text-center text-xl font-bold cursor-pointer transition-colors border-[1px] border-solid border-gray-200 rounded-full px-8 py-2 ${openTeamIndex === index ? 'bg-sky-500 text-white' : 'bg-white text-gray-700 hover:bg-sky-200'}`}
        >
          {name}
        </div>
      ))}
      {/* <div
        className={'text-center text-xl font-bold cursor-pointer transition-colors border rounded-full px-8 py-2 bg-white text-gray-700 hover:bg-sky-200'}
      > */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
          {/* <img src='/add_icon.png' alt='' width={28} height={28} />
      </div> */}
      <button className='bg-transparent border-none p-0 cursor-pointer' onClick={handleNextTeam}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src='/right_icon.png' alt='' width={20} height={20} />
      </button>
    </div>
  );
};