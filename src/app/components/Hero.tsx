import { motion } from "motion/react";
import svgPaths from "../../imports/svg-eir802r15e";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export function Hero() {
  const scrollToSection = (id: string) => {
    if (typeof window === "undefined") return;
    const target = document.getElementById(id);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-purple-50/30 to-blue-50/40 px-4 pb-16 pt-24 md:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left Content */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="relative z-10 space-y-6 md:space-y-8"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 rounded-full border border-purple-200/50 bg-purple-50/50 px-4 py-2 backdrop-blur-sm"
            >
              <svg className="size-4" fill="none" viewBox="0 0 16 16">
                <g clipPath="url(#clip0_1_601)">
                  <g>
                    <path d={svgPaths.p7b0f1f0} fill="#8A2BE2" />
                    <path d={svgPaths.p1dc2280} fill="#8A2BE2" />
                    <path d={svgPaths.p33e9ec00} fill="#8A2BE2" />
                    <path d={svgPaths.p193f9380} fill="#8A2BE2" />
                    <path d={svgPaths.p2515f80} fill="#8A2BE2" />
                    <path d={svgPaths.p34206400} fill="#8A2BE2" />
                    <path d={svgPaths.p43ae680} fill="#8A2BE2" />
                    <path d={svgPaths.p15bc15a0} fill="#8A2BE2" />
                    <path d={svgPaths.p1d8bd780} fill="#8A2BE2" />
                    <path d={svgPaths.p2f3ca600} fill="#8A2BE2" />
                  </g>
                </g>
                <defs>
                  <clipPath id="clip0_1_601">
                    <rect fill="white" height="16" width="16" />
                  </clipPath>
                </defs>
              </svg>
              <span className="text-sm text-purple-600">AI 기반 SNS 콘텐츠 자동 생성</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="space-y-2">
              <span className="block bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-transparent">
                메모 한 줄이
              </span>
              <span className="block text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-gray-900">
                플랫폼의
              </span>
              <span className="block text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-gray-900">
                맞춤 콘텐츠로
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="max-w-md text-lg text-gray-600 md:text-xl"
            >
              간단한 메모만 입력하세요. TapTap이 각 플랫폼에 최적화된 매력적인 콘텐츠로 자동 변환해드립니다. 
              이제 SNS 관리, 탭 두 번이면 끝!
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col gap-4 sm:flex-row">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection("cta-section")}
                className="rounded-2xl bg-gradient-to-b from-purple-600 to-blue-500 px-18 py-3.5 font-semibold text-white shadow-lg shadow-purple-500/30 transition-shadow hover:shadow-xl hover:shadow-purple-500/40"
              >
                사전 예약
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection("demo-section")}
                className="rounded-2xl border-2 border-gray-200 bg-white px-18 py-3.5 font-semibold text-gray-900 transition-colors hover:bg-gray-50"
              >
                체험 하기
              </motion.button>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap gap-4 pt-4 text-sm text-gray-600"
            >
            </motion.div>
          </motion.div>

          {/* Right Content - Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotate: -5 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center lg:justify-end"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative"
            >
              <div className="relative z-10 w-[280px] overflow-hidden rounded-[40px] border-8 border-gray-800 bg-white shadow-2xl sm:w-[320px] md:w-[360px]">
                <div className="aspect-[8/16] bg-white p-6">
                  <div className="space-y-4">
                    {/* Instagram */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-4 shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-orange-500 p-2.5 shadow-md">
                          <svg className="size-full" fill="none" viewBox="0 0 24 24">
                            <path d={svgPaths.p4fdb300} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                            <path d={svgPaths.p39557800} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                            <path d="M17.5 6.5H17.51" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-500">Instagram</p>
                          <p className="mt-1 text-sm text-gray-700">오늘 브런치 카페에서 만난 특별한 순간 ☕✨</p>
                        </div>
                      </div>
                    </motion.div>

                    {/* X (Twitter) */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-4 shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-700 to-black p-2.5 shadow-md">
                          <svg className="size-full" fill="none" viewBox="0 0 32 32">
                            <path d={svgPaths.p68f3cc0} fill="white" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-500">X</p>
                          <p className="mt-1 text-sm text-gray-700">브런치 카페 신메뉴 찢었다...</p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Naver Blog */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                      className="overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-4 shadow-sm"
                    >
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
                          <p className="text-xs font-semibold text-gray-500">네이버 블로그</p>
                          <p className="mt-1 text-sm text-gray-700">여러분! 오늘 새로 생긴 브런치 카페 다녀왔어요 😊</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}