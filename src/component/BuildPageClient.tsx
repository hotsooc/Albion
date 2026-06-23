'use client';

import { CloseCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Form, Select, message, Spin } from 'antd';
import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, Transition } from 'framer-motion';
import { allItemsData, dataSets, ItemType } from '@/store/data';
import useTrans from '@/hooks/useTrans';
import { GridSkeleton } from '@/component/Skeleton';
import { ChevronLeft, ChevronRight, Plus, Pencil, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase/client';

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

const categoriesOrder = [
    'Sword', 'Axe', 'Mace', 'Hammer', 'War Gloves',
    'Bow', 'Dagger', 'Spear', 'Quarterstaves',
    'Shapeshifter Staves', 'Nature Staves', 'Fire Staves',
    'Holy Staves', 'Arcane Staves', 'Frost Staves',
    'Cursed Staves', 'Shields', 'Torches', 'Tomes'
];

export default function BuildPageClient() {
    const searchParams = useSearchParams();
    const { trans } = useTrans();
    const [form] = Form.useForm();

    const [inputValue, setInputValue] = useState('');
    const [searchResults, setSearchResults] = useState<ItemType[]>([]);
    const [activeButton, setActiveButton] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<ItemType | null>(null);
    
    // Dynamic database states
    const [buildsList, setBuildsList] = useState<ItemType[]>([]);
    const [dynamicDataSets, setDynamicDataSets] = useState<Record<string, ItemType[]>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    
    // CRUD Modals
    const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
    const [editingBuild, setEditingBuild] = useState<ItemType | null>(null);

    // Get active user role to toggle edit access
    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setIsAdmin(true); // Allow logged-in users to manage
            }
        };
        checkUser();
    }, []);

    // Load builds from Supabase id: 2, auto-seed if empty
    useEffect(() => {
        const loadBuilds = async () => {
            try {
                setIsLoading(true);
                const { data, error } = await supabase
                    .from('teams_data')
                    .select('data')
                    .eq('id', 2)
                    .single();

                if (error && error.code === 'PGRST116') {
                    // Seed initial data
                    const seededBuilds = allItemsData.map(item => {
                        let category = 'Unknown';
                        for (const [catName, items] of Object.entries(dataSets)) {
                            if (items.some(i => i.id === item.id)) {
                                category = catName;
                                break;
                            }
                        }
                        return { ...item, category };
                    });

                    const payload = { builds: seededBuilds };
                    const { error: insertError } = await supabase
                        .from('teams_data')
                        .insert({ id: 2, data: payload });

                    if (insertError) {
                        console.error('Error seeding builds:', insertError);
                    }
                    setBuildsList(seededBuilds);
                } else if (data && data.data) {
                    const parsed = data.data as { builds: ItemType[] };
                    setBuildsList(parsed.builds || []);
                }
            } catch (err) {
                console.error(err);
                message.error('Lỗi khi tải danh sách build.');
            } finally {
                setIsLoading(false);
            }
        };
        loadBuilds();
    }, []);

    // Regroup dynamic datasets on buildsList change
    useEffect(() => {
        const dynamicSets: Record<string, ItemType[]> = {};
        categoriesOrder.forEach(cat => {
            dynamicSets[cat] = [];
        });
        
        buildsList.forEach(item => {
            const cat = item.category || 'Unknown';
            if (!dynamicSets[cat]) {
                dynamicSets[cat] = [];
            }
            dynamicSets[cat].push(item);
        });
        setDynamicDataSets(dynamicSets);
    }, [buildsList]);

    // Handle search triggers from URL params
    useEffect(() => {
        const query = searchParams.get('q');
        if (query && buildsList.length > 0) {
            setInputValue(query);
            const filteredData = buildsList.filter(item =>
                item.name.toLowerCase().includes(query.toLowerCase())
            );
            setSearchResults(filteredData);
            setSelectedItem(filteredData[0] || null);
        }
    }, [searchParams, buildsList]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        setActiveButton(null);
        setSelectedItem(null);
        const filteredData = buildsList.filter(item =>
            item.name.toLowerCase().includes(value.toLowerCase())
        );
        setSearchResults(filteredData);
    };

    const handleToggleDataSet = (label: string) => {
        const dataSet = dynamicDataSets[label] || [];
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

    // Helper functions for CRUD
    const saveBuildsToSupabase = async (newBuilds: ItemType[]) => {
        const { error } = await supabase
            .from('teams_data')
            .update({ data: { builds: newBuilds } })
            .eq('id', 2);
        
        if (error) {
            console.error('Error saving builds:', error);
            message.error('Không thể cập nhật database.');
            return false;
        }
        setBuildsList(newBuilds);
        return true;
    };

    const handleOpenAddModal = () => {
        setEditingBuild(null);
        form.resetFields();
        setIsAddEditModalOpen(true);
    };

    const handleOpenEditModal = (item: ItemType) => {
        setEditingBuild(item);
        form.setFieldsValue({
            name: item.name,
            category: item.category || 'Sword',
            detail: item.detail,
            image: cleanImageUrl(item.image),
            image2: cleanImageUrl(item.image2),
            image3: cleanImageUrl(item.image3)
        });
        setIsAddEditModalOpen(true);
    };

    const cleanImageUrl = (url: string) => {
        if (!url) return '';
        if (url.startsWith('https://render.albiononline.com/v1/item/')) {
            const parts = url.split('/');
            return parts[parts.length - 1].replace('.png', '');
        }
        return url;
    };

    const formatImageUrl = (val: string) => {
        if (!val) return '';
        const trimmed = val.trim();
        if (trimmed.startsWith('http') || trimmed.startsWith('/') || trimmed.startsWith('.')) {
            return trimmed;
        }
        return `https://render.albiononline.com/v1/item/${trimmed.toUpperCase()}.png`;
    };

    const handleSaveBuild = async (values: any) => {
        try {
            const formattedBuild: ItemType = {
                id: editingBuild ? editingBuild.id : `custom_${Date.now()}`,
                name: values.name,
                category: values.category,
                detail: values.detail,
                image: formatImageUrl(values.image),
                image2: formatImageUrl(values.image2),
                image3: formatImageUrl(values.image3)
            };

            let updatedList = [];
            if (editingBuild) {
                updatedList = buildsList.map(b => b.id === editingBuild.id ? formattedBuild : b);
                message.success('Cập nhật cấu hình build thành công!');
            } else {
                updatedList = [formattedBuild, ...buildsList];
                message.success('Thêm build mới thành công!');
            }

            const success = await saveBuildsToSupabase(updatedList);
            if (success) {
                setIsAddEditModalOpen(false);
                setSelectedItem(formattedBuild);
                
                // Refresh list display
                if (activeButton === values.category) {
                    const dynamicSets = getDynamicSets(updatedList);
                    setSearchResults(dynamicSets[values.category] || []);
                } else if (inputValue) {
                    const filtered = updatedList.filter(item =>
                        item.name.toLowerCase().includes(inputValue.toLowerCase())
                    );
                    setSearchResults(filtered);
                }
            }
        } catch (err) {
            console.error(err);
            message.error('Đã xảy ra lỗi.');
        }
    };

    const getDynamicSets = (list: ItemType[]) => {
        const dynamicSets: Record<string, ItemType[]> = {};
        list.forEach(item => {
            const cat = item.category || 'Unknown';
            if (!dynamicSets[cat]) {
                dynamicSets[cat] = [];
            }
            dynamicSets[cat].push(item);
        });
        return dynamicSets;
    };

    const handleDeleteBuild = async (item: ItemType) => {
        Modal.confirm({
            title: `Xác nhận xóa build`,
            content: `Bạn có chắc chắn muốn xóa build "${item.name}"?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                const updatedList = buildsList.filter(b => b.id !== item.id);
                const success = await saveBuildsToSupabase(updatedList);
                if (success) {
                    message.success('Xóa build thành công!');
                    setSelectedItem(null);
                    if (activeButton === item.category) {
                        const dynamicSets = getDynamicSets(updatedList);
                        setSearchResults(dynamicSets[item.category] || []);
                    } else if (inputValue) {
                        const filtered = updatedList.filter(b =>
                            b.name.toLowerCase().includes(inputValue.toLowerCase())
                        );
                        setSearchResults(filtered);
                    }
                }
            }
        });
    };

    const buttonsToDisplay = activeButton ? [activeButton] : categoriesOrder;
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

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen w-full">
                <Spin size="large" tip="Đang tải dữ liệu vũ khí & builds..." />
            </div>
        );
    }

    return (
        <Suspense fallback={<GridSkeleton />}>
        <section className="grid grid-cols-1 lg:grid-cols-[1.2fr_3.8fr] h-auto gap-4 md:gap-6 mx-1 md:mx-6 transition-all duration-300 text-[var(--text-primary)]">
            {/* Left Filter & Search Bar */}
            <div className="flex flex-col gap-5 border-2 border-[var(--border-color)] rounded-[32px] p-5 bg-[var(--bg-panel-solid)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                
                {isAdmin && (
                    <Button
                        type="primary"
                        onClick={handleOpenAddModal}
                        icon={<Plus size={16} />}
                        className="w-full !h-12 !rounded-full border-2 border-black !bg-emerald-500 hover:!bg-emerald-600 !text-black font-extrabold sora-font flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px] transition-all"
                    >
                        Tạo Build Mới
                    </Button>
                )}

                <div className="flex items-center rounded-full w-full overflow-hidden border-2 border-[var(--border-color)] bg-[var(--bg-panel-solid)] px-4 transition-all duration-300 focus-within:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <SearchOutlined className="text-[var(--text-primary)] text-lg mr-2" />
                    <Input
                        placeholder={trans.common.searchPlaceholder}
                        value={inputValue}
                        onChange={handleSearch}
                        className="!border-none !shadow-none bg-transparent flex-grow h-11 focus:ring-0 !text-[var(--text-primary)]"
                    />
                    {inputValue && (
                        <Button
                            type="text"
                            icon={<CloseCircleOutlined />}
                            onClick={handleClearSearch}
                            className="!text-[var(--text-primary)] hover:!text-red-500"
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
                            const isActive = activeButton === label;
                            return (
                                <motion.div key={label} variants={itemVariants}>
                                    <button
                                        onClick={() => handleToggleDataSet(label)}
                                        className={`w-full py-3 px-4 rounded-full border-2 border-[var(--border-color)] text-left font-bold sora-font tracking-tight transition-all duration-200 cursor-pointer ${
                                            isActive 
                                                ? 'bg-[var(--color-accent)] text-[var(--text-btn-upload)] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -translate-y-[1px]' 
                                                : 'bg-[var(--bg-panel-solid)] hover:bg-[var(--bg-column)] text-[var(--text-primary)] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px]'
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
                    <div className="w-full overflow-y-auto max-h-[500px] border-t-2 border-[var(--border-color)] pt-4 mt-2">
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
                                            className={`py-2 px-4 border-2 border-[var(--border-color)] rounded-full w-full text-center font-bold text-sm transition-all duration-200 cursor-pointer ${
                                                isCurrent 
                                                    ? 'bg-[var(--color-accent)] text-[var(--text-btn-upload)] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                                                    : 'bg-[var(--bg-panel-solid)] hover:bg-[var(--bg-column)] text-[var(--text-primary)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
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
            <div className="flex flex-col gap-5 p-6 rounded-[32px] border-2 border-[var(--border-color)] bg-[var(--bg-panel-solid)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 text-[var(--text-primary)]">
                {selectedItem ? (
                    <motion.div
                        key={selectedItem.id}
                        variants={detailVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col h-full justify-between gap-6"
                    >
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-3xl font-extrabold sora-font tracking-tight flex-grow text-center">
                                    {trans.build.guide}
                                </span>
                                {isAdmin && (
                                    <div className="flex gap-2 shrink-0">
                                        <button
                                            onClick={() => handleOpenEditModal(selectedItem)}
                                            className="p-2.5 border-2 border-black bg-amber-400 hover:bg-amber-500 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px] transition-all cursor-pointer"
                                            title="Sửa Build"
                                        >
                                            <Pencil size={16} className="text-black" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteBuild(selectedItem)}
                                            className="p-2.5 border-2 border-black bg-rose-500 hover:bg-rose-600 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px] transition-all cursor-pointer"
                                            title="Xóa Build"
                                        >
                                            <Trash2 size={16} className="text-white" />
                                        </button>
                                    </div>
                                )}
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.5fr] gap-6">
                                {/* Details Text Card */}
                                <div className="rounded-2xl border-2 border-[var(--border-color)] p-5 bg-[var(--bg-column)] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-start">
                                    <h3 className="text-center font-extrabold text-xl mb-4 border-b-2 border-[var(--border-color)] pb-2 sora-font">
                                        ~ {trans.common.detail} ~
                                    </h3>
                                    <div className="flex flex-col gap-3 text-sm">
                                        <p className="leading-relaxed">
                                            <strong className="text-[var(--text-primary)] font-extrabold sora-font">{trans.common.name}:</strong> <br />
                                            {(trans.items as any)[selectedItem.id]?.name || selectedItem.name}
                                        </p>
                                        <p className="leading-relaxed whitespace-pre-line">
                                            <strong className="text-[var(--text-primary)] font-extrabold sora-font">{trans.common.detailLabel}</strong> <br />
                                            {(trans.items as any)[selectedItem.id]?.detail || selectedItem.detail}
                                        </p>
                                        <p className="leading-relaxed">
                                            <strong className="text-[var(--text-primary)] font-extrabold sora-font">{trans.build.pov}</strong>
                                        </p>
                                    </div>
                                </div>

                                {/* Images Section */}
                                <div className="flex flex-col md:flex-row gap-4 justify-center items-stretch">
                                    {selectedItem.image && (
                                        <div className="rounded-2xl border-2 border-[var(--border-color)] p-4 bg-[var(--bg-panel-solid)] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex-1 flex flex-col items-center justify-between">
                                            <span className="sora-font text-center text-[var(--text-primary)] text-[16px] font-extrabold mb-3">{trans.build.hellgate}</span>
                                            <img
                                                src={selectedItem.image}
                                                alt={`${selectedItem.name} image 1`}
                                                className="w-full h-auto object-contain rounded-xl border border-gray-150 max-h-[300px]"
                                            />
                                        </div>
                                    )}
                                    {selectedItem.image2 && (
                                        <div className="rounded-2xl border-2 border-[var(--border-color)] p-4 bg-[var(--bg-panel-solid)] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex-1 flex flex-col items-center justify-between">
                                            <span className="sora-font text-center text-[var(--text-primary)] text-[16px] font-extrabold mb-3">{trans.build.corrupted}</span>
                                            <img
                                                src={selectedItem.image2}
                                                alt={`${selectedItem.name} image 2`}
                                                className="w-full h-auto object-contain rounded-xl border border-gray-150 max-h-[300px]"
                                            />
                                        </div>
                                    )}
                                    {selectedItem.image3 && (
                                        <div className="rounded-2xl border-2 border-[var(--border-color)] p-4 bg-[var(--bg-panel-solid)] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex-1 flex flex-col items-center justify-between">
                                            <span className="sora-font text-center text-[var(--text-primary)] text-[16px] font-extrabold mb-3">{trans.build.openworld}</span>
                                            <img
                                                src={selectedItem.image3}
                                                alt={`${selectedItem.name} image 3`}
                                                className="w-full h-auto object-contain rounded-xl border border-gray-150 max-h-[300px]"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Navigation Controllers */}
                        <div className="flex justify-center mt-4 gap-6 items-center border-t-2 border-[var(--border-color)] pt-4">
                            <button 
                                className="cursor-pointer bg-[var(--bg-panel-solid)] hover:bg-[var(--bg-column)] border-2 border-[var(--border-color)] rounded-full p-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px] active:translate-y-[1px] disabled:opacity-40 disabled:cursor-not-allowed transition-all" 
                                onClick={handlePrev} 
                                disabled={searchResults.length <= 1}
                            >
                                <ChevronLeft size={16} className="text-[var(--text-primary)]" />
                            </button>
                            <span className="text-xl font-bold sora-font tracking-tight">
                                ~ {activeButton ? getButtonLabel(activeButton) : ''} ~
                            </span>
                            <button 
                                className="cursor-pointer bg-[var(--bg-panel-solid)] hover:bg-[var(--bg-column)] border-2 border-[var(--border-color)] rounded-full p-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px] active:translate-y-[1px] disabled:opacity-40 disabled:cursor-not-allowed transition-all" 
                                onClick={handleNext} 
                                disabled={searchResults.length <= 1}
                            >
                                <ChevronRight size={16} className="text-[var(--text-primary)]" />
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <div className="flex justify-center items-center h-48 lg:h-full">
                        <p className="text-[var(--text-secondary)] text-base font-bold sora-font">{trans.build.selectItemPrompt}</p>
                    </div>
                )}
            </div>
        </section>

        {/* Modal form for CRUD builds */}
        <Modal
            title={editingBuild ? "Cập Nhật Cấu Hình Build" : "Tạo Cấu Hinh Build Mới"}
            open={isAddEditModalOpen}
            onCancel={() => setIsAddEditModalOpen(false)}
            footer={null}
            destroyOnClose
            centered
            className="sircle-modal"
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSaveBuild}
                initialValues={{
                    category: 'Sword'
                }}
                className="text-[var(--text-primary)] mt-4"
            >
                <Form.Item
                    name="name"
                    label="Tên Build / Vũ Khí"
                    rules={[{ required: true, message: 'Vui lòng nhập tên build!' }]}
                >
                    <Input className="!bg-[var(--bg-input)] !text-[var(--text-primary)] border-2 border-[var(--border-color)] rounded-xl h-11" />
                </Form.Item>

                <Form.Item
                    name="category"
                    label="Nhóm Vũ Khí (Category)"
                    rules={[{ required: true }]}
                >
                    <Select className="border-[var(--border-color)] rounded-xl !bg-[var(--bg-input)] !text-[var(--text-primary)] h-11">
                        {categoriesOrder.map(cat => (
                            <Select.Option key={cat} value={cat}>
                                {getButtonLabel(cat)}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="detail"
                    label="Mô tả / Hướng dẫn cách chơi"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả hoặc hướng dẫn!' }]}
                >
                    <Input.TextArea rows={4} className="!bg-[var(--bg-input)] !text-[var(--text-primary)] border-2 border-[var(--border-color)] rounded-xl" />
                </Form.Item>

                <div className="border-t border-[var(--border-color)] my-4 pt-4">
                    <h4 className="font-bold mb-3 text-sm">Hình ảnh Build cho các chế độ (Nhập Link Ảnh hoặc Mã Item game như: T8_MAIN_BOW)</h4>
                    
                    <Form.Item
                        name="image"
                        label="Hellgate Build (Link ảnh hoặc Item ID)"
                    >
                        <Input placeholder="Ví dụ: T8_MAIN_BOW hoặc link ảnh" className="!bg-[var(--bg-input)] !text-[var(--text-primary)] border-2 border-[var(--border-color)] rounded-xl h-11" />
                    </Form.Item>

                    <Form.Item
                        name="image2"
                        label="Corrupted Dungeon Build (Link ảnh hoặc Item ID)"
                    >
                        <Input placeholder="Ví dụ: T8_MAIN_BOW_KEEPER hoặc link ảnh" className="!bg-[var(--bg-input)] !text-[var(--text-primary)] border-2 border-[var(--border-color)] rounded-xl h-11" />
                    </Form.Item>

                    <Form.Item
                        name="image3"
                        label="Open World / ZvZ Build (Link ảnh hoặc Item ID)"
                    >
                        <Input placeholder="Ví dụ: T8_MAIN_SWORD_CARVING hoặc link ảnh" className="!bg-[var(--bg-input)] !text-[var(--text-primary)] border-2 border-[var(--border-color)] rounded-xl h-11" />
                    </Form.Item>
                </div>

                <Form.Item className="flex justify-end gap-2 mb-0 mt-6">
                    <Button onClick={() => setIsAddEditModalOpen(false)} className="mr-2 rounded-xl h-10 font-bold">
                        Hủy
                    </Button>
                    <Button type="primary" htmlType="submit" className="!bg-[var(--color-accent)] hover:!bg-[var(--color-accent-hover)] !text-[var(--text-btn-upload)] font-bold rounded-xl border-none h-10">
                        Lưu Build
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
        </Suspense>
    );
}
