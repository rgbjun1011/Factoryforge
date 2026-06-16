import Link from "next/link";
import {
  Camera,
  FileText,
  Factory,
  Globe2,
  Receipt,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Nav from "@/components/Nav";

const FEATURES = [
  {
    href: "/photo",
    icon: Camera,
    title: "智能工业摄影",
    desc: "手机拍一张 → AI 抠图 → 白底精修 → 场景合成 + 比例参照，三件套一次出",
    tag: "核心差异",
    color: "from-emerald-500 to-teal-600",
  },
  {
    href: "/spec",
    icon: FileText,
    title: "双语规格书",
    desc: "结构化录入 + 双语排版 + 工业术语翻译，10 分钟出标准 A4 PDF",
    tag: "护城河",
    color: "from-blue-500 to-indigo-600",
  },
  {
    href: "/factory",
    icon: Factory,
    title: "工厂能力展示",
    desc: "产线全景 + 认证墙 + 设备清单，让海外买家 3 分钟「验厂」",
    tag: "信任建立",
    color: "from-amber-500 to-orange-600",
  },
  {
    href: "/quote",
    icon: Receipt,
    title: "询盘报价单",
    desc: "FOB/CIF/EXW 模板 + 装箱自动计算，让专业报价单替代「1000个$5」",
    tag: "闭环转化",
    color: "from-rose-500 to-pink-600",
  },
  {
    href: "/catalog",
    icon: Globe2,
    title: "多语言目录",
    desc: "英/西/阿/俄/葡 5 语种同步生成，阿拉伯语 RTL 排版支持",
    tag: "增量市场",
    color: "from-violet-500 to-purple-600",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Nav />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-emerald-50" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-3 py-1 text-xs text-brand-700">
              <Sparkles className="h-3.5 w-3.5" />
              工业品 B2B 专用 · 红海旁边的蓝海
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900">
              工厂老板也能用上的<br />
              <span className="text-brand-600">AI 素材工具</span>
            </h1>
            <p className="mt-4 text-base md:text-lg text-zinc-600 leading-relaxed">
              手机拍一张 → 一键生成阿里国际站白底图 + 双语规格书 + 多语言目录 + 询盘报价单
              <br />
              不用 PS，不用翻译公司，让老外以为你是上市公司
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/photo"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-brand-700 transition"
              >
                立即体验
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/spec"
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition"
              >
                查看演示
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-zinc-900">5 大核心场景</h2>
          <p className="mt-1 text-sm text-zinc-500">基于外贸工厂实地调研，按付费意愿排序</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <Link
                key={f.href}
                href={f.href}
                className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 transition hover:border-brand-300 hover:shadow-lg"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} text-white`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-600">
                    {f.tag}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 group-hover:text-brand-700 transition">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-brand-600 opacity-0 group-hover:opacity-100 transition">
                  开始使用
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 价值对比 */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8">
          <h2 className="text-2xl font-bold text-zinc-900 mb-6">为什么外贸工厂需要 AI？</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <div className="text-3xl font-bold text-brand-600">70%</div>
              <div className="mt-1 text-sm text-zinc-600">B2B 平台产品图不合格率</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-brand-600">800-3000</div>
              <div className="mt-1 text-sm text-zinc-600">外包摄影元/套成本</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-brand-600">15min</div>
              <div className="mt-1 text-sm text-zinc-600">AI 生成整套素材时间</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-200 py-8 text-center text-sm text-zinc-500">
        © 2026 FactoryForge · 内部测试版 v0.1
      </footer>
    </div>
  );
}
