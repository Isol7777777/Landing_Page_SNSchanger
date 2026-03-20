import svgPaths from "../../imports/svg-eir802r15e";

export function Hero() {
  const scrollToSection = (id: string) => {
    if (typeof window === "undefined") return;
    const target = document.getElementById(id);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-background px-4 pb-16 pt-24 md:px-8 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left Content */}
          <div className="relative z-10 space-y-6 md:space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200/50 bg-purple-50/50 px-4 py-2 backdrop-blur-sm text-purple-600 dark:text-[var(--vibrant-violet)] dark:border-border/90 dark:bg-primary/14">
              <svg className="size-4" fill="none" viewBox="0 0 16 16">
                <g clipPath="url(#clip0_1_601)">
                  <g>
                    <path d={svgPaths.p7b0f1f0} fill="currentColor" />
                    <path d={svgPaths.p1dc2280} fill="currentColor" />
                    <path d={svgPaths.p33e9ec00} fill="currentColor" />
                    <path d={svgPaths.p193f9380} fill="currentColor" />
                    <path d={svgPaths.p2515f80} fill="currentColor" />
                    <path d={svgPaths.p34206400} fill="currentColor" />
                    <path d={svgPaths.p43ae680} fill="currentColor" />
                    <path d={svgPaths.p15bc15a0} fill="currentColor" />
                    <path d={svgPaths.p1d8bd780} fill="currentColor" />
                    <path d={svgPaths.p2f3ca600} fill="currentColor" />
                  </g>
                </g>
                <defs>
                  <clipPath id="clip0_1_601">
                    <rect fill="white" height="16" width="16" />
                  </clipPath>
                </defs>
              </svg>
              <span className="text-sm text-purple-600 dark:text-[var(--vibrant-violet)]">
                AI 기반 SNS 콘텐츠 자동 생성
              </span>
            </div>

            <h1 className="space-y-2">
              <span className="block bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-transparent">
                메모 한 줄이
              </span>
              <span className="block text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-foreground">
                플랫폼의
              </span>
              <span className="block text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-foreground">
                맞춤 콘텐츠로
              </span>
            </h1>

            <p className="max-w-md text-lg text-muted-foreground md:text-xl">
              간단한 메모만 입력하세요. TapTap이 각 플랫폼에 최적화된 매력적인 콘텐츠로 자동 변환해드립니다. 
              이제 SNS 관리, 탭 두 번이면 끝!
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                onClick={() => scrollToSection("cta-section")}
                className="rounded-2xl bg-gradient-to-b from-purple-600 to-blue-500 px-18 py-3.5 font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:shadow-xl hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98]"
              >
                사전 예약
              </button>
              <button
                onClick={() => scrollToSection("demo-section")}
                className="rounded-2xl border-2 border-border bg-card px-18 py-3.5 font-semibold text-foreground transition-all hover:bg-card/70 hover:scale-[1.02] active:scale-[0.98] dark:border-border/80 dark:bg-primary/14 dark:hover:bg-primary/20"
              >
                체험 하기
              </button>
            </div>

            <div className="flex flex-wrap gap-4 pt-4 text-sm text-muted-foreground" />
          </div>

          {/* Right Content - Phone Mockup */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              <div className="relative z-10 aspect-[8/16] w-[240px] overflow-hidden rounded-[40px] border-8 border-gray-800 bg-white shadow-2xl dark:border-border/80 dark:bg-card sm:w-[280px] md:w-[300px]">
                <div className="h-full bg-white p-6 dark:bg-card overflow-hidden">
                  <div className="space-y-4">
                    {/* Instagram */}
                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-4 shadow-sm dark:border-border/90 dark:bg-primary/14 dark:from-transparent dark:to-transparent">
                      <div className="flex items-start gap-3">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-orange-500 p-2.5 shadow-md">
                          <svg className="size-full" fill="none" viewBox="0 0 24 24">
                            <path d={svgPaths.p4fdb300} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                            <path d={svgPaths.p39557800} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                            <path d="M17.5 6.5H17.51" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-500 dark:text-foreground">Instagram</p>
                          <p className="mt-1 text-sm text-gray-700 dark:text-foreground">
                            모든 채널을 운영하고 싶지만 시간이 부족한 당신을 위한 탭탭
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* X (Twitter) */}
                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-4 shadow-sm dark:border-border/90 dark:bg-primary/14 dark:from-transparent dark:to-transparent">
                      <div className="flex items-start gap-3">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-700 to-black p-2.5 shadow-md">
                          <svg className="size-full" fill="none" viewBox="0 0 32 32">
                            <path d={svgPaths.p68f3cc0} fill="white" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-500 dark:text-foreground">X</p>
                          <p className="mt-1 text-sm text-gray-700 dark:text-foreground">
                            매일 올려야 하는 홍보글, 포스팅은 이제 '탭탭'에게 맡기세요
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Naver Blog */}
                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-4 shadow-sm dark:border-border/90 dark:bg-primary/14 dark:from-transparent dark:to-transparent">
                      <div className="flex items-start gap-3">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-2.5 shadow-md">
                          <svg className="size-full" fill="none" viewBox="0 0 24 24">
                            <path d={svgPaths.p3fc5fe30} fill="white" />
                            <path d={svgPaths.p1bde6d80} fill="white" />
                            <path d={svgPaths.p1f483300} fill="white" />
                            <path d={svgPaths.p159aae00} fill="white" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-500 dark:text-foreground">네이버 블로그</p>
                          <p className="mt-1 text-sm text-gray-700 dark:text-foreground">
                            마감 기한에 쫓기는 리뷰 작성, 이제 10분 만에 끝내세요
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}