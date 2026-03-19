import { useEffect, useState } from "react";
import type { SharedLinkContent } from "../../lib/shareService";

type ActiveTab = "instagram" | "twitter";

type UseDemoShareParams = {
  sectionRef: React.RefObject<HTMLElement | null>;
  inputText: string;
  outputText: string;
  activeTab: ActiveTab;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
  setActiveTab: React.Dispatch<React.SetStateAction<ActiveTab>>;
  setOutputText: React.Dispatch<React.SetStateAction<string>>;
  setIsConverted: React.Dispatch<React.SetStateAction<boolean>>;
  buildInstagramMock: (input: string) => string;
  buildTwitterMock: (input: string) => string;
};

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

export function useDemoShare({
  sectionRef,
  inputText,
  outputText,
  activeTab,
  setInputText,
  setActiveTab,
  setOutputText,
  setIsConverted,
  buildInstagramMock,
  buildTwitterMock,
}: UseDemoShareParams) {
  const [copied, setCopied] = useState(false);
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  const loadShareService = async () => import("../../lib/shareService");
  const loadScreenshot = async () => import("modern-screenshot");

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

  const getCaptureBackgroundColor = () => {
    const bg = getComputedStyle(document.documentElement)
      .getPropertyValue("--background")
      .trim();
    return bg || "#ffffff";
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

    const { createSharedLink } = await loadShareService();
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
        const { fetchSharedLink } = await loadShareService();
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
  }, [sectionRef, setActiveTab, setInputText, setIsConverted, setOutputText]);

  const captureResultGridDataUrl = async (): Promise<string> => {
    const target = document.getElementById("capture-area");
    if (!target) throw new Error("캡처할 영역(#capture-area)을 찾지 못했어요.");

    const CAPTURE_WIDTH = 450;
    const measureHost = document.createElement("div");
    measureHost.style.position = "fixed";
    measureHost.style.left = "-99999px";
    measureHost.style.top = "0";
    measureHost.style.width = `${CAPTURE_WIDTH}px`;
    measureHost.style.pointerEvents = "none";
    const measureArea = target.cloneNode(true) as HTMLElement;
    measureArea.style.width = `${CAPTURE_WIDTH}px`;
    measureArea.style.maxWidth = `${CAPTURE_WIDTH}px`;
    measureArea.style.height = "auto";
    measureArea.querySelectorAll<HTMLElement>(".overflow-y-auto").forEach((el) => {
      el.style.overflow = "visible";
      el.style.overflowY = "visible";
      el.style.height = "auto";
      el.style.maxHeight = "none";
    });
    measureHost.appendChild(measureArea);
    document.body.appendChild(measureHost);
    const measuredHeight = Math.ceil(measureArea.scrollHeight);
    measureHost.remove();

    const captureHeight = Math.max(1, measuredHeight);

    const { domToPng } = await loadScreenshot();
    const dataUrl = await domToPng(target as HTMLElement, {
      width: CAPTURE_WIDTH,
      height: captureHeight,
      scale: 2,
      useCORS: true,
      backgroundColor: getCaptureBackgroundColor(),
      fetch: {
        requestInit: {
          mode: "cors",
          cache: "no-cache",
        },
      },
      onclone: (clonedDoc: Document) => {
        const clonedArea = clonedDoc.querySelector("#capture-area") as HTMLElement | null;
        if (!clonedArea) return;

        clonedDoc
          .querySelectorAll<HTMLElement>('[data-capture-exclude="true"], [role="menu"]')
          .forEach((node) => node.remove());
        clonedDoc.querySelectorAll<HTMLElement>("*").forEach((node) => {
          const style = clonedDoc.defaultView?.getComputedStyle(node);
          if (!style) return;
          if (style.position === "fixed" || style.position === "absolute") {
            if (node !== clonedArea) node.remove();
          }
        });

        clonedDoc.body.innerHTML = "";
        clonedDoc.body.style.position = "relative";
        clonedDoc.body.style.margin = "0";
        clonedDoc.body.style.padding = "0";
        clonedDoc.body.style.width = `${CAPTURE_WIDTH}px`;
        clonedDoc.body.style.height = `${captureHeight}px`;
        clonedDoc.body.style.overflow = "hidden";
        clonedDoc.body.style.background = getCaptureBackgroundColor();

        clonedArea.style.position = "absolute";
        clonedArea.style.left = "0";
        clonedArea.style.top = "0";
        clonedArea.style.width = `${CAPTURE_WIDTH}px`;
        clonedArea.style.maxWidth = `${CAPTURE_WIDTH}px`;
        clonedArea.style.height = "auto";
        clonedArea.style.overflow = "visible";
        clonedArea.style.background = getCaptureBackgroundColor();
        clonedArea.querySelectorAll<HTMLElement>("*").forEach((el) => {
          if (el.classList.contains("overflow-y-auto")) {
            el.style.overflow = "visible";
            el.style.overflowY = "visible";
            el.style.height = "auto";
            el.style.maxHeight = "none";
          }
        });
        clonedDoc.body.appendChild(clonedArea);

        const contentHeight = Math.ceil(clonedArea.scrollHeight);
        if (contentHeight > captureHeight) {
          const scale = Math.max(0.72, captureHeight / contentHeight);
          clonedArea.style.transformOrigin = "top left";
          clonedArea.style.transform = `scale(${scale})`;
          clonedArea.style.width = `${Math.floor(CAPTURE_WIDTH / scale)}px`;
        }
      },
    } as any);

    if (!dataUrl) throw new Error("캡처 이미지 생성에 실패했어요.");
    return dataUrl;
  };

  const downloadImage = (dataUrl: string, fileName: string) => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const dataUrlToFile = async (dataUrl: string, fileName: string): Promise<File> => {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    return new File([blob], fileName, { type: blob.type || "image/png" });
  };

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

  return {
    copied,
    shareStatus,
    handleCopyLink,
    handleSystemShare,
    handleShareToKakaoTalk,
    handleShareToInstagramStory,
    handleShareToThreads,
    handleShareToX,
  };
}

