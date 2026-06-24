'use client';

import React, { useState } from 'react';
import { Input, Button, Modal, Row, Col } from 'antd';
import { SearchOutlined, CloseCircleOutlined } from '@ant-design/icons';
import useTrans from '@/hooks/useTrans';
import { glossaryTerms, GlossaryTerm } from '@/store/glossary';

export default function DictionaryPage() {
  const { trans, lang } = useTrans();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'pvp' | 'pve' | 'economy' | 'general'>('all');
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);

  const handleCategoryClick = (category: typeof activeCategory) => {
    setActiveCategory(category);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const categories = [
    { key: 'all', label: trans.dictionary.filterAll },
    { key: 'pvp', label: trans.dictionary.filterPvp },
    { key: 'pve', label: trans.dictionary.filterPve },
    { key: 'economy', label: trans.dictionary.filterEconomy },
    { key: 'general', label: trans.dictionary.filterGeneral }
  ];

  const filteredTerms = glossaryTerms.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definitionVi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definitionEn.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-4 md:p-6 w-full h-full rounded-[32px] border-2 border-[var(--border-color)] bg-[var(--bg-panel-solid)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-[var(--text-primary)] theme-transition">
      
      {/* Title Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold sora-font tracking-tight mt-2 text-[var(--text-primary)]">
          {trans.dictionary.title}
        </h1>
        <p className="text-[var(--text-secondary)] text-sm md:text-base font-semibold max-w-xl mx-auto mt-2">
          {trans.dictionary.subtitle}
        </p>
      </div>

      {/* Category Tabs Selection */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => handleCategoryClick(cat.key as any)}
              className={`py-2 px-5 rounded-full border-2 border-[var(--border-color)] font-extrabold sora-font text-xs md:text-sm tracking-tight cursor-pointer transition-all duration-200 ${
                isActive 
                  ? 'bg-[var(--color-accent)] text-[var(--text-btn-upload)] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -translate-y-[1px]' 
                  : 'bg-[var(--bg-panel-solid)] hover:bg-[var(--bg-column)] text-[var(--text-primary)] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Search Input Bar */}
      <div className="flex justify-center mb-8">
        <div className="relative w-full max-w-md flex items-center rounded-full overflow-hidden border-2 border-[var(--border-color)] bg-[var(--bg-input)] px-4 transition-all duration-300 focus-within:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <SearchOutlined className="text-[var(--text-primary)] text-lg mr-2" />
          <Input
            placeholder={trans.dictionary.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="!border-none !shadow-none bg-transparent flex-grow h-11 focus:ring-0 !text-[var(--text-primary)]"
          />
          {searchTerm && (
            <Button
              type="text"
              icon={<CloseCircleOutlined />}
              onClick={handleClearSearch}
              className="!text-[var(--text-primary)] hover:!text-red-500"
            />
          )}
        </div>
      </div>

      {/* Grid of Terms */}
      {filteredTerms.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[var(--text-secondary)] font-extrabold sora-font text-lg">
            {trans.dictionary.noResults}
          </p>
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredTerms.map((item) => (
            <Col key={item.term} xs={24} sm={12} md={8} lg={6}>
              <div
                onClick={() => setSelectedTerm(item)}
                className="cursor-pointer h-full rounded-2xl border-2 border-[var(--border-color)] p-5 bg-[var(--bg-panel-solid)] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[2px] transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xl font-extrabold sora-font tracking-tight text-[var(--text-primary)]">
                      {item.term}
                    </span>
                    <span className="text-[10px] uppercase font-extrabold border-2 border-[var(--border-color)] px-2 py-0.5 rounded-full bg-[var(--bg-column)] text-[var(--text-secondary)]">
                      {item.category}
                    </span>
                  </div>
                  <h4 className="text-xs text-[var(--text-secondary)] font-bold mb-3">
                    {item.fullName}
                  </h4>
                  <p className="text-sm text-[var(--text-primary)] line-clamp-3 leading-relaxed">
                    {lang === 'vi' ? item.definitionVi : item.definitionEn}
                  </p>
                </div>
                <div className="mt-4 text-xs font-extrabold text-[var(--color-accent-hover)] dark:text-[var(--text-primary)] border-t border-[var(--border-color)] pt-2 flex items-center justify-end">
                  {trans.common.detail} →
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}

      {/* Detail Modal */}
      <Modal
        title={<span className="sora-font font-extrabold text-xl">{trans.dictionary.termDetails}</span>}
        open={selectedTerm !== null}
        onCancel={() => setSelectedTerm(null)}
        footer={null}
        destroyOnClose={true}
        className="sircle-modal"
      >
        {selectedTerm && (
          <div className="flex flex-col gap-4 mt-4 text-[var(--text-primary)]">
            <div>
              <span className="text-2xl font-extrabold sora-font text-[var(--text-primary)]">
                {selectedTerm.term}
              </span>
              <p className="text-sm text-[var(--text-secondary)] font-bold">
                {selectedTerm.fullName}
              </p>
            </div>
            
            <div className="border-t border-[var(--border-color)] pt-3 flex flex-col gap-2.5">
              <div>
                <strong className="text-xs uppercase text-[var(--text-secondary)] block mb-1">
                  {trans.dictionary.categoryLabel}
                </strong>
                <span className="text-xs uppercase font-extrabold border border-[var(--border-color)] px-2.5 py-1 rounded-full bg-[var(--bg-column)]">
                  {selectedTerm.category}
                </span>
              </div>
              
              <div className="mt-2">
                <strong className="text-xs uppercase text-[var(--text-secondary)] block mb-1">
                  {trans.dictionary.definitionLabel}
                </strong>
                <p className="text-base font-semibold leading-relaxed whitespace-pre-wrap bg-[var(--bg-column)] p-4 rounded-xl border border-[var(--border-color)]">
                  {lang === 'vi' ? selectedTerm.definitionVi : selectedTerm.definitionEn}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
