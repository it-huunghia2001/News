// app/NewsTabs.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

interface Article {
  id: number;
  title: string;
  slug: string;
  summary?: string | null;
  content?: string | null;
  image?: string | null;
  link: string;
  category: string;
  publishedAt: string | Date;
  source?: string | null;
}

interface NewsTabsProps {
  articles: Article[];
}

export default function NewsTabs({ articles }: NewsTabsProps) {
  const categories = [
    { key: "general", label: "📰 Tin tổng hợp" },
    { key: "gold", label: "🪙 Tin tức vàng" },
    { key: "stock", label: "📈 Tin chứng khoán" },
  ];

  const [active, setActive] = useState("general");

  const filtered = articles.filter((a) => a.category === active);
  const featured = filtered[0];
  const rest = filtered.slice(1);
  const withImage = rest.filter((a) => !!a.image);
  const withoutImage = rest.filter((a) => !a.image);

  return (
    <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      {/* Tabs */}
      <div className="flex gap-6 border-b pb-3">
        {categories.map((c) => (
          <button
            key={c.key}
            onClick={() => setActive(c.key)}
            className={`pb-2 text-lg font-semibold ${
              active === c.key
                ? "border-b-4 border-blue-600 text-blue-600"
                : "text-gray-600"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Tin tức theo tab */}
      {filtered.length === 0 && (
        <div className="text-center text-gray-500 py-20 text-lg">
          Chưa có {categories.find((c) => c.key === active)?.label}
        </div>
      )}

      {filtered.length > 0 && (
        <>
          {/* Tin nổi bật */}
          {featured && (
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
                    <h2 className="text-3xl font-bold mb-3">
                      {featured.title}
                    </h2>
                    <p className="text-gray-200 max-w-3xl line-clamp-3">
                      {featured.summary || featured.content || ""}
                    </p>
                  </div>
                </div>
              )}
            </Link>
          )}

          {/* Layout tin tổng hợp riêng */}
          {active === "general" ? (
            <div className="grid lg:grid-cols-3 gap-10">
              {/* Tin có ảnh */}
              <div className="lg:col-span-2 grid sm:grid-cols-2 gap-8">
                {withImage.map((a) => (
                  <Link
                    key={a.id}
                    href={a.link}
                    target="_blank"
                    className="group rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition flex flex-col"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={a.image!}
                        alt={a.title}
                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-blue-600 line-clamp-2">
                        {a.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                        {a.summary || a.content || ""}
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

              {/* Tin không ảnh */}
              <div className="space-y-6">
                <h2 className="font-semibold text-xl text-gray-800 border-b pb-2">
                  🗞 Tin nhanh
                </h2>
                {withoutImage.slice(0, 10).map((a) => (
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
                      {a.summary || a.content || ""}
                    </p>
                    <div className="text-xs text-gray-400 mt-1">
                      {a.source} —{" "}
                      {new Date(a.publishedAt).toLocaleDateString("vi-VN")}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            // Layout cho tin vàng / chứng khoán
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((a) => (
                <Link
                  key={a.id}
                  href={a.link}
                  target="_blank"
                  className="group rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition flex flex-col"
                >
                  {a.image && (
                    <div className="relative overflow-hidden">
                      <img
                        src={a.image}
                        alt={a.title}
                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-blue-600 line-clamp-2">
                      {a.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                      {a.summary || a.content || ""}
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
          )}
        </>
      )}
    </main>
  );
}
