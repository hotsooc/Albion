export type VideoType = {
    id: string | number;
    url: string;
    name: string;
    thumbnail: string; 
    description: string; 
}

export const VideoAlbion: VideoType[] = [
    // {
    //     name: 'Chết ngu part 1',
    //     url: '/video/Albion/Chet_ngu.mp4',
    //     thumbnail: 'URL_HINH_ANH_THU_NHO_1.jpg',
    //     description: 'Nor chết ngu'
    // },
    {
        id: '1',
        name: 'Chết ngu part 1',
        url: 'https://drive.google.com/file/d/1xkm_KEW31PbfYAmvmD8B19jtdnl01vXH/view?usp=sharing',
        thumbnail: 'URL_HINH_ANH_THU_NHO_1.jpg',
        description: 'Nor chết ngu'
    },
    {
        id: '2',
        name: 'Chết ngu part 2',
        url: '/video/Albion/Chet_ngu_part2.mp4',
        thumbnail: 'URL_HINH_ANH_THU_NHO_2.jpg',
        description: 'Phần tiếp theo của chuỗi video về những khoảnh khắc đáng nhớ.'
    },
    {
        id: '3',
        name: 'Chết ngu part 3',
        url: 'https://res.cloudinary.com/dkgc5jg4s/video/upload/v1756889799/Chet_ngu_part_3_pkmjrc.mp4',
        thumbnail: 'URL_HINH_ANH_THU_NHO_3.jpg',
        description: 'Phần cuối cùng trong chuỗi video với những pha xử lý bất ngờ.'
    },
    {
        id: '4',
        name: 'Highlight',
        url: 'https://www.youtube.com/watch?v=dAi2Bl-kStM&feature=youtu.be',
        thumbnail: 'URL_HINH_ANH_THU_NHO_3.jpg',
        description: 'Phần cuối cùng trong chuỗi video với những pha xử lý bất ngờ.'
    }
];