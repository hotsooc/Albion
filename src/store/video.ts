export type VideoType = {
    id: string | number;
    url: string | null;
    name: string;
    thumbnail: string; 
    description: string; 
}

export const VideoAlbion: { [key: string]: VideoType[] } = {
  Highlight: [
    {
      id: 1,
      name: "Epic Guild Fight",
      url: "https://www.youtube.com/watch?v=dAi2Bl-kStM&feature=youtu.be",
      thumbnail: 'URL_HINH_ANH_THU_NHO_1.jpg',
      description: "A huge battle between two guilds.",
    },
  ],
  "Funny Moment": [
    {
      id: 2,
      name: "Ganking Gone Wrong",
      url: "https://www.youtube.com/watch?v=dAi2Bl-kStM&feature=youtu.be",
      thumbnail: 'URL_HINH_ANH_THU_NHO_1.jpg',
      description: "My ganking attempt didn't go as planned.",
    },
  ],
  Record: [
    
  ],
};