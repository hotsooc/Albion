'use client';

import BuildCard from '@/component/BuildCard';
import Pagination from '@/component/Pagination';
import Sidebar2 from '@/component/Sidebar2';
import { allItemsData, navItems } from '@/store/data';
import React, { useState, useMemo } from 'react';

const getDataSetForCategory = (category: string) => {
  const normalizedCategory = category.toLowerCase().replace(/\s/g, '');

  if (normalizedCategory.includes('bow')) {
    return allItemsData.filter(item => item.name.toLowerCase().includes('bow'));
  }
  if (normalizedCategory.includes('dagger')) {
    return allItemsData.filter(item => item.name.toLowerCase().includes('dagger'));
  }
  if (normalizedCategory.includes('spear')) {
    return allItemsData.filter(item => item.name.toLowerCase().includes('spear'));
  }
  if (normalizedCategory.includes('quarterstaff')) {
    return allItemsData.filter(item => item.name.toLowerCase().includes('quarterstaff'));
  }
  if (normalizedCategory.includes('shapeshifter')) {
    return allItemsData.filter(item => item.name.toLowerCase().includes('staff') && item.id >= '33' && item.id <= '40');
  }
  if (normalizedCategory.includes('nature')) {
    return allItemsData.filter(item => item.name.toLowerCase().includes('nature'));
  }
  if (normalizedCategory.includes('sword')) {
    return allItemsData.filter(item => item.name.toLowerCase().includes('sword'));
  }
  if (normalizedCategory.includes('axe')) {
    return allItemsData.filter(item => item.name.toLowerCase().includes('axe'));
  }
  if (normalizedCategory.includes('mace')) {
    return allItemsData.filter(item => item.name.toLowerCase().includes('mace'));
  }
  if (normalizedCategory.includes('hammer')) {
    return allItemsData.filter(item => item.name.toLowerCase().includes('hammer'));
  }
  if (normalizedCategory.includes('glove')) {
    return allItemsData.filter(item => item.name.toLowerCase().includes('glove'));
  }
  if (normalizedCategory.includes('fire')) {
    return allItemsData.filter(item => item.name.toLowerCase().includes('fire'));
  }
  if (normalizedCategory.includes('holy')) {
    return allItemsData.filter(item => item.name.toLowerCase().includes('holy'));
  }
  if (normalizedCategory.includes('arcane')) {
    return allItemsData.filter(item => item.name.toLowerCase().includes('arcane'));
  }
  if (normalizedCategory.includes('frost')) {
    return allItemsData.filter(item => item.name.toLowerCase().includes('frost'));
  }
  if (normalizedCategory.includes('cursed')) {
    return allItemsData.filter(item => item.name.toLowerCase().includes('cursed'));
  }
  
  return [];
};


export default function BuildPage() {
  const [activeCategory, setActiveCategory] = useState(navItems[0]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentDataSet = useMemo(() => getDataSetForCategory(activeCategory), [activeCategory]);
  const currentBuild = currentDataSet[currentIndex];

  const handleSelectCategory = (category: string) => {
    setActiveCategory(category);
    setCurrentIndex(0); // Reset index when category changes
  };

  const handleNext = () => {
    if (currentIndex < currentDataSet.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <main className="flex flex-col items-center p-4 rounded-xl mx-10 shadow-xl min-h-auto bg-[#E4FFFE] ">
      <h1 className="text-4xl font-bold mb-8">Builds Guide</h1>
      <div className="flex flex-rows w-full justify-center">
        <Sidebar2 activeCategory={activeCategory} onSelectCategory={handleSelectCategory} />
        <div className="flex flex-col flex-wrap gap-8 justify-center flex-grow">
          {currentBuild ? (
            <>
            <div className='grid grid-rows-[1fr_5fr] items-center p-4'>
              <div className="flex flex-col items-center">
                <div className="text-sm text-left w-full max-w-sm">
                  <p className="mb-1.5"><strong>Name:</strong> {currentBuild.name || '............'}</p>
                  <p className="mb-1.5"><strong>Detail:</strong> {currentBuild.detail || '............'}</p>
                  <p><strong>Video POV:</strong> ............</p>
                </div>
              </div>
              <div className="flex flex-rows gap-8 justify-center flex-wrap">
                <BuildCard title="Hellgate 5v5" buildData={currentBuild} />
                <BuildCard title="Hellgate 2v2" buildData={currentBuild} />
                <BuildCard title="Openworld" buildData={currentBuild} />
              </div>
            </div>
            <div className=''>
              <Pagination
                onPrev={handlePrev}
                onNext={handleNext}
                isPrevDisabled={currentIndex === 0}
                isNextDisabled={currentIndex === currentDataSet.length - 1}
              />
            </div>
            </>
          ) : (
            <p className="text-lg">Chọn một loại vũ khí để xem builds.</p>
          )}
        </div>
      </div>
    </main>
  );
}