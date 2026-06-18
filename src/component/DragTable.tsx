'use client';

import { useState } from 'react';
import { Input, Button } from 'antd';
import { DraggableItem } from './DraggableItem';
import { allItemsData, dataSets, ItemType } from '@/store/data';
import { SearchOutlined, CloseCircleOutlined } from '@ant-design/icons';
import useTrans from '@/hooks/useTrans';

export const DragSourceContainer = () => {
  const [inputValue, setInputValue] = useState('');
  const [searchResults, setSearchResults] = useState<ItemType[]>([]);
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const { trans } = useTrans();

  const getButtonLabel = (key: string) => {
    const mapping: { [key: string]: string } = {
        Sword: trans.build.weaponTypes.sword,
        Axe: trans.build.weaponTypes.axe,
        Mace: trans.build.weaponTypes.mace,
        Hammer: trans.build.weaponTypes.hammer,
        'War Gloves': trans.build.weaponTypes.warGloves,
        Bow: trans.build.weaponTypes.bow,
        Dagger: trans.build.weaponTypes.dagger,
        Spear: trans.build.weaponTypes.spear,
        'Quarterstaves': trans.build.weaponTypes.quarterstaves,
        'Shapeshifter Staves': trans.build.weaponTypes.shapeshifter,
        'Nature Staves': trans.build.weaponTypes.nature,
        'Fire Staves': trans.build.weaponTypes.fire,
        'Holy Staves': trans.build.weaponTypes.holy,
        'Arcane Staves': trans.build.weaponTypes.arcane,
        'Frost Staves': trans.build.weaponTypes.frost,
        'Cursed Staves': trans.build.weaponTypes.cursed,
        Shields: trans.build.weaponTypes.shields,
        Torches: trans.build.weaponTypes.torches,
        Tomes: trans.build.weaponTypes.tomes,
    };
    return mapping[key] || key;
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setActiveButton(null);
    const filteredData = allItemsData.filter(item =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setSearchResults(filteredData);
  };

  const handleToggleDataSet = (dataSet: ItemType[], label: string) => {
    if (activeButton === label) {
      setSearchResults([]);
      setActiveButton(null);
      setInputValue('');
    } else {
      setSearchResults(dataSet);
      setActiveButton(label);
      setInputValue(label);
    }
  };

  const handleClearSearch = () => {
    setInputValue('');
    setSearchResults([]);
    setActiveButton(null);
  };

  const buttonsToDisplay = activeButton ? [activeButton] : Object.keys(dataSets);
  const showResults = inputValue || activeButton;

  return (
    <div className='flex flex-col gap-4 text-black'>
      <div 
        className="flex items-center rounded-full w-full overflow-hidden border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-within:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] px-4 transition-all duration-300"
      >
        <SearchOutlined className="text-black text-lg mr-2" />
        <Input
          placeholder={trans.common.searchPlaceholder}
          value={inputValue}
          onChange={handleSearch}
          className="!border-none !shadow-none bg-transparent flex-grow h-11 focus:ring-0 !text-black"
        />
        {inputValue && (
          <Button
            type="text"
            icon={<CloseCircleOutlined />}
            onClick={handleClearSearch}
            className="!text-black hover:!text-red-500"
          />
        )}
      </div>

      <div className='grid grid-cols-1 gap-2.5'>
        <div className='flex flex-col gap-2 overflow-y-auto max-h-[470px] no-scrollbar pr-1'>
          {!inputValue && buttonsToDisplay.map((label) => {
            const data = dataSets[label as keyof typeof dataSets];
            const isActive = activeButton === label;
            return (
              <button
                key={label}
                onClick={() => handleToggleDataSet(data, label)}
                className={`py-3 px-4 border-2 border-black rounded-full font-bold sora-font text-sm transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? 'bg-[#ebc7b5] text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -translate-y-[1px]' 
                    : 'bg-white hover:bg-[#fcf8f2] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px]'
                }`}
              >
                {getButtonLabel(label)}
              </button>
            );
          })}
        </div>
      </div>

      {showResults && searchResults.length > 0 && (
        <div className='w-full overflow-y-auto max-h-[500px] border-t-2 border-black pt-4'>
          <div className='flex flex-col gap-2'>
            {searchResults.map((item) => (
              <DraggableItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
