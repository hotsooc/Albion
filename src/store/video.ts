export type VideoType = {
    url: string;
    name: string;
    thumbnail: string; 
    description: string; 
}

export const NorAlbion: VideoType[] = [
    {
        name: 'Chết ngu part 1',
        url: '/video/Nor/Chet_ngu.mp4',
        thumbnail: 'URL_HINH_ANH_THU_NHO_1.jpg',
        description: 'Nor chết ngu'
    },
    {
        name: 'Chết ngu part 2',
        url: '/video/Nor/Chet_ngu_part2_.mp4',
        thumbnail: 'URL_HINH_ANH_THU_NHO_2.jpg',
        description: 'Phần tiếp theo của chuỗi video về những khoảnh khắc đáng nhớ.'
    },
    {
        name: 'Chết ngu part 3',
        url: '/video/Nor/Chet_ngu_part3.mp4',
        thumbnail: 'URL_HINH_ANH_THU_NHO_3.jpg',
        description: 'Phần cuối cùng trong chuỗi video với những pha xử lý bất ngờ.'
    }
];