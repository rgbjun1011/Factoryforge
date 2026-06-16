# 工坊智造 FactoryForge

> 面向传统外贸工厂的 AI 工业品素材工具 · 内部 MVP v0.1

## 这是什么

手机拍一张 → AI 抠图 → 白底精修 → 场景合成 + 比例参照，三件套一次出
配合双语规格书、询盘报价单、多语言目录、工厂能力展示，让外贸工厂老板也能产出"上市公司级"营销素材。

## 5 大核心模块

| 模块 | 路径 | 功能 |
|---|---|---|
| 智能工业摄影 | `/photo` | 上传 → 抠图 → 白底 800×800 → 场景合成 → 比例参照图 |
| 双语规格书 | `/spec` | 6 个分类模板（紧固件/机械/电气/纺织/建材/通用）→ A4 PDF |
| 询盘报价单 | `/quote` | FOB/CIF/EXW/DDP 模板 + 装箱自动计算 → 正式报价单 PDF |
| 工厂能力展示 | `/factory` | 产线数据 + 设备清单 + 认证墙 → 一页纸 PDF |
| 多语言目录 | `/catalog` | 英/西/阿/俄/葡 5 语种（支持 RTL）→ 多语种 PDF |

## 技术栈

- **Next.js 14.2.33** (App Router)
- **React 18 + TypeScript**
- **Tailwind CSS**
- **lucide-react 0.460.0**（注意：必须显式指定版本，npm 上有同名冒名包）
- **jsPDF + html2canvas**（PDF 导出）
- **JSZip**（多图打包下载）

## 启动

```bash
cd factoryforge-app
npm install
npm run dev      # http://localhost:3000
# 或
npm run build && npm start
```

## 关键技术决策

### 为什么不用 server API route？

Next.js 14 在使用 `app/(group)/...` route group 时，`app/api/*/route.ts` 可能在 dev 和 prod 都不被 pickup。
本项目所有第三方 API 调用都走客户端 + CORS-enabled 服务（Pollinations / Unsplash 等都支持 CORS），
避开这个 bug，部署也简单。

### AI 抠图的三档方案

1. **remove.bg API**（用户填 key）— 精度最高，免费 50 次/月
2. **@imgly/background-removal** — 浏览器本地 ML，免费无限制，但首次加载慢
3. **纯 Canvas 采样** — 0 依赖，效果对纯色背景够用

默认走方案 3（Canvas 采样），需要时升级到 1/2。

### 工业场景的 6 个内置模板

不依赖外链图库，全部用 Canvas 渐变 + 几何绘制生成。
后期接 Pollinations / Unsplash 替换。

## 项目结构

```
factoryforge-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # 全局布局
│   │   ├── page.tsx            # 首页
│   │   ├── photo/page.tsx      # 智能工业摄影
│   │   ├── spec/page.tsx       # 双语规格书
│   │   ├── quote/page.tsx      # 询盘报价单
│   │   ├── factory/page.tsx    # 工厂能力展示
│   │   ├── catalog/page.tsx    # 多语言目录
│   │   └── globals.css
│   ├── components/
│   │   └── Nav.tsx             # 顶部导航 + 移动端 tab
│   └── lib/
│       ├── bg-removal.ts       # 抠图（3 档方案）
│       ├── white-bg.ts         # 白底精修
│       ├── scene.ts            # 场景合成 + 比例参照
│       ├── spec-templates.ts   # 6 个产品规格书模板
│       ├── quotation.ts        # 贸易条款 + 装箱计算
│       └── pdf-export.ts       # jsPDF 导出 + ZIP 打包
├── package.json
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

## 已知限制

- **PPT/Word 导出**：当前只支持 PDF
- **真正的 RTL 排版引擎**：阿拉伯语 PDF 是浏览器原生 dir=rtl，效果 OK 但不完美
- **AI 虚拟参观视频**：P1 阶段暂未实现
- **OCR 参数录入**：P2 阶段

## 后续路线（对应 PRD 文档）

- [ ] P1: 工业术语翻译引擎（中→英、西、俄、葡、阿）
- [ ] P1: 拍照 OCR 录入参数
- [ ] P1: 实时汇率 API（exchangerate-api.com 免费层）
- [ ] P2: 真正基于 ML 的工业品抠图模型
- [ ] P2: 多工厂协作版
- [ ] P3: 阿里国际站 API 直传对接
