'use client'

import { CloseCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; // Thêm import này
import { allItemsData, dataSet1, dataSet10, dataSet11, dataSet12, dataSet13, dataSet14, dataSet15, dataSet16, dataSet18, dataSet19, dataSet2, dataSet20, dataSet3, dataSet4, dataSet5, dataSet6, dataSet7, dataSet8, dataSet9, ItemType } from '@/store/data';
import { Baloo_2 } from 'next/font/google';

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

const balooFont = Baloo_2({
    subsets: ['vietnamese'],
    weight: ['800'],
});

export default function BuildPage() {
    const searchParams = useSearchParams(); // Sử dụng hook để lấy tham số URL
    const [inputValue, setInputValue] = useState('');
    const [searchResults, setSearchResults] = useState<ItemType[]>([]);
    const [activeButton, setActiveButton] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<ItemType | null>(null);

    // Sử dụng useEffect để xử lý tham số tìm kiếm từ URL
    useEffect(() => {
        const query = searchParams.get('q');
        if (query) {
            setInputValue(query);
            const filteredData = allItemsData.filter(item =>
                item.name.toLowerCase().includes(query.toLowerCase())
            );
            setSearchResults(filteredData);
            setSelectedItem(filteredData[0] || null);
        }
    }, [searchParams]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        setActiveButton(null);
        setSelectedItem(null);
        const filteredData = allItemsData.filter(item =>
            item.name.toLowerCase().includes(value.toLowerCase())
        );
        setSearchResults(filteredData);
    };

    const handleToggleDataSet = (dataSet: ItemType[], label: string) => {
        if (activeButton === label) {
            setSearchResults([]);
            setActiveButton(null);
            setSelectedItem(null);
        } else {
            setSearchResults(dataSet);
            setActiveButton(label);
            setSelectedItem(dataSet[0] || null);
        }
    };

    const handleClearSearch = () => {
        setInputValue('');
        setSearchResults([]);
        setActiveButton(null);
        setSelectedItem(null);
    };

    const handleNext = () => {
        if (!selectedItem || searchResults.length === 0) return;
        const currentIndex = searchResults.findIndex(item => item.id === selectedItem.id);
        const nextIndex = (currentIndex + 1) % searchResults.length;
        setSelectedItem(searchResults[nextIndex]);
    };

    const handlePrev = () => {
        if (!selectedItem || searchResults.length === 0) return;
        const currentIndex = searchResults.findIndex(item => item.id === selectedItem.id);
        const prevIndex = (currentIndex - 1 + searchResults.length) % searchResults.length;
        setSelectedItem(searchResults[prevIndex]);
    };
    
    // Hàm xử lý khi click vào một vật phẩm từ danh sách kết quả tìm kiếm
    const handleItemClick = (item: ItemType) => {
        setSelectedItem(item);
    };

    const buttonsToDisplay = activeButton ? [activeButton] : Object.keys(dataSets);
    const showResults = inputValue || activeButton;

    return (
        <section className='grid grid-cols-[1fr_5fr] bg-gradient-to-br from-[#E4FFFE] to-[#8BDDFB] h-auto p-4 rounded-xl shadow-xl gap-4 ml-1 mr-10'>
            <div className='flex flex-col gap-4'>
                <div className="flex items-center bg-white rounded-full w-full overflow-hidden shadow-sm px-4">
                    <SearchOutlined className="text-black text-lg mr-2" />
                    <Input
                        placeholder="Tìm kiếm..."
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
                                    className={`!rounded-md custom-button !text-lg !font-medium !bg-sky-200 !text-blue !border-none ${activeButton === label ? '!bg-sky-500 !text-white' : ''}`}
                                >
                                    {label}
                                </Button>
                            );
                        })}
                    </div>
                </div>

                {showResults && searchResults.length > 0 && (
                    <div className='w-full overflow-y-auto max-h-[500px]'>
                        <div className='grid grid-cols-1 gap-3 text-black text-center'>
                            {searchResults.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleItemClick(item)}
                                    className="p-2 border rounded-md hover:bg-gray-200"
                                >
                                    {item.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className='flex flex-col gap-4 p-4 border-none rounded-lg bg-[#E4FFFE] shadow-xl'>
                {selectedItem ? (
                    <>
                        <span className={`${balooFont.className} text-[30px] text-center`}>Build Guide</span>
                        <div className='grid grid-cols-[1fr_5fr] gap-5'>
                            <div className='bg-white rounded-xl flex flex-col py-4 px-3 h-[470px] shadow-2xl'>
                                <h3 className={`${balooFont.className} text-center text-[24px] text-black`}>~ Detail ~ </h3>
                                <p className={`${balooFont.className} text-xl text-black`}>Name: {selectedItem.name}</p>
                                <p className={`${balooFont.className} text-xl text-black`}>Detail: {selectedItem.detail}</p>
                                <p className={`${balooFont.className} text-xl text-black`}>POV: ...</p>
                                <div className='flex justify-center mt-10'>
                                    <img src="/umaru.png" alt="Umaru-chan" width={400} height={400} />
                                </div>
                            </div>
                            <div>
                                <div className='flex flex-row justify-center gap-4'>
                                    {selectedItem.image && (
                                        <div className='bg-white rounded-xl p-4 h-[470px] shadow-2xl'>
                                            <span className={`${balooFont.className} flex justify-center text-center text-black text-[24px] font-bold`}>HellGate 5v5</span>
                                            <img
                                                src={selectedItem.image}
                                                alt={`${selectedItem.name} image 1`}
                                                className='w-100 h-100 object-contain !rounded-xl'
                                            />
                                        </div>
                                    )}
                                    {selectedItem.image2 && (
                                        <div className='bg-white rounded-xl p-4 h-[470px] shadow-2xl'>
                                            <span className={`${balooFont.className} flex justify-center text-center text-black text-[24px] font-bold`}>HellGate 5v5 (2v2)</span>
                                            <img
                                                src={selectedItem.image2}
                                                alt={`${selectedItem.name} image 2`}
                                                className='w-100 h-100 object-contain !rounded-xl'
                                            />
                                        </div>
                                    )}
                                    {selectedItem.image3 && (
                                        <div className='bg-white rounded-xl p-4 h-[470px] shadow-2xl'>
                                            <span className={`${balooFont.className} flex justify-center text-center text-black text-[24px] font-bold`}>OpenWorld</span>
                                            <img
                                                src={selectedItem.image3}
                                                alt={`${selectedItem.name} image 3`}
                                                className='w-100 h-100 object-contain !rounded-xl'
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-between items-center'>
                            <Button className='!bg-transparent !border-none !p-0 !cursor-pointer' onClick={handlePrev} disabled={searchResults.length <= 1}>
                                <img src='/left-icon.png' alt='' width={20} height={20} />
                            </Button>
                            <span className={`${balooFont.className} text-3xl font-bold`}>~ {activeButton} ~</span>
                            <Button className='!bg-transparent !border-none !p-0 !cursor-pointer' onClick={handleNext} disabled={searchResults.length <= 1}>
                                <img src='/right_icon.png' alt='' width={20} height={20} />
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className='flex justify-center items-center h-full'>
                        <p className='text-gray-500 text-lg'>Vui lòng chọn một vật phẩm để xem chi tiết.</p>
                    </div>
                )}
            </div>
        </section>
    );
}