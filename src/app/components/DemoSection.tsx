import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  Instagram,
  ArrowDown,
  Share2,
  Link2,
  Send,
  Check,
  Sparkles,
} from "lucide-react";
import { useDemoShare } from "../hooks/useDemoShare";
import { translateWithPersonaApi, type PersonaTranslation } from "../../lib/personaTranslateService";
import svgPaths from "../../imports/svg-eir802r15e";

// 💡 AI 토큰 절감 프리셋
export const EXAMPLE_PRESETS = [
  {
    id: 1,
    label: "일상",
    prompt:
      "오늘 퇴근길에 본 노을이 정말 아름다웠어요. 잠시 멈춰서 사진을 찍었는데, 하늘이 분홍빛으로 물들어서 마치 그림 같았습니다.",
    results: {
      instagram:
        "핑크빛으로 물든 오늘의 퇴근길 🩷🌅\n\n바쁜 하루 끝에 마주한 선물 같은 풍경이었어요. 잠시 멈춰 서서 바라본 하늘은 마치 한 폭의 수채화 같았답니다. 이런 작은 행복들이 모여 내일을 살아갈 힘이 되는 것 같아요. ✨\n\n#오늘의노을 #퇴근길감성 #분홍하늘 #일상기록 #sunset #skyview",
      naver:
        "퇴근길에 우연히 하늘을 올려다봤는데, 노을이 정말 예쁘더라고요.\n\n잠깐 멈춰서 사진도 찍고, 그냥 그 순간만 느껴봤어요. 요즘은 바쁘게 살다 보면 이런 풍경을 놓치기 쉬운데, 오늘은 작은 선물 같은 시간이었어요.\n\n비슷한 날 있으면 한번 천천히 걸어보세요 🙂",
    },
  },
  {
    id: 2,
    label: "업무",
    prompt:
      "새로운 프로젝트를 시작했습니다! 팀원들과 함께 열심히 준비 중이에요. 결과가 기대됩니다.",
    results: {
      instagram:
        "New Chapter, New Project! 🚀✨\n\n드디어 새로운 도전을 시작하게 되었습니다. 든든한 팀원들과 함께 열정 가득하게 준비하고 있어요. 우리가 그려나갈 결과물들이 벌써부터 기대되네요! 응원해 주세요. 💪🔥\n\n#새로운시작 #프로젝트 #팀워크 #열정 #워크라이프 #갓생살기 #workmode",
      naver:
        "새 프로젝트를 시작하게 됐어요. 팀원들이랑 같이 준비하면서 설레기도 하고, 조금 긴장되기도 했네요.\n\n아직 결과는 모르겠지만, 시작했다는 것만으로도 의미 있는 하루인 것 같아요. 앞으로 차근차근 기록해 보려고요.\n\n비슷한 시기 지나가는 분들도 응원해요!",
    },
  },
  {
    id: 3,
    label: "운동",
    prompt:
      "오늘 아침 조깅을 다녀왔어요. 상쾌한 공기를 마시며 달리니 하루를 시작하기 좋네요!",
    results: {
      instagram:
        "Morning Routine: Jogging 🏃‍♀️🌱\n\n상쾌한 아침 공기 마시며 기분 좋게 하루 시작! 몸은 조금 무겁지만 마음만큼은 가벼워지는 시간이에요. 오늘 하루도 건강하고 활기차게 보내봐요! ☀️✨\n\n#오운완 #아침운동 #조깅 #건강한습관 #갓생기록 #운동하는여자 #morningrun",
      naver:
        "오늘은 아침에 가볍게 조깅을 다녀왔어요. 공기가 차가운데도 달리고 나니까 머리가 맑아지는 느낌이었어요.\n\n완벽한 페이스는 아니었지만, 일어난 것만으로 스스로 칭찬해 주기로 했습니다. 작은 습관이 쌓이면 나중에 큰 변화가 되겠죠.\n\n오늘도 한 걸음씩!",
    },
  },
  {
    id: 4,
    label: "맛집",
    prompt:
      "새로 생긴 브런치 카페에 다녀왔어요. 라떼도 맛있고 분위기도 너무 좋았습니다.",
    results: {
      instagram:
        "Weekends & Brunch ☕️🥐\n\n햇살 가득한 새로 생긴 브런치 카페 발견! 고소한 라떼 한 잔에 예쁜 공간이 주는 힐링까지, 완벽한 주말 아침이었어요. 여기 단골 예약입니다. ✨\n\n#브런치카페 #카페투어 #주말기록 #라떼맛집 #감성카페 #힐링타임 #cafevibe",
      naver:
        "새로 생긴 브런치 카페에 다녀왔어요. 라떼 맛이 고소하고 부드러워서 기분이 좋아졌네요.\n\n인테리어도 따뜻해서 사진 찍기 좋았고, 창가 자리에 앉아 여유 있게 쉬었어요. 주말 아침에 가기 딱 좋은 곳이에요.\n\n다음에 또 가고 싶은 카페로 기록해 둡니다.",
    },
  },
];

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

function buildNaverMock(input: string): string {
  const trimmed = input.trim();
  const short = trimmed.length > 200 ? `${trimmed.slice(0, 200)}...` : trimmed;
  return `${short}\n\n오늘 있었던 일을 이렇게 적어봤어요. 비슷한 경험 있으신가요?\n\n앞으로도 가끔 일상을 여기에 남겨보려고 합니다.`;
}

export function DemoSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [activeTab, setActiveTab] = useState<"instagram" | "naver">("instagram");
  const [activePresetId, setActivePresetId] = useState<number | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isConverted, setIsConverted] = useState(false);
  const [aiResult, setAiResult] = useState<PersonaTranslation | null>(null);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    const preset =
      activePresetId != null ? EXAMPLE_PRESETS.find((p) => p.id === activePresetId) : null;
    if (preset) {
      setAiResult(null);
      setOutputText(
        activeTab === "instagram" ? preset.results.instagram : preset.results.naver
      );
      setIsConverted(true);
      setShowShareMenu(false);
      return;
    }

    setIsTranslating(true);
    try {
      const translated = await translateWithPersonaApi(inputText);
      setAiResult(translated);
      setOutputText(activeTab === "instagram" ? translated.instagram : translated.naver);
      setIsConverted(true);
      setShowShareMenu(false);
    } catch (error) {
      console.error("Persona translate error", error);
      const detail = error instanceof Error ? error.message : String(error);
      alert(
        `변환 중 오류가 발생했습니다.\n\n${detail}\n\n• 로컬: .env에 위 변수 설정 후 npm run dev 재시작\n• Vercel: Project → Settings → Environment Variables에 VITE_SUPABASE_URL·VITE_SUPABASE_ANON_KEY(또는 PUBLISHABLE) 추가 → Redeploy (빌드 시에만 주입됨)\n• Supabase: Edge Function persona-translate 배포, OPENAI_API_KEY 시크릿 설정`
      );
    } finally {
      setIsTranslating(false);
    }
  };

  const handleExampleClick = (presetId: number) => {
    const preset = EXAMPLE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    setActivePresetId(preset.id);
    setAiResult(null);
    setInputText(preset.prompt);
    setOutputText("");
    setIsConverted(false);
    setShowShareMenu(false);
  };

  const handleTabChange = (tab: "instagram" | "naver") => {
    setActiveTab(tab);

    // 결과가 없는 상태에서는 탭 전환만으로 자동 생성하지 않습니다.
    if (!outputText.trim()) return;

    if (activePresetId != null) {
      const preset = EXAMPLE_PRESETS.find((p) => p.id === activePresetId);
      if (!preset) return;

      setOutputText(tab === "instagram" ? preset.results.instagram : preset.results.naver);
      setIsConverted(true);
      return;
    }

    if (aiResult) {
      setOutputText(tab === "instagram" ? aiResult.instagram : aiResult.naver);
      setIsConverted(true);
      return;
    }

    setOutputText(tab === "instagram" ? buildInstagramMock(inputText) : buildNaverMock(inputText));
    setIsConverted(true);
  };
  const {
    copied,
    shareStatus,
    handleCopyLink,
    handleSystemShare,
    handleShareToThreads,
    handleShareToX,
  } = useDemoShare({
    sectionRef,
    inputText,
    outputText,
    activeTab,
    setInputText,
    setActiveTab,
    setOutputText,
    setIsConverted,
    buildInstagramMock,
    buildNaverMock,
  });

  const NaverBlogIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" aria-hidden>
      <path d={svgPaths.p3fc5fe30} fill="currentColor" />
      <path d={svgPaths.p1bde6d80} fill="currentColor" />
      <path d={svgPaths.p1f483300} fill="currentColor" />
      <path d={svgPaths.p159aae00} fill="currentColor" />
    </svg>
  );

  const XShareIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 25 22" aria-hidden className={className} fill="currentColor">
      <path d="M18.244 2H21.308L14.548 9.73L22.5 20H16.29L11.427 13.79L5.93 20H2.864L10.097 11.74L2.5 2H8.868L13.262 7.676L18.244 2ZM17.168 18.1H18.865L7.946 3.8H6.123L17.168 18.1Z" />
    </svg>
  );

  const shareOptions = [
    { icon: Share2, label: "Share Link", action: handleSystemShare },
    { icon: Link2, label: "Copy Link", action: handleCopyLink },
    { icon: Send, label: "Share to Threads", action: handleShareToThreads },
    { icon: XShareIcon, label: "X로 공유", action: handleShareToX },
  ];

  return (
    <section id="demo-section" ref={sectionRef} className="bg-background px-6 py-20">
      <div className="mx-auto max-w-[1024px]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-4 py-2 dark:bg-primary/14">
            <Sparkles className="h-4 w-4 text-[var(--vibrant-violet)]" />
            <span className="bg-gradient-to-r from-[var(--vibrant-violet)] to-[var(--electric-blue)] bg-clip-text text-sm font-semibold text-transparent">
              직접 체험하기
            </span>
          </div>
          <h2 className="mb-4 text-4xl font-bold text-white-900 md:text-5xl">
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
          data-capture-target="demo-grid"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl border border-border/80 bg-card p-0 shadow-2xl sm:p-8 dark:bg-primary/14"
        >
          {/* Desktop (sm 이상): 기존 좌/우 그리드 유지 */}
          <div className="hidden h-full sm:grid sm:grid-cols-2 gap-6">
            {/* Left Panel - Input */}
            <div className="flex h-full flex-col gap-4">
              {/* Header */}
              <div className="flex min-h-[132px] flex-col justify-end gap-2">
                <label className="text-lg text-foreground">
                  당신의 생각을 간단하게 입력하세요.
                  <br />
                  그럼 AI가 자동으로 변환해드립니다.
                </label>
                <p className="text-sm text-muted-foreground">
                  무엇을 입력할지 모르겠다면 예시를 클릭해보세요.
                </p>

                {/* Example Pills */}
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_PRESETS.map((pill) => (
                    <button
                      key={pill.id}
                      onClick={() => handleExampleClick(pill.id)}
                      className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground shadow-sm transition-all duration-200 hover:border-purple-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:text-[var(--vibrant-violet)] hover:shadow-md"
                    >
                      {pill.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea */}
              <textarea
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  setActivePresetId(null);
                }}
                placeholder="예: 오늘 퇴근길에 본 노을이 정말 아름다웠어요..."
                className="h-[320px] w-full resize-none rounded-2xl border-2 border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground shadow-sm transition-all focus:border-[var(--vibrant-violet)] focus:outline-none focus:ring-4 focus:ring-purple-100"
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
                <div className="flex w-full gap-2 rounded-2xl border border-border/80 bg-card p-1 shadow-sm">
                  <button
                    onClick={() => {
                      handleTabChange("instagram");
                    }}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                      activeTab === "instagram"
                        ? "bg-gradient-to-r from-pink-900 to-orange-800 text-white shadow-lg shadow-pink-500/10"
                        : "text-muted-foreground hover:bg-card/70 hover:text-foreground"
                    }`}
                  >
                    <Instagram className="h-4 w-4" />
                    Instagram
                  </button>
                  <button
                    onClick={() => {
                      handleTabChange("naver");
                    }}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                      activeTab === "naver"
                        ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/20"
                        : "text-muted-foreground hover:bg-card/70 hover:text-foreground"
                    }`}
                  >
                    <NaverBlogIcon className="h-4 w-4" />
                    네이버 블로그
                  </button>
                </div>
              </div>

              {/* Output Box */}
              <div className="relative">
                <div className="h-[320px] w-full overflow-y-auto rounded-2xl border-2 border-border bg-card px-4 py-3 shadow-sm">
                  {outputText ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="whitespace-pre-wrap leading-relaxed text-foreground"
                    >
                      {outputText}
                    </motion.div>
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
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
                        data-capture-exclude="true"
                        onClick={() => setShowShareMenu(false)}
                      />

                      {/* Menu */}
                      <motion.div
                        role="menu"
                        data-capture-exclude="true"
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

              {isConverted && (
                <button
                  onClick={() => {
                    setInputText("");
                    setOutputText("");
                    setIsConverted(false);
                    setAiResult(null);
                    setActivePresetId(null);
                    setShowShareMenu(false);
                  }}
                  className="text-sm font-semibold text-purple-600 transition-colors hover:text-purple-700"
                >
                  다시 변환하기
                </button>
              )}
            </div>
          </div>

          {/* Mobile Full-screen Split (sm 미만) */}
          <div className="sm:hidden flex h-[calc(100dvh-120px)] min-h-[calc(100dvh-120px)] flex-col gap-6 p-4">
            
            {/* ==========================================
                상단: 입력 영역 (Top Half)
            ========================================== */}
            <div className="flex min-h-0 flex-1 flex-col gap-3">
              {/* 1. 상단 컨트롤 (예시 필) */}
              <div className="flex shrink-0 gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {EXAMPLE_PRESETS.map((pill) => (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => handleExampleClick(pill.id)}
                    className="shrink-0 rounded-full border border-border/80 bg-card px-3 py-1.5 text-sm text-foreground shadow-sm transition-all duration-200 hover:border-purple-300 hover:shadow-md"
                  >
                    {pill.label}
                  </button>
                ))}
              </div>

              {/* 2. 메인 박스 (입력창) */}
              <textarea
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  setActivePresetId(null);
                }}
                placeholder="여기에 텍스트를 입력하거나 붙여넣기 ..."
                className="min-h-0 w-full flex-1 resize-none rounded-2xl border-2 border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground shadow-sm transition-all focus:border-[var(--vibrant-violet)] focus:outline-none focus:ring-4 focus:ring-purple-100"
              />

              {/* 3. 하단 액션 버튼 (변환하기) */}
              <div className="shrink-0">
                <button
                  onClick={handleTranslate}
                  disabled={!inputText.trim() || isTranslating}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--vibrant-violet)] to-[var(--electric-blue)] px-6 py-4 font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-purple-500/40 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isTranslating ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="inline-flex"
                      >
                        <Sparkles className="h-5 w-5" />
                      </motion.span>
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
            </div>

            {/* ==========================================
                하단: 결과 영역 (Bottom Half)
            ========================================== */}
            <div className="flex min-h-0 flex-1 flex-col gap-3">
              {/* 1. 상단 컨트롤 (플랫폼 탭) */}
              <div className="flex shrink-0 gap-2 rounded-2xl border border-border/80 bg-card p-1">
                <button
                  type="button"
                  onClick={() => handleTabChange("instagram")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-all duration-200 ${
                    activeTab === "instagram"
                      ? "bg-gradient-to-r from-pink-900 to-orange-800 text-white shadow-lg shadow-pink-500/10"
                      : "text-muted-foreground hover:bg-card/70 hover:text-foreground"
                  }`}
                >
                  <Instagram className="h-4 w-4" />
                  Instagram
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange("naver")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-all duration-200 ${
                    activeTab === "naver"
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/20"
                      : "text-muted-foreground hover:bg-card/70 hover:text-foreground"
                  }`}
                >
                  <NaverBlogIcon className="h-4 w-4 shrink-0" />
                  <span className="leading-tight">네이버 블로그</span>
                </button>
              </div>

              {/* 2. 메인 박스 (결과창) */}
              <div className="min-h-0 w-full flex-1 overflow-y-auto rounded-2xl border-2 border-border bg-card px-4 py-3 shadow-sm">
                {outputText ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="whitespace-pre-wrap leading-relaxed text-foreground"
                  >
                    {outputText}
                  </motion.div>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    변환된 내용이 여기에 표시됩니다
                  </div>
                )}
              </div>

              {/* 3. 하단 액션 버튼 (공유하기 & 리셋) */}
              <div className="shrink-0 relative flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  disabled={!outputText}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--vibrant-violet)] to-[var(--electric-blue)] px-6 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-purple-500/40 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Share2 className="h-5 w-5" />
                  공유하기
                </button>

                {/* 공유 메뉴 팝오버 */}
                <AnimatePresence>
                  {showShareMenu && outputText && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        data-capture-exclude="true"
                        onClick={() => setShowShareMenu(false)}
                      />
                      <motion.div
                        role="menu"
                        data-capture-exclude="true"
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
                      >
                        {shareOptions.map((option, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => {
                              option.action();
                              setShowShareMenu(false);
                            }}
                            className="flex w-full items-center gap-3 border-b border-border/50 px-4 py-3 transition-colors duration-150 last:border-b-0 hover:bg-muted"
                          >
                            <option.icon className="h-5 w-5 text-muted-foreground" />
                            <span className="text-sm font-medium text-foreground">
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

                {/* 다시 변환하기 버튼 */}
                {isConverted && (
                  <button
                    type="button"
                    onClick={() => {
                      setInputText("");
                      setOutputText("");
                      setIsConverted(false);
                      setAiResult(null);
                      setActivePresetId(null);
                      setShowShareMenu(false);
                    }}
                    className="text-sm font-semibold text-[var(--vibrant-violet)] transition-colors hover:opacity-80 pb-1"
                  >
                    다시 변환하기
                  </button>
                )}
              </div>
            </div>
          </div>

        {shareStatus && (
          <p className="mt-4 text-center text-sm text-gray-600">{shareStatus}</p>
        )}

      </div>
    </section>
  );
}
