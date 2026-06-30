import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const board = searchParams.get('board');
    const depthStr = searchParams.get('depth') || '8'; // Mặc định độ sâu 8 ply để tính toán cực nhanh và mạnh mẽ

    if (!board) {
        return NextResponse.json({ error: 'Missing board parameter' }, { status: 400 });
    }

    // Làm sạch FEN string: chỉ cho phép các kí tự FEN hợp lệ để ngăn chặn chèn lệnh qua stdin
    const sanitizedBoard = board.replace(/[^a-zA-Z0-9/\s\-]/g, '').trim();

    const depth = parseInt(depthStr, 10);
    const binDir = path.join(process.cwd(), 'bin');
    
    // Tìm nền tảng hiện tại (Windows, Linux, MacOS) để xác định thư mục con
    let platformDirName = '';
    const platform = os.platform();
    if (platform === 'win32') {
        platformDirName = 'Windows';
    } else if (platform === 'darwin') {
        platformDirName = 'MacOS';
    } else if (platform === 'linux') {
        platformDirName = 'Linux';
    }

    const platformDir = platformDirName ? path.join(binDir, platformDirName) : binDir;
    
    // Tìm file chạy Pikafish
    let runCwd = binDir; // Thư mục chứa file weights .nnue
    let actualExePath = '';

    if (fs.existsSync(platformDir)) {
        const files = fs.readdirSync(platformDir);
        // Ưu tiên chọn các phiên bản tối ưu hóa cho CPU (bmi2, avx2, etc.)
        const exeFile = files.find(f => 
            f.toLowerCase().includes('bmi2') || 
            f.toLowerCase().includes('avx2') || 
            f.toLowerCase().includes('modern') || 
            (f.toLowerCase().startsWith('pikafish') && f.endsWith('.exe')) ||
            f.toLowerCase() === 'pikafish'
        );
        if (exeFile) {
            actualExePath = path.join(platformDir, exeFile);
        }
    }

    // Nếu không thấy trong thư mục platform, thử tìm ở root /bin
    if (!actualExePath && fs.existsSync(binDir)) {
        const files = fs.readdirSync(binDir);
        const exeFile = files.find(f => 
            (f.toLowerCase().startsWith('pikafish') && f.endsWith('.exe')) ||
            f.toLowerCase() === 'pikafish'
        );
        if (exeFile) {
            actualExePath = path.join(binDir, exeFile);
            runCwd = binDir;
        }
    }

    if (!actualExePath) {
        return NextResponse.json({ 
            error: 'Pikafish engine not found', 
            setupInstructions: 'Vui lòng tải Pikafish từ GitHub official-pikafish/Pikafish, giải nén và đặt các file vào thư mục /bin trong dự án.' 
        }, { status: 404 });
    }

    try {
        const bestMove = await runPikafishEngine(actualExePath, runCwd, sanitizedBoard, depth);
        return NextResponse.json({ result: `move:${bestMove}` });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Error executing Pikafish engine';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

function runPikafishEngine(enginePath: string, workingDir: string, fen: string, depth: number): Promise<string> {
    return new Promise((resolve, reject) => {
        // Khởi chạy tiến trình Pikafish
        // Đặt thư mục làm việc (cwd) là workingDir (thư mục /bin nơi chứa file weights .nnue)
        const child = spawn(enginePath, [], { cwd: workingDir });
        
        let errorOutput = '';
        let resolved = false;

        // Giới hạn thời gian chạy tối đa là 15 giây
        const timer = setTimeout(() => {
            if (!resolved) {
                child.kill();
                reject(new Error('Pikafish engine evaluation timed out'));
            }
        }, 15000);

        child.stdout.on('data', (data) => {
            const text = data.toString();

            // Tìm từ khóa bestmove trong luồng stdout
            const lines = text.split('\n');
            for (const line of lines) {
                if (line.trim().startsWith('bestmove')) {
                    const parts = line.trim().split(/\s+/);
                    const move = parts[1]; // ví dụ: "h2g2"
                    resolved = true;
                    clearTimeout(timer);
                    child.kill();
                    resolve(move);
                    break;
                }
            }
        });

        child.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        child.on('error', (err) => {
            resolved = true;
            clearTimeout(timer);
            reject(err);
        });

        child.on('close', (code) => {
            if (!resolved) {
                clearTimeout(timer);
                reject(new Error(`Pikafish engine exited with code ${code}. Error: ${errorOutput}`));
            }
        });

        // Gửi các lệnh chuẩn UCI cho engine
        child.stdin.write('uci\n');
        child.stdin.write('isready\n');
        child.stdin.write(`position fen ${fen}\n`);
        child.stdin.write(`go depth ${depth}\n`);
    });
}
