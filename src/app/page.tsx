/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { prisma } from "../lib/prisma";

export const revalidate = 300;

export default async function HomePage() {
  const articles = await prisma.article.findMany({
    orderBy: { publishedAt: "desc" },
    take: 30,
  });

  if (!articles.length) {
    return (
      <main className="flex items-center justify-center h-[80vh] text-gray-500 text-lg">
        ⏳ Đang cập nhật tin tức mới nhất...
      </main>
    );
  }

  const [featured, ...rest] = articles;

  // Chia tin có / không có ảnh
  const withImage = rest.filter((a: any) => !!a.image);
  const withoutImage = rest.filter((a: any) => !a.image);

  return (
    <main className="max-w-7xl mx-auto px-6 py-10 space-y-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          📰 Tin tức hôm nay
        </h1>
        <p className="text-gray-500 text-sm">Cập nhật tự động mỗi 5 phút</p>
      </div>

      {/* Tin nổi bật */}
      <Link
        href={featured.link}
        target="_blank"
        className="block rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all bg-white"
      >
        {featured.image && (
          <div className="relative">
            <img
              src={featured.image}
              alt={featured.title}
              className="w-full h-[440px] object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h2 className="text-3xl font-bold mb-3">{featured.title}</h2>
              <p className="text-gray-200 max-w-3xl line-clamp-3">
                {featured.summary || featured.description}
              </p>
            </div>
          </div>
        )}
      </Link>

      {/* Hai cột: có ảnh + không ảnh */}
      <div className="grid lg:grid-cols-3 gap-10">
        {/* Cột tin có ảnh */}
        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-8">
          {withImage.map((a: any) => (
            <Link
              key={a.id}
              href={a.link}
              target="_blank"
              className="group rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition flex flex-col"
            >
              <div className="relative overflow-hidden">
                <img
                  src={a.image}
                  alt={a.title}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-blue-600 line-clamp-2">
                  {a.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {a.summary || a.description}
                </p>
                <div className="mt-auto flex justify-between text-xs text-gray-500">
                  <span>{a.source}</span>
                  <span>
                    {new Date(a.publishedAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Cột tin không ảnh */}
        <div className="space-y-6">
          <h2 className="font-semibold text-xl text-gray-800 border-b pb-2">
            🗞 Tin nhanh
          </h2>
          {withoutImage.slice(0, 10).map((a: any) => (
            <Link
              key={a.id}
              href={a.link}
              target="_blank"
              className="block group"
            >
              <h3 className="font-medium text-gray-900 group-hover:text-blue-600 line-clamp-2 mb-1">
                {a.title}
              </h3>
              <p className="text-gray-500 text-sm line-clamp-2">
                {a.summary || a.description}
              </p>
              <div className="text-xs text-gray-400 mt-1">
                {a.source} —{" "}
                {new Date(a.publishedAt).toLocaleDateString("vi-VN")}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
