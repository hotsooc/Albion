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
        url: 'https://www.youtube.com/watch?v=yRbkUhfdPF8',
        thumbnail: 'URL_HINH_ANH_THU_NHO_1.jpg',
        description: 'Hí chết ngu'
    },
    {
        id: '2',
        name: 'Chết ngu part 2',
        url: 'https://www.youtube.com/watch?v=dAi2Bl-kStM&feature=youtu.be',
        thumbnail: 'URL_HINH_ANH_THU_NHO_2.jpg',
        description: 'Phần tiếp theo của chuỗi video về những khoảnh khắc đáng nhớ.'
    },
    {
        id: '3',
        name: 'Chết ngu part 3',
        url: 'https://www.youtube.com/watch?v=dAi2Bl-kStM&feature=youtu.be',
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