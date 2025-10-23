/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";
import Parser from "rss-parser";
import slugify from "slugify";

const parser = new Parser();

// 🔗 Danh sách nguồn RSS
const sources = [
  // 📰 Tin tổng hợp
  {
    name: "VnExpress",
    url: "https://vnexpress.net/rss/tin-moi-nhat.rss",
    category: "general",
  },
  {
    name: "Thanh Niên",
    url: "https://thanhnien.vn/rss/home.rss",
    category: "general",
  },
  {
    name: "Tuổi Trẻ",
    url: "https://tuoitre.vn/rss/tin-moi-nhat.rss",
    category: "general",
  },

  // 🪙 Tin vàng
  {
    name: "Vietstock - Giá vàng",
    url: "https://vietstock.vn/rss/vang.rss",
    category: "gold",
  },
  {
    name: "24h - Giá vàng",
    url: "https://www.24h.com.vn/upload/rss/vang-ngoai-te.rss",
    category: "gold",
  },

  // 📈 Tin chứng khoán
  {
    name: "Vietstock - Chứng khoán",
    url: "https://vietstock.vn/rss/chung-khoan.rss",
    category: "stock",
  },
  {
    name: "CafeBiz - Thị trường chứng khoán",
    url: "https://cafebiz.vn/trang-chu.rss",
    category: "stock",
  },
];

export async function GET() {
  try {
    console.log("🚀 Bắt đầu crawl RSS feed...");

    // 🔄 Lấy tất cả RSS song song
    const feeds = await Promise.all(
      sources.map(async (source) => {
        try {
          const feed = await parser.parseURL(source.url);
          return { ...source, items: feed.items };
        } catch (error) {
          console.error(`❌ Lỗi khi tải RSS: ${source.name}`, error);
          return { ...source, items: [] };
        }
      })
    );

    const newArticles: any[] = [];

    // 🧩 Duyệt từng feed
    for (const feed of feeds) {
      for (const item of feed.items) {
        if (!item.title || !item.link) continue;

        const title = item.title.trim();
        const link = item.link.trim();

        // ✅ Kiểm tra trùng link
        const exists = await prisma.article.findFirst({
          where: { link: { equals: link, mode: "insensitive" } },
          select: { id: true },
        });

        if (exists) continue;

        const slug =
          slugify(title, { lower: true, strict: true }) +
          "-" +
          Math.random().toString(36).substring(2, 7);

        const articleData = {
          title,
          link,
          source: feed.name,
          category: feed.category,
          description: item.contentSnippet?.trim() ?? null,
          image:
            (item.enclosure && (item.enclosure as any).url) ||
            extractImage(item.content) ||
            null,
          publishedAt: item.isoDate ? new Date(item.isoDate) : new Date(),
          slug,
        };

        try {
          await prisma.article.create({ data: articleData });
          newArticles.push(articleData);
        } catch (err: any) {
          console.error("⚠️ Lỗi khi lưu bài viết:", err.message);
        }
      }
    }

    console.log(`✅ Crawl hoàn tất: ${newArticles.length} bài mới.`);

    return NextResponse.json({
      message: "Crawl thành công",
      count: newArticles.length,
      data: newArticles,
    });
  } catch (error: any) {
    console.error("💥 Lỗi tổng khi crawl:", error);
    return NextResponse.json(
      { error: "Lỗi khi crawl tin tức", details: error.message },
      { status: 500 }
    );
  }
}

// 🧠 Hàm phụ để lấy ảnh từ nội dung HTML nếu RSS không có enclosure
function extractImage(content?: string): string | null {
  if (!content) return null;
  const match = content.match(/<img[^>]+src="([^">]+)"/);
  return match ? match[1] : null;
}
