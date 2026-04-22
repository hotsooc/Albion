'use client'

import { CloseCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, Transition } from 'framer-motion';
import { allItemsData, dataSet1, dataSet10, dataSet11, dataSet12, dataSet13, dataSet14, dataSet15, dataSet16, dataSet18, dataSet19, dataSet2, dataSet20, dataSet3, dataSet4, dataSet5, dataSet6, dataSet7, dataSet8, dataSet9, ItemType } from '@/store/data';
import { Baloo_2 } from 'next/font/google';
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

const balooFont = Baloo_2({
    subsets: ['vietnamese'],
    weight: ['800'],
});

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
    },
};

const detailVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        } as Transition,
    },
};

export default function BuildPageClient() {
    const searchParams = useSearchParams();
    const [inputValue, setInputValue] = useState('');
    const [searchResults, setSearchResults] = useState<ItemType[]>([]);
    const [activeButton, setActiveButton] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<ItemType | null>(null);
    const { trans } = useTrans();

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
    
    const handleItemClick = (item: ItemType) => {
        setSelectedItem(item);
    };

    const buttonsToDisplay = activeButton ? [activeButton] : Object.keys(dataSets);
    const showResults = inputValue || activeButton;

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

    return (
        <section className='grid grid-cols-[1fr_5fr] bg-gradient-to-br from-[#E4FFFE] to-[#8BDDFB] h-auto p-4 rounded-xl shadow-xl gap-4 ml-1 mr-10'>
            <div className='flex flex-col gap-4'>
                <div className="flex items-center bg-white rounded-full w-full overflow-hidden shadow-sm px-4">
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
                    <motion.div
                        className='flex flex-col gap-3 overflow-y-auto max-h-[470px] no-scrollbar'
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {!inputValue && buttonsToDisplay.map((label) => {
                            const data = dataSets[label as keyof typeof dataSets];
                            return (
                                <motion.div key={label} variants={itemVariants}>
                                    <Button
                                        onClick={() => handleToggleDataSet(data, label)}
                                        className={`!rounded-md custom-button w-full !text-lg !font-medium !bg-sky-200 !text-blue !border-none ${activeButton === label ? '!bg-sky-500 !text-white' : ''}`}
                                    >
                                        {getButtonLabel(label)}
                                    </Button>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>

                {showResults && searchResults.length > 0 && (
                    <div className='w-full overflow-y-auto max-h-[500px]'>
                        <motion.div
                            className='grid grid-cols-1 gap-3 text-black text-center'
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {searchResults.map((item) => (
                                <motion.div key={item.id} variants={itemVariants}>
                                    <button
                                        onClick={() => handleItemClick(item)}
                                        className="p-2 border rounded-md w-full hover:bg-gray-200"
                                    >
                                        {(trans.items as any)[item.id]?.name || item.name}
                                    </button>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                )}
            </div>

            <div className='flex flex-col gap-4 p-4 border-none rounded-lg bg-[#E4FFFE] shadow-xl'>
                {selectedItem ? (
                    <motion.div
                        key={selectedItem.id}
                        variants={detailVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <span className={`${balooFont.className} text-[30px] flex justify-center mb-2 text-center`}>{trans.build.guide}</span>
                        <div className='grid grid-cols-[1fr_4fr] gap-5'>
                            <div className='bg-white rounded-xl flex flex-col py-4 px-3 h-[470px] shadow-2xl'>
                                <h3 className={`${balooFont.className} text-center text-[24px] text-black`}>~ {trans.common.detail} ~ </h3>
                                <p className={`${balooFont.className} text-xl text-black`}>{trans.common.name}: {(trans.items as any)[selectedItem.id]?.name || selectedItem.name}</p>
                                <p className={`${balooFont.className} text-xl text-black whitespace-pre-line`}>{trans.common.detailLabel} {(trans.items as any)[selectedItem.id]?.detail || selectedItem.detail}</p>
                                <p className={`${balooFont.className} text-xl text-black`}>{trans.build.pov} ...</p>
                            </div>
                            <div>
                                <div className='flex flex-row justify-center gap-4'>
                                    {selectedItem.image && (
                                        <div className='bg-white rounded-xl p-4 shadow-2xl'>
                                            <span className={`${balooFont.className} flex justify-center text-center text-black text-[24px] font-bold`}>{trans.build.hellgate}</span>
                                            <img
                                                src={selectedItem.image}
                                                alt={`${selectedItem.name} image 1`}
                                                className='w-100 h-100 object-contain !rounded-xl'
                                            />
                                        </div>
                                    )}
                                    {selectedItem.image2 && (
                                        <div className='bg-white rounded-xl p-4 h-[470px] shadow-2xl'>
                                            <span className={`${balooFont.className} flex justify-center text-center text-black text-[24px] font-bold`}>{trans.build.corrupted}</span>
                                            <img
                                                src={selectedItem.image2}
                                                alt={`${selectedItem.name} image 2`}
                                                className='w-100 h-100 object-contain !rounded-xl'
                                            />
                                        </div>
                                    )}
                                    {selectedItem.image3 && (
                                        <div className='bg-white rounded-xl p-4 h-[470px] shadow-2xl'>
                                            <span className={`${balooFont.className} flex justify-center text-center text-black text-[24px] font-bold`}>{trans.build.openworld}</span>
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
                        <div className='flex justify-center mt-5 gap-5 items-center'>
                            <Button className='!bg-transparent !border-none !p-0 !cursor-pointer' onClick={handlePrev} disabled={searchResults.length <= 1}>
                                <img src='/image/left-icon.png' alt='' width={20} height={20} />
                            </Button>
                            <span className={`${balooFont.className} text-3xl font-bold`}>~ {activeButton} ~</span>
                            <Button className='!bg-transparent !border-none !p-0 !cursor-pointer' onClick={handleNext} disabled={searchResults.length <= 1}>
                                <img src='/image/right_icon.png' alt='' width={20} height={20} />
                            </Button>
                        </div>
                    </motion.div>
                ) : (
                    <div className='flex justify-center items-center h-full'>
                        <p className='text-gray-500 text-lg'>{trans.build.selectItemPrompt}</p>
                    </div>
                )}
            </div>
        </section>
    );
}