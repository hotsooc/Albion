import { NextResponse } from 'next/server';
import { dataSets } from '@/store/data';
import { glossaryTerms } from '@/store/glossary';

export async function POST(req: Request) {
  const { messages, context } = await req.json();

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Mã OPENAI_API_KEY chưa được cấu hình ở file .env.local.' },
      { status: 500 }
    );
  }

  // Hỗ trợ cấu hình Base URL tùy chọn để dùng các API miễn phí (như OpenRouter, Github Models, Groq)
  const baseUrl = process.env.OPENAI_API_BASE_URL || 'https://api.openai.com/v1';
  const model = process.env.OPENAI_MODEL_NAME || 'gpt-4o-mini';

  // Tạo thư mục vũ khí chuẩn từ database cục bộ để cung cấp thông tin chính xác
  const weaponDirectory = Object.entries(dataSets)
    .map(([category, items]) => {
      const list = items.map(i => `${i.name} (${i.detail.replace(/\n\s*/g, ' ')})`).join('\n  * ');
      return `Nhóm [${category}]:\n  * ${list}`;
    })
    .join('\n\n');

  // Tạo danh sách từ điển thuật ngữ chuẩn
  const dictionaryDirectory = glossaryTerms
    .map(term => `- ${term.term} (${term.fullName}): ${term.definitionVi}`)
    .join('\n');

  const systemPrompt = `Bạn là "XHCN Albion Helper" - trợ lý AI chuyên gia về Albion Online của bang hội XHCN.
Nhiệm vụ của bạn là giải đáp thắc mắc của người dùng dựa trên ngữ cảnh trang hiện tại và nguồn dữ liệu chuẩn được cung cấp dưới đây.

--- QUY TẮC TRÌNH BÀY & XỬ LÝ (BẮT BUỘC) ---
1. **TRÌNH BÀY ĐẸP & TÁCH DÒNG:** Luôn sử dụng định dạng Markdown. Bắt buộc xuống dòng hợp lý bằng gạch đầu dòng (\`-\` hoặc \`*\`) và đánh số (\`1.\`, \`2.\`). Bôi đậm (\`**Tên vũ khí**\`) để người dùng dễ theo dõi. KHÔNG viết liền một khối văn bản dài.
2. **TỔNG HỢP THÔNG MINH (KHÔNG LIỆT KÊ TRÀN LAN):** Khi được hỏi về một dòng vũ khí, KHÔNG ĐƯỢC liệt kê toàn bộ danh sách thô. Hãy phân tích kỹ câu hỏi của người dùng để chọn lọc:
   - Ví dụ hỏi *"loại nào thích hợp PvP nhất"*: Hãy lọc ra và chỉ nói về các vũ khí có mô tả phù hợp PvP (như Bow 1v1, Badon nhỏ lẻ, Walling cho ZvZ), bỏ qua các vũ khí chuyên PvE (như Longbow).
   - Hãy phân nhóm câu trả lời theo mục đích (ví dụ: PvP Solo, PvP Nhóm nhỏ, PvP Đông người/ZvZ) để thể hiện sự thông minh của một chuyên gia.
3. **ĐÍNH CHÍNH & KHÔNG HỮU DANH:** Chỉ sử dụng vũ khí có trong dữ liệu chuẩn. Nếu người dùng gọi sai tên hoặc nhầm nhánh (như Crossbow thuộc Bow, hoặc Carving Bow), hãy nhẹ nhàng đính chính trước rồi mới trả lời.
4. **VĂN PHONG:** Sử dụng thuật ngữ Albion Online thông dụng (gank, spec, regear, IP, oneshot...). Trả lời ngắn gọn, tập trung thẳng vào câu hỏi.

--- DỮ LIỆU GAME CHUẨN CỦA DỰ ÁN ---
1. DANH SÁCH VŨ KHÍ & CHI TIẾT SỬ DỤNG:
${weaponDirectory}

2. TỪ ĐIỂN THUẬT NGỮ GAME:
${dictionaryDirectory}

--- NGỮ CẢNH TRANG NGƯỜI CHƠI ĐANG XEM ---
${context || 'Người chơi đang ở trang chủ.'}`;

  // Định dạng lịch sử trò chuyện cho OpenAI API
  const formattedMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }))
  ];

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: formattedMessages,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || `API báo lỗi HTTP ${response.status}`);
  }

  const data = await response.json();
  const replyText = data.choices[0]?.message?.content || '';

  return NextResponse.json({ reply: replyText });
}
