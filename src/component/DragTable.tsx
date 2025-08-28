'use client';

import { useState } from 'react';
import { Input, Button } from 'antd';
import { DraggableItem } from './DraggableItem';
import { dataSet1, dataSet10, dataSet11, dataSet12, dataSet13, dataSet14, dataSet15, dataSet16, dataSet18, dataSet19, dataSet2, dataSet20, dataSet3, dataSet4, dataSet5, dataSet6, dataSet7, dataSet8, dataSet9, ItemType } from '@/store/data';


const allData: ItemType[] = [...dataSet1, ...dataSet2, ...dataSet3, ...dataSet4, ...dataSet5, ...dataSet6, 
  ...dataSet7, ...dataSet8, ...dataSet9, ...dataSet10,...dataSet11, ...dataSet12, ...dataSet13, ...dataSet14, 
  ...dataSet15, ...dataSet16, ...dataSet18, ...dataSet19, ...dataSet20
];

export const DragSourceContainer = () => {
  const [inputValue, setInputValue] = useState('');
  const [searchResults, setSearchResults] = useState<ItemType[]>([]);
  const [activeDataSet, setActiveDataSet] = useState<ItemType[] | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value.toLowerCase();
  setInputValue(value);
  if (value === '') {
    setSearchResults([]);
    setActiveDataSet(null);
  } else {
    const filteredData = allData.filter(item =>
      item.name.toLowerCase().includes(value)
    );
    setSearchResults(filteredData);
    setActiveDataSet(null);
  }
};

  const handleToggleDataSet = (dataSet: ItemType[]) => {
    if (activeDataSet === dataSet) {
      setSearchResults([]);
      setActiveDataSet(null);
    } else {
      setSearchResults(dataSet);
      setActiveDataSet(dataSet);
      setInputValue('');
    }
  };

  return (
    <div className='flex flex-col'>
      <Input
        value={inputValue}
        onChange={handleSearch}
        placeholder="Tìm kiếm"
        className='w-full'
      />
      <div className='grid grid-cols-2 gap-3 mt-3'>
        <div className='flex flex-col gap-3 max-h-[300px] overflow-y-auto no-scrollbar'>
          <Button 
            onClick={() => handleToggleDataSet(dataSet1)} 
          >
            Bow
          </Button>
          
          <Button 
            onClick={() => handleToggleDataSet(dataSet2)} 
          >
            Dagger
          </Button>
          <Button 
            onClick={() => handleToggleDataSet(dataSet3)} 
          >
            Spear
          </Button>
          <Button 
            onClick={() => handleToggleDataSet(dataSet4)} 
          >
            Quarterstaves
          </Button>
          <Button 
            onClick={() => handleToggleDataSet(dataSet5)} 
          >
            Shapeshifter Staves
          </Button>
          <Button 
            onClick={() => handleToggleDataSet(dataSet6)} 
          >
            Nature Staves	
          </Button>
          <Button 
            onClick={() => handleToggleDataSet(dataSet7)} 
          >
            Swords
          </Button>
          <Button 
            onClick={() => handleToggleDataSet(dataSet8)} 
          >
            Axes
          </Button>
          <Button 
            onClick={() => handleToggleDataSet(dataSet9)} 
          >
            Maces
          </Button>
          <Button 
            onClick={() => handleToggleDataSet(dataSet10)} 
          >
            Hammers
          </Button>
          <Button 
            onClick={() => handleToggleDataSet(dataSet11)} 
          >
            War Gloves
          </Button>
          <Button 
            onClick={() => handleToggleDataSet(dataSet12)} 
          >
            Fire Staves
          </Button>
          <Button 
            onClick={() => handleToggleDataSet(dataSet13)} 
          >
            Holy Staves
          </Button>
          <Button 
            onClick={() => handleToggleDataSet(dataSet14)} 
          >
            Arcane Staves
          </Button>
          <Button 
            onClick={() => handleToggleDataSet(dataSet15)} 
          >
            Frost Staves
          </Button>
          <Button 
            onClick={() => handleToggleDataSet(dataSet16)} 
          >
            Cursed Staves
          </Button>
          {/* <Button 
            onClick={() => handleToggleDataSet(dataSet17)} 
          >
            
          </Button> */}
          <Button 
            onClick={() => handleToggleDataSet(dataSet18)} 
          >
            Shields
          </Button>
          <Button 
            onClick={() => handleToggleDataSet(dataSet19)} 
          >
            Torches
          </Button>
          <Button 
            onClick={() => handleToggleDataSet(dataSet20)} 
          >
            Tomes
          </Button>
        </div>
        <div>
          {searchResults.length > 0 && (
            <div className='w-full sticky'>
              {searchResults.map((item) => (
                <DraggableItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};