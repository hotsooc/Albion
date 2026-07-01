import VideoDetailClient from '@/component/VideoDetailClient';
import { createClient } from '../../../../../lib/supabase/server';
import { getYouTubeVideoId } from '@/utils/youtube';

const fetchYouTubeMetadata = async (videoId: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const res = await fetch(`${baseUrl}/api/youtube-metadata?videoId=${videoId}`);

  if (!res.ok) {
    console.error('YouTube metadata fetch failed:', res.status);
  }
  return res.json();
};

export default async function VideoDetailPage({
  params,
}: {
  params: { videoId: string };
}) {
  const { videoId } = params;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('id', videoId)
    .single();

  if (error || !data?.url) {
    return <div>Video not found.</div>;
  }

  const youtubeId = getYouTubeVideoId(data.url);
  let metadata = { title: '', channel: '' };
  
  if (youtubeId) {
    const res = await fetchYouTubeMetadata(youtubeId);
    if (res && !res.error) {
      metadata = res;
    }
  }

  const videoData = {
    ...data,
    title: data.name || metadata.title || '',
    channel: metadata.channel || '',
    description: data.description || '',
  };

  return <VideoDetailClient videoData={videoData} videoId={videoId} />;
}
