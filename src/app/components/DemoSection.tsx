import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  Instagram,
  Share2,
  Link2,
  MessageCircle,
  Send,
  Check,
  Sparkles,
} from "lucide-react";
import { createSharedLink, fetchSharedLink, type SharedLinkContent } from "../../lib/shareService";
import { domToDataUrl } from "modern-screenshot";

const examplePills = [
  {
    id: 1,
    label: "일상",
    prompt:
      "오늘 퇴근길에 본 노을이 정말 아름다웠어요. 잠시 멈춰서 사진을 찍었는데, 하늘이 분홍빛으로 물들어서 마치 그림 같았습니다.",
  },
  {
    id: 2,
    label: "업무",
    prompt:
      "새로운 프로젝트를 시작했습니다! 팀원들과 함께 열심히 준비 중이에요. 결과가 기대됩니다.",
  },
  {
    id: 3,
    label: "운동",
    prompt:
      "오늘 아침 조깅을 다녀왔어요. 상쾌한 공기를 마시며 달리니 하루를 시작하기 좋네요!",
  },
  {
    id: 4,
    label: "맛집",
    prompt:
      "새로 생긴 브런치 카페에 다녀왔어요. 라떼도 맛있고 분위기도 너무 좋았습니다.",
  },
];

const mockTranslations = {
  instagram:
    "퇴근길의 작은 위로 🌅\n\n하늘이 만들어낸 오늘의 감정은 평온함과 그리움의 중간쯤이었어요.\n\n잠시 멈춰 서서 이 순간을 담았습니다. 때론 이런 작은 순간들이 하루를 특별하게 만들어주는 것 같아요.\n\n#일상 #노을 #퇴근길 #감성 #하늘스타그램 #daily #sunset #mood",
  twitter:
    "오늘 퇴근길에 본 노을이 진짜 미쳤다. 근데 핸드폰 배터리가 1%라 사진을 못 찍은 건 안 비밀 🥲\n\n결국 뇌에만 저장하고 옴 ㅋㅋㅋ",
};

function buildInstagramMock(input: string): string {
  const trimmed = input.trim();
  const short = trimmed.length > 120 ? `${trimmed.slice(0, 120)}...` : trimmed;
  const tags = Array.from(
    new Set(
      trimmed
        .split(/\s+/)
        .map((w) => w.replace(/[^\p{L}\p{N}]/gu, ""))
        .filter((w) => w.length >= 2)
        .slice(0, 4)
    )
  )
    .map((w) => `#${w}`)
    .join(" ");

  return `${short}\n\n오늘의 순간을 기록해요 ✨\n작은 감정도 소중하니까요.\n\n${
    tags || "#일상 #감성 #기록"
  }`;
}

function buildTwitterMock(input: string): string {
  const trimmed = input.trim();
  const short = trimmed.length > 160 ? `${trimmed.slice(0, 160)}...` : trimmed;
  return `${short}\n\n이거 나만 그런 거 아니지? 😮`;
}

const X_SHARE_CAPTIONS = [
  "내 아무말을 인스타 감성으로 세탁해드립니다. 본격 SNS 번역기 가동 중! ☕✨",
  "아무말 던졌는데 SNS 맞춤 문구로 변환 완료. 이게 바로 탭탭 매직.",
  "오늘도 아무말을 콘텐츠로 바꾸는 중. SNS 번역기 테스트 해보세요!",
];

const THREADS_SHARE_CAPTIONS = [
  "아무말 한 줄이 감성 글이 되는 중. TapTap으로 변환해봤어요.",
  "생각나는 문장을 SNS 스타일로 바꿔봤어요. 공유해봅니다.",
  "오늘의 문장을 인스타/X 스타일로 변환 완료. 여러분도 해보세요!",
];

export function DemoSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const resultGridRef = useRef<HTMLDivElement | null>(null);
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [activeTab, setActiveTab] = useState<"instagram" | "twitter">("instagram");
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isConverted, setIsConverted] = useState(false);
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    setIsTranslating(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    setOutputText(
      activeTab === "instagram"
        ? buildInstagramMock(inputText)
        : buildTwitterMock(inputText)
    );
    setIsConverted(true);
    setIsTranslating(false);
  };

  const handleExampleClick = (prompt: string) => {
    setInputText(prompt);
    setOutputText("");
    setIsConverted(false);
  };

  const setTimedShareStatus = (message: string) => {
    setShareStatus(message);
    window.setTimeout(() => setShareStatus(null), 3000);
  };

  const isMobileDevice = () => {
    const ua = navigator.userAgent || "";
    return /Android|iPhone|iPad|iPod/i.test(ua);
  };

  const getInstagramStoreUrl = () => {
    const ua = navigator.userAgent || "";
    const isIOS = /iPhone|iPad|iPod/i.test(ua);
    return isIOS
      ? "https://apps.apple.com/app/instagram/id389801252"
      : "https://play.google.com/store/apps/details?id=com.instagram.android";
  };

  const getCurrentSharePayload = () => {
    const base = inputText.trim();
    const instagram =
      activeTab === "instagram" && outputText.trim()
        ? outputText
        : buildInstagramMock(base || "일상을 공유해요");
    const twitter =
      activeTab === "twitter" && outputText.trim()
        ? outputText
        : buildTwitterMock(base || "오늘의 한 줄");
    const keywords = Array.from(
      new Set(
        base
          .split(/\s+/)
          .map((w) => w.replace(/[^\p{L}\p{N}]/gu, ""))
          .filter((w) => w.length >= 2)
      )
    ).slice(0, 8);

    return {
      instagram,
      twitter,
      keywords: keywords.length >= 3 ? keywords : ["일상", "감성", "기록"],
    };
  };

  const getOrCreateShareUrl = async (): Promise<string> => {
    const url = new URL(window.location.href);
    const existing = url.searchParams.get("v");
    if (existing) return url.toString();

    const id = await createSharedLink(getCurrentSharePayload());
    url.searchParams.set("v", id);
    window.history.replaceState(null, "", url.toString());
    return url.toString();
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    const sharedId = url.searchParams.get("v");
    if (!sharedId) return;

    let cancelled = false;
    const restoreFromSharedLink = async () => {
      try {
        const payload = await fetchSharedLink(sharedId);
        if (!payload || cancelled) return;
        const shared = payload as SharedLinkContent;
        setInputText("");
        setActiveTab("instagram");
        setOutputText(shared.instagram ?? "");
        setIsConverted(true);

        setTimeout(() => {
          sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 0);
      } catch {
        setTimedShareStatus("공유 링크 복구에 실패했어요.");
      }
    };

    void restoreFromSharedLink();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCopyLink = async () => {
    try {
      const shareUrl = await getOrCreateShareUrl();
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
      setTimedShareStatus("복사 완료!");
    } catch {
      setTimedShareStatus("링크 복사에 실패했어요.");
    }
  };

  const getCaptureBackgroundColor = () => {
    const bg = getComputedStyle(document.documentElement)
      .getPropertyValue("--background")
      .trim();
    return bg || "#ffffff";
  };

  const captureResultGridDataUrl = async (): Promise<string> => {
    const target = resultGridRef.current;
    if (!target) throw new Error("캡처할 결과 그리드 영역을 찾지 못했어요.");

    // 9:16 세로 캔버스 안에 결과 그리드를 깨짐 없이 맞춰 담습니다.
    const CANVAS_WIDTH = 1080;
    const CANVAS_HEIGHT = 1920;
    const clone = target.cloneNode(true) as HTMLDivElement;
    clone.style.display = "flex";
    clone.style.flexDirection = "column";
    clone.style.gap = "24px";
    clone.style.width = `${CANVAS_WIDTH - 96}px`;
    clone.style.maxWidth = "none";
    clone.style.background = getCaptureBackgroundColor();
    clone.style.boxSizing = "border-box";
    clone.querySelectorAll<HTMLElement>("*").forEach((el) => {
      // 가로 2열 유틸 영향 제거 (세로 스택 강제)
      if (el.classList.contains("lg:grid-cols-2")) {
        el.classList.remove("lg:grid-cols-2");
      }
      // 캡처본에서 최소 가독성 보장
      const computed = window.getComputedStyle(el);
      const currentFontSize = Number.parseFloat(computed.fontSize || "0");
      if (currentFontSize > 0 && currentFontSize < 28) {
        el.style.fontSize = `${Math.max(16, Math.round(currentFontSize * 1.08))}px`;
      }
    });

    const wrapper = document.createElement("div");
    wrapper.style.position = "fixed";
    wrapper.style.left = "0";
    wrapper.style.top = "0";
    wrapper.style.zIndex = "999999";
    wrapper.style.pointerEvents = "none";
    wrapper.style.padding = "0";
    wrapper.style.margin = "0";
    wrapper.style.width = `${CANVAS_WIDTH}px`;
    wrapper.style.height = `${CANVAS_HEIGHT}px`;
    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";
    wrapper.style.justifyContent = "center";
    wrapper.style.overflow = "hidden";
    wrapper.style.background = getCaptureBackgroundColor();
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    try {
      const dataUrl = await domToDataUrl(wrapper, {
        scale: 2,
        useCORS: true,
        // modern-screenshot에서 useCORS에 준하는 네트워크 설정
        fetch: {
          requestInit: {
            mode: "cors",
            cache: "no-cache",
          },
        },
        backgroundColor: getCaptureBackgroundColor(),
      } as any);
      if (!dataUrl) throw new Error("캡처 이미지 생성에 실패했어요.");
      return dataUrl;
    } finally {
      wrapper.remove();
    }
  };

  const dataUrlToFile = async (dataUrl: string, fileName: string): Promise<File> => {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    return new File([blob], fileName, { type: blob.type || "image/png" });
  };

  const handleSystemShare = async () => {
    try {
      const shareUrl = await getOrCreateShareUrl();
      const imageDataUrl = await captureResultGridDataUrl();
      const imageFile = await dataUrlToFile(imageDataUrl, "taptap-result.png");

      if (typeof navigator.share === "function") {
        const canShareFiles =
          typeof navigator.canShare === "function" &&
          navigator.canShare({ files: [imageFile] });
        if (!canShareFiles) {
          downloadImage(imageDataUrl, "taptap-result.png");
          setTimedShareStatus("이미지를 저장했어요. 공유가 지원되지 않아 다운로드로 전환했어요.");
          return;
        }
        await navigator.share({
          title: "TapTap 공유",
          text: "SNS 번역 결과를 확인해보세요!",
          url: shareUrl,
          files: [imageFile],
        });
        setTimedShareStatus("공유 완료!");
        return;
      }

      // navigator.share 미지원 브라우저 폴백
      await navigator.clipboard.writeText(shareUrl);
      setTimedShareStatus("복사 완료!");
    } catch {
      setTimedShareStatus("공유에 실패했어요.");
    }
  };

  const pickRandomCaption = (list: string[]) =>
    list[Math.floor(Math.random() * list.length)] ?? list[0];

  const handleShareToX = async () => {
    try {
      const shareUrl = await getOrCreateShareUrl();
      const caption = pickRandomCaption(X_SHARE_CAPTIONS);
      const intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        caption
      )}&url=${encodeURIComponent(shareUrl)}`;
      window.open(intentUrl, "_blank", "noopener,noreferrer");
    } catch {
      setTimedShareStatus("X 공유 링크 생성에 실패했어요.");
    }
  };

  const handleShareToThreads = async () => {
    try {
      const shareUrl = await getOrCreateShareUrl();
      const caption = pickRandomCaption(THREADS_SHARE_CAPTIONS);
      const text = `${caption}\n${shareUrl}`;
      const threadsUrl = `https://www.threads.net/intent/post?text=${encodeURIComponent(
        text
      )}`;
      window.open(threadsUrl, "_blank", "noopener,noreferrer");
    } catch {
      setTimedShareStatus("Threads 공유 링크 생성에 실패했어요.");
    }
  };

  const downloadImage = (dataUrl: string, fileName: string) => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const fallbackSaveAndCopy = async (dataUrl: string, shareUrl: string) => {
    downloadImage(dataUrl, "taptap-story.png");
    try {
      await navigator.clipboard.writeText(shareUrl);
      setTimedShareStatus("이미지를 저장하고 링크를 복사했어요. 모바일에서 인스타 앱으로 업로드해 주세요.");
    } catch {
      setTimedShareStatus("이미지를 저장했어요. 링크 복사는 브라우저 권한을 확인해 주세요.");
    }
  };

  const handleShareToKakaoTalk = async () => {
    try {
      const shareUrl = await getOrCreateShareUrl();
      const dataUrl = await captureResultGridDataUrl();
      downloadImage(dataUrl, "taptap-result.png");
      await navigator.clipboard.writeText(shareUrl);
      setTimedShareStatus(
        "이미지를 저장하고 링크를 복사했어요. 카카오톡 앱으로 업로드해 주세요."
      );
    } catch {
      setTimedShareStatus("카카오톡 공유 준비에 실패했어요.");
    }
  };

  const handleShareToInstagramStory = async () => {
    try {
      const shareUrl = await getOrCreateShareUrl();
      const dataUrl = await captureResultGridDataUrl();

      if (!isMobileDevice()) {
        await fallbackSaveAndCopy(dataUrl, shareUrl);
        return;
      }

      const base64 = dataUrl.split(",")[1] ?? "";
      if (!base64) throw new Error("인스타 공유용 이미지 데이터가 비어있어요.");

      const sourceApp =
        (import.meta.env.VITE_INSTAGRAM_SOURCE_APPLICATION as string | undefined)?.trim() ||
        "TapTap";
      const schemeUrl = `instagram-stories://share?source_application=${encodeURIComponent(
        sourceApp
      )}&backgroundImage=${encodeURIComponent(base64)}`;

      let didHide = false;
      const onVisibility = () => {
        if (document.visibilityState === "hidden") didHide = true;
      };
      document.addEventListener("visibilitychange", onVisibility);

      window.location.href = schemeUrl;

      window.setTimeout(async () => {
        document.removeEventListener("visibilitychange", onVisibility);
        if (!didHide) {
          // 모바일에서 앱 스킴 실행에 실패한 경우 스토어로 유도 후 폴백 처리
          window.location.href = getInstagramStoreUrl();
          await fallbackSaveAndCopy(dataUrl, shareUrl);
        } else {
          setTimedShareStatus("인스타그램 스토리를 여는 중입니다...");
        }
      }, 1600);
    } catch {
      try {
        const shareUrl = await getOrCreateShareUrl();
        const dataUrl = await captureResultGridDataUrl();
        await fallbackSaveAndCopy(dataUrl, shareUrl);
      } catch {
        setTimedShareStatus("인스타그램 공유 준비에 실패했어요.");
      }
    }
  };


  const XIcon = ({ className }: { className?: string }) => (
    <svg
      viewBox="0 0 25 22"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M18.244 2H21.308L14.548 9.73L22.5 20H16.29L11.427 13.79L5.93 20H2.864L10.097 11.74L2.5 2H8.868L13.262 7.676L18.244 2ZM17.168 18.1H18.865L7.946 3.8H6.123L17.168 18.1Z" />
    </svg>
  );

  const shareOptions = [
    { icon: Share2, label: "Share Link", action: handleSystemShare },
    { icon: Link2, label: "Copy Link", action: handleCopyLink },
    {
      icon: MessageCircle,
      label: "Share to KakaoTalk",
      action: handleShareToKakaoTalk,
    },
    { icon: Instagram, label: "Share to Instagram Story", action: handleShareToInstagramStory },
    { icon: Send, label: "Share to Threads", action: handleShareToThreads },
    { icon: XIcon, label: "Post to X", action: handleShareToX },
  ];

  return (
    <section ref={sectionRef} className="bg-white px-6 py-20">
      <div className="mx-auto max-w-[1024px]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-200/50 bg-gradient-to-r from-purple-100 to-blue-100 px-4 py-2">
            <Sparkles className="h-4 w-4 text-[var(--vibrant-violet)]" />
            <span className="bg-gradient-to-r from-[var(--vibrant-violet)] to-[var(--electric-blue)] bg-clip-text text-sm font-semibold text-transparent">
              직접 체험하기
            </span>
          </div>
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            지금 바로
            <br />
            <span className="bg-gradient-to-r from-[var(--vibrant-violet)] to-[var(--electric-blue)] bg-clip-text text-transparent">
              TapTap을 경험해보세요
            </span>
          </h2>
          <p className="text-lg text-gray-600">
            일상의 생각을 각 플랫폼에 맞는 콘텐츠로 즉시 변환하세요
          </p>
        </motion.div>

        {/* Translator Interface */}
        <motion.div
          ref={resultGridRef}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="grid gap-6 rounded-3xl border border-gray-200/50 bg-gradient-to-br from-purple-50/50 to-blue-50/50 p-8 shadow-2xl lg:grid-cols-2"
        >
          {/* Left Panel - Input */}
          <div className="flex h-full flex-col gap-4">
            {/* Header */}
            <div className="flex min-h-[132px] flex-col justify-end gap-2">
              <label className="text-lg text-gray-600">
                당신의 생각을 간단하게 입력하세요.
                <br />
                그럼 AI가 자동으로 변환해드립니다.
              </label>
              <p className="text-sm text-gray-500">
                무엇을 입력할지 모르겠다면 예시를 클릭해보세요.
              </p>

              {/* Example Pills */}
              <div className="flex flex-wrap gap-2">
                {examplePills.map((pill) => (
                  <button
                    key={pill.id}
                    onClick={() => handleExampleClick(pill.prompt)}
                    className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm transition-all duration-200 hover:border-purple-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:text-[var(--vibrant-violet)] hover:shadow-md"
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Textarea */}
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="예: 오늘 퇴근길에 본 노을이 정말 아름다웠어요..."
              className="h-[320px] w-full resize-none rounded-2xl border-2 border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 shadow-sm transition-all focus:border-[var(--vibrant-violet)] focus:outline-none focus:ring-4 focus:ring-purple-100"
            />

            {/* Translate Button */}
            <button
              onClick={handleTranslate}
              disabled={!inputText.trim() || isTranslating}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--vibrant-violet)] to-[var(--electric-blue)] px-6 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isTranslating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="h-5 w-5" />
                  </motion.div>
                  변환 중...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  변환하기
                </>
              )}
            </button>
          </div>

          {/* Right Panel - Output */}
          <div className="flex h-full flex-col gap-4">
            {/* Platform Tabs */}
            <div className="flex min-h-[132px] items-end">
              <div className="flex w-full gap-2 rounded-2xl border border-gray-200 bg-white p-1 shadow-sm">
              <button
                onClick={() => {
                  setActiveTab("instagram");
                  if (inputText && outputText) {
                    setOutputText(buildInstagramMock(inputText));
                  }
                }}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  activeTab === "instagram"
                    ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg shadow-pink-500/30"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Instagram className="h-4 w-4" />
                Instagram
              </button>
              <button
                onClick={() => {
                  setActiveTab("twitter");
                  if (inputText && outputText) {
                    setOutputText(buildTwitterMock(inputText));
                  }
                }}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  activeTab === "twitter"
                    ? "bg-gradient-to-r from-zinc-800 to-black text-white shadow-lg shadow-black/30"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <XIcon className="h-4 w-4" />
                X(트위터)
              </button>
              </div>
            </div>

            {/* Output Box */}
            <div className="relative">
              <div className="h-[320px] w-full overflow-y-auto rounded-2xl border-2 border-gray-200 bg-white px-4 py-3 shadow-sm">
                {outputText ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="whitespace-pre-wrap leading-relaxed text-gray-900"
                  >
                    {outputText}
                  </motion.div>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-gray-400">
                    변환된 내용이 여기에 표시됩니다
                  </div>
                )}
              </div>
            </div>

            {/* Share Button */}
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                disabled={!outputText}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--vibrant-violet)] to-[var(--electric-blue)] px-6 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/40 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Share2 className="h-5 w-5" />
                공유하기
              </button>

              {/* Share Menu Popover */}
              <AnimatePresence>
                {showShareMenu && outputText && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowShareMenu(false)}
                    />

                    {/* Menu */}
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute bottom-full right-0 z-50 mb-2 w-64 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
                    >
                      {shareOptions.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            option.action();
                            setShowShareMenu(false);
                          }}
                          className="flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3 transition-colors duration-150 last:border-b-0 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50"
                        >
                          <option.icon className="h-5 w-5 text-gray-600" />
                          <span className="text-sm font-medium text-gray-900">
                            {option.label}
                          </span>
                          {option.label === "Copy Link" && copied && (
                            <Check className="ml-auto h-4 w-4 text-green-500" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {shareStatus && (
          <p className="mt-4 text-center text-sm text-gray-600">{shareStatus}</p>
        )}

      </div>
    </section>
  );
}
