'use client';

import { CloseCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, Transition } from 'framer-motion';
import { allItemsData, dataSets, ItemType } from '@/store/data';
import useTrans from '@/hooks/useTrans';

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
    hidden: { y: 15, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
    },
};

const detailVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
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
        <section className="grid grid-cols-1 lg:grid-cols-[1.2fr_3.8fr] h-auto gap-6 ml-1 mr-6 transition-all duration-300 text-black">
            {/* Left Filter & Search Bar */}
            <div className="flex flex-col gap-5 border-2 border-black rounded-[32px] p-5 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center rounded-full w-full overflow-hidden border-2 border-black bg-white px-4 transition-all duration-300 focus-within:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
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

                <div className="grid grid-cols-1 gap-2.5">
                    <motion.div
                        className="flex flex-col gap-2 overflow-y-auto max-h-[500px] pr-1"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {!inputValue && buttonsToDisplay.map((label) => {
                            const data = dataSets[label as keyof typeof dataSets];
                            const isActive = activeButton === label;
                            return (
                                <motion.div key={label} variants={itemVariants}>
                                    <button
                                        onClick={() => handleToggleDataSet(data, label)}
                                        className={`w-full py-3 px-4 rounded-full border-2 border-black text-left font-bold sora-font tracking-tight transition-all duration-200 cursor-pointer ${
                                            isActive 
                                                ? 'bg-[#ebc7b5] text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -translate-y-[1px]' 
                                                : 'bg-white hover:bg-[#fcf8f2] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px]'
                                        }`}
                                    >
                                        <div className="flex justify-between items-center w-full">
                                            <span>{getButtonLabel(label)}</span>
                                            {isActive && <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full">active</span>}
                                        </div>
                                    </button>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>

                {showResults && searchResults.length > 0 && (
                    <div className="w-full overflow-y-auto max-h-[500px] border-t-2 border-black pt-4 mt-2">
                        <motion.div
                            className="flex flex-col gap-2"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {searchResults.map((item) => {
                                const isCurrent = selectedItem?.id === item.id;
                                return (
                                    <motion.div key={item.id} variants={itemVariants}>
                                        <button
                                            onClick={() => handleItemClick(item)}
                                            className={`py-2 px-4 border-2 border-black rounded-full w-full text-center font-bold text-sm transition-all duration-200 cursor-pointer ${
                                                isCurrent 
                                                    ? 'bg-[#ebc7b5] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                                                    : 'bg-white hover:bg-[#fcf8f2] text-black hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                                            }`}
                                        >
                                            {(trans.items as any)[item.id]?.name || item.name}
                                        </button>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </div>
                )}
            </div>

            {/* Right Details Panel */}
            <div className="flex flex-col gap-5 p-6 rounded-[32px] border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 text-black">
                {selectedItem ? (
                    <motion.div
                        key={selectedItem.id}
                        variants={detailVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col h-full justify-between gap-6"
                    >
                        <div>
                            <span className="text-3xl font-extrabold flex justify-center mb-6 text-center sora-font tracking-tight">
                                {trans.build.guide}
                            </span>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.5fr] gap-6">
                                {/* Details Text Card */}
                                <div className="rounded-2xl border-2 border-black p-5 bg-[#fcf8f2] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-start">
                                    <h3 className="text-center font-extrabold text-xl mb-4 border-b-2 border-black pb-2 sora-font">
                                        ~ {trans.common.detail} ~
                                    </h3>
                                    <div className="flex flex-col gap-3 text-sm">
                                        <p className="leading-relaxed">
                                            <strong className="text-black font-extrabold sora-font">{trans.common.name}:</strong> <br />
                                            {(trans.items as any)[selectedItem.id]?.name || selectedItem.name}
                                        </p>
                                        <p className="leading-relaxed whitespace-pre-line">
                                            <strong className="text-black font-extrabold sora-font">{trans.common.detailLabel}</strong> <br />
                                            {(trans.items as any)[selectedItem.id]?.detail || selectedItem.detail}
                                        </p>
                                        <p className="leading-relaxed">
                                            <strong className="text-black font-extrabold sora-font">{trans.build.pov}</strong>
                                        </p>
                                    </div>
                                </div>

                                {/* Images Section */}
                                <div className="flex flex-col md:flex-row gap-4 justify-center items-stretch">
                                    {selectedItem.image && (
                                        <div className="rounded-2xl border-2 border-black p-4 bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex-1 flex flex-col items-center justify-between">
                                            <span className="sora-font text-center text-black text-[16px] font-extrabold mb-3">{trans.build.hellgate}</span>
                                            <img
                                                src={selectedItem.image}
                                                alt={`${selectedItem.name} image 1`}
                                                className="w-full h-auto object-contain rounded-xl border border-gray-100 max-h-[300px]"
                                            />
                                        </div>
                                    )}
                                    {selectedItem.image2 && (
                                        <div className="rounded-2xl border-2 border-black p-4 bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex-1 flex flex-col items-center justify-between">
                                            <span className="sora-font text-center text-black text-[16px] font-extrabold mb-3">{trans.build.corrupted}</span>
                                            <img
                                                src={selectedItem.image2}
                                                alt={`${selectedItem.name} image 2`}
                                                className="w-full h-auto object-contain rounded-xl border border-gray-100 max-h-[300px]"
                                            />
                                        </div>
                                    )}
                                    {selectedItem.image3 && (
                                        <div className="rounded-2xl border-2 border-black p-4 bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex-1 flex flex-col items-center justify-between">
                                            <span className="sora-font text-center text-black text-[16px] font-extrabold mb-3">{trans.build.openworld}</span>
                                            <img
                                                src={selectedItem.image3}
                                                alt={`${selectedItem.name} image 3`}
                                                className="w-full h-auto object-contain rounded-xl border border-gray-100 max-h-[300px]"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Navigation Controllers */}
                        <div className="flex justify-center mt-4 gap-6 items-center border-t-2 border-black pt-4">
                            <button 
                                className="cursor-pointer bg-white hover:bg-[#fcf8f2] border-2 border-black rounded-full p-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px] active:translate-y-[1px] disabled:opacity-40 disabled:cursor-not-allowed transition-all" 
                                onClick={handlePrev} 
                                disabled={searchResults.length <= 1}
                            >
                                <img src="/image/left-icon.png" alt="Prev" width={16} height={16} />
                            </button>
                            <span className="text-xl font-bold sora-font tracking-tight">
                                ~ {activeButton ? getButtonLabel(activeButton) : ''} ~
                            </span>
                            <button 
                                className="cursor-pointer bg-white hover:bg-[#fcf8f2] border-2 border-black rounded-full p-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px] active:translate-y-[1px] disabled:opacity-40 disabled:cursor-not-allowed transition-all" 
                                onClick={handleNext} 
                                disabled={searchResults.length <= 1}
                            >
                                <img src="/image/right_icon.png" alt="Next" width={16} height={16} />
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <div className="flex justify-center items-center h-48 lg:h-full">
                        <p className="text-[#5d6c7b] text-base font-bold sora-font">{trans.build.selectItemPrompt}</p>
                    </div>
                )}
            </div>
        </section>
    );
}
