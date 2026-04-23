'use client';

import { useState } from 'react';
import { Input, Button } from 'antd';
import { DraggableItem } from './DraggableItem';
import { allItemsData, dataSet1, dataSet10, dataSet11, dataSet12, dataSet13, dataSet14, dataSet15, dataSet16, dataSet18, dataSet19, dataSet2, dataSet20, dataSet3, dataSet4, dataSet5, dataSet6, dataSet7, dataSet8, dataSet9, ItemType } from '@/store/data';
import { SearchOutlined, CloseCircleOutlined } from '@ant-design/icons';
import useTrans from '@/hooks/useTrans';

const dataSets = {
  Sword: dataSet7,
  Axe: dataSet8,
  Mace: dataSet9,
  Hammer: dataSet10,
  'War Gloves': dataSet11,
  Bow: dataSet1,
  Dagger: dataSet2,
  Spear: dataSet3,
  'Quarterstaves': dataSet4,
  'Shapeshifter Staves': dataSet5,
  'Nature Staves': dataSet6,
  'Fire Staves': dataSet12,
  'Holy Staves': dataSet13,
  'Arcane Staves': dataSet14,
  'Frost Staves': dataSet15,
  'Cursed Staves': dataSet16,
  Shields: dataSet18,
  Torches: dataSet19,
  Tomes: dataSet20,
};

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
    <div className='flex flex-col gap-4'>
      <div className="flex items-center bg-white rounded-full w-full h-full overflow-hidden  shadow-sm px-4">
        <SearchOutlined className="text-black text-lg mr-2" />
        <Input
          placeholder={trans.common.searchPlaceholder}
          value={inputValue}
          onChange={handleSearch}
          className="!border-none !shadow-none bg-transparent flex-grow h-10 focus:ring-0"
        />
        {inputValue && (
          <Button
            type="text"
            icon={<CloseCircleOutlined />}
            onClick={handleClearSearch}
            className="!text-black"
          />
        )}
      </div>

      <div className='grid grid-cols-1 gap-3'>
        <div className='flex flex-col gap-3 overflow-y-auto max-h-[470px] no-scrollbar'>
          {!inputValue && buttonsToDisplay.map((label) => {
            const data = dataSets[label as keyof typeof dataSets];
            return (
              <Button
                key={label}
                onClick={() => handleToggleDataSet(data, label)}
                className={`!rounded-md !h-12 !text-lg !font-medium !bg-sky-200 !text-blue !border-none ${activeButton === label ? '!bg-sky-500 !text-white' : ''}`}
              >
                {getButtonLabel(label)}
              </Button>
            );
          })}
        </div>
      </div>

      {showResults && searchResults.length > 0 && (
        <div className='w-full overflow-y-auto max-h-[500px]'>
          <div className='grid grid-row-1 sm:grid-row-2 md:grid-row-3 text-black text-center gap-3'>
            {searchResults.map((item) => (
              <DraggableItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
