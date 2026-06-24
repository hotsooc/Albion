export interface GlossaryTerm {
  term: string;
  fullName: string;
  category: 'pvp' | 'pve' | 'economy' | 'general';
  definitionVi: string;
  definitionEn: string;
}

export const glossaryTerms: GlossaryTerm[] = [
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
