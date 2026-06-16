/**
 * 通用 PDF 导出（jsPDF + html2canvas）
 */
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function exportElementToPDF(
  element: HTMLElement,
  filename: string,
  options: { landscape?: boolean; scale?: number } = {},
): Promise<void> {
  const { landscape = false, scale = 2 } = options;
  const canvas = await html2canvas(element, {
    scale,
    backgroundColor: "#ffffff",
    useCORS: true,
    logging: false,
  });
  const imgData = canvas.toDataURL("image/jpeg", 0.92);
  const pdf = new jsPDF({
    orientation: landscape ? "landscape" : "portrait",
    unit: "mm",
    format: "a4",
  });
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pdfWidth;
  const imgHeight = (canvas.height * pdfWidth) / canvas.width;
  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
  heightLeft -= pdfHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
  }
  pdf.save(filename);
}

/**
 * 多图片打包下载
 */
import JSZip from "jszip";

export async function downloadImagesAsZip(
  images: { name: string; dataUrl: string }[],
  zipName: string,
): Promise<void> {
  const zip = new JSZip();
  images.forEach((img) => {
    const base64 = img.dataUrl.split(",")[1];
    zip.file(img.name, base64, { base64: true });
  });
  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = zipName;
  a.click();
  URL.revokeObjectURL(url);
}
