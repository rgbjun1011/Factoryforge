"use client";

import { useState, useRef } from "react";
import { Download, Plus, Trash2, Eye } from "lucide-react";
import Nav from "@/components/Nav";
import { exportElementToPDF } from "@/lib/pdf-export";

const LANGUAGES = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "ar", name: "العربية", flag: "🇸🇦", rtl: true },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
];

type Product = {
  id: number;
  model: string;
  category: string;
  descEN: string;
  descES: string;
  descAR: string;
  descRU: string;
  descPT: string;
  moq: number;
};

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 1,
    model: "M8 Hex Bolt",
    category: "Fasteners",
    descEN: "M8x30 8.8 Grade Carbon Steel Hex Bolt, Zinc Plated",
    descES: "Perno hexagonal M8x30 Grado 8.8 Acero al carbono, Galvanizado",
    descAR: "برغي سداسي M8x30 درجة 8.8 فولاذ كربوني، مجلفن",
    descRU: "Болт M8x30 кл.проч. 8.8 углеродистая сталь, оцинкованный",
    descPT: "Parafuso sextavado M8x30 Grau 8.8 Aço carbono, Zincado",
    moq: 1000,
  },
  {
    id: 2,
    model: "6205-2RS Bearing",
    category: "Mechanical Parts",
    descEN: "Deep Groove Ball Bearing 6205-2RS, Chrome Steel",
    descES: "Rodamiento rígido de bolas 6205-2RS, Acero cromado",
    descAR: "محمل كروي ذو أخدود عميق 6205-2RS، فولاذ كروم",
    descRU: "Подшипник шариковый 6205-2RS, хромированная сталь",
    descPT: "Rolamento rígido de esferas 6205-2RS, Aço cromo",
    moq: 500,
  },
];

export default function CatalogPage() {
  const [companyName, setCompanyName] = useState("Your Company Name Co., Ltd");
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [activeLangs, setActiveLangs] = useState<string[]>(["en", "es"]);
  const previewRef = useRef<HTMLDivElement>(null);

  const toggleLang = (code: string) => {
    setActiveLangs((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
  };

  const addProduct = () => {
    setProducts([
      ...products,
      {
        id: Date.now(),
        model: "",
        category: "",
        descEN: "",
        descES: "",
        descAR: "",
        descRU: "",
        descPT: "",
        moq: 1000,
      },
    ]);
  };
  const removeProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
  };
  const updateProduct = (id: number, key: keyof Product, value: any) => {
    setProducts(products.map((p) => (p.id === id ? { ...p, [key]: value } : p)));
  };

  const handleExportPDF = async () => {
    if (!previewRef.current) return;
    await exportElementToPDF(previewRef.current, "Product-Catalog.pdf");
  };

  const descKey = (code: string): keyof Product => {
    const map: Record<string, keyof Product> = {
      en: "descEN",
      es: "descES",
      ar: "descAR",
      ru: "descRU",
      pt: "descPT",
    };
    return map[code] || "descEN";
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <Nav />
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900">多语言产品目录</h1>
          <p className="mt-1 text-sm text-zinc-500">
            一套产品信息 → 自动生成多语种 PDF 目录（支持阿拉伯语 RTL）
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <div className="space-y-4 max-h-[calc(100vh-160px)] overflow-y-auto pr-2">
            <Section title="公司信息">
              <Field label="公司名称" value={companyName} onChange={setCompanyName} />
            </Section>

            <Section title="选择目标语种">
              <div className="flex flex-wrap gap-1.5">
                {LANGUAGES.map((lang) => {
                  const active = activeLangs.includes(lang.code);
                  return (
                    <button
                      key={lang.code}
                      onClick={() => toggleLang(lang.code)}
                      className={`rounded-lg border px-3 py-1.5 text-sm ${
                        active
                          ? "border-brand-500 bg-brand-50 text-brand-700"
                          : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
                      }`}
                    >
                      {lang.flag} {lang.name}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-zinc-500">
                已选 {activeLangs.length} 个语种 · 阿拉伯语会自动启用 RTL 排版
              </p>
            </Section>

            <Section title="产品列表">
              {products.map((p, idx) => (
                <div key={p.id} className="rounded border border-zinc-200 bg-zinc-50 p-2 mb-2">
                  <div className="mb-1 flex items-center justify-between">
                    <div className="text-xs font-medium text-zinc-700">产品 {idx + 1}</div>
                    <button
                      onClick={() => removeProduct(p.id)}
                      className="text-rose-500 hover:bg-rose-50 rounded p-0.5"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <input
                      type="text"
                      value={p.model}
                      onChange={(e) => updateProduct(p.id, "model", e.target.value)}
                      placeholder="型号"
                      className="rounded border border-zinc-200 bg-white px-2 py-1 text-sm"
                    />
                    <input
                      type="text"
                      value={p.category}
                      onChange={(e) => updateProduct(p.id, "category", e.target.value)}
                      placeholder="分类"
                      className="rounded border border-zinc-200 bg-white px-2 py-1 text-sm"
                    />
                  </div>
                  <input
                    type="number"
                    value={p.moq}
                    onChange={(e) => updateProduct(p.id, "moq", Number(e.target.value))}
                    placeholder="MOQ"
                    className="mt-1 w-full rounded border border-zinc-200 bg-white px-2 py-1 text-sm"
                  />
                  {activeLangs.map((code) => {
                    const lang = LANGUAGES.find((l) => l.code === code)!;
                    return (
                      <div key={code} className="mt-1">
                        <div className="text-[10px] text-zinc-500 mb-0.5">
                          {lang.flag} {lang.name}
                        </div>
                        <textarea
                          value={p[descKey(code)] as string}
                          onChange={(e) => updateProduct(p.id, descKey(code), e.target.value)}
                          rows={2}
                          placeholder={`${lang.name} 描述`}
                          className="w-full rounded border border-zinc-200 bg-white px-2 py-1 text-sm"
                          dir={lang.rtl ? "rtl" : "ltr"}
                        />
                      </div>
                    );
                  })}
                </div>
              ))}
              <button
                onClick={addProduct}
                className="inline-flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-50"
              >
                <Plus className="h-3.5 w-3.5" /> 添加产品
              </button>
            </Section>

            <button
              onClick={handleExportPDF}
              className="sticky bottom-0 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
            >
              <Download className="h-4 w-4" />
              导出多语言目录 PDF
            </button>
          </div>

          {/* 预览 */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <h3 className="mb-2 text-sm font-semibold text-zinc-700 flex items-center gap-1.5">
              <Eye className="h-4 w-4" /> 实时预览
            </h3>
            <div
              ref={previewRef}
              className="mx-auto bg-white shadow-xl"
              style={{
                width: "100%",
                maxWidth: 595,
                padding: "20px 24px",
                fontSize: "10.5px",
                lineHeight: 1.4,
              }}
            >
              {activeLangs.map((code, langIdx) => {
                const lang = LANGUAGES.find((l) => l.code === code)!;
                const isRTL = !!lang.rtl;
                return (
                  <div key={code} className={langIdx > 0 ? "mt-6 pt-4 border-t-2 border-zinc-300" : ""}>
                    <div
                      className="mb-3 text-center border-b border-zinc-200 pb-2"
                      dir={isRTL ? "rtl" : "ltr"}
                    >
                      <div className="text-[9px] text-zinc-500">PRODUCT CATALOG · 产品目录</div>
                      <div className="text-base font-bold text-zinc-900">{companyName}</div>
                      <div className="text-[9px] text-zinc-500 mt-0.5">
                        {lang.flag} {lang.name} Edition
                      </div>
                    </div>
                    <div className="space-y-2" dir={isRTL ? "rtl" : "ltr"}>
                      {products.map((p, i) => (
                        <div
                          key={p.id}
                          className="rounded border border-zinc-200 p-2"
                        >
                          <div className="flex items-baseline justify-between mb-1">
                            <div className="text-[11px] font-bold text-zinc-900">
                              {i + 1}. {p.model}
                            </div>
                            <div className="text-[9px] text-zinc-500">{p.category}</div>
                          </div>
                          <div className="text-[9.5px] text-zinc-700">
                            {p[descKey(code)] as string}
                          </div>
                          <div className="mt-1 text-[8.5px] text-zinc-500">
                            MOQ: {p.moq.toLocaleString()} pcs
                          </div>
                        </div>
                      ))}
                    </div>
                    {products.length === 0 && (
                      <div className="py-12 text-center text-zinc-300 text-sm">
                        请添加产品
                      </div>
                    )}
                  </div>
                );
              })}
              {activeLangs.length === 0 && (
                <div className="py-12 text-center text-zinc-300 text-sm">
                  请选择至少一个语种
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-2xl border border-zinc-200 bg-white p-4">
    <h3 className="mb-3 text-sm font-semibold text-zinc-900">{title}</h3>
    <div className="space-y-2">{children}</div>
  </div>
);

const Field = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <div>
    <label className="mb-1 block text-xs text-zinc-600">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-sm focus:border-brand-500 focus:outline-none"
    />
  </div>
);
