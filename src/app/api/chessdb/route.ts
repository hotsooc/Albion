import { NextRequest, NextResponse } from 'next/server';

export function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const board = searchParams.get('board');

    if (!board) {
        return NextResponse.json({ error: 'Missing board parameter' }, { status: 400 });
    }

    const sanitizedBoard = board.replace(/[^a-zA-Z0-9/\s\-]/g, '').trim();

    const url = `https://www.chessdb.cn/chessdb.php?action=querybest&board=${encodeURIComponent(sanitizedBoard)}`;

    return fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        next: { revalidate: 3600 }
    })
        .then(response => response.text())
        .then(data => {
            return NextResponse.json({ result: data });
        });
}
