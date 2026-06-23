'use client';

import React, { useState } from 'react';
import { Input, Button, Modal, Row, Col } from 'antd';
import { SearchOutlined, CloseCircleOutlined } from '@ant-design/icons';
import useTrans from '@/hooks/useTrans';

interface GlossaryTerm {
  term: string;
  fullName: string;
  category: 'pvp' | 'pve' | 'economy' | 'general';
  definitionVi: string;
  definitionEn: string;
}

const glossaryTerms: GlossaryTerm[] = [
  {
    term: "ZvZ",
    fullName: "Zone vs Zone / Zero vs Zero",
    category: "pvp",
    definitionVi: "Giao tranh quy mô lớn giữa các liên minh hoặc bang hội (thường từ 20v20 trở lên) tại vùng Black Zone để tranh giành lãnh thổ, lâu đài hoặc boss.",
    definitionEn: "Large scale guild-versus-guild battles (usually 20v20 or more) in the Black Zone for territories, castles, or world bosses."
  },
  {
    term: "CTA",
    fullName: "Call to Action",
    category: "general",
    definitionVi: "Lệnh triệu tập khẩn cấp/bắt buộc toàn bộ thành viên bang hội online tham gia các hoạt động chiến sự quan trọng của bang hội.",
    definitionEn: "Mandatory guild summoning for crucial events such as defending territories, castles, or prime time objectives."
  },
  {
    term: "IP",
    fullName: "Item Power",
    category: "general",
    definitionVi: "Chỉ số sức mạnh trung bình của trang bị. IP càng cao, các chỉ số cơ bản của trang bị (sát thương, máu, chống chịu) càng mạnh.",
    definitionEn: "Item Power represents the strength of a gear piece. Higher IP scales your character's combat stats (damage, health, defenses) higher."
  },
  {
    term: "Spec",
    fullName: "Specialization",
    category: "general",
    definitionVi: "Điểm thông thạo chuyên sâu của một loại trang bị/vũ khí trong Destiny Board (từ 1 đến 120). Tăng Spec giúp cộng thêm lượng IP lớn khi mặc trang bị đó.",
    definitionEn: "Your specialization level (1 to 120) for a specific item in the Destiny Board. Higher Spec grants a significant passive IP boost."
  },
  {
    term: "HCE",
    fullName: "Hardcore Expedition",
    category: "pve",
    definitionVi: "Phó bản PvE cấp độ cao từ map 1 đến 18 dành cho nhóm 5 người. Đòi hỏi trang bị đắt tiền có IP cực cao và phối hợp hoàn hảo để vượt ải đúng thời gian.",
    definitionEn: "High-end PvE maps (tier 1-18) for 5 players. Requires high-spec gear with maximum IP and precise team execution to beat the timer."
  },
  {
    term: "Regear",
    fullName: "Regear System",
    category: "economy",
    definitionVi: "Hệ thống bồi hoàn trang bị của bang hội. Khi bạn chết trong các trận CTA của bang hội, quỹ bang sẽ bù lại set trang bị tương ứng.",
    definitionEn: "Guild gear compensation system. If you die during guild CTA events, the guild treasury refunds your gear set according to guild rules."
  },
  {
    term: "Flipper",
    fullName: "Market Flipping / Arbitrage",
    category: "economy",
    definitionVi: "Người buôn bán chênh lệch giá, mua trang bị/tài nguyên giá rẻ ở một thành phố và vận chuyển qua bán ở thành phố khác hoặc Chợ Đen (Black Market).",
    definitionEn: "Trader who buys items/resources at a low price in one city and transports them to sell at a higher price in another city or the Black Market."
  },
  {
    term: "CTA Schedule",
    fullName: "Guild CTA Hours",
    category: "general",
    definitionVi: "Lịch trình hoạt động chiến sự cố định của bang hội theo các múi giờ Reset của game (thường là 00, 03, 05, 12, 15, 18, 21 UTC).",
    definitionEn: "Guild fixed CTA activity times matching Albion game timer resets (usually 00, 03, 05, 12, 15, 18, 21 UTC)."
  },
  {
    term: "Yellow Zone",
    fullName: "Y-Zone",
    category: "general",
    definitionVi: "Vùng an toàn trung bình. Cho phép PK (đồ sát), nhưng khi bị hạ gục người chơi chỉ bị gục ngã (knock down) và mất độ bền đồ chứ không mất trang bị.",
    definitionEn: "Medium safety zone. PK is allowed, but being defeated only knocks you down and reduces gear durability without full-loot death."
  },
  {
    term: "Red Zone",
    fullName: "R-Zone",
    category: "general",
    definitionVi: "Vùng nguy hiểm. Cho phép PK cướp toàn bộ trang bị (Full Loot). Người chơi bật PK (đồ sát) sẽ bị đánh dấu vạch đỏ trên radar mini.",
    definitionEn: "Dangerous zone with full loot on death. Players flagged for PK will trigger a hostile count warning on your minimap."
  },
  {
    term: "Black Zone",
    fullName: "Outlands / B-Zone",
    category: "general",
    definitionVi: "Vùng đất Đen bên ngoài lục địa hoàng gia. Mặc định là vùng đồ sát tự do (Full Loot), tất cả người ngoài bang hội/liên minh đều là kẻ thù.",
    definitionEn: "The Outlands continent. A lawless PvP area with full loot on death, where anyone not in your guild/alliance is a threat."
  },
  {
    term: "Faction Warfare",
    fullName: "Faction Fight",
    category: "pvp",
    definitionVi: "Hệ thống chiến tranh bang phái. Người chơi đăng ký theo 1 trong các thành phố Hoàng gia để cướp đồn và đánh chiếm cứ điểm kiếm điểm thưởng Faction.",
    definitionEn: "City faction system. Players enlist for one of the Royal cities to capture outposts, fight other factions, and earn faction points."
  },
  {
    term: "Gank / Ganking",
    fullName: "Ganking",
    category: "pvp",
    definitionVi: "Hoạt động đi săn bắt người chơi khác trên đường đi nhằm cướp trang bị của họ. Thường thực hiện theo nhóm nhỏ từ 2-5 người với các món đồ khống chế cao.",
    definitionEn: "The act of hunting down gatherers, traders, or solo players to loot them. Usually done in small groups using crowd-control heavy builds."
  },
  {
    term: "HCE Map",
    fullName: "HCE Map Tier",
    category: "pve",
    definitionVi: "Bản đồ phó bản để mở cổng Hardcore Expedition, có cấp độ từ Tier 1 (dễ) đến Tier 18 (cực khó). Bản đồ tier càng cao giá trị càng đắt.",
    definitionEn: "Expedition map used to enter HCE, ranging from Tier 1 (easy) to Tier 18 (hardcore). Higher tier maps yield better rewards but cost more."
  },
  {
    term: "Black Market",
    fullName: "Chợ Đen (BM)",
    category: "economy",
    definitionVi: "Chợ đặt tại thành Caerleon, nơi hệ thống game tự động mua trang bị từ người chơi để phân phối làm phần thưởng rơi ra từ quái và rương phó bản.",
    definitionEn: "Caerleon system-driven market that buys gear from players to seed drops for mobs and chests across the world."
  }
];

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
