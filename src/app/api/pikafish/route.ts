import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';

// Sao chép file chạy sang thư mục ghi được /tmp và gán quyền thực thi (+x) trên môi trường non-Windows
async function prepareExecutable(srcPath: string): Promise<string> {
    if (os.platform() === 'win32') {
        return srcPath;
    }
    
    try {
        const tempDir = os.tmpdir();
        const destName = `pikafish_${path.basename(srcPath)}`;
        const destPath = path.join(tempDir, destName);
        
        let shouldCopy = true;
        if (fs.existsSync(destPath)) {
            const srcStat = fs.statSync(srcPath);
            const destStat = fs.statSync(destPath);
            if (srcStat.size === destStat.size) {
                shouldCopy = false;
            }
        }
        
        if (shouldCopy) {
            fs.copyFileSync(srcPath, destPath);
        }
        
        // Luôn đảm bảo quyền thực thi 755 (chmod +x)
        fs.chmodSync(destPath, '755');

        // Sao chép thư viện chia sẻ libatomic.so.1 nếu có trong thư mục nguồn (để chạy trên Vercel/Linux)
        const srcDir = path.dirname(srcPath);
        const libatomicSrc = path.join(srcDir, 'libatomic.so.1');
        const libatomicDest = path.join(tempDir, 'libatomic.so.1');
        if (fs.existsSync(libatomicSrc)) {
            let shouldCopyLib = true;
            if (fs.existsSync(libatomicDest)) {
                const sStat = fs.statSync(libatomicSrc);
                const dStat = fs.statSync(libatomicDest);
                if (sStat.size === dStat.size) {
                    shouldCopyLib = false;
                }
            }
            if (shouldCopyLib) {
                fs.copyFileSync(libatomicSrc, libatomicDest);
            }
            fs.chmodSync(libatomicDest, '755');
        }
        
        return destPath;
    } catch (err) {
        console.error('Error preparing executable:', err);
        return srcPath; // Fallback
    }
}

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
    
    // Tìm đường dẫn tệp weights pikafish.nnue
    let nnuePath = path.join(platformDir, 'pikafish.nnue');
    if (!fs.existsSync(nnuePath)) {
        nnuePath = path.join(binDir, 'pikafish.nnue');
    }

    // Thư mục làm việc (cwd): ưu tiên thư mục chứa weights file, fallback là platformDir
    let runCwd = platformDir;
    if (fs.existsSync(nnuePath)) {
        runCwd = path.dirname(nnuePath);
    }

    // Liệt kê và sắp xếp các ứng cử viên nhị phân (candidates) theo thứ tự tối ưu giảm dần
    const candidates: string[] = [];
    if (fs.existsSync(platformDir)) {
        const files = fs.readdirSync(platformDir);
        const exeFiles = files.filter(f => {
            const lf = f.toLowerCase();
            return lf.includes('pikafish') && !lf.endsWith('.txt') && !lf.endsWith('.md') && !lf.endsWith('.nnue') && !lf.endsWith('.so') && !lf.endsWith('.so.1');
        });

        // Sắp xếp thứ tự ưu tiên chạy (optimized -> generic)
        const getPriority = (name: string) => {
            const ln = name.toLowerCase();
            if (ln.includes('bmi2')) return 5;
            if (ln.includes('avx2')) return 4;
            if (ln.includes('modern')) return 3;
            if (ln === 'pikafish' || ln === 'pikafish.exe') return 1;
            return 2;
        };

        exeFiles.sort((a, b) => getPriority(b) - getPriority(a));

        for (const file of exeFiles) {
            candidates.push(path.join(platformDir, file));
        }
    }

    // Nếu không thấy trong platformDir, tìm trong thư mục root /bin
    if (candidates.length === 0 && fs.existsSync(binDir)) {
        const files = fs.readdirSync(binDir);
        const exeFiles = files.filter(f => {
            const lf = f.toLowerCase();
            return lf.includes('pikafish') && !lf.endsWith('.txt') && !lf.endsWith('.md') && !lf.endsWith('.nnue') && !lf.endsWith('.so') && !lf.endsWith('.so.1');
        });
        for (const file of exeFiles) {
            candidates.push(path.join(binDir, file));
        }
    }

    if (candidates.length === 0) {
        return NextResponse.json({ 
            error: 'Pikafish engine not found', 
            setupInstructions: 'Vui lòng tải Pikafish từ GitHub official-pikafish/Pikafish, giải nén và đặt các file vào thư mục /bin trong dự án.' 
        }, { status: 404 });
    }

    let lastError: Error | null = null;
    
    // Thử khởi chạy các nhị phân theo thứ tự ưu tiên
    for (const rawExePath of candidates) {
        try {
            const exePath = await prepareExecutable(rawExePath);
            const bestMove = await runPikafishEngine(exePath, runCwd, nnuePath, sanitizedBoard, depth);
            return NextResponse.json({ result: `move:${bestMove}` });
        } catch (err: any) {
            console.error(`Failed to run Pikafish with binary ${rawExePath}:`, err);
            lastError = err instanceof Error ? err : new Error(String(err));
            // Tiếp tục vòng lặp thử ứng cử viên khác
        }
    }

    // Nếu tất cả ứng cử viên đều thất bại
    return NextResponse.json({ 
        error: lastError ? lastError.message : 'All Pikafish candidates failed to execute',
        candidatesAttempted: candidates
    }, { status: 500 });
}

function runPikafishEngine(enginePath: string, workingDir: string, nnuePath: string, fen: string, depth: number): Promise<string> {
    return new Promise((resolve, reject) => {
        // Cấu hình biến môi trường LD_LIBRARY_PATH để chỉ đến thư mục tạm /tmp nơi chứa libatomic.so.1
        const tempDir = os.tmpdir();
        const env = {
            ...process.env,
            LD_LIBRARY_PATH: `${tempDir}:${process.env.LD_LIBRARY_PATH || ''}`
        };

        // Khởi chạy tiến trình Pikafish
        const child = spawn(enginePath, [], { cwd: workingDir, env });
        
        let errorOutput = '';
        let resolved = false;

        // Giới hạn thời gian chạy tối đa là 15 giây
        const timer = setTimeout(() => {
            if (!resolved) {
                child.kill();
                reject(new Error('Pikafish engine evaluation timed out'));
            }
        }, 15000);

        // Tránh sập luồng khi tiến trình bị đóng trước khi kết thúc ghi dữ liệu
        child.stdin.on('error', (err) => {
            console.error('Pikafish stdin error:', err);
        });

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
        
        // Thiết lập đường dẫn tuyệt đối cho file weights NNUE
        if (nnuePath && fs.existsSync(nnuePath)) {
            child.stdin.write(`setoption name EvalFile value ${nnuePath}\n`);
        }
        
        child.stdin.write('isready\n');
        child.stdin.write(`position fen ${fen}\n`);
        child.stdin.write(`go depth ${depth}\n`);
    });
}
