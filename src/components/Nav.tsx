"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Camera,
  FileText,
  Factory,
  Globe2,
  Receipt,
  Home,
} from "lucide-react";

const NAV = [
  { href: "/", label: "首页", icon: Home },
  { href: "/photo", label: "智能工业摄影", icon: Camera },
  { href: "/spec", label: "双语规格书", icon: FileText },
  { href: "/factory", label: "工厂能力展示", icon: Factory },
  { href: "/quote", label: "询盘报价单", icon: Receipt },
  { href: "/catalog", label: "多语言目录", icon: Globe2 },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white font-bold">
            F
          </div>
          <div>
            <div className="font-bold text-zinc-900">工坊智造</div>
            <div className="text-xs text-zinc-500 -mt-0.5">FactoryForge</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.slice(1).map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition ${
                  active
                    ? "bg-brand-50 text-brand-700"
                    : "text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
            v0.1 内部测试
          </span>
        </div>
      </div>

      {/* 移动端底部 tab */}
      <nav className="md:hidden flex border-t border-zinc-200 overflow-x-auto">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 min-w-[80px] flex-col items-center gap-0.5 py-2 text-[11px] ${
                active ? "text-brand-700" : "text-zinc-500"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label.replace("智能工业", "摄影").replace("工厂能力", "能力").replace("询盘", "").replace("多语言", "目录")}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
