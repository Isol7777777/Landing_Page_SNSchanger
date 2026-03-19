import { motion } from "motion/react";
import svgPaths from "../../imports/svg-eir802r15e";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

export function SolutionSection() {
  return (
    <section className="relative bg-white px-4 py-16 md:px-8 md:py-24 lg:px-16">
      <div className="mx-auto max-w-5xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-200/50 bg-gradient-to-r from-purple-50 to-blue-50 px-4 py-2">
            <svg className="size-4" fill="none" viewBox="0 0 16 16">
              <g>
                <path d={svgPaths.p2b853180} fill="#6341EA" />
                <path d={svgPaths.p6a9a680} fill="#6341EA" />
                <path d={svgPaths.p2e964800} fill="#6341EA" />
                <path d={svgPaths.p2273f700} fill="#6341EA" />
                <path d={svgPaths.p3ddce280} fill="#6341EA" />
                <path d={svgPaths.p1fa0dc00} fill="#6341EA" />
                <path d={svgPaths.p2e2d7200} fill="#6341EA" />
                <path d={svgPaths.p33786400} fill="#6341EA" />
                <path d={svgPaths.p2074bd80} fill="#6341EA" />
                <path d={svgPaths.p3687f000} fill="#6341EA" />
              </g>
            </svg>
            <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-sm font-semibold text-transparent">
              TapTap의 해결책
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">TapTap</span>
            <span>이 모든 걸</span>
          </h2>
          <p className="mt-4 text-4xl md:text-5xl font-bold text-gray-900">
            완벽하게 해결합니다
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-24 md:space-y-32"
        >
          {/* Feature 1 */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12"
          >
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-200/50 bg-purple-50/50 px-4 py-2">
                <svg className="size-5" fill="none" viewBox="0 0 20 20">
                  <path d={svgPaths.p25397b80} stroke="#8A2BE2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                  <path d={svgPaths.p2c4f400} stroke="#8A2BE2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                  <path d={svgPaths.p2241fff0} stroke="#8A2BE2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                  <path d={svgPaths.pae3c380} stroke="#8A2BE2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                </svg>
                <span className="text-sm font-semibold text-purple-600">Feature 01</span>
              </div>

              <h3 className="text-4xl font-bold text-gray-900">
                플랫폼별 페르소나{" "}
                <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                  자동 변환
                </span>
              </h3>

              <p className="text-lg leading-relaxed text-gray-600 md:text-xl">
                하나의 메모가 인스타그램의 감성적인 톤, X의 간결한 메시지, 네이버 블로그의 친근한 분위기로 자동 변환됩니다.{" "}
                각 플랫폼의 특성을 완벽하게 이해하는 AI가 최적의 콘텐츠를 생성합니다.
              </p>

              <ul className="space-y-3">
                {["인스타그램: 감성적이고 비주얼 중심", "X: 간결하고 임팩트 있게", "네이버 블로그 : 친근하고 스토리텔링"].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="size-2 rounded-full bg-gradient-to-b from-purple-600 to-blue-500" />
                    <span className="text-gray-700">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl"
            >
              <div className="absolute -right-6 -top-6 size-24 rounded-full bg-gradient-to-br from-purple-200/30 to-blue-200/30 blur-3xl" />
              <div className="relative space-y-4">
                {[
                  { 
                    platform: "Instagram", 
                    text: "오늘 브런치 카페에서 만난 특별한 순간 ☕✨", 
                    gradient: "from-pink-500 to-orange-500",
                    icon: (
                      <svg className="size-full" fill="none" viewBox="0 0 24 24">
                        <path d={svgPaths.p4fdb300} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        <path d={svgPaths.p39557800} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        <path d="M17.5 6.5H17.51" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    )
                  },
                  { 
                    platform: "X", 
                    text: "브런치 카페 신메뉴 찢었다...", 
                    gradient: "from-gray-700 to-black",
                    icon: (
                      <svg className="size-full" fill="none" viewBox="0 0 32 32">
                        <path d={svgPaths.p68f3cc0} fill="white" />
                      </svg>
                    )
                  },
                  { 
                    platform: "네이버 블로그", 
                    text: "여러분! 오늘 새로 생긴 브런치 카페 다녀왔어요 😊", 
                    gradient: "from-green-500 to-green-600",
                    icon: (
                      <svg className="size-full" fill="none" viewBox="0 0 24 24">
                        <path d={svgPaths.p3fc5fe30} fill="white" />
                        <path d={svgPaths.p1bde6d80} fill="white" />
                        <path d={svgPaths.p1f483300} fill="white" />
                        <path d={svgPaths.p159aae00} fill="white" />
                      </svg>
                    )
                  }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    whileHover={{ x: 4 }}
                    className="rounded-2xl bg-gradient-to-br from-gray-50 to-white p-4 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="mb-2 flex items-center gap-3">
                      <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} p-2.5 shadow-lg`}>
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-500">{item.platform}</p>
                        <p className="mt-1 text-sm text-gray-700">{item.text}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative order-2 rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl lg:order-1"
            >
              <div className="absolute -left-6 -bottom-6 size-24 rounded-full bg-gradient-to-br from-blue-200/30 to-purple-200/30 blur-3xl" />
              <div className="relative">
                <div className="mb-6 grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.05, rotate: i % 2 === 0 ? 2 : -2 }}
                      className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100"
                    >
                      <div className="flex size-full items-center justify-center">
                        <svg className="size-8 opacity-80" fill="none" viewBox="0 0 32 32">
                          <path d={svgPaths.p29be2880} fill="white" fillOpacity="0.8" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.8" strokeWidth="2.66667" />
                          <path d={svgPaths.pd3e9900} fill="white" fillOpacity="0.8" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.8" strokeWidth="2.66667" />
                        </svg>
                      </div>
                      {i === 1 && (
                        <div className="absolute right-2 top-2 rounded-full bg-gradient-to-b from-purple-600 to-blue-500 p-1">
                          <svg className="size-3" fill="none" viewBox="0 0 16 16">
                            <path d={svgPaths.p874e300} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                          </svg>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
                <div className="rounded-xl border border-purple-200/50 bg-gradient-to-r from-purple-50 to-blue-50 p-4">
                  <p className="text-sm">
                    <span className="font-semibold text-purple-600">AI 추천:</span>{" "}
                    <span className="text-gray-700">이 위치에는 킹받는 이미지가 효과적이에요!</span>
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="order-1 space-y-6 lg:order-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/50 bg-blue-50/50 px-4 py-2">
                <svg className="size-5" fill="none" viewBox="0 0 20 20">
                  <path d={svgPaths.pc921000} stroke="#007BFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                  <path d={svgPaths.p16bbd80} stroke="#007BFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                </svg>
                <span className="text-sm font-semibold text-blue-600">Feature 02</span>
              </div>

              <h3 className="text-4xl font-bold text-gray-900">
                위트 있는 비주얼{" "}
                <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                  가이드
                </span>
              </h3>

              <p className="text-lg leading-relaxed text-gray-600 md:text-xl">
                사용자의 이미지는 스마트하게 배치하고, 부족한 감성은 '밈(Meme)'으로 채워줍니다. 콘텐츠 흐름에 맞는 자동 이미지 배치로 시각적 리듬감이 살아있는 레이아웃을 완성합니다.
              </p>

              <ul className="space-y-3">
                {["콘텐츠 흐름에 맞는 자동 이미지 배치", "감정을 전달하는 맞춤형 밈(Meme) 제공", "시각적 리듬감이 살아있는 레이아웃"].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="size-2 rounded-full bg-gradient-to-b from-purple-600 to-blue-500" />
                    <span className="text-gray-700">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12"
          >
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-200/50 bg-purple-50/50 px-4 py-2">
                <svg className="size-5" fill="none" viewBox="0 0 20 20">
                  <path d={svgPaths.p24941500} stroke="#8A2BE2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                </svg>
                <span className="text-sm font-semibold text-purple-600">Feature 03</span>
              </div>

              <h3 className="text-4xl font-bold text-gray-900">
                나만의 아이덴티티{" "}
                <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                  완벽 유지
                </span>
              </h3>

              <p className="text-lg leading-relaxed text-gray-600 md:text-xl">
                당신의 고유한 색깔은 지키되, 플랫폼과 취향에 맞춰 자유롭게 변신하세요. 핵심 내용은 유지하면서 각 채널에 최적화된 문체로 다듬어드립니다.
              </p>

              <ul className="space-y-3">
                {["플랫폼 맞춤형 SNS 문체 변환", "브랜드 컬러 & 말투 커스텀 설정", "일관성과 트렌디함의 완벽한 조화"].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="size-2 rounded-full bg-gradient-to-b from-purple-600 to-blue-500" />
                    <span className="text-gray-700">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl"
            >
              <div className="absolute -right-6 -top-6 size-24 rounded-full bg-gradient-to-br from-purple-200/30 to-blue-200/30 blur-3xl" />
              <div className="relative space-y-8">
                <div className="flex justify-center">
                  <motion.div
                    animate={{
                      rotate: [0, 5, 0, -5, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="flex size-20 items-center justify-center rounded-full bg-gradient-to-b from-purple-600 to-blue-500 shadow-xl"
                  >
                    <span className="text-3xl">✨</span>
                  </motion.div>
                </div>
                <h4 className="text-center text-lg font-bold text-gray-900">문체 커스터마이징</h4>
                <div className="space-y-4">
                  {[
                    { label: "친근함", value: 85 },
                    { label: "전문성", value: 70 },
                    { label: "유머", value: 60 }
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-gray-700">{item.label}</span>
                        <span className="text-gray-500">{item.value}%</span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.value}%` }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.2 + i * 0.1, duration: 0.8 }}
                          className="h-full rounded-full bg-gradient-to-r from-purple-600 to-blue-500"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}