/**
 * 工业品规格书模板
 * 每个分类提供：参数字段 + 默认值 + 单位 + 排序
 */

export type ParamField = {
  key: string;
  label: string;
  enLabel: string;
  type: "text" | "number" | "select" | "textarea";
  unit?: string;
  options?: string[];
  required?: boolean;
};

export type CategoryTemplate = {
  id: string;
  name: string;
  enName: string;
  description: string;
  fields: ParamField[];
};

export const CATEGORY_TEMPLATES: CategoryTemplate[] = [
  {
    id: "fastener",
    name: "紧固件",
    enName: "Fasteners",
    description: "螺栓/螺母/螺钉等",
    fields: [
      { key: "model", label: "型号", enLabel: "Model", type: "text", required: true },
      { key: "spec", label: "规格", enLabel: "Specification", type: "text", required: true },
      { key: "material", label: "材质", enLabel: "Material", type: "select", options: ["碳钢 Carbon Steel", "不锈钢 304 Stainless Steel 304", "不锈钢 316 Stainless Steel 316", "合金钢 Alloy Steel", "铜 Copper", "铝 Aluminum"] },
      { key: "surface", label: "表面处理", enLabel: "Surface Treatment", type: "select", options: ["镀锌 Galvanized", "发黑 Black Oxide", "达克罗 Dacromet", "镀镍 Nickel Plated", "本色 Plain"] },
      { key: "diameter", label: "直径", enLabel: "Diameter", type: "number", unit: "mm" },
      { key: "length", label: "长度", enLabel: "Length", type: "number", unit: "mm" },
      { key: "thread", label: "牙距", enLabel: "Thread Pitch", type: "number", unit: "mm" },
      { key: "head", label: "头部型式", enLabel: "Head Type", type: "select", options: ["外六角 Hex", "内六角 Socket", "十字 Phillips", "一字 Slotted", "梅花 Torx", "盘头 Pan", "沉头 Countersunk"] },
      { key: "strength", label: "强度等级", enLabel: "Strength Grade", type: "select", options: ["4.8", "8.8", "10.9", "12.9", "A2-70", "A4-80"] },
      { key: "moq", label: "起订量", enLabel: "MOQ", type: "number", unit: "pcs" },
      { key: "leadTime", label: "交期", enLabel: "Lead Time", type: "text" },
      { key: "cert", label: "认证", enLabel: "Certification", type: "text" },
      { key: "package", label: "包装", enLabel: "Package", type: "text" },
      { key: "remark", label: "备注", enLabel: "Remarks", type: "textarea" },
    ],
  },
  {
    id: "mechanical",
    name: "机械配件",
    enName: "Mechanical Parts",
    description: "轴承/齿轮/传动件等",
    fields: [
      { key: "model", label: "型号", enLabel: "Model", type: "text", required: true },
      { key: "type", label: "类型", enLabel: "Type", type: "text", required: true },
      { key: "material", label: "材质", enLabel: "Material", type: "text", required: true },
      { key: "od", label: "外径 OD", enLabel: "Outer Diameter", type: "number", unit: "mm" },
      { key: "id", label: "内径 ID", enLabel: "Inner Diameter", type: "number", unit: "mm" },
      { key: "width", label: "宽度", enLabel: "Width", type: "number", unit: "mm" },
      { key: "weight", label: "重量", enLabel: "Weight", type: "number", unit: "g" },
      { key: "hardness", label: "硬度", enLabel: "Hardness", type: "text" },
      { key: "tolerance", label: "公差", enLabel: "Tolerance", type: "text" },
      { key: "surface", label: "表面处理", enLabel: "Surface", type: "text" },
      { key: "load", label: "额定载荷", enLabel: "Rated Load", type: "text" },
      { key: "speed", label: "极限转速", enLabel: "Limit Speed", type: "number", unit: "rpm" },
      { key: "moq", label: "起订量", enLabel: "MOQ", type: "number" },
      { key: "leadTime", label: "交期", enLabel: "Lead Time", type: "text" },
      { key: "cert", label: "认证", enLabel: "Certification", type: "text" },
      { key: "remark", label: "备注", enLabel: "Remarks", type: "textarea" },
    ],
  },
  {
    id: "electrical",
    name: "电气元件",
    enName: "Electrical Components",
    description: "电机/控制器/传感器等",
    fields: [
      { key: "model", label: "型号", enLabel: "Model", type: "text", required: true },
      { key: "voltage", label: "额定电压", enLabel: "Rated Voltage", type: "text", required: true },
      { key: "current", label: "额定电流", enLabel: "Rated Current", type: "text" },
      { key: "power", label: "功率", enLabel: "Power", type: "text" },
      { key: "frequency", label: "频率", enLabel: "Frequency", type: "text" },
      { key: "material", label: "材质", enLabel: "Material", type: "text" },
      { key: "protection", label: "防护等级", enLabel: "IP Rating", type: "select", options: ["IP54", "IP55", "IP65", "IP66", "IP67", "IP68"] },
      { key: "tempRange", label: "工作温度", enLabel: "Operating Temp", type: "text" },
      { key: "lifespan", label: "使用寿命", enLabel: "Lifespan", type: "text" },
      { key: "cert", label: "认证", enLabel: "Certification", type: "text" },
      { key: "moq", label: "起订量", enLabel: "MOQ", type: "number" },
      { key: "leadTime", label: "交期", enLabel: "Lead Time", type: "text" },
      { key: "remark", label: "备注", enLabel: "Remarks", type: "textarea" },
    ],
  },
  {
    id: "textile",
    name: "纺织面料",
    enName: "Textile & Fabric",
    description: "布料/纱线/成品等",
    fields: [
      { key: "name", label: "品名", enLabel: "Product Name", type: "text", required: true },
      { key: "composition", label: "成分", enLabel: "Composition", type: "text", required: true },
      { key: "weight", label: "克重", enLabel: "Weight", type: "number", unit: "g/m²" },
      { key: "width", label: "幅宽", enLabel: "Width", type: "number", unit: "cm" },
      { key: "weave", label: "织造方式", enLabel: "Weave", type: "select", options: ["平纹 Plain", "斜纹 Twill", "缎纹 Satin", "针织 Knit", "无纺 Non-woven"] },
      { key: "yarnCount", label: "纱支", enLabel: "Yarn Count", type: "text" },
      { key: "density", label: "密度", enLabel: "Density", type: "text" },
      { key: "color", label: "颜色", enLabel: "Color", type: "text" },
      { key: "feature", label: "特性", enLabel: "Features", type: "text" },
      { key: "usage", label: "用途", enLabel: "Application", type: "text" },
      { key: "moq", label: "起订量", enLabel: "MOQ", type: "number" },
      { key: "leadTime", label: "交期", enLabel: "Lead Time", type: "text" },
      { key: "cert", label: "认证", enLabel: "Certification", type: "text" },
      { key: "remark", label: "备注", enLabel: "Remarks", type: "textarea" },
    ],
  },
  {
    id: "building",
    name: "建材",
    enName: "Building Materials",
    description: "管材/板材/型材等",
    fields: [
      { key: "model", label: "型号", enLabel: "Model", type: "text", required: true },
      { key: "material", label: "材质", enLabel: "Material", type: "text", required: true },
      { key: "spec", label: "规格", enLabel: "Specification", type: "text", required: true },
      { key: "length", label: "长度", enLabel: "Length", type: "number", unit: "m" },
      { key: "width", label: "宽度", enLabel: "Width", type: "number", unit: "mm" },
      { key: "thickness", label: "厚度", enLabel: "Thickness", type: "number", unit: "mm" },
      { key: "weight", label: "米重", enLabel: "Weight per Meter", type: "number", unit: "kg/m" },
      { key: "surface", label: "表面处理", enLabel: "Surface", type: "text" },
      { key: "color", label: "颜色", enLabel: "Color", type: "text" },
      { key: "loadCapacity", label: "承载力", enLabel: "Load Capacity", type: "text" },
      { key: "moq", label: "起订量", enLabel: "MOQ", type: "number" },
      { key: "leadTime", label: "交期", enLabel: "Lead Time", type: "text" },
      { key: "cert", label: "认证", enLabel: "Certification", type: "text" },
      { key: "remark", label: "备注", enLabel: "Remarks", type: "textarea" },
    ],
  },
  {
    id: "general",
    name: "通用",
    enName: "General",
    description: "自定义参数",
    fields: [
      { key: "name", label: "产品名称", enLabel: "Product Name", type: "text", required: true },
      { key: "model", label: "型号", enLabel: "Model", type: "text" },
      { key: "material", label: "材质", enLabel: "Material", type: "text" },
      { key: "spec", label: "规格", enLabel: "Specification", type: "text" },
      { key: "moq", label: "起订量", enLabel: "MOQ", type: "number" },
      { key: "leadTime", label: "交期", enLabel: "Lead Time", type: "text" },
      { key: "cert", label: "认证", enLabel: "Certification", type: "text" },
      { key: "remark", label: "备注", enLabel: "Remarks", type: "textarea" },
    ],
  },
];
