"use client";

import { useState, useRef } from "react";
import { Download, Plus, Trash2, Eye } from "lucide-react";
import Nav from "@/components/Nav";
import {
  TRADE_TERM_DESCRIPTIONS,
  CURRENCIES,
  COMMON_PORTS,
  calculatePacking,
  type TradeTerm,
} from "@/lib/quotation";
import { exportElementToPDF } from "@/lib/pdf-export";

type QuoteItem = {
  id: number;
  productName: string;
  model: string;
  spec: string;
  quantity: number;
  unitPrice: number;
  unitsPerCarton: number;
  cartonL: number;
  cartonW: number;
  cartonH: number;
  netWeight: number;
  grossWeight: number;
};

const DEFAULT_ITEM: Omit<QuoteItem, "id"> = {
  productName: "",
  model: "",
  spec: "",
  quantity: 1000,
  unitPrice: 5.0,
  unitsPerCarton: 50,
  cartonL: 40,
  cartonW: 30,
  cartonH: 25,
  netWeight: 0.5,
  grossWeight: 15,
};

export default function QuotePage() {
  const [tradeTerm, setTradeTerm] = useState<TradeTerm>("FOB");
  const [currency, setCurrency] = useState("USD");
  const [originPort, setOriginPort] = useState("Shanghai 上海");
  const [destinationPort, setDestinationPort] = useState("Los Angeles 洛杉矶");
  const [validity, setValidity] = useState("15");
  const [paymentTerm, setPaymentTerm] = useState("30% T/T deposit, 70% balance before shipment");
  const [customerName, setCustomerName] = useState("");
  const [customerCountry, setCustomerCountry] = useState("");
  const [companyName, setCompanyName] = useState("Your Company Name Co., Ltd");
  const [companyAddress, setCompanyAddress] = useState("No. 88, Industry Road, Shenzhen, China");
  const [contactInfo, setContactInfo] = useState("Tel: +86-755-12345678 | Email: sales@yourcompany.com");
  const [items, setItems] = useState<QuoteItem[]>([
    { id: 1, ...DEFAULT_ITEM, productName: "M8 Hex Bolt", model: "GB/T 5783", spec: "M8x30 8.8 Zinc Plated" },
  ]);
  const previewRef = useRef<HTMLDivElement>(null);

  const addItem = () => {
    setItems([...items, { id: Date.now(), ...DEFAULT_ITEM }]);
  };
  const removeItem = (id: number) => {
    setItems(items.filter((i) => i.id !== id));
  };
  const updateItem = (id: number, key: keyof QuoteItem, value: any) => {
    setItems(items.map((i) => (i.id === id ? { ...i, [key]: value } : i)));
  };

  const totalAmount = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  const currencyInfo = CURRENCIES.find((c) => c.code === currency);

  const aggregatePacking = items.reduce(
    (acc, i) => {
      const p = calculatePacking({
        unitsPerCarton: i.unitsPerCarton,
        totalQuantity: i.quantity,
        cartonSize: { l: i.cartonL, w: i.cartonW, h: i.cartonH },
        netWeight: i.netWeight,
        grossWeight: i.grossWeight,
      });
      return {
        cartons: acc.cartons + p.totalCartons,
        volume: acc.volume + p.totalVolume,
        grossWeight: acc.grossWeight + p.totalGrossWeight,
      };
    },
    { cartons: 0, volume: 0, grossWeight: 0 },
  );

  const handleExportPDF = async () => {
    if (!previewRef.current) return;
    await exportElementToPDF(previewRef.current, `Quotation-${customerName || "Customer"}-${Date.now()}.pdf`);
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <Nav />
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900">询盘报价单</h1>
          <p className="mt-1 text-sm text-zinc-500">
            输入产品/数量/港口/条款 → 自动生成正式 PDF 报价单
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
          {/* 左侧表单 */}
          <div className="space-y-4 max-h-[calc(100vh-160px)] overflow-y-auto pr-2">
            {/* 公司信息 */}
            <Section title="公司信息">
              <Field label="公司名称" value={companyName} onChange={setCompanyName} />
              <Field label="公司地址" value={companyAddress} onChange={setCompanyAddress} />
              <Field label="联系方式" value={contactInfo} onChange={setContactInfo} />
            </Section>

            {/* 客户信息 */}
            <Section title="客户信息">
              <Field label="客户名称" value={customerName} onChange={setCustomerName} placeholder="ABC Trading Co., Ltd" />
              <Field label="客户国家" value={customerCountry} onChange={setCustomerCountry} placeholder="United States" />
            </Section>

            {/* 贸易条款 */}
            <Section title="贸易条款">
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(TRADE_TERM_DESCRIPTIONS) as TradeTerm[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTradeTerm(t)}
                    className={`rounded-lg border px-3 py-2 text-sm ${
                      tradeTerm === t
                        ? "border-brand-500 bg-brand-50 text-brand-700"
                        : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="text-xs text-zinc-500 bg-zinc-50 rounded p-2">
                {TRADE_TERM_DESCRIPTIONS[tradeTerm].cn} ·{" "}
                {TRADE_TERM_DESCRIPTIONS[tradeTerm].en}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <SelectField
                  label="币种"
                  value={currency}
                  onChange={setCurrency}
                  options={CURRENCIES.map((c) => ({
                    value: c.code,
                    label: `${c.code} (${c.symbol})`,
                  }))}
                />
                <Field
                  label="报价有效期 (天)"
                  type="number"
                  value={validity}
                  onChange={setValidity}
                />
              </div>
              <SelectField
                label="起运港"
                value={originPort}
                onChange={setOriginPort}
                options={COMMON_PORTS.map((p) => ({ value: p, label: p }))}
              />
              <SelectField
                label="目的港"
                value={destinationPort}
                onChange={setDestinationPort}
                options={COMMON_PORTS.map((p) => ({ value: p, label: p }))}
              />
              <Field label="付款方式" value={paymentTerm} onChange={setPaymentTerm} />
            </Section>

            {/* 商品明细 */}
            <Section title="商品明细">
              {items.map((item, idx) => (
                <div key={item.id} className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 mb-2">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-xs font-medium text-zinc-700">商品 {idx + 1}</div>
                    {items.length > 1 && (
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-rose-500 hover:bg-rose-50 rounded p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <Field
                    label="产品名称"
                    value={item.productName}
                    onChange={(v) => updateItem(item.id, "productName", v)}
                    placeholder="M8 Hex Bolt"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Field
                      label="型号"
                      value={item.model}
                      onChange={(v) => updateItem(item.id, "model", v)}
                    />
                    <Field
                      label="规格"
                      value={item.spec}
                      onChange={(v) => updateItem(item.id, "spec", v)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Field
                      label="数量"
                      type="number"
                      value={item.quantity.toString()}
                      onChange={(v) => updateItem(item.id, "quantity", Number(v))}
                    />
                    <Field
                      label={`单价 (${currency})`}
                      type="number"
                      step="0.01"
                      value={item.unitPrice.toString()}
                      onChange={(v) => updateItem(item.id, "unitPrice", Number(v))}
                    />
                  </div>
                  <details className="mt-1">
                    <summary className="text-xs text-zinc-500 cursor-pointer hover:text-brand-600">
                      装箱参数（高级）
                    </summary>
                    <div className="mt-2 grid grid-cols-3 gap-1.5">
                      <SmallField
                        label="单箱装量"
                        value={item.unitsPerCarton.toString()}
                        onChange={(v) => updateItem(item.id, "unitsPerCarton", Number(v))}
                      />
                      <SmallField
                        label="箱长cm"
                        value={item.cartonL.toString()}
                        onChange={(v) => updateItem(item.id, "cartonL", Number(v))}
                      />
                      <SmallField
                        label="箱宽cm"
                        value={item.cartonW.toString()}
                        onChange={(v) => updateItem(item.id, "cartonW", Number(v))}
                      />
                      <SmallField
                        label="箱高cm"
                        value={item.cartonH.toString()}
                        onChange={(v) => updateItem(item.id, "cartonH", Number(v))}
                      />
                      <SmallField
                        label="单件净重kg"
                        value={item.netWeight.toString()}
                        onChange={(v) => updateItem(item.id, "netWeight", Number(v))}
                      />
                      <SmallField
                        label="单箱毛重kg"
                        value={item.grossWeight.toString()}
                        onChange={(v) => updateItem(item.id, "grossWeight", Number(v))}
                      />
                    </div>
                  </details>
                </div>
              ))}
              <button
                onClick={addItem}
                className="mt-1 inline-flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50"
              >
                <Plus className="h-3.5 w-3.5" /> 添加商品
              </button>
            </Section>

            <button
              onClick={handleExportPDF}
              className="sticky bottom-0 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
            >
              <Download className="h-4 w-4" />
              导出 PDF 报价单
            </button>
          </div>

          {/* 右侧预览 */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-700 flex items-center gap-1.5">
                <Eye className="h-4 w-4" /> 实时预览
              </h3>
              <span className="text-xs text-zinc-500">A4 · 专业报价单</span>
            </div>
            <div
              ref={previewRef}
              className="mx-auto bg-white shadow-xl"
              style={{
                width: "100%",
                maxWidth: 595,
                aspectRatio: "210/297",
                padding: "20px 24px",
                fontSize: "10.5px",
                lineHeight: 1.4,
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b-2 border-zinc-900 pb-3 mb-3">
                <div>
                  <div className="text-base font-bold text-zinc-900">QUOTATION</div>
                  <div className="text-[10px] text-zinc-500">报价单</div>
                </div>
                <div className="text-right text-[9.5px] text-zinc-600">
                  <div className="font-bold text-zinc-900">{companyName}</div>
                  <div>{companyAddress}</div>
                  <div>{contactInfo}</div>
                </div>
              </div>

              {/* To / From */}
              <div className="grid grid-cols-2 gap-3 mb-3 text-[10px]">
                <div>
                  <div className="text-zinc-500">TO / 致:</div>
                  <div className="mt-0.5 font-medium text-zinc-900">
                    {customerName || "Customer Name"}
                  </div>
                  {customerCountry && (
                    <div className="text-zinc-600">{customerCountry}</div>
                  )}
                </div>
                <div className="text-right">
                  <div>
                    <span className="text-zinc-500">Quotation No.: </span>
                    FF-Q{Date.now().toString().slice(-8)}
                  </div>
                  <div>
                    <span className="text-zinc-500">Date: </span>
                    {new Date().toISOString().slice(0, 10)}
                  </div>
                  <div>
                    <span className="text-zinc-500">Valid Until: </span>
                    {new Date(Date.now() + Number(validity) * 86400000)
                      .toISOString()
                      .slice(0, 10)}
                  </div>
                </div>
              </div>

              {/* Trade Terms */}
              <div className="rounded border border-zinc-300 p-2 mb-3 text-[9.5px]">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <div className="text-zinc-500">Trade Term / 贸易条款</div>
                    <div className="font-medium">
                      {tradeTerm} {tradeTerm === "FOB" || tradeTerm === "CIF" ? originPort : ""}
                    </div>
                  </div>
                  <div>
                    <div className="text-zinc-500">Port / 港口</div>
                    <div className="font-medium">
                      {originPort} → {destinationPort}
                    </div>
                  </div>
                  <div>
                    <div className="text-zinc-500">Payment / 付款</div>
                    <div className="font-medium text-[8.5px]">{paymentTerm}</div>
                  </div>
                </div>
              </div>

              {/* Items table */}
              <table className="w-full border-collapse text-[9.5px] mb-2">
                <thead>
                  <tr className="bg-zinc-100">
                    <th className="border border-zinc-300 px-1.5 py-1 text-left">No.</th>
                    <th className="border border-zinc-300 px-1.5 py-1 text-left">Description / 产品描述</th>
                    <th className="border border-zinc-300 px-1.5 py-1 text-right">Qty / 数量</th>
                    <th className="border border-zinc-300 px-1.5 py-1 text-right">Unit Price / 单价</th>
                    <th className="border border-zinc-300 px-1.5 py-1 text-right">Amount / 金额</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={item.id}>
                      <td className="border border-zinc-300 px-1.5 py-1 text-center">
                        {idx + 1}
                      </td>
                      <td className="border border-zinc-300 px-1.5 py-1">
                        <div className="font-medium">{item.productName}</div>
                        <div className="text-zinc-500 text-[8.5px]">
                          {item.model} · {item.spec}
                        </div>
                      </td>
                      <td className="border border-zinc-300 px-1.5 py-1 text-right">
                        {item.quantity.toLocaleString()} pcs
                      </td>
                      <td className="border border-zinc-300 px-1.5 py-1 text-right">
                        {currencyInfo?.symbol}
                        {item.unitPrice.toFixed(2)}
                      </td>
                      <td className="border border-zinc-300 px-1.5 py-1 text-right">
                        {currencyInfo?.symbol}
                        {(item.quantity * item.unitPrice).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="font-bold bg-zinc-50">
                    <td colSpan={4} className="border border-zinc-300 px-1.5 py-1 text-right">
                      Total Amount / 合计 ({currency})
                    </td>
                    <td className="border border-zinc-300 px-1.5 py-1 text-right">
                      {currencyInfo?.symbol}
                      {totalAmount.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>

              {/* Packing summary */}
              <div className="mb-2 rounded border border-zinc-300 p-2 text-[9.5px]">
                <div className="font-medium text-zinc-900 mb-1">Packing Information / 装箱信息</div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <div className="text-zinc-500">Total Cartons / 总箱数</div>
                    <div className="font-bold">{aggregatePacking.cartons} ctns</div>
                  </div>
                  <div>
                    <div className="text-zinc-500">Total Volume / 总体积</div>
                    <div className="font-bold">{aggregatePacking.volume.toFixed(3)} CBM</div>
                  </div>
                  <div>
                    <div className="text-zinc-500">Total G.W. / 总毛重</div>
                    <div className="font-bold">{aggregatePacking.grossWeight.toFixed(3)} T</div>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="text-[8.5px] text-zinc-600 leading-relaxed">
                <div className="font-medium text-zinc-900 mb-1">
                  Terms & Conditions / 条款说明:
                </div>
                <div>1. Price Term: {TRADE_TERM_DESCRIPTIONS[tradeTerm].en}</div>
                <div>2. Payment: {paymentTerm}</div>
                <div>3. Validity: This quotation is valid for {validity} days from the date above.</div>
                <div>4. Lead Time: To be confirmed upon order confirmation.</div>
                <div>5. 报价单有效期 {validity} 天，具体交期以订单确认为准。</div>
              </div>

              {/* Signature */}
              <div className="mt-3 grid grid-cols-2 gap-4 text-[9.5px]">
                <div>
                  <div className="border-t border-zinc-400 pt-1">Customer Signature / 客户签字</div>
                </div>
                <div>
                  <div className="border-t border-zinc-400 pt-1">Authorized Signature / 公司盖章</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 内部小组件
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
  type = "text",
  placeholder,
  step,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  step?: string;
}) => (
  <div>
    <label className="mb-1 block text-xs text-zinc-600">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      step={step}
      className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-sm focus:border-brand-500 focus:outline-none"
    />
  </div>
);

const SelectField = ({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) => (
  <div>
    <label className="mb-1 block text-xs text-zinc-600">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-sm focus:border-brand-500 focus:outline-none"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

const SmallField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <div>
    <label className="mb-0.5 block text-[10px] text-zinc-500">{label}</label>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded border border-zinc-200 bg-white px-1.5 py-1 text-xs focus:border-brand-500 focus:outline-none"
    />
  </div>
);
