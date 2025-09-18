import VideoDetailClient from '@/component/VideoDetailClient';
import { supabase } from '../../../../../lib/supabase/client';

const getYouTubeVideoId = (url: string | null) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const fetchYouTubeMetadata = async (videoId: string) => {
  const res = await fetch(
    `http://localhost:3000/api/youtube-metadata?videoId=${videoId}`
  );
  if (!res.ok) {
    return { title: 'Không có tiêu đề', channel: 'Không rõ tác giả' };
  }
  return res.json();
};

export default async function VideoDetailPage({
  params,
}: {
  params: { videoId: string };
}) {
  const { videoId } = params;

  const { data, error } = await supabase
    .from('videos')
    .select('url')
    .eq('id', videoId)
    .single();

  if (error || !data?.url) {
    console.error('Lỗi khi lấy video từ Supabase:', error);
    return <div>Video không tồn tại.</div>;
  }

  const youtubeId = getYouTubeVideoId(data.url);
  const metadata = youtubeId
    ? await fetchYouTubeMetadata(youtubeId)
    : { title: 'Không có tiêu đề', channel: 'Không rõ tác giả' };

  const videoData = { ...data, ...metadata };

  return <VideoDetailClient videoData={videoData} videoId={videoId} />;
}
