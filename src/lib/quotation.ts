/**
 * 询盘报价单 - 贸易条款 / 装箱计算
 */

export type TradeTerm = "FOB" | "CIF" | "EXW" | "DDP";

export const TRADE_TERM_DESCRIPTIONS: Record<TradeTerm, { cn: string; en: string }> = {
  FOB: {
    cn: "船上交货价（指定装运港）",
    en: "Free On Board (Named Port of Shipment)",
  },
  CIF: {
    cn: "成本加保险费、运费（指定目的港）",
    en: "Cost, Insurance & Freight (Named Port of Destination)",
  },
  EXW: {
    cn: "工厂交货价",
    en: "Ex Works (Named Place)",
  },
  DDP: {
    cn: "完税后交货（指定目的地）",
    en: "Delivered Duty Paid (Named Place of Destination)",
  },
};

export const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
  { code: "RUB", symbol: "₽", name: "Russian Ruble" },
];

export const COMMON_PORTS = [
  "Shanghai 上海", "Ningbo 宁波", "Shenzhen 深圳", "Qingdao 青岛", "Guangzhou 广州",
  "Tianjin 天津", "Xiamen 厦门", "Hong Kong 香港",
  "Rotterdam 鹿特丹", "Hamburg 汉堡", "Los Angeles 洛杉矶", "New York 纽约",
  "Dubai 迪拜", "Singapore 新加坡", "Mumbai 孟买", "Santos 桑托斯", "Istanbul 伊斯坦布尔",
];

export interface PackingInput {
  unitsPerCarton: number; // 单箱数量
  totalQuantity: number; // 总数量
  cartonSize: { l: number; w: number; h: number }; // 单箱尺寸 cm
  netWeight: number; // 单件净重 kg
  grossWeight: number; // 单箱毛重 kg
}

export interface PackingResult {
  totalCartons: number;
  totalVolume: number; // CBM
  totalNetWeight: number;
  totalGrossWeight: number;
  cartonsPer20ft: number;
  cartonsPer40ft: number;
  cartonsPer40hq: number;
}

export function calculatePacking(input: PackingInput): PackingResult {
  const { unitsPerCarton, totalQuantity, cartonSize, netWeight, grossWeight } = input;
  const totalCartons = Math.ceil(totalQuantity / unitsPerCarton);
  const cartonVolume = (cartonSize.l * cartonSize.w * cartonSize.h) / 1000000; // cm³ → m³
  const totalVolume = totalCartons * cartonVolume;
  const totalNetWeight = (totalQuantity * netWeight) / 1000; // 转为吨
  const totalGrossWeight = (totalCartons * grossWeight) / 1000;

  // 标准 20ft 柜 ≈ 28 CBM, 40ft 柜 ≈ 58 CBM, 40HQ ≈ 68 CBM
  const cartonsPer20ft = Math.floor(28 / cartonVolume);
  const cartonsPer40ft = Math.floor(58 / cartonVolume);
  const cartonsPer40hq = Math.floor(68 / cartonVolume);

  return {
    totalCartons,
    totalVolume: parseFloat(totalVolume.toFixed(3)),
    totalNetWeight: parseFloat(totalNetWeight.toFixed(3)),
    totalGrossWeight: parseFloat(totalGrossWeight.toFixed(3)),
    cartonsPer20ft,
    cartonsPer40ft,
    cartonsPer40hq,
  };
}

/**
 * 交期计算
 */
export function calculateLeadTime(dailyCapacity: number, orderQty: number, prepDays = 7): string {
  if (dailyCapacity <= 0) return "待确认";
  const productionDays = Math.ceil(orderQty / dailyCapacity);
  const totalDays = prepDays + productionDays;
  return `${totalDays} 天（约 ${prepDays} 天备料 + ${productionDays} 天生产）`;
}
