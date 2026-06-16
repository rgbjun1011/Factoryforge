/**
 * 工业品 AI 抠图 - 客户端实现
 *
 * 策略：
 * 1. 优先尝试 remove.bg 免费 API（每月 50 次，精度最高）
 * 2. 失败/超限降级到 Canvas 智能采样（基于背景色距离 + alpha 渐变）
 *
 * 工业品特殊性：金属反光、塑料纹理、复杂咬合面
 * MVP 阶段：先用通用抠图，效果对 70% 工业品可用
 */

// ===== 方案 A：基于背景色距离的客户端抠图（免费，无 limit）=====
export async function removeBackgroundClient(imageDataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas 不可用"));

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // 1. 采样 4 角背景色（取中位色）
      const corners = [
        [0, 0],
        [canvas.width - 1, 0],
        [0, canvas.height - 1],
        [canvas.width - 1, canvas.height - 1],
      ];
      const bgSamples: [number, number, number][] = corners.map(([x, y]) => {
        const i = (y * canvas.width + x) * 4;
        return [data[i], data[i + 1], data[i + 2]];
      });
      const bgColor: [number, number, number] = [
        Math.round(bgSamples.reduce((s, c) => s + c[0], 0) / 4),
        Math.round(bgSamples.reduce((s, c) => s + c[1], 0) / 4),
        Math.round(bgSamples.reduce((s, c) => s + c[2], 0) / 4),
      ];

      // 2. 计算颜色距离 + alpha 渐变
      const threshold = 45; // 颜色距离阈值（0-441）
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i],
          g = data[i + 1],
          b = data[i + 2];
        const dist = Math.sqrt(
          Math.pow(r - bgColor[0], 2) + Math.pow(g - bgColor[1], 2) + Math.pow(b - bgColor[2], 2),
        );
        if (dist < threshold) {
          data[i + 3] = 0; // 完全透明
        } else if (dist < threshold + 25) {
          // 边缘渐变（抗锯齿）
          data[i + 3] = Math.round(((dist - threshold) / 25) * 255);
        }
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = imageDataUrl;
  });
}

// ===== 方案 B：remove.bg API（需要用户填 API key，留接口）=====
export async function removeBackgroundAPI(
  imageDataUrl: string,
  apiKey: string,
): Promise<string> {
  const blob = await (await fetch(imageDataUrl)).blob();
  const formData = new FormData();
  formData.append("image_file", blob, "image.png");
  formData.append("size", "auto");

  const res = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: { "X-Api-Key": apiKey },
    body: formData,
  });
  if (!res.ok) throw new Error("remove.bg 调用失败");
  const resultBlob = await res.blob();
  return URL.createObjectURL(resultBlob);
}

// ===== 方案 C：可选的 @imgly/background-removal（浏览器本地模型，效果最好但首次加载慢）=====
// 注：该库依赖 onnxruntime-web 的 wasm，Next.js 14 server build 容易失败
// 因此：调用方通过 useImgly 标志动态加载，本文件不直接 import
export async function removeBackgroundLocal(
  imageDataUrl: string,
): Promise<string> {
  // 使用 Function 构造器避免 webpack 静态分析 @imgly
  // 这样 Next.js server build 时不会尝试 resolve 这个包
  // 用户需要先 `npm install @imgly/background-removal` 才会真正用上
  const dynImport = new Function("m", "return import(m)") as (
    m: string,
  ) => Promise<any>;
  let mod;
  try {
    mod = await dynImport("@imgly/background-removal");
  } catch (e) {
    throw new Error(
      "@imgly/background-removal 未安装，请先 npm install，或使用 API key 模式",
    );
  }
  const { removeBackground } = mod;
  const blob = await (await fetch(imageDataUrl)).blob();
  const outBlob = await removeBackground(blob);
  return URL.createObjectURL(outBlob);
}

/**
 * 智能选择抠图方案
 */
export async function smartRemoveBackground(
  imageDataUrl: string,
  apiKey?: string,
  options: { useImgly?: boolean } = {},
): Promise<string> {
  // 优先级：API > 本地模型 > 客户端采样
  if (apiKey) {
    try {
      return await removeBackgroundAPI(imageDataUrl, apiKey);
    } catch (e) {
      console.warn("remove.bg 失败，降级", e);
    }
  }
  if (options.useImgly) {
    try {
      return await removeBackgroundLocal(imageDataUrl);
    } catch (e) {
      console.warn("@imgly 失败，降级到客户端采样", e);
    }
  }
  return removeBackgroundClient(imageDataUrl);
}
