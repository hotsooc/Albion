import { NextResponse, NextRequest } from 'next/server';

export function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'news';
  
  let steamUrl = 'https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=761890&count=6';
  if (type === 'patchnotes') {
    steamUrl += '&tags=patchnotes';
  }

  return fetch(
    steamUrl,
    { next: { revalidate: 1800 } }
  ).then(response => {
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch Steam news' }, { status: response.status });
    }
    return response.json().then(data => {
      const newsItems = data?.appnews?.newsitems || [];

      const parsedNews = newsItems.map((item: any) => {
        let cleanContent = item.contents || '';
        cleanContent = cleanContent
          .replace(/\[img\].*?\[\/img\]/g, '')
          .replace(/\[b\](.*?)\[\/b\]/g, '$1')
          .replace(/\[i\](.*?)\[\/i\]/g, '$1')
          .replace(/\[url=.*?\](.*?)\[\/url\]/g, '$1')
          .replace(/\[h\d\](.*?)\[\/h\d\]/g, '$1')
          .replace(/\[list\]/g, '')
          .replace(/\[\/list\]/g, '')
          .replace(/\[\*\]/g, '• ')
          .replace(/\[\/\*\]/g, '\n')
          .substring(0, 150) + '...';

        return {
          id: item.gid,
          title: item.title,
          url: item.url,
          date: new Date(item.date * 1000).toLocaleDateString('vi-VN'),
          description: cleanContent,
          category: type === 'patchnotes' ? 'PATCH' : (item.feedlabel === 'Community Announcements' ? 'NEWS' : 'UPDATE')
        };
      });

      return NextResponse.json(parsedNews);
    });
  });
}
