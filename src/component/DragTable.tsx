'use client';

import { useState } from 'react';
import { Input, Button } from 'antd';
import { DraggableItem } from './DraggableItem';

type ItemType = { id: string; name: string };

const dataSet1: ItemType[] = [
  { id: '1', name: 'Bow' },
  { id: '2', name: 'Bow of Badon' },
  { id: '3', name: 'Mist Piercer' },
  { id: '4', name: 'Skystrider bow' },
  { id: '5', name: 'Walling bow' },
  { id: '6', name: 'Whispering bow' },
  { id: '7', name: 'Warbow' },
  { id: '8', name: 'Long bow' },
];

const dataSet2: ItemType[] = [
  { id: '4', name: '4' },
  { id: '5', name: '5' },
  { id: '6', name: '6' },
];

const allData: ItemType[] = [...dataSet1, ...dataSet2];

export const DragSourceContainer = () => {
  const [inputValue, setInputValue] = useState('');
  const [searchResults, setSearchResults] = useState<ItemType[]>([]);
  const [activeDataSet, setActiveDataSet] = useState<ItemType[] | null>(null);

  const handleSearch = (e: any) => {
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

  const handleToggleDataSet = (dataSet: any) => {
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
        <div className='flex flex-col gap-3'>
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
        </div>
        <div>
          {searchResults.length > 0 && (
            <div className='w-full'>
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