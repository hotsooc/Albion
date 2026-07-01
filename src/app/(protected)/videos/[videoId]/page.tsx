import VideoDetailClient from '@/component/VideoDetailClient';
import { createClient } from '../../../../../lib/supabase/server';
import { getYouTubeVideoId } from '@/utils/youtube';

const fetchYouTubeMetadata = (videoId: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  return fetch(`${baseUrl}/api/youtube-metadata?videoId=${videoId}`)
    .then(res => {
      if (!res.ok) {
        console.error('YouTube metadata fetch failed:', res.status);
      }
      return res.json();
    });
};

export default function VideoDetailPage({
  params,
}: {
  params: { videoId: string };
}) {
  const { videoId } = params;

  const supabase = createClient();

  return supabase
    .from('videos')
        .select('*')
        .eq('id', videoId)
        .single()
        .then(({ data, error }) => {
          if (error || !data?.url) {
            return <div>Video not found.</div>;
          }

          const youtubeId = getYouTubeVideoId(data.url);
          const metaPromise = youtubeId
            ? fetchYouTubeMetadata(youtubeId)
            : Promise.resolve({ title: '', channel: '' });

          return metaPromise.then(metaRes => {
            const metadata = (metaRes && !metaRes.error)
              ? metaRes
              : { title: '', channel: '' };

            const videoData = {
              ...data,
              title: data.name || metadata.title || '',
              channel: metadata.channel || '',
              description: data.description || '',
            };

          return <VideoDetailClient videoData={videoData} videoId={videoId} />;
        });
      });
}
