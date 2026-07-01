import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const board = searchParams.get('board');

    if (!board) {
        return NextResponse.json({ error: 'Missing board parameter' }, { status: 400 });
    }

    // Làm sạch FEN string: chỉ cho phép các kí tự FEN hợp lệ
    const sanitizedBoard = board.replace(/[^a-zA-Z0-9/\s\-]/g, '').trim();

    // ChessDB API endpoint
    const url = `https://www.chessdb.cn/chessdb.php?action=querybest&board=${encodeURIComponent(sanitizedBoard)}`;

    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        next: { revalidate: 3600 } // Cache results for 1 hour to save bandwidth
    });
    const data = await response.text();

    return NextResponse.json({ result: data });
}
