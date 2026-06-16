"use client";

import { useState, useRef } from "react";
import { Download, ChevronRight, FileText, Eye } from "lucide-react";
import Nav from "@/components/Nav";
import { CATEGORY_TEMPLATES, type CategoryTemplate } from "@/lib/spec-templates";
import { exportElementToPDF } from "@/lib/pdf-export";

export default function SpecPage() {
  const [category, setCategory] = useState<CategoryTemplate>(CATEGORY_TEMPLATES[0]);
  const [values, setValues] = useState<Record<string, string>>({});
  const previewRef = useRef<HTMLDivElement>(null);

  const updateValue = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleExportPDF = async () => {
    if (!previewRef.current) return;
    await exportElementToPDF(previewRef.current, `${category.enName}-Specification.pdf`);
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <Nav />
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900">双语规格书</h1>
          <p className="mt-1 text-sm text-zinc-500">
            选模板 → 填参数 → 一键导出 A4 双语 PDF
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          {/* 左侧：模板选择 + 表单 */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-zinc-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-zinc-900 mb-3">选择产品分类</h3>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORY_TEMPLATES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setCategory(cat);
                      setValues({});
                    }}
                    className={`flex flex-col items-start gap-0.5 rounded-lg border p-2.5 text-left transition ${
                      category.id === cat.id
                        ? "border-brand-500 bg-brand-50"
                        : "border-zinc-200 bg-white hover:bg-zinc-50"
                    }`}
                  >
                    <div className="text-sm font-medium text-zinc-900">{cat.name}</div>
                    <div className="text-[11px] text-zinc-500">{cat.enName}</div>
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-zinc-500">{category.description}</p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-4 max-h-[60vh] overflow-y-auto">
              <h3 className="text-sm font-semibold text-zinc-900 mb-3">填写参数</h3>
              <div className="space-y-3">
                {category.fields.map((field) => (
                  <div key={field.key}>
                    <label className="mb-1 flex items-baseline justify-between text-xs text-zinc-600">
                      <span>
                        {field.label}
                        {field.required && <span className="ml-0.5 text-rose-500">*</span>}
                      </span>
                      <span className="text-zinc-400">{field.enLabel}</span>
                    </label>
                    {field.type === "select" ? (
                      <select
                        value={values[field.key] || ""}
                        onChange={(e) => updateValue(field.key, e.target.value)}
                        className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-sm focus:border-brand-500 focus:outline-none"
                      >
                        <option value="">请选择</option>
                        {field.options?.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : field.type === "textarea" ? (
                      <textarea
                        value={values[field.key] || ""}
                        onChange={(e) => updateValue(field.key, e.target.value)}
                        rows={2}
                        className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-sm focus:border-brand-500 focus:outline-none"
                      />
                    ) : (
                      <div className="flex gap-1.5">
                        <input
                          type={field.type}
                          value={values[field.key] || ""}
                          onChange={(e) => updateValue(field.key, e.target.value)}
                          className="flex-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-sm focus:border-brand-500 focus:outline-none"
                        />
                        {field.unit && (
                          <span className="inline-flex items-center rounded-lg bg-zinc-50 px-2 text-xs text-zinc-500">
                            {field.unit}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={handleExportPDF}
                className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700"
              >
                <Download className="h-4 w-4" />
                导出 A4 PDF
              </button>
            </div>
          </div>

          {/* 右侧：预览 */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-700 flex items-center gap-1.5">
                <Eye className="h-4 w-4" /> 实时预览
              </h3>
              <span className="text-xs text-zinc-500">A4 双语对照</span>
            </div>
            <div
              ref={previewRef}
              className="mx-auto bg-white shadow-xl"
              style={{
                width: "100%",
                maxWidth: 595, // A4 at 72dpi
                aspectRatio: "210/297",
                padding: "24px 28px",
                fontSize: "11px",
                lineHeight: 1.5,
              }}
            >
              <div className="border-b-2 border-zinc-900 pb-3 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-zinc-500">PRODUCT SPECIFICATION</div>
                    <div className="text-base font-bold text-zinc-900">
                      {values.name || values.model || "Product Name"}
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      产品规格书 · {category.enName}
                    </div>
                  </div>
                  <div className="text-right text-[10px] text-zinc-500">
                    <div>Document No. FF-{Date.now().toString().slice(-8)}</div>
                    <div>Date: {new Date().toISOString().slice(0, 10)}</div>
                    <div>Rev: A1</div>
                  </div>
                </div>
              </div>

              <table className="w-full border-collapse text-[10.5px]">
                <tbody>
                  {category.fields
                    .filter((f) => values[f.key])
                    .map((field) => (
                      <tr key={field.key} className="border-b border-zinc-200">
                        <td className="w-1/3 py-1.5 pr-2 align-top">
                          <div className="font-medium text-zinc-900">{field.label}</div>
                          <div className="text-[9.5px] text-zinc-500">{field.enLabel}</div>
                        </td>
                        <td className="w-1/3 py-1.5 pr-2 align-top text-zinc-700">
                          {field.options
                            ? values[field.key]?.split(" ")[0] || ""
                            : values[field.key]}
                        </td>
                        <td className="w-1/3 py-1.5 align-top text-zinc-700">
                          {field.options
                            ? values[field.key]?.split(" ").slice(1).join(" ") || ""
                            : values[field.key]}
                          {field.unit && (
                            <span className="ml-1 text-zinc-500">{field.unit}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              {category.fields.every((f) => !values[f.key]) && (
                <div className="mt-12 text-center text-zinc-300 text-sm">
                  ← 填写左侧参数，预览会实时更新
                </div>
              )}

              {/* 底部声明 */}
              {Object.keys(values).length > 0 && (
                <div className="mt-6 pt-3 border-t border-zinc-200 text-[9.5px] text-zinc-500">
                  <div>声明：以上规格参数如有更改，恕不另行通知，请以最新版本为准。</div>
                  <div className="mt-1">
                    Specifications are subject to change without notice. Please refer to the
                    latest version.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
