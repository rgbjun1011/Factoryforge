/**
 * 工业场景合成 - 把白底图合成到预设场景中
 * 使用预设的免版权场景图（车间/展台/质检台等）
 */

// 内置 6 个场景（用 gradient + CSS 模拟，避免外链依赖）
export const SCENE_TEMPLATES = [
  {
    id: "workshop",
    name: "生产车间",
    description: "工业感强，适合机械/金属件",
    icon: "🏭",
    // 渐变背景 + 地面投影，模拟车间
    render: (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "#e2e8f0");
      grad.addColorStop(0.6, "#cbd5e1");
      grad.addColorStop(1, "#94a3b8");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      // 地面线
      ctx.strokeStyle = "#64748b";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.65);
      ctx.lineTo(w, h * 0.65);
      ctx.stroke();
      // 透视网格
      for (let i = 1; i < 6; i++) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(100,116,139,0.15)";
        ctx.moveTo((w / 6) * i, h * 0.65);
        ctx.lineTo((w / 6) * i - 80, h);
        ctx.stroke();
      }
    },
  },
  {
    id: "showroom",
    name: "产品展台",
    description: "干净专业，适合消费品类工业品",
    icon: "✨",
    render: (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "#f8fafc");
      grad.addColorStop(1, "#e2e8f0");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      // 圆形展台
      const cx = w / 2;
      const cy = h * 0.7;
      const r = Math.min(w, h) * 0.3;
      const stageGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      stageGrad.addColorStop(0, "#ffffff");
      stageGrad.addColorStop(1, "#cbd5e1");
      ctx.fillStyle = stageGrad;
      ctx.beginPath();
      ctx.ellipse(cx, cy, r * 1.4, r * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  {
    id: "qc",
    name: "质检台",
    description: "突出严谨专业",
    icon: "🔍",
    render: (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, w, h);
      // 桌面
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(0, h * 0.7, w, h * 0.3);
      // 灯带
      ctx.fillStyle = "rgba(34,197,94,0.4)";
      ctx.fillRect(0, h * 0.7 - 2, w, 2);
    },
  },
  {
    id: "warehouse",
    name: "仓储货架",
    description: "实物感强",
    icon: "📦",
    render: (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "#fef3c7");
      grad.addColorStop(1, "#fbbf24");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      // 货架线
      ctx.strokeStyle = "#92400e";
      ctx.lineWidth = 2;
      for (let i = 1; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(0, (h / 4) * i);
        ctx.lineTo(w, (h / 4) * i);
        ctx.stroke();
      }
    },
  },
  {
    id: "pallet",
    name: "托盘出货",
    description: "出口场景",
    icon: "🛬",
    render: (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      ctx.fillStyle = "#f1f5f9";
      ctx.fillRect(0, 0, w, h);
      // 托盘
      ctx.fillStyle = "#a16207";
      const ph = h * 0.15;
      ctx.fillRect(w * 0.1, h * 0.7, w * 0.8, ph);
      // 木纹
      ctx.strokeStyle = "#854d0e";
      ctx.lineWidth = 1;
      for (let i = 0; i < 8; i++) {
        const x = w * 0.1 + (i * w * 0.1);
        ctx.beginPath();
        ctx.moveTo(x, h * 0.7);
        ctx.lineTo(x, h * 0.7 + ph);
        ctx.stroke();
      }
    },
  },
  {
    id: "outdoor",
    name: "户外应用",
    description: "适合建材/机械等重型设备",
    icon: "🌤️",
    render: (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "#7dd3fc");
      grad.addColorStop(0.5, "#bae6fd");
      grad.addColorStop(0.5, "#86efac");
      grad.addColorStop(1, "#16a34a");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    },
  },
];

/**
 * 合成产品到场景
 */
export async function composeScene(
  productImageUrl: string,
  sceneId: string,
  options: { width?: number; height?: number; shadow?: boolean } = {},
): Promise<string> {
  const { width = 1600, height = 1200, shadow = true } = options;

  return new Promise((resolve, reject) => {
    const scene = SCENE_TEMPLATES.find((s) => s.id === sceneId) || SCENE_TEMPLATES[0];

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return reject(new Error("Canvas 不可用"));

    // 1. 渲染场景底图
    scene.render(ctx, width, height);

    // 2. 加载产品图并合成
    const productImg = new Image();
    productImg.crossOrigin = "anonymous";
    productImg.onload = () => {
      const productSize = Math.min(width, height) * 0.45;
      const scale = Math.min(productSize / productImg.width, productSize / productImg.height);
      const drawW = productImg.width * scale;
      const drawH = productImg.height * scale;
      const x = (width - drawW) / 2;
      const y = height * 0.5 - drawH / 2;

      // 3. 投影（模拟）
      if (shadow) {
        ctx.save();
        ctx.fillStyle = "rgba(0,0,0,0.18)";
        ctx.beginPath();
        ctx.ellipse(
          x + drawW / 2,
          y + drawH + 10,
          drawW * 0.4,
          15,
          0,
          0,
          Math.PI * 2,
        );
        ctx.fill();
        ctx.restore();
      }

      ctx.drawImage(productImg, x, y, drawW, drawH);
      resolve(canvas.toDataURL("image/jpeg", 0.9));
    };
    productImg.onerror = reject;
    productImg.src = productImageUrl;
  });
}

/**
 * 比例参照图 - 在白底图上叠加标准参照物
 */
export async function composeScaleReference(
  productImageUrl: string,
  refType: "coin" | "caliper" | "hand" = "coin",
): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1000;
    canvas.height = 1000;
    const ctx = canvas.getContext("2d");
    if (!ctx) return reject(new Error("Canvas 不可用"));

    // 白底
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 1000, 1000);

    const productImg = new Image();
    productImg.crossOrigin = "anonymous";
    productImg.onload = () => {
      // 产品居中
      const size = 600;
      const scale = Math.min(size / productImg.width, size / productImg.height);
      const drawW = productImg.width * scale;
      const drawH = productImg.height * scale;
      const x = (1000 - drawW) / 2;
      const y = (1000 - drawH) / 2 - 50;
      ctx.drawImage(productImg, x, y, drawW, drawH);

      // 比例尺（左下角）
      const refSize = 80;
      const refX = 80;
      const refY = 850;

      if (refType === "coin") {
        // 1 元硬币（直径 2.5cm）
        ctx.fillStyle = "#fbbf24";
        ctx.beginPath();
        ctx.arc(refX + refSize / 2, refY + refSize / 2, refSize / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#92400e";
        ctx.font = "bold 28px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("¥1", refX + refSize / 2, refY + refSize / 2);
      } else if (refType === "caliper") {
        // 游标卡尺示意
        ctx.fillStyle = "#475569";
        ctx.fillRect(refX, refY + refSize / 2 - 5, refSize, 10);
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(refX, refY, 15, refSize);
        // 刻度
        ctx.fillStyle = "#1e293b";
        for (let i = 0; i < 5; i++) {
          ctx.fillRect(refX + 20 + i * 12, refY + refSize / 2 - 8, 1, 6);
        }
      } else {
        // 手掌（简笔画）
        ctx.fillStyle = "#fde68a";
        ctx.beginPath();
        ctx.ellipse(refX + refSize / 2, refY + refSize / 2, refSize / 2, refSize / 2.5, 0, 0, Math.PI * 2);
        ctx.fill();
        // 手指
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.ellipse(
            refX + 15 + i * 15,
            refY + 10,
            6,
            12,
            0,
            0,
            Math.PI * 2,
          );
          ctx.fill();
        }
      }

      // 标注
      ctx.fillStyle = "#1e293b";
      ctx.font = "16px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(
        refType === "coin" ? "1 元硬币 ≈ 2.5cm" : refType === "caliper" ? "游标卡尺" : "成人手掌",
        refX,
        refY + refSize + 25,
      );

      resolve(canvas.toDataURL("image/jpeg", 0.92));
    };
    productImg.onerror = reject;
    productImg.src = productImageUrl;
  });
}
