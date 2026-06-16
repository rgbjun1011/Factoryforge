"use client";

import { useState, useRef } from "react";
import { Upload, Download, Plus, Trash2, Award, Building2, Wrench } from "lucide-react";
import Nav from "@/components/Nav";
import { exportElementToPDF } from "@/lib/pdf-export";

type Cert = { id: number; name: string; issuer: string; date: string; image: string | null };

const DEFAULT_CERTS: Cert[] = [
  { id: 1, name: "ISO 9001:2015", issuer: "TÜV Rheinland", date: "2024-08", image: null },
  { id: 2, name: "CE Marking", issuer: "EU Notified Body", date: "2024-03", image: null },
  { id: 3, name: "RoHS Compliance", issuer: "SGS", date: "2024-05", image: null },
];

export default function FactoryPage() {
  const [companyName, setCompanyName] = useState("Shenzhen Precision Manufacturing Co., Ltd");
  const [established, setEstablished] = useState("2008");
  const [employees, setEmployees] = useState("150");
  const [factoryArea, setFactoryArea] = useState("8,000");
  const [monthlyCapacity, setMonthlyCapacity] = useState("500,000");
  const [mainProducts, setMainProducts] = useState("精密机械零件、注塑件、五金冲压");
  const [mainMarkets, setMainMarkets] = useState("欧洲 35% · 北美 30% · 东南亚 20% · 其他 15%");
  const [certs, setCerts] = useState<Cert[]>(DEFAULT_CERTS);
  const [equipmentList, setEquipmentList] = useState([
    "CNC 加工中心 × 12",
    "数控车床 × 8",
    "注塑机 50T-800T × 6",
    "冲压机 60T-200T × 4",
    "三坐标测量仪 × 2",
    "光谱分析仪 × 1",
  ]);
  const [newEquip, setNewEquip] = useState("");
  const [qcSteps, setQcSteps] = useState([
    "来料检验 IQC",
    "首件检验 FAI",
    "过程巡检 IPQC",
    "出货检验 OQC",
    "全尺寸检测报告",
  ]);
  const [factoryImages, setFactoryImages] = useState<string[]>([]);
  const previewRef = useRef<HTMLDivElement>(null);

  const addCert = () => {
    setCerts([
      ...certs,
      { id: Date.now(), name: "", issuer: "", date: "", image: null },
    ]);
  };
  const removeCert = (id: number) => {
    setCerts(certs.filter((c) => c.id !== id));
  };
  const updateCert = (id: number, key: keyof Cert, value: any) => {
    setCerts(certs.map((c) => (c.id === id ? { ...c, [key]: value } : c)));
  };

  const addEquipment = () => {
    if (newEquip.trim()) {
      setEquipmentList([...equipmentList, newEquip.trim()]);
      setNewEquip("");
    }
  };
  const removeEquipment = (idx: number) => {
    setEquipmentList(equipmentList.filter((_, i) => i !== idx));
  };

  const handleFactoryImages = (files: FileList | null) => {
    if (!files) return;
    Array.from(files)
      .slice(0, 6)
      .forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFactoryImages((prev) => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
  };

  const handleExportPDF = async () => {
    if (!previewRef.current) return;
    await exportElementToPDF(previewRef.current, "Factory-Capability-Brochure.pdf");
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <Nav />
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900">工厂能力展示</h1>
          <p className="mt-1 text-sm text-zinc-500">
            上传车间照片/输入工厂数据 → 一键生成「工厂能力一页纸」+ 认证墙
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <div className="space-y-4 max-h-[calc(100vh-160px)] overflow-y-auto pr-2">
            <Section title="公司基础信息">
              <Field label="公司名称" value={companyName} onChange={setCompanyName} />
              <div className="grid grid-cols-2 gap-2">
                <Field label="成立年份" value={established} onChange={setEstablished} />
                <Field label="员工人数" value={employees} onChange={setEmployees} />
                <Field label="厂房面积 (m²)" value={factoryArea} onChange={setFactoryArea} />
                <Field label="月产能" value={monthlyCapacity} onChange={setMonthlyCapacity} />
              </div>
              <Field label="主营产品" value={mainProducts} onChange={setMainProducts} />
              <Field label="主要市场" value={mainMarkets} onChange={setMainMarkets} />
            </Section>

            <Section title="车间图片">
              <label className="flex h-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-zinc-200 hover:border-brand-500 hover:bg-brand-50">
                <div className="text-center">
                  <Upload className="mx-auto h-5 w-5 text-zinc-400" />
                  <div className="mt-1 text-xs text-zinc-500">点击上传（最多 6 张）</div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFactoryImages(e.target.files)}
                />
              </label>
              {factoryImages.length > 0 && (
                <div className="grid grid-cols-3 gap-1.5 mt-2">
                  {factoryImages.map((src, i) => (
                    <div key={i} className="relative group">
                      <img src={src} className="aspect-square w-full rounded object-cover" />
                      <button
                        onClick={() => setFactoryImages(factoryImages.filter((_, idx) => idx !== i))}
                        className="absolute right-1 top-1 hidden rounded bg-rose-500 p-0.5 text-white group-hover:block"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            <Section title="设备清单">
              <div className="space-y-1">
                {equipmentList.map((eq, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded bg-zinc-50 px-2 py-1.5 text-sm"
                  >
                    <span>{eq}</span>
                    <button
                      onClick={() => removeEquipment(i)}
                      className="text-rose-500 hover:bg-rose-50 rounded p-0.5"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={newEquip}
                  onChange={(e) => setNewEquip(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addEquipment()}
                  placeholder="例如：激光切割机 × 2"
                  className="flex-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-sm focus:border-brand-500 focus:outline-none"
                />
                <button
                  onClick={addEquipment}
                  className="rounded-lg bg-zinc-100 px-2 py-1.5 text-sm hover:bg-zinc-200"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </Section>

            <Section title="认证证书">
              {certs.map((cert) => (
                <div key={cert.id} className="rounded border border-zinc-200 bg-zinc-50 p-2 mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs font-medium text-zinc-700">证书 {cert.id}</div>
                    <button
                      onClick={() => removeCert(cert.id)}
                      className="text-rose-500 hover:bg-rose-50 rounded p-0.5"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) => updateCert(cert.id, "name", e.target.value)}
                    placeholder="ISO 9001:2015"
                    className="mb-1 w-full rounded border border-zinc-200 bg-white px-2 py-1 text-sm"
                  />
                  <div className="grid grid-cols-2 gap-1.5">
                    <input
                      type="text"
                      value={cert.issuer}
                      onChange={(e) => updateCert(cert.id, "issuer", e.target.value)}
                      placeholder="发证机构"
                      className="rounded border border-zinc-200 bg-white px-2 py-1 text-sm"
                    />
                    <input
                      type="month"
                      value={cert.date}
                      onChange={(e) => updateCert(cert.id, "date", e.target.value)}
                      className="rounded border border-zinc-200 bg-white px-2 py-1 text-sm"
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={addCert}
                className="inline-flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-50"
              >
                <Plus className="h-3.5 w-3.5" /> 添加证书
              </button>
            </Section>

            <button
              onClick={handleExportPDF}
              className="sticky bottom-0 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
            >
              <Download className="h-4 w-4" />
              导出工厂一页纸 PDF
            </button>
          </div>

          {/* 预览 */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <h3 className="mb-2 text-sm font-semibold text-zinc-700">实时预览 · A4 一页纸</h3>
            <div
              ref={previewRef}
              className="mx-auto bg-white shadow-xl"
              style={{
                width: "100%",
                maxWidth: 595,
                aspectRatio: "210/297",
                padding: "20px 24px",
                fontSize: "10px",
                lineHeight: 1.4,
              }}
            >
              {/* Header */}
              <div className="border-b-2 border-zinc-900 pb-2 mb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[9px] text-zinc-500">FACTORY CAPABILITY BROCHURE</div>
                    <div className="text-base font-bold text-zinc-900">{companyName}</div>
                    <div className="text-[9px] text-zinc-500">工厂能力一页纸</div>
                  </div>
                  <Building2 className="h-10 w-10 text-zinc-300" />
                </div>
              </div>

              {/* 关键数据 */}
              <div className="mb-3 grid grid-cols-4 gap-1.5">
                {[
                  { k: "成立年份", v: established },
                  { k: "员工人数", v: `${employees}人` },
                  { k: "厂房面积", v: `${factoryArea}m²` },
                  { k: "月产能", v: monthlyCapacity },
                ].map((item) => (
                  <div key={item.k} className="rounded border border-zinc-200 bg-zinc-50 p-1.5 text-center">
                    <div className="text-[8px] text-zinc-500">{item.k}</div>
                    <div className="text-[11px] font-bold text-zinc-900">{item.v}</div>
                  </div>
                ))}
              </div>

              {/* 主营 + 市场 */}
              <div className="mb-3 grid grid-cols-2 gap-2 text-[9.5px]">
                <div>
                  <div className="text-zinc-500">主营产品 / Main Products</div>
                  <div className="text-zinc-900 font-medium">{mainProducts}</div>
                </div>
                <div>
                  <div className="text-zinc-500">主要市场 / Main Markets</div>
                  <div className="text-zinc-900 font-medium">{mainMarkets}</div>
                </div>
              </div>

              {/* 车间图 */}
              {factoryImages.length > 0 && (
                <div className="mb-3">
                  <div className="mb-1 text-[9.5px] font-medium text-zinc-700">生产现场 / Workshop</div>
                  <div className="grid grid-cols-3 gap-1">
                    {factoryImages.slice(0, 6).map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        className="aspect-video w-full rounded object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* 设备 + 质检 */}
              <div className="mb-3 grid grid-cols-2 gap-2">
                <div>
                  <div className="mb-1 flex items-center gap-1 text-[9.5px] font-medium text-zinc-700">
                    <Wrench className="h-3 w-3" /> 设备清单 / Equipment
                  </div>
                  <ul className="space-y-0.5 text-[9px] text-zinc-700">
                    {equipmentList.slice(0, 6).map((eq, i) => (
                      <li key={i}>• {eq}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="mb-1 text-[9.5px] font-medium text-zinc-700">质检流程 / QC Process</div>
                  <div className="flex flex-wrap gap-1">
                    {qcSteps.map((step, i) => (
                      <div key={i} className="rounded bg-zinc-100 px-1.5 py-0.5 text-[8.5px]">
                        {i + 1}. {step}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 认证墙 */}
              {certs.length > 0 && (
                <div>
                  <div className="mb-1 flex items-center gap-1 text-[9.5px] font-medium text-zinc-700">
                    <Award className="h-3 w-3" /> 认证 / Certifications
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {certs.map((cert) => (
                      <div
                        key={cert.id}
                        className="rounded border-2 border-dashed border-zinc-300 bg-zinc-50 p-1.5 text-center"
                      >
                        <div className="text-[9px] font-bold text-zinc-900">
                          {cert.name || "Certificate"}
                        </div>
                        <div className="text-[8px] text-zinc-500">{cert.issuer}</div>
                        <div className="text-[7.5px] text-zinc-400">{cert.date}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="mt-3 border-t border-zinc-200 pt-1.5 text-center text-[8px] text-zinc-500">
                欢迎莅临工厂参观 · Welcome to visit our factory anytime
              </div>
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
