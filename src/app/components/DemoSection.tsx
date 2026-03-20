import { motion, AnimatePresence } from "motion/react";
import { useRef, useState } from "react";
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
      twitter: "얘들아 제발 지금 당장 고개 들어서 하늘 좀 봐... 나 길 한복판에서 노을 보다가 고흐될뻔;;",
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
      twitter:
        "새 프로젝트 시작... 팀원들 눈광 보니까 이거 대박 아니면 진짜 은퇴각임ㅋㅋㅋㅋㅋ 자 가보자고!!!! (사실 이미 도망가고 싶음)",
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
      twitter:
        "갓생 살겠다고 새벽 6시에 조깅 나간 과거의 나 멱살 잡고 싶다... 지금 다리 후들거려서 계단 내려가는데 자동 탭댄스 추는 중임ㅋㅋㅋㅋㅋ 운동은 몸에 해롭다... 아냐 좋아... 아냐 해로워...",
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
      twitter:
        "여기 브런치 카페 라떼 한 입 먹자마자 전두엽 기립박수 침;; 분위기 미쳤고 맛은 더 미쳤음. 역시 인생은 탄수화물과 카페인의 합작이다. ",
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

function buildTwitterMock(input: string): string {
  const trimmed = input.trim();
  const short = trimmed.length > 160 ? `${trimmed.slice(0, 160)}...` : trimmed;
  return `${short}\n\n이거 나만 그런 거 아니지? 😮`;
}

export function DemoSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [activeTab, setActiveTab] = useState<"instagram" | "twitter">("instagram");
  const [activePresetId, setActivePresetId] = useState<number | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isConverted, setIsConverted] = useState(false);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    const preset =
      activePresetId != null ? EXAMPLE_PRESETS.find((p) => p.id === activePresetId) : null;
    if (preset) {
      setOutputText(
        activeTab === "instagram" ? preset.results.instagram : preset.results.twitter
      );
      setIsConverted(true);
      setShowShareMenu(false);
      return;
    }

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

  const handleExampleClick = (presetId: number) => {
    const preset = EXAMPLE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    setActivePresetId(preset.id);
    setInputText(preset.prompt);
    setOutputText("");
    setIsConverted(false);
    setShowShareMenu(false);
  };

  const handleTabChange = (tab: "instagram" | "twitter") => {
    setActiveTab(tab);

    // 결과가 없는 상태에서는 탭 전환만으로 자동 생성하지 않습니다.
    if (!outputText.trim()) return;

    if (activePresetId != null) {
      const preset = EXAMPLE_PRESETS.find((p) => p.id === activePresetId);
      if (!preset) return;

      setOutputText(tab === "instagram" ? preset.results.instagram : preset.results.twitter);
      setIsConverted(true);
      return;
    }

    setOutputText(tab === "instagram" ? buildInstagramMock(inputText) : buildTwitterMock(inputText));
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
    buildTwitterMock,
  });


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
    { icon: Send, label: "Share to Threads", action: handleShareToThreads },
    { icon: XIcon, label: "Post to X", action: handleShareToX },
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
          className="grid gap-6 rounded-3xl border border-border/80 bg-card p-8 shadow-2xl lg:grid-cols-2 dark:bg-primary/14"
        >
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
                  handleTabChange("twitter");
                }}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  activeTab === "twitter"
                    ? "bg-gradient-to-r from-zinc-800 to-black text-white shadow-lg shadow-black/30"
                    : "text-muted-foreground hover:bg-card/70 hover:text-foreground"
                }`}
              >
                <XIcon className="h-4 w-4" />
                X(트위터)
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
                  setActivePresetId(null);
                  setShowShareMenu(false);
                }}
                className="text-sm font-semibold text-purple-600 transition-colors hover:text-purple-700"
              >
                다시 변환하기
              </button>
            )}
          </div>
        </motion.div>

        {/* Hidden Capture Rendering */}
        <div className="fixed left-[-9999px] top-[-9999px] -z-50 pointer-events-none">
          <div className="flex justify-center">
            <div
              id="capture-area"
              className="w-full max-w-[450px] overflow-hidden rounded-3xl border border-border bg-background text-foreground shadow-2xl"
            >
              <div className="flex flex-col p-6">
                {/* Header with Platform Selector */}
                <div className="mb-6 flex items-center">
                  <div className="flex gap-2 rounded-2xl bg-gray-100 p-1">
                    <button
                      onClick={() => handleTabChange("instagram")}
                      className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-medium transition-all duration-200 ${
                        activeTab === "instagram"
                          ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-md"
                          : "text-gray-600"
                      }`}
                    >
                      <Instagram className="h-3.5 w-3.5" />
                      Instagram
                    </button>
                    <button
                      onClick={() => handleTabChange("twitter")}
                      className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-medium transition-all duration-200 ${
                        activeTab === "twitter"
                          ? "bg-gradient-to-r from-zinc-800 to-black text-white shadow-md"
                          : "text-gray-600"
                      }`}
                    >
                      <XIcon className="h-3.5 w-3.5" />
                      X
                    </button>
                  </div>
                </div>

                {/* Input Section */}
                <div className="mb-4 flex-none">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-gradient-to-r from-[var(--vibrant-violet)] to-[var(--electric-blue)]" />
                    <span className="text-sm font-semibold text-foreground">입력</span>
                  </div>
                  <div className="rounded-2xl border border-border bg-card p-4">
                    <textarea
                      value={inputText}
                      onChange={(e) => {
                        setInputText(e.target.value);
                        setActivePresetId(null);
                      }}
                      className="w-full resize-none bg-transparent text-sm leading-relaxed text-foreground focus:outline-none"
                      rows={4}
                      placeholder="변환할 내용을 입력하세요..."
                    />
                  </div>
                </div>

                {/* Conversion Icon */}
                <div className="my-4 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[var(--vibrant-violet)] to-[var(--electric-blue)] shadow-lg shadow-purple-500/30">
                    <ArrowDown className="h-6 w-6 text-white" />
                  </div>
                </div>

                {/* Output Section */}
                <div className="flex flex-col">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-gradient-to-r from-[var(--vibrant-violet)] to-[var(--electric-blue)]" />
                    <span className="text-sm font-semibold text-foreground">결과</span>
                  </div>
                  <div className="rounded-2xl border border-border bg-card p-4">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                      {outputText}
                    </div>
                  </div>
                </div>
              </div>
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
