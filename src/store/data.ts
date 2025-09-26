export type ItemType = {
  id: string;
  name: string;
  detail: string;
  image: string;
  image2: string;
  image3: string;
};

// https://www.facebook.com/khanh.duy.57514

export const dataSet1: ItemType[] = [
  { id: '1', name: 'Bow', detail: `Cung rác
    Tốt cho pvp 1v1 vì lượng dmg deal tốt và khá cơ động`, image: '/asset/Bow/Bow/hellgate.png', image2: '/asset/Bow/Bow/corrupted.png', image3: '/asset/Bow/Bow/openworld.png' },
  { id: '2', name: 'Bow Of Badon', detail: `Cung Sét
    Tốt cho các giao tranh nhỏ lẻ như SC, 5v5, ... dmg deal khá tốt và có cơ chế làm gián đoạn cast spell của người chơi`, image: '/asset/Bow/Badon/hellgate.png', image2: '/asset/Bow/Badon/corrupted.png', image3: '/asset/Bow/Badon/openworld.png' },
  { id: '3', name: 'MistPiercer', detail: `Cung Chim
    Tốt cho các giao tranh nhỏ lẻ như SC, Road Avalonian, ... dmg deal tốt nhưng cần CC cứng từ team`, image: '', image2: '/asset/Bow/Mistpiercer/corrupted.png', image3: '/asset/Bow/Mistpiercer/openworld.png' },
  { id: '4', name: 'Skystrider Bow', detail: `Cung Sét v2
    Khá tốt cho solo player với lượng dmg ổn và cơ chế miễn nhiễm sát thương khi đứng trên không khá ngầu`, image: '', image2: '/asset/Bow/Skystrider/corrupted.png', image3: '/asset/Bow/Skystrider/openworld.png' },
  { id: '5', name: 'Walling Bow', detail: `Cung Xuyên Thấu
    Tốt cho các giao tranh lớn như ZvZ, Road Avalonian, ... dmg deal tốt nếu biết chọn góc bắn phù hợp với cơ chế càng xuyên qua nhiều người dmg càng lớn`, image: '', image2: '', image3: '' },
  { id: '6', name: 'Whispering Bow', detail: `Đại bác tầm xa
    Dmg deal khá tốt nếu được free shot nhưng rất mỏng và cần cover rất nhiều từ team`, image: '', image2: '', image3: '' },
  { id: '7', name: 'WarBow', detail: `Cung Rỉa
    Khá yếu khi đem đi đánh những content lớn và hầu như chỉ được chơi ở corrupted dungeon, 2v2`, image: '', image2: '/asset/Bow/WarBow/corrupted.png', image3: '/asset/Bow/WarBow/openworld.png' },
  { id: '8', name: 'LongBow', detail: `Cung PVE
    Rất mạnh ở khoản clear mob và dmg deal khá tốt nếu như team có CC cứng`, image: '', image2: '', image3: '' },
];

export const dataSet2: ItemType[] = [
  { id: '9', name: 'Dagger', detail: `Dmg deal ổn và rất mạnh với các content solo boss.
    Có các build 1shot khá dị nên thử qua (Khi đã master còn không thì +1 video funny moment vì cơ chế tự mất máu theo thời gian)`, image: '/asset/Dagger/Dagger/hellgate.png', image2: '', image3: '/asset/Dagger/Dagger/openworld.png' },
  { id: '10', name: 'DaggerPair', detail: 'Dmg deal ổn (Có bleed khi E) và khá được ưa chuộng khi đi gank vì rất dễ dismount địch', image: '/asset/Dagger/DaggerPair/hellgate.png', image2: '', image3: '/asset/Dagger/DaggerPair/openworld.png' },
  { id: '11', name: 'DeathGivers', detail: `Dmg deal tốt và rất phù hợp với những người có "bản năng sát thủ".
    Bonus: Ngoài ra có rất nhiều radar player ưa chuộng trong the Mist`, image: '', image2: '/asset/Dagger/DeathGivers/corrupted.png', image3: '/asset/Dagger/DeathGivers/openworld.png' },
  { id: '12', name: 'DemonFang', detail: 'Dmg deal ổn và phù hợp với các content lớn như ZvZ', image: '', image2: '', image3: '' },
  { id: '13', name: 'Bloodletter', detail: 'Khá hoàn hảo khi có thể tham dự hầu hết mọi content có khả năng dứt điểm với set 1shot hay đơn giản là set build tank để quẩy trong 1vX', image: '', image2: '', image3: '/asset/Dagger/Bloodletter/openworld.png' },
  { id: '14', name: 'BridledFury', detail: 'Dmg deal tốt khi đã master (spec > 400) phù hợp cho ZvZ', image: '', image2: '', image3: '' },
  { id: '15', name: 'Claws', detail: 'Phù hợp với các content đi gank và có thể là corrupted dungeon', image: '', image2: '', image3: '' },
  { id: '16', name: 'TwinSlayer', detail: 'Nếu bạn đã chơi Talon thì cây này phù hợp với bạn', image: '/asset/Dagger/TwinSlayer/hellgate.png', image2: '', image3: '' },
];

export const dataSet3: ItemType[] = [
  { id: '17', name: 'Spear', detail: 'Thích hợp cho solo (Mist, Openworld, Corrupted)', image: '', image2: '/asset/Spear/Spear/corrupted.png', image3: '/asset/Spear/Spear/openworld.png' },
  { id: '18', name: 'Pike', detail: 'Mạnh ở khoảng solo, dồn sát thương 1 nhịp, phù hợp content Mist, Corrupted', image: '', image2: '', image3: '' },
  { id: '19', name: 'Glaive', detail: 'Phù hợp content Hellgate 2v2 hoặc 5v5, cô lập với heal dứt điểm mục tiêu còn lại', image: '/asset/Spear/Glaive/hellgate.png', image2: '', image3: '' },
  { id: '20', name: 'Heron Spear', detail: 'Phù hợp nhất content SC, đi cùng LongBow hoặc Bloodletter, có khả năng đánh outnumbered', image: '', image2: '', image3: '/asset/Spear/Heron/openworld.png' },
  { id: '21', name: 'Spirit Hunter', detail: 'Phù hợp đội hình 1-shot', image: '', image2: '/asset/Spear/SpiritHunter/hellgate.png', image3: '/asset/Spear/SpiritHunter/openworld.png' },
  { id: '22', name: 'Trinity Spear', detail: 'Phù hợp với solo (corrupted)', image: '', image2: '/asset/Spear/Trinity/corrupted.png', image3: '' },
  { id: '23', name: 'DayBreaker', detail: 'Phù hợp với content đông người, MDPS khỏe, E xóa buff mạnh', image: '/asset/Spear/DayBreaker/hellgate.png', image2: '/asset/Spear/DayBreaker/corrupted.png', image3: '/asset/Spear/DayBreaker/openworld.png' },
  { id: '24', name: 'Rift Glaive', detail: 'Cần tối thiểu 3 cây trong 1 team, team 1-shot', image: '/asset/Spear/RiftGlaive/hellgate.png', image2: '', image3: '/asset/Spear/RiftGlaive/openworld.png' },
];

export const dataSet4: ItemType[] = [
  { id: '25', name: 'Quarterstaff', detail: 'Phù hợp cho solo', image: '', image2: '/asset/Quarterstaves/Quarterstaff/corrupted.png', image3: '/asset/Quarterstaves/Quarterstaff/openworld.png' },
  { id: '26', name: 'Iron-clad Staff', detail: 'Phế vật', image: '', image2: '', image3: '' },
  { id: '27', name: 'Double Bladed Staff', detail: 'Phù hợp content gank', image: '', image2: '', image3: '' },
  { id: '28', name: 'Black Monk Stave', detail: 'Thường dùng trong tank boss HCE', image: '', image2: '', image3: '' },
  { id: '29', name: 'Soulscythe', detail: 'Thường đánh trong ZvZ, hoặc Hellgate 2v2 oneshot', image: '/asset/Quarterstaves/Soulscythe/hellgate.png', image2: '', image3: '' },
  { id: '30', name: 'Staff of Balance', detail: 'Thường đánh trong ZvZ, hoặc Hellgate 2v2 oneshot', image: '/asset/Quarterstaves/StaffofBalance/hellgate.png', image2: '', image3: '' },
  { id: '31', name: 'Grailseeker', detail: 'Thường đánh trong Hellgate 2v2 oneshot chung với Dagger', image: '/asset/Quarterstaves/Grailseeker/hellgate.png', image2: '', image3: '' },
  { id: '32', name: 'Phantom Twinblade', detail: 'Chỉ chơi được trong The Depth, không tính tiền', image: '', image2: '', image3: '' },
];

export const dataSet5: ItemType[] = [
  { id: '33', name: 'Prowling Staff', detail: 'Phù hợp chơi solo, đặc biệt là trong the Mist', image: '', image2: '', image3: '' },
  { id: '34', name: 'Rootbound Staff', detail: 'Đánh team tốt với vai trò cover, hold kẻ địch, tăng heal tốt, shield', image: '/asset/Shapeshifter/Rootbound/hellgate.png', image2: '', image3: '/asset/Shapeshifter/Rootbound/openworld.png' },
  { id: '35', name: 'Primal Staff', detail: 'Đánh với vai trò Sub Tank, gây CC nhiều, áp lực hàng sau tốt', image: '/asset/Shapeshifter/Primal/hellgate.png', image2: '', image3: '/asset/Shapeshifter/Primal/openworld.png' },
  { id: '36', name: 'Bloodmoon Staff', detail: 'Khả năng 1vX, 2vX cực tốt, đánh team vẫn ổn, vai trò Flex', image: '/asset/Shapeshifter/Bloodmoon/hellgate.png', image2: '', image3: '/asset/Shapeshifter/Bloodmoon/openworld.png' },
  { id: '37', name: 'Hellspawn Staff', detail: 'Vũ khí RDPS sát thương cao cần biết tận dung nội tại + skill hợp lí, nhưng hơi giấy ở dạng biến hình', image: '/asset/Shapeshifter/Hellspawn/hellgate.png', image2: '', image3: '/asset/Shapeshifter/Hellspawn/openworld.png' },
  { id: '38', name: 'Earthrune Staff', detail: 'Vai trò Tanker, thường chỉ dùng trong ZvZ', image: '/asset/Shapeshifter/Earthrune/hellgate.png', image2: '', image3: '/asset/Shapeshifter/Earthrune/openworld.png' },
  { id: '39', name: 'Lightcaller Staff', detail: 'Vũ khí RDPS sát thương cao, cần biết tận dụng nội tại tốt, chống chịu tầm trung', image: '/asset/Shapeshifter/Lightcaller/hellgate.png', image2: '', image3: '/asset/Shapeshifter/Lightcaller/openworld.png' },
  { id: '40', name: 'Stillgaze Staff', detail: 'Vũ khí đánh team tốt với vai trò Cover, khả năng giảm heal, hold kẻ địch', image: '/asset/Shapeshifter/Stillgaze/hellgate.png', image2: '', image3: '/asset/Shapeshifter/Stillgaze/openworld.png' },
];

export const dataSet6: ItemType[] = [
  { id: '41', name: 'Nature Staff', detail: 'Vũ khí top tier của Nature, phù hợp với team 3 trở lên, với team trên 5 cần dùng W 5 để tận dụng tốt được khả năng heal AOE theo stack của E', image: '/asset/Nature/NatureStaff/hellgate.png', image2: '', image3: '/asset/Nature/NatureStaff/openworld.png' },
  { id: '42', name: 'Great Nature Staff', detail: 'Chỉ phù hợp với đánh 2v2', image: '/asset/Nature/GreatNatureStaff/hellgate.png', image2: '', image3: '/asset/Nature/GreatNatureStaff/openworld.png' },
  { id: '43', name: 'Wild Staff', detail: 'Heal mức khá, phù hợp đánh team nhưng cần xử lí tốt E vì chiêu cố định vị trí và có cast time', image: '', image2: '', image3: '' },
  { id: '44', name: 'Druidic Staff', detail: 'Chỉ dùng để solo farm', image: '', image2: '', image3: '' },
  { id: '45', name: 'Blight Staff', detail: 'Vũ khí top tier của Nature, team 3 trở lên đánh cực khỏe', image: '/asset/Nature/BlightStaff/hellgate.png', image2: '', image3: '/asset/Nature/BlightStaff/openworld.png' },
  { id: '46', name: 'Rampant Staff', detail: 'Chỉ dùng trong ZvZ', image: '', image2: '', image3: '' },
  { id: '47', name: 'Ironroot Staff', detail: 'Chỉ phù hợp 2v2, đồi hỏi có Spec của Nature cao (500 trở lên)', image: '/asset/Nature/IronrootStaff/hellgate.png', image2: '', image3: '/asset/Nature/IronrootStaff/openworld.png' },
  { id: '48', name: 'Forgebark Staff', detail: 'Đánh team 3-5 tốt với mức heal khá, tạo sheild, nhược điểm là hồi chiêu 30s của E', image: '/asset/Nature/ForgebarkStaff/openworld.png', image2: '', image3: '/asset/Nature/ForgebarkStaff/openworld.png' },
];

export const dataSet7: ItemType[] = [
  { id: '49', name: 'Broadsword', detail: '', image: '', image2: '', image3: '' },
  { id: '50', name: 'Claymore', detail: 'Thường chỉ dùng trong Hellgate 2v2', image: '/asset/Sword/Claymore/hellgate.png', image2: '/asset/Sword/Claymore/corrupted.png', image3: '' },
  { id: '51', name: 'Dual Swords', detail: 'Có khả năng solo tốt', image: '', image2: '/asset/Sword/DualSwords/corrupted.png', image3: '/asset/Sword/DualSwords/openworld.png' },
  { id: '52', name: 'Clarent Blade', detail: 'Thường dùng trong đánh SC', image: '', image2: '', image3: '/asset/Sword/Clarent/openworld.png' },
  { id: '53', name: 'Carving Sword', detail: 'Debuff mạnh, phù hợp đánh Hellgate, SC,...', image: '/asset/Sword/Carving/hellgate.png', image2: '', image3: '/asset/Sword/Carving/openworld.png' },
  { id: '54', name: 'Galatine Pair', detail: 'Phế vật đừng coi youtube rồi ảo', image: '', image2: '', image3: '/asset/Sword/Carving/openworld.png' },
  { id: '55', name: 'Kingmaker', detail: 'Đòi hỏi kĩ năng cao, bình tĩnh', image: '', image2: '', image3: '/asset/Sword/GalatinePair/openworld.png' },
  { id: '56', name: 'Infinity Blade', detail: 'Neft xong phế xD', image: '', image2: '', image3: '/asset/Sword/Infinity/openworld.png' },
];

export const dataSet8: ItemType[] = [
  { id: '57', name: 'Battleaxe', detail: 'Farm solo khỏe, content solo tốt', image: '/asset/Axe/BattleAxe/hellgate.png', image2: '/asset/Axe/BattleAxe/corrupted.png', image3: '/asset/Axe/BattleAxe/openworld.png' },
  { id: '58', name: 'Greataxe', detail: 'Đánh nhỏ mức ổn', image: '', image2: '', image3: '' },
  { id: '59', name: 'Halberd', detail: 'Thường dùng trong đánh Hellgate', image: '/asset/Axe/Halberd/hellgate.png', image2: '', image3: '' },
  { id: '60', name: 'Carrioncaller', detail: 'Thường dùng trong đánh Hellgate', image: '/asset/Axe/Carrion/hellgate.png', image2: '', image3: '' },
  { id: '61', name: 'Infernal Scythe', detail: 'Thường dùng trong CS, ZvZ, mạnh ở khả năng dứt điểm', image: '', image2: '', image3: '/asset/Axe/InfernalScythe/openworld.png' },
  { id: '62', name: 'Bear Paws', detail: 'Gank tốt, đánh team vẫn ổn nếu biết ra vào hợp lí', image: '/asset/Axe/BearPaws/hellgate.png', image2: '', image3: '/asset/Axe/BearPaws/openworld.png' },
  { id: '63', name: 'Realmbreaker', detail: 'Đi chung với team 1 shot hoặc team Balance tốt', image: '', image2: '', image3: '/asset/Axe/RealmBreaker/openworld.png' },
  { id: '64', name: 'Crystal Reaper', detail: 'Đừng xem youtube rồi ảo', image: '', image2: '', image3: '/asset/Axe/CrystalReaper/openworld.png' },
];

export const dataSet9: ItemType[] = [
  { id: '65', name: 'Mace', detail: 'Bomb, SC tốt', image: '', image2: '', image3: '/asset/Mace/Mace/openworld.png' },
  { id: '66', name: 'Heavy Mace', detail: 'Dùng nhiều trong Hellgate, SC, ZvZ', image: '/asset/Mace/HeavyMace/hellgate.png', image2: '', image3: '/asset/Mace/HeavyMace/openworld.png' },
  { id: '67', name: 'Morning Star', detail: '', image: '', image2: '', image3: '' },
  { id: '68', name: 'Bedrock Mace', detail: '', image: '', image2: '', image3: '' },
  { id: '69', name: 'Incubus Mace', detail: '', image: '', image2: '', image3: '' },
  { id: '70', name: 'Camlann Mace', detail: '', image: '', image2: '', image3: '' },
  { id: '71', name: 'Oathkeepers', detail: '', image: '', image2: '', image3: '' },
  { id: '72', name: 'Dreadstorm Monarch', detail: 'Vũ khí thiên hướng dame, kén đội hình', image: '/asset/Mace/DreadstormMonarch/hellgate.png', image2: '', image3: '/asset/Mace/DreadstormMonarch/openworld.png' },
];

export const dataSet10: ItemType[] = [
  { id: '73', name: 'Hammer', detail: '', image: '', image2: '', image3: '' },
  { id: '74', name: 'Polehammer', detail: 'CC theo đường thẳng tầm xa, đi chung với team có MistPiercer', image: '', image2: '', image3: '' },
  { id: '75', name: 'Great Hammer	', detail: 'Thường dùng đánh Hellgate, Avalon', image: '/asset/Hammer/GreatHammer/hellgate.png', image2: '/asset/Hammer/GreatHammer/corrupted.png', image3: '/asset/Hammer/GreatHammer/openworld.png' },
  { id: '76', name: 'Tombhammer', detail: 'Khả năng CC tầm xa, cũng phù hợp team có MistPierce', image: '', image2: '', image3: '/asset/Hammer/Tombhammer/openworld.png' },
  { id: '77', name: 'Forge Hammers', detail: 'Thường dùng trong Hellgate, gây áp lực cho hàng sau', image: '/asset/Hammer/ForgeHammers/hellgate.png', image2: '', image3: '' },
  { id: '78', name: 'Grovekeeper', detail: '', image: '', image2: '', image3: '' },
  { id: '79', name: 'Hand of Justice', detail: '', image: '', image2: '', image3: '' },
  { id: '80', name: 'Truebolt Hammer ', detail: '', image: '', image2: '', image3: '' },
];

export const dataSet11: ItemType[] = [
  { id: '81', name: 'Brawler Gloves', detail: '', image: '', image2: '', image3: '' },
  { id: '82', name: 'Battle Bracers', detail: '', image: '', image2: '', image3: '' },
  { id: '83', name: 'Spiked Gauntlets', detail: '', image: '', image2: '', image3: '' },
  { id: '84', name: 'Ursine Maulers', detail: '', image: '', image2: '', image3: '' },
  { id: '85', name: 'Hellfire Hands', detail: '', image: '', image2: '', image3: '' },
  { id: '86', name: 'Ravenstrike Cestus', detail: '', image: '', image2: '', image3: '' },
  { id: '87', name: 'Fists of Avalon', detail: '', image: '', image2: '', image3: '' },
  { id: '88', name: 'Forgepulse Bracers', detail: '', image: '', image2: '', image3: '' },
];

export const dataSet12: ItemType[] = [
  { id: '89', name: 'Fire Staff', detail: '', image: '', image2: '', image3: '' },
  { id: '90', name: 'Great Fire Staff', detail: '', image: '', image2: '', image3: '' },
  { id: '91', name: 'Infernal Staff', detail: '', image: '', image2: '', image3: '' },
  { id: '92', name: 'Wildfire Staff', detail: '', image: '', image2: '', image3: '' },
  { id: '93', name: 'Brimstone Staff', detail: '', image: '', image2: '', image3: '' },
  { id: '94', name: 'Blazing Staff', detail: '', image: '', image2: '', image3: '' },
  { id: '95', name: 'Dawnsong', detail: '', image: '', image2: '', image3: '' },
  { id: '96', name: 'Flamewalker Staff', detail: '', image: '', image2: '', image3: '' },
];

export const dataSet13: ItemType[] = [
  { id: '97', name: 'Holy Staff', detail: 'Đáy xã hội', image: '', image2: '', image3: '' },
  { id: '98', name: 'Great Holy Staff', detail: 'Đáy xã hội', image: '', image2: '', image3: '' },
  { id: '99', name: 'Divine Staff', detail: 'Đáy xã hội', image: '', image2: '', image3: '' },
  { id: '100', name: 'Lifetouch Staff', detail: 'Đáy xã hội', image: '', image2: '', image3: '' },
  { id: '101', name: 'Fallen Staff', detail: 'Đáy xã hội', image: '', image2: '', image3: '' },
  { id: '102', name: 'Redemption Staff', detail: 'Đáy xã hội', image: '', image2: '', image3: '' },
  { id: '103', name: 'Hallowfall', detail: 'Đáy xã hội', image: '', image2: '', image3: '' },
  { id: '104', name: 'Exalted Staff', detail: 'Đáy xã hội', image: '', image2: '', image3: '' },
];

export const dataSet14: ItemType[] = [
  { id: '105', name: 'Arcane Staff', detail: '', image: '', image2: '', image3: '' },
  { id: '106', name: 'Great Arcane Staff', detail: '', image: '', image2: '', image3: '' },
  { id: '107', name: 'Enigmatic Staff', detail: '', image: '', image2: '', image3: '' },
  { id: '108', name: 'Witchwork Staff', detail: '', image: '', image2: '', image3: '' },
  { id: '109', name: 'Occult Staff', detail: '', image: '', image2: '', image3: '' },
  { id: '110', name: 'Malevolent Locus', detail: '', image: '', image2: '', image3: '' },
  { id: '111', name: 'Evensong', detail: '', image: '', image2: '', image3: '' },
  { id: '112', name: 'Astral Staff', detail: '', image: '', image2: '', image3: '' },
];

export const dataSet15: ItemType[] = [
  { id: '113', name: 'Frost Staff', detail: '', image: '', image2: '', image3: '' },
  { id: '114', name: 'Great Frost Staff', detail: '', image: '', image2: '', image3: '' },
  { id: '115', name: 'Glacial Staff', detail: '', image: '', image2: '', image3: '' },
  { id: '116', name: 'Hoarfrost Staff', detail: '', image: '', image2: '', image3: '' },
  { id: '117', name: 'Icicle Staff', detail: '', image: '', image2: '', image3: '' },
  { id: '118', name: 'Permafrost Prism', detail: '', image: '', image2: '', image3: '' },
  { id: '119', name: 'Chillhowl', detail: '', image: '', image2: '', image3: '' },
  { id: '120', name: 'Arctic Staff', detail: '', image: '', image2: '', image3: '' },
];

export const dataSet16: ItemType[] = [
  { id: '121', name: 'Cursed Staff', detail: '', image: '', image2: '', image3: '' },
  { id: '122', name: 'Great Cursed Staff', detail: '', image: '', image2: '', image3: '' },
  { id: '123', name: 'Demonic Staff', detail: '', image: '', image2: '', image3: '' },
  { id: '124', name: 'Lifecurse Staff', detail: '', image: '', image2: '', image3: '' },
  { id: '125', name: 'Cursed Skull', detail: '', image: '', image2: '', image3: '' },
  { id: '126', name: 'Damnation Staff', detail: '', image: '', image2: '', image3: '' },
  { id: '127', name: 'Shadowcaller', detail: '', image: '', image2: '', image3: '' },
  { id: '128', name: 'Rotcaller Staff', detail: '', image: '', image2: '', image3: '' },
];

// export const dataSet17: ItemType[] = [
//   { id: '129', name: '', detail: '', image: '', image2: '', image3: '' },
//   { id: '130', name: '', detail: '', image: '', image2: '', image3: '' },
//   { id: '131', name: '', detail: '', image: '', image2: '', image3: '' },
//   { id: '132', name: '', detail: '', image: '', image2: '', image3: '' },
//   { id: '133', name: '', detail: '', image: '', image2: '', image3: '' },
//   { id: '134', name: '', detail: '', image: '', image2: '', image3: '' },
//   { id: '135', name: '', detail: '', image: '', image2: '', image3: '' },
//   { id: '136', name: '', detail: '', image: '', image2: '', image3: '' },
// ];

export const dataSet18: ItemType[] = [
  { id: '137', name: 'Shield', detail: '', image: '', image2: '', image3: '' },
  { id: '138', name: 'Sarcophagus', detail: '', image: '', image2: '', image3: '' },
  { id: '139', name: 'Caitiff Shield', detail: '', image: '', image2: '', image3: '' },
  { id: '140', name: 'Facebreaker', detail: '', image: '', image2: '', image3: '' },
  { id: '141', name: 'Astral Aegis', detail: '', image: '', image2: '', image3: '' },
  { id: '142', name: 'Shield Crystal', detail: '', image: '', image2: '', image3: '' },
];

export const dataSet19: ItemType[] = [
  { id: '143', name: 'Torch', detail: '', image: '', image2: '', image3: '' },
  { id: '144', name: 'Mistcaller', detail: '', image: '', image2: '', image3: '' },
  { id: '145', name: 'Leering Cane', detail: '', image: '', image2: '', image3: '' },
  { id: '146', name: 'Cryptcandle', detail: '', image: '', image2: '', image3: '' },
  { id: '147', name: 'Sacred Scepter', detail: '', image: '', image2: '', image3: '' },
  { id: '148', name: 'Torch Crystal', detail: '', image: '', image2: '', image3: '' },
];

export const dataSet20: ItemType[] = [
  { id: '149', name: 'Tome of Spells', detail: '', image: '', image2: '', image3: '' },
  { id: '150', name: 'Eye of Secrets', detail: '', image: '', image2: '', image3: '' },
  { id: '151', name: 'Muisak', detail: '', image: '', image2: '', image3: '' },
  { id: '152', name: 'Taproot', detail: '', image: '', image2: '', image3: '' },
  { id: '153', name: 'Celestial Censer', detail: '', image: '', image2: '', image3: '' },
  { id: '154', name: 'Tome Crystal', detail: '', image: '', image2: '', image3: '' },
];



export const allItemsData: ItemType[] = [
  ...dataSet1,
  ...dataSet2,
  ...dataSet3,
  ...dataSet4,
  ...dataSet5,
  ...dataSet6,
  ...dataSet7,
  ...dataSet8,
  ...dataSet9,
  ...dataSet10,
  ...dataSet11,
  ...dataSet12,
  ...dataSet13,
  ...dataSet14,
  ...dataSet15,
  ...dataSet16,
  ...dataSet18, 
  ...dataSet19,
  ...dataSet20,
];
