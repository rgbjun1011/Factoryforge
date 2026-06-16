/**
 * 白底精修 - 将抠图结果合成到纯白底
 * 符合阿里国际站 800x800 纯白底标准
 */

export interface WhiteBgOptions {
  size?: number; // 输出尺寸（默认 800）
  padding?: number; // 内边距比例 0-0.5（默认 0.1）
  bgColor?: string; // 背景色（默认纯白）
}

export async function composeWhiteBackground(
  transparentImageUrl: string,
  options: WhiteBgOptions = {},
): Promise<string> {
  const { size = 800, padding = 0.1, bgColor = "#ffffff" } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas 不可用"));

      // 1. 纯白底
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, size, size);

      // 2. 等比缩放 + 居中
      const availableSize = size * (1 - padding * 2);
      const scale = Math.min(availableSize / img.width, availableSize / img.height);
      const drawW = img.width * scale;
      const drawH = img.height * scale;
      const x = (size - drawW) / 2;
      const y = (size - drawH) / 2;

      ctx.drawImage(img, x, y, drawW, drawH);
      resolve(canvas.toDataURL("image/jpeg", 0.92));
    };
    img.onerror = reject;
    img.src = transparentImageUrl;
  });
}
