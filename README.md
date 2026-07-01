# XHCN Albion Wiki Portal

Trang wiki & tool hỗ trợ bang hội XHCN trong Albion Online. Cung cấp build trang bị, quản lý đội hình, video hướng dẫn, từ điển thuật ngữ, và trợ lý AI tích hợp.

## Tech Stack

| Layer | Công nghệ |
|-------|-----------|
| **Framework** | Next.js 14 (App Router) + React 18 |
| **Ngôn ngữ** | TypeScript |
| **UI** | Ant Design 5, Tailwind CSS 4, Framer Motion |
| **Icons** | Lucide React, Ant Design Icons |
| **Backend** | Supabase (Auth, Database, Storage, Edge Functions) |
| **Theme** | next-themes (dark/light mode) |
| **i18n** | Custom `useTrans` hook (vi/en) |
| **Game** | Pixi.js, Phaser, Three.js |
| **Drag & Drop** | @dnd-kit, react-dnd |
| **AI** | Google Gemini AI |
| **Video** | React Player, YouTube API |
| **Deploy** | Vercel |

## Getting Started

Copy `.env.local` với các biến môi trường cần thiết:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=
YOUTUBE_API_KEY=
```

```bash
npm install
npm run dev        # Dev server tại http://localhost:3000
npm run build      # Production build
npm run lint       # ESLint kiểm tra code
```

## Phương Hướng Cải Thiện

### Code Quality
- **Tách component lớn**: `BuildPageClient.tsx` (682 dòng), `ChineseChess.tsx` (1239 dòng), `home/page.tsx` (523 dòng) nên được tách thành các component nhỏ hơn
- **TypeScript strict mode**: Đã bật `strict: true`, cần khai báo đầy đủ types cho các `any` còn tồn tại
- **Shared types**: Gom các interface dùng chung (`ItemType`, `VideoItem`, `NewsItem`) vào `src/types/`
- **Custom hooks**: Trích xuất logic data fetching thành custom hooks (`useBuilds`, `useVideos`, `useTeams`)
- **Magic strings**: Thay các string hardcode (URL API, key Supabase) bằng constants hoặc env variables

### Performance
- **Code splitting**: Dùng `dynamic(() => import(...))` cho các game engine (pixi, phaser, three) - đã làm một phần
- **Image optimization**: Dùng `next/image` thay vì `<img>` cho ảnh build và guild
- **Bundle size**: `moment` + `dayjs` cùng tồn tại, nên bỏ `moment` (dayjs nhẹ hơn)
- **Caching API responses**: Các API route nên thêm cache headers phù hợp
- **Virtual scrolling**: Áp dụng cho danh sách video dài và danh sách build
- **ChineseChess minimax**: Cân nhắc dùng Web Worker để AI chạy không block UI thread

### Architecture
- **API layer**: Tạo typed API client thay vì gọi `fetch` trực tiếp ở nhiều nơi
- **State management**: Khi app lớn hơn, cân nhắc Zustand hoặc Context API thay vì lifting state
- **Supabase types**: Đã có `database.types.ts`, cần sử dụng type từ đó thay vì `as` cast
- **Protected routes**: Middleware dùng hardcoded array, nên chuyển sang route group pattern hoặc config file
- **Edge functions**: Supabase functions chạy trên Deno, cần có script deploy riêng

### UI/UX
- **Responsive**: Đã responsive cơ bản, cần test trên tablet và mobile nhỏ
- **Loading states**: Đã có Skeleton components, cần áp dụng đồng bộ ở tất cả các trang
- **Error boundaries**: Thêm React Error Boundary ở cấp layout để catch lỗi render
- **Keyboard navigation**: Đã có Command Palette (Ctrl+K), nên mở rộng thêm shortcuts
- **SEO**: Thêm metadata, Open Graph tags cho các trang

### Bảo Mật
- **Input validation**: Validate tất cả input từ URL params và form trước khi query Supabase
- **Row Level Security**: Đảm bảo RLS policies trong Supabase được cấu hình đúng
- **API rate limiting**: Thêm rate limit cho các API route (chat, chessdb)
- **CORS**: Supabase functions dùng `*` cho CORS, nên giới hạn về domain cụ thể

### Testing
- **Unit tests**: Chưa có test framework, nên thêm Vitest + React Testing Library
- **Integration tests**: Test các flow chính (login, build CRUD, teammate DnD)
- **E2E tests**: Playwright cho các flow người dùng chính
