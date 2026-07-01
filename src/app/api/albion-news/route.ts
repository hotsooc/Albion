import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'news';
  
  let steamUrl = 'https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=761890&count=6';
  if (type === 'patchnotes') {
    steamUrl += '&tags=patchnotes';
  }

  const response = await fetch(
    steamUrl,
    { next: { revalidate: 1800 } } // Cache for 30 minutes
  );

  if (!response.ok) {
    return NextResponse.json({ error: 'Failed to fetch Steam news' }, { status: response.status });
  }

  const data = await response.json();
  const newsItems = data?.appnews?.newsitems || [];

  // Parse and map to a cleaner format
  const parsedNews = newsItems.map((item: any) => {
    // Clean BBCode from content preview
    let cleanContent = item.contents || '';
    cleanContent = cleanContent
      .replace(/\[img\].*?\[\/img\]/g, '') // remove images
      .replace(/\[b\](.*?)\[\/b\]/g, '$1') // remove bold
      .replace(/\[i\](.*?)\[\/i\]/g, '$1') // remove italics
      .replace(/\[url=.*?\](.*?)\[\/url\]/g, '$1') // remove links
      .replace(/\[h\d\](.*?)\[\/h\d\]/g, '$1') // remove headers
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
}

