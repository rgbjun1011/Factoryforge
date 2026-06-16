"use client";

import { useState, useCallback, useRef } from "react";
import {
  Upload,
  Download,
  Loader2,
  ImageIcon,
  Sparkles,
  RefreshCw,
  Coins,
  Ruler,
  Hand,
  Package,
} from "lucide-react";
import Nav from "@/components/Nav";
import { smartRemoveBackground } from "@/lib/bg-removal";
import { composeWhiteBackground } from "@/lib/white-bg";
import { composeScene, composeScaleReference, SCENE_TEMPLATES } from "@/lib/scene";
import { downloadImagesAsZip } from "@/lib/pdf-export";

type Step = "upload" | "processing" | "result";

export default function PhotoPage() {
  const [step, setStep] = useState<Step>("upload");
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [cutoutUrl, setCutoutUrl] = useState<string | null>(null);
  const [whiteBgUrl, setWhiteBgUrl] = useState<string | null>(null);
  const [sceneUrl, setSceneUrl] = useState<string | null>(null);
  const [scaleUrl, setScaleUrl] = useState<string | null>(null);
  const [selectedScene, setSelectedScene] = useState("workshop");
  const [scaleType, setScaleType] = useState<"coin" | "caliper" | "hand">("coin");
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setStep("upload");
    setOriginalUrl(null);
    setCutoutUrl(null);
    setWhiteBgUrl(null);
    setSceneUrl(null);
    setScaleUrl(null);
    setProgress(0);
    setStatusText("");
    setError(null);
  };

  const processImage = useCallback(
    async (dataUrl: string) => {
      setStep("processing");
      setError(null);
      setProgress(10);
      setStatusText("正在分析图像...");

      try {
        setProgress(20);
        setStatusText("AI 智能抠图中...");
        const cutout = await smartRemoveBackground(dataUrl);
        setCutoutUrl(cutout);
        setProgress(50);

        setStatusText("白底精修中...");
        const white = await composeWhiteBackground(cutout, { size: 800 });
        setWhiteBgUrl(white);
        setProgress(70);

        setStatusText("场景合成中...");
        const scene = await composeScene(cutout, selectedScene, {
          width: 1600,
          height: 1200,
        });
        setSceneUrl(scene);
        setProgress(85);

        setStatusText("比例参照图生成中...");
        const scale = await composeScaleReference(white, scaleType);
        setScaleUrl(scale);
        setProgress(100);

        setStatusText("完成！");
        setTimeout(() => setStep("result"), 400);
      } catch (e) {
        console.error(e);
        setError("处理失败，请重试或换张图");
        setStep("upload");
      }
    },
    [selectedScene, scaleType],
  );

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("请上传图片文件");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError("文件太大，最大 20MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setOriginalUrl(dataUrl);
      processImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDownloadAll = async () => {
    const files: { name: string; dataUrl: string }[] = [];
    if (cutoutUrl) files.push({ name: "01-透明底.png", dataUrl: cutoutUrl });
    if (whiteBgUrl) files.push({ name: "02-白底图-800x800.jpg", dataUrl: whiteBgUrl });
    if (sceneUrl) files.push({ name: "03-场景图-1600x1200.jpg", dataUrl: sceneUrl });
    if (scaleUrl) files.push({ name: "04-比例参照图.jpg", dataUrl: scaleUrl });
    if (files.length) {
      await downloadImagesAsZip(files, "factoryforge-photo-pack.zip");
    }
  };

  // 当用户改场景/比例尺时，单独重新生成对应图
  const regenerateScene = async () => {
    if (!cutoutUrl) return;
    setStatusText("重新合成场景...");
    const scene = await composeScene(cutoutUrl, selectedScene, {
      width: 1600,
      height: 1200,
    });
    setSceneUrl(scene);
    setStatusText("");
  };

  const regenerateScale = async () => {
    if (!whiteBgUrl) return;
    setStatusText("重新生成比例参照...");
    const scale = await composeScaleReference(whiteBgUrl, scaleType);
    setScaleUrl(scale);
    setStatusText("");
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <Nav />

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900">智能工业摄影</h1>
          <p className="mt-1 text-sm text-zinc-500">
            手机拍一张 → AI 抠图 → 白底精修 → 场景合成 + 比例参照，三件套一次出
          </p>
        </div>

        {step === "upload" && (
          <UploadView
            dragging={dragging}
            onDrop={onDrop}
            setDragging={setDragging}
            onPick={() => fileInputRef.current?.click()}
            error={error}
            ref={fileInputRef}
            onFile={handleFile}
          />
        )}

        {step === "processing" && (
          <ProcessingView
            originalUrl={originalUrl!}
            progress={progress}
            status={statusText}
          />
        )}

        {step === "result" && (
          <ResultView
            originalUrl={originalUrl!}
            cutoutUrl={cutoutUrl}
            whiteBgUrl={whiteBgUrl}
            sceneUrl={sceneUrl}
            scaleUrl={scaleUrl}
            selectedScene={selectedScene}
            setSelectedScene={setSelectedScene}
            scaleType={scaleType}
            setScaleType={setScaleType}
            onReset={reset}
            onRegenerateScene={regenerateScene}
            onRegenerateScale={regenerateScale}
            onDownloadAll={handleDownloadAll}
            statusText={statusText}
          />
        )}
      </div>
    </div>
  );
}

// ============ 子组件 ============

const UploadView = (
  {
    dragging,
    onDrop,
    setDragging,
    onPick,
    error,
    ref,
    onFile,
  }: {
    dragging: boolean;
    onDrop: (e: React.DragEvent) => void;
    setDragging: (b: boolean) => void;
    onPick: () => void;
    error: string | null;
    ref: React.Ref<HTMLInputElement>;
    onFile: (f: File) => void;
  },
) => (
  <div className="grid gap-6 md:grid-cols-3">
    <div className="md:col-span-2">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={onPick}
        className={`upload-zone ${dragging ? "dragging" : ""} flex aspect-video cursor-pointer flex-col items-center justify-center rounded-2xl bg-white p-12 text-center transition`}
      >
        <input
          ref={ref}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
        />
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <Upload className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-zinc-900">拖拽或点击上传</h3>
        <p className="mt-1 text-sm text-zinc-500">支持 JPG / PNG / HEIC，最大 20MB</p>
        <p className="mt-3 text-xs text-zinc-400">建议：自然光下拍摄，产品占画面 60% 以上</p>
      </div>
      {error && (
        <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}
    </div>

    <div className="space-y-3">
      <h3 className="text-sm font-medium text-zinc-700">拍照小贴士</h3>
      {[
        { icon: "💡", title: "自然光最佳", desc: "避免顶光，金属件容易过曝" },
        { icon: "📐", title: "占满画面", desc: "产品占 60%+，留 10% 边距" },
        { icon: "🎯", title: "保持水平", desc: "主体放中央，水平线对齐" },
        { icon: "🚫", title: "避免杂物", desc: "先清理背景再拍" },
      ].map((t, i) => (
        <div key={i} className="rounded-lg border border-zinc-200 bg-white p-3">
          <div className="text-lg">{t.icon}</div>
          <div className="mt-1 text-sm font-medium text-zinc-900">{t.title}</div>
          <div className="text-xs text-zinc-500">{t.desc}</div>
        </div>
      ))}
    </div>
  </div>
);

const ProcessingView = ({
  originalUrl,
  progress,
  status,
}: {
  originalUrl: string;
  progress: number;
  status: string;
}) => (
  <div className="rounded-2xl border border-zinc-200 bg-white p-8">
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <img
          src={originalUrl}
          alt="原图"
          className="w-full rounded-xl border border-zinc-200"
        />
        <p className="mt-2 text-center text-xs text-zinc-500">原图</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-brand-600" />
        <div className="mt-4 text-lg font-medium text-zinc-900">{status}</div>
        <div className="mt-4 w-full max-w-sm">
          <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 text-center text-xs text-zinc-500">{progress}%</div>
        </div>
      </div>
    </div>
  </div>
);

const ResultView = ({
  originalUrl,
  cutoutUrl,
  whiteBgUrl,
  sceneUrl,
  scaleUrl,
  selectedScene,
  setSelectedScene,
  scaleType,
  setScaleType,
  onReset,
  onRegenerateScene,
  onRegenerateScale,
  onDownloadAll,
  statusText,
}: {
  originalUrl: string;
  cutoutUrl: string | null;
  whiteBgUrl: string | null;
  sceneUrl: string | null;
  scaleUrl: string | null;
  selectedScene: string;
  setSelectedScene: (s: string) => void;
  scaleType: "coin" | "caliper" | "hand";
  setScaleType: (s: "coin" | "caliper" | "hand") => void;
  onReset: () => void;
  onRegenerateScene: () => void;
  onRegenerateScale: () => void;
  onDownloadAll: () => void;
  statusText: string;
}) => (
  <div className="space-y-6">
    {/* 操作栏 */}
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white p-4">
      <div className="flex items-center gap-2 text-sm text-zinc-600">
        <Sparkles className="h-4 w-4 text-brand-600" />
        处理完成！共生成 4 张素材图
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm hover:bg-zinc-50"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          重新上传
        </button>
        <button
          onClick={onDownloadAll}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-sm text-white hover:bg-brand-700"
        >
          <Package className="h-3.5 w-3.5" />
          打包下载 ZIP
        </button>
      </div>
    </div>

    {/* 对比展示 */}
    <div className="grid gap-4 lg:grid-cols-2">
      <ResultCard title="原图" subtitle="用户上传">
        <img src={originalUrl} className="w-full" alt="原图" />
      </ResultCard>

      <ResultCard
        title="透明底 PNG"
        subtitle="用于二次合成"
        downloadName="01-透明底.png"
        dataUrl={cutoutUrl}
      >
        {cutoutUrl ? (
          <div className="checker-bg">
            <img src={cutoutUrl} className="w-full" alt="透明底" />
          </div>
        ) : (
          <EmptyImg />
        )}
      </ResultCard>

      <ResultCard
        title="白底图 800×800"
        subtitle="符合阿里国际站/亚马逊B2B 上架标准"
        downloadName="02-白底图-800x800.jpg"
        dataUrl={whiteBgUrl}
      >
        {whiteBgUrl ? (
          <img src={whiteBgUrl} className="w-full" alt="白底图" />
        ) : (
          <EmptyImg />
        )}
      </ResultCard>

      {/* 场景图 + 控制 */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-sm font-semibold text-zinc-900">场景图 1600×1200</div>
            <div className="text-xs text-zinc-500">产品+环境，社交媒体友好</div>
          </div>
          {sceneUrl && (
            <a
              href={sceneUrl}
              download="03-场景图.jpg"
              className="inline-flex items-center gap-1 rounded-lg bg-zinc-100 px-2 py-1 text-xs hover:bg-zinc-200"
            >
              <Download className="h-3 w-3" /> 下载
            </a>
          )}
        </div>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {SCENE_TEMPLATES.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setSelectedScene(s.id);
              }}
              className={`rounded-lg border px-2.5 py-1 text-xs ${
                selectedScene === s.id
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
              }`}
            >
              {s.icon} {s.name}
            </button>
          ))}
          <button
            onClick={onRegenerateScene}
            className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-600 hover:bg-zinc-50"
          >
            {statusText || "重新生成"}
          </button>
        </div>
        <div className="overflow-hidden rounded-xl border border-zinc-200">
          {sceneUrl ? (
            <img src={sceneUrl} className="w-full" alt="场景图" />
          ) : (
            <EmptyImg />
          )}
        </div>
      </div>

      {/* 比例参照图 + 控制 */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 lg:col-span-2">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-sm font-semibold text-zinc-900">比例参照图</div>
            <div className="text-xs text-zinc-500">让买家一眼知道产品尺寸</div>
          </div>
          {scaleUrl && (
            <a
              href={scaleUrl}
              download="04-比例参照图.jpg"
              className="inline-flex items-center gap-1 rounded-lg bg-zinc-100 px-2 py-1 text-xs hover:bg-zinc-200"
            >
              <Download className="h-3 w-3" /> 下载
            </a>
          )}
        </div>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {[
            { id: "coin" as const, icon: <Coins className="h-3.5 w-3.5" />, name: "1元硬币" },
            { id: "caliper" as const, icon: <Ruler className="h-3.5 w-3.5" />, name: "游标卡尺" },
            { id: "hand" as const, icon: <Hand className="h-3.5 w-3.5" />, name: "成人手掌" },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setScaleType(s.id)}
              className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs ${
                scaleType === s.id
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
              }`}
            >
              {s.icon} {s.name}
            </button>
          ))}
          <button
            onClick={onRegenerateScale}
            className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-600 hover:bg-zinc-50"
          >
            重新生成
          </button>
        </div>
        <div className="mx-auto max-w-md overflow-hidden rounded-xl border border-zinc-200">
          {scaleUrl ? (
            <img src={scaleUrl} className="w-full" alt="比例参照" />
          ) : (
            <EmptyImg />
          )}
        </div>
      </div>
    </div>
  </div>
);

const ResultCard = ({
  title,
  subtitle,
  children,
  downloadName,
  dataUrl,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  downloadName?: string;
  dataUrl?: string | null;
}) => (
  <div className="rounded-2xl border border-zinc-200 bg-white p-4">
    <div className="flex items-center justify-between mb-3">
      <div>
        <div className="text-sm font-semibold text-zinc-900">{title}</div>
        <div className="text-xs text-zinc-500">{subtitle}</div>
      </div>
      {dataUrl && downloadName && (
        <a
          href={dataUrl}
          download={downloadName}
          className="inline-flex items-center gap-1 rounded-lg bg-zinc-100 px-2 py-1 text-xs hover:bg-zinc-200"
        >
          <Download className="h-3 w-3" /> 下载
        </a>
      )}
    </div>
    <div className="overflow-hidden rounded-xl border border-zinc-200">{children}</div>
  </div>
);

const EmptyImg = () => (
  <div className="flex aspect-video items-center justify-center bg-zinc-50 text-zinc-300">
    <ImageIcon className="h-10 w-10" />
  </div>
);
