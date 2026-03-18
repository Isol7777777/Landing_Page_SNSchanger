import { motion, AnimatePresence } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import svgPaths from "../../imports/svg-eir802r15e";
import svgPathsResult from "../../imports/svg-rtrsvnnyqs";
import imgImageSunset from "../../assets/demo-sunset-e25b65c9.png";
import { transformText, type DualTransformResult } from "../../lib/gemini";
import {
  fetchImagesFromSupabaseByKeywords,
  pickBestAssetFromKeywords,
  pickBestFromDummyDb,
  placeholderImage,
  type ImageAsset,
} from "../../lib/imageMatch";

export function DemoSection() {
  const [activeTab, setActiveTab] = useState<"instagram" | "twitter">("instagram");
  const [isConverted, setIsConverted] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isTransforming, setIsTransforming] = useState(false);
  const [transformError, setTransformError] = useState<string | null>(null);
  const [transformResult, setTransformResult] = useState<DualTransformResult | null>(null);
  const [supabaseAssets, setSupabaseAssets] = useState<ImageAsset[] | null>(null);

  const keywords = transformResult?.keywords ?? [];

  const dummyBest = useMemo(() => pickBestFromDummyDb(keywords), [keywords]);
  const supabaseBest = useMemo(() => {
    if (!supabaseAssets?.length) return null;
    return pickBestAssetFromKeywords(keywords, supabaseAssets);
  }, [keywords, supabaseAssets]);

  const best = supabaseBest ?? dummyBest;
  const twitterImageSrc = best?.twitter ?? placeholderImage.twitter;
  const instagramImageSrc = best?.instagram ?? placeholderImage.instagram;
  const bestAlt = best?.keyword ?? "기본";

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setSupabaseAssets(null);
      if (!keywords.length) return;
      try {
        const assets = await fetchImagesFromSupabaseByKeywords(keywords);
        if (!cancelled) setSupabaseAssets(assets);
      } catch {
        // Supabase가 아직 준비되지 않았거나 테이블이 없으면 더미 매칭으로 폴백합니다.
        if (!cancelled) setSupabaseAssets([]);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [keywords]);

  const handleConvert = async () => {
    if (isTransforming) return;
    setTransformError(null);
    setIsTransforming(true);
    try {
      const result = await transformText(inputText);
      setTransformResult(result);
      setIsConverted(true);
    } catch (e) {
      const message = e instanceof Error ? e.message : "변환 중 오류가 발생했습니다.";
      setTransformError(message);
    } finally {
      setIsTransforming(false);
    }
  };

  const handleReset = () => {
    setIsConverted(false);
    setTransformError(null);
    setTransformResult(null);
    setSupabaseAssets(null);
  };

  return (
    <section
      id="demo-section"
      className="relative bg-white px-4 py-16 md:px-8 md:py-24 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        <AnimatePresence mode="wait">
          {!isConverted ? (
            // Input View
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="mb-12 text-center"
              >
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-200/50 bg-gradient-to-r from-purple-50 to-blue-50 px-4 py-2">
                  <svg className="size-4" fill="none" viewBox="0 0 16 16">
                    <g clipPath="url(#clip0_demo)">
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
                      <clipPath id="clip0_demo">
                        <rect fill="white" height="16" width="16" />
                      </clipPath>
                    </defs>
                  </svg>
                  <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-sm font-semibold text-transparent">
                    직접 체험하기
                  </span>
                </div>

                <h2 className="mb-4 text-4xl md:text-5xl font-bold">
                  <span className="text-gray-900">지금 바로</span>
                </h2>
                <p className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-4xl md:text-5xl font-bold text-transparent">
                  TapTap을 경험해보세요
                </p>

                <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
                  생각나는 대로 적어보세요.{" "}
                  <br className="hidden sm:inline" />
                  TapTap이 인스타의 감성과 트위터의 위트로 즉시 번역해 드립니다.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mx-auto max-w-4xl"
              >
                <div
                  className="overflow-hidden rounded-3xl p-8 md:p-12"
                  style={{
                    backgroundImage: "linear-gradient(171.302deg, rgba(250, 245, 255, 0.5) 8.4735%, rgba(239, 246, 255, 0.5) 91.527%)"
                  }}
                >
                  <div className="space-y-6">
                    {/* Platform Tabs */}
                    <div className="flex flex-wrap gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveTab("instagram")}
                        className={`flex items-center gap-2 rounded-xl px-4 py-3 font-semibold transition-all ${
                          activeTab === "instagram"
                            ? "bg-gradient-to-b from-purple-600 to-blue-500 text-white shadow-lg shadow-purple-500/30"
                            : "border-2 border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <svg className="size-5" fill="none" viewBox="0 0 24 24">
                          <path
                            d={svgPaths.p4fdb300}
                            stroke={activeTab === "instagram" ? "white" : "#364153"}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          />
                          <path
                            d={svgPaths.p39557800}
                            stroke={activeTab === "instagram" ? "white" : "#364153"}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          />
                          <path
                            d="M17.5 6.5H17.51"
                            stroke={activeTab === "instagram" ? "white" : "#364153"}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          />
                        </svg>
                        <span>인스타그램</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveTab("twitter")}
                        className={`flex items-center gap-2 rounded-xl px-4 py-3 font-semibold transition-all ${
                          activeTab === "twitter"
                            ? "bg-gradient-to-b from-purple-600 to-blue-500 text-white shadow-lg shadow-purple-500/30"
                            : "border-2 border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <svg className="size-5" fill="none" viewBox="0 0 15 15">
                          <path d={svgPaths.p52804c0} fill={activeTab === "twitter" ? "white" : "#364153"} />
                        </svg>
                        <span>X (트위터)</span>
                      </motion.button>
                    </div>

                    {/* Input Area */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden rounded-2xl border-2 border-gray-200 bg-white"
                    >
                      <textarea
                        placeholder="오늘 있었던 일이나 떠오르는 생각을 3줄 내외로 적어보세요."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="w-full resize-none border-0 p-6 text-gray-900 outline-none placeholder:text-gray-400"
                        rows={6}
                      />
                    </motion.div>

                    {transformError && (
                      <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                        {transformError}
                      </div>
                    )}

                    {/* Convert Button */}
                    <motion.button
                      whileHover={!isTransforming ? { scale: 1.02 } : {}}
                      whileTap={!isTransforming ? { scale: 0.98 } : {}}
                      onClick={handleConvert}
                      disabled={isTransforming || !inputText.trim()}
                      className={`group flex w-full items-center justify-center gap-3 rounded-2xl px-8 py-5 font-semibold text-white shadow-xl transition-shadow ${
                        isTransforming || !inputText.trim()
                          ? "bg-purple-400 shadow-purple-500/10 cursor-not-allowed"
                          : "bg-gradient-to-b from-purple-600 to-blue-500 shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/40"
                      }`}
                    >
                      <span className="text-lg">
                        {isTransforming ? "변환 중..." : "탭해서 변환하기"}
                      </span>
                      <motion.svg
                        className="size-5"
                        fill="none"
                        viewBox="0 0 20 20"
                        animate={{
                          x: [0, 4, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        style={isTransforming ? { opacity: 0.6 } : undefined}
                      >
                        <path
                          d="M8 5.5L12.5 10L8 14.5"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </motion.svg>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            // Result View
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="w-full"
            >
              {/* Header */}
              <div className="mb-12 text-center">
                <h2 className="mb-4 text-4xl md:text-5xl font-bold text-gray-900">
                  변환 완료!
                </h2>
                <p className="text-lg md:text-xl text-gray-600">
                  같은 내용, 다른 감성. 플랫폼별로 최적화된 결과를 확인해보세요.
                </p>
              </div>

              {/* Results Grid */}
              <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                  {/* Twitter Result */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex flex-col h-full space-y-6"
                  >
                    {/* Platform Label */}
                    <div className="flex items-center gap-2">
                      <div className="flex size-8 items-center justify-center rounded-full bg-black">
                        <svg className="size-5" fill="none" viewBox="0 0 20 20">
                          <path d={svgPathsResult.p1bb63c00} fill="white" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">X (트위터)</h3>
                    </div>

                    {/* Twitter Post Card */}
                    <div className="flex-1 overflow-hidden rounded-3xl p-6 shadow-2xl" style={{ backgroundImage: "linear-gradient(126.183deg, rgb(249, 250, 251) 0%, rgb(255, 255, 255) 100%)" }}>
                      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-4">
                        {/* Post Header */}
                        <div className="mb-4 flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="size-12 shrink-0 rounded-full" style={{ backgroundImage: "linear-gradient(135deg, rgb(142, 81, 255) 0%, rgb(43, 127, 255) 100%)" }} />
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-gray-900">TapTap User</p>
                                <svg className="size-5" fill="none" viewBox="0 0 20 20">
                                  <path d={svgPathsResult.p19991100} fill="#51A2FF" />
                                </svg>
                              </div>
                              <p className="text-sm text-gray-500">@taptap_user</p>
                            </div>
                          </div>
                          <button className="text-xl text-gray-400">•••</button>
                        </div>

                        {/* Post Content */}
                        <div className="mb-4 space-y-2 text-sm text-gray-900">
                          {(transformResult?.twitter ?? "")
                            .split("\n")
                            .map((line: string) => line.trim())
                            .filter(Boolean)
                            .map((line: string, idx: number) => (
                              <p key={idx}>{line}</p>
                            ))}
                        </div>

                        {/* Post Image */}
                        <div className="mb-4 overflow-hidden rounded-2xl border border-gray-100 bg-white">
                          <img
                            src={twitterImageSrc}
                            alt={bestAlt}
                            className="w-full object-cover"
                            style={{ aspectRatio: "16/9" }}
                            loading="lazy"
                          />
                        </div>

                        {/* Timestamp */}
                        <p className="mb-3 text-sm text-gray-500">2시간 전</p>

                        {/* Engagement Stats */}
                        <div className="flex items-center gap-6 border-t border-gray-100 pt-3 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <svg className="size-5" fill="none" viewBox="0 0 20 20">
                              <path d={svgPathsResult.pc663880} stroke="#6A7282" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                            </svg>
                            <span>24</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="size-5" fill="none" viewBox="0 0 20 20">
                              <path d={svgPathsResult.p12288f00} stroke="#6A7282" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                              <path d={svgPathsResult.p1788ca00} stroke="#6A7282" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                              <path d={svgPathsResult.p32511300} stroke="#6A7282" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                              <path d={svgPathsResult.pcf76200} stroke="#6A7282" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                            </svg>
                            <span>12</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="size-5" fill="none" viewBox="0 0 20 20">
                              <path d={svgPathsResult.p2f84f400} stroke="#6A7282" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                            </svg>
                            <span>156</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="size-5" fill="none" viewBox="0 0 20 20">
                              <path d={svgPathsResult.p34d64900} stroke="#6A7282" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                              <path d={svgPathsResult.p9c60480} stroke="#6A7282" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                              <path d="M10 1.66667V12.5" stroke="#6A7282" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                            </svg>
                            <span>2.1K</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Share Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-black px-6 py-4 font-semibold text-white shadow-lg transition-shadow hover:shadow-xl"
                    >
                      <svg className="size-5" fill="none" viewBox="0 0 20 20">
                        <path d={svgPathsResult.p1bb63c00} fill="white" />
                      </svg>
                      <span>X로 공유</span>
                    </motion.button>
                  </motion.div>

                  {/* Instagram Result */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex flex-col h-full space-y-6"
                  >
                    {/* Platform Label */}
                    <div className="flex items-center gap-2">
                      <div className="flex size-8 items-center justify-center rounded-full" style={{ backgroundImage: "linear-gradient(45deg, rgb(253, 199, 0) 0%, rgb(246, 51, 154) 50%, rgb(152, 16, 250) 100%)" }}>
                        <svg className="size-5" fill="none" viewBox="0 0 20 20">
                          <path d={svgPathsResult.p4b98700} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                          <path d={svgPathsResult.p19f4a800} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                          <path d="M14.5833 5.41667H14.5917" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">Instagram</h3>
                    </div>

                    {/* Instagram Post Card */}
                    <div className="flex-1 overflow-hidden rounded-3xl p-6 shadow-2xl" style={{ backgroundImage: "linear-gradient(126.183deg, rgb(253, 242, 248) 0%, rgb(250, 245, 255) 100%)" }}>
                      <div className="overflow-hidden rounded-2xl border border-pink-100 bg-white">
                        {/* Post Header */}
                        <div className="flex items-center justify-between border-b border-gray-100 p-4">
                          <div className="flex items-center gap-3">
                            <div className="size-8 rounded-full p-0.5" style={{ backgroundImage: "linear-gradient(45deg, rgb(253, 199, 0) 0%, rgb(246, 51, 154) 50%, rgb(152, 16, 250) 100%)" }}>
                              <div className="size-full rounded-full bg-white p-0.5">
                                <div className="size-full rounded-full" style={{ backgroundImage: "linear-gradient(135deg, rgb(142, 81, 255) 0%, rgb(43, 127, 255) 100%)" }} />
                              </div>
                            </div>
                            <p className="font-semibold text-gray-900">taptap_user</p>
                          </div>
                          <button className="text-2xl text-gray-900">•••</button>
                        </div>

                        {/* Post Image */}
                        <div className="overflow-hidden border-b border-gray-100 bg-white">
                          <img
                            src={instagramImageSrc}
                            alt={bestAlt}
                            className="w-full object-cover"
                            style={{ aspectRatio: "1/1" }}
                            loading="lazy"
                          />
                        </div>

                        {/* Post Actions */}
                        <div className="space-y-3 p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <svg className="size-6" fill="none" viewBox="0 0 24 24">
                                <path d={svgPathsResult.p337b8d80} stroke="#101828" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                              </svg>
                              <svg className="size-6" fill="none" viewBox="0 0 24 24">
                                <path d={svgPathsResult.p3beeb9c0} stroke="#101828" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                              </svg>
                              <svg className="size-6" fill="none" viewBox="0 0 26 26">
                                <path d={svgPathsResult.p17d2b00} fill="#101828" />
                              </svg>
                            </div>
                            <svg className="size-6" fill="none" viewBox="0 0 24 24">
                              <path d={svgPathsResult.p1ed2c280} stroke="#101828" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                            </svg>
                          </div>

                          {/* Likes */}
                          <p className="text-sm font-semibold text-gray-900">좋아요 892개</p>

                          {/* Caption */}
                          <div className="text-sm whitespace-pre-wrap text-gray-900">
                            <span className="font-semibold text-gray-900">taptap_user</span>
                            <span className="ml-2">{transformResult?.instagram ?? ""}</span>
                          </div>

                          {/* Timestamp */}
                          <p className="text-xs text-gray-500">2시간 전</p>
                        </div>
                      </div>
                    </div>

                    {/* Share Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 font-semibold text-white shadow-lg transition-shadow hover:shadow-xl"
                      style={{ backgroundImage: "linear-gradient(90deg, rgb(246, 51, 154) 0%, rgb(152, 16, 250) 100%)" }}
                    >
                      <svg className="size-5" fill="none" viewBox="0 0 20 20">
                        <path d={svgPathsResult.p4b98700} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                        <path d={svgPathsResult.p19f4a800} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                        <path d="M14.5833 5.41667H14.5917" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                      </svg>
                      <span>스토리로 공유</span>
                    </motion.button>
                  </motion.div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 rounded-2xl bg-gradient-to-b from-purple-600 to-blue-500 px-8 py-4 font-semibold text-white shadow-xl shadow-purple-500/30 transition-shadow hover:shadow-2xl hover:shadow-purple-500/40"
                  >
                    <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v13m0 0l-4-4m4 4l4-4m6 5v3a2 2 0 01-2 2H4a2 2 0 01-2-2v-3" />
                    </svg>
                    <span>바로 이미지 저장하기</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 rounded-2xl border-2 border-gray-300 bg-white px-8 py-4 font-semibold text-gray-700 transition-all hover:border-gray-400"
                  >
                    <svg className="size-5" fill="none" viewBox="0 0 26 26">
                      <path d={svgPathsResult.p17d2b00} fill="#374151" />
                    </svg>
                    <span>공유하기</span>
                  </motion.button>
                </div>

                {/* Reset Button */}
                <div className="mt-8 text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={handleReset}
                    className="text-purple-600 font-semibold hover:text-purple-700 transition-colors"
                  >
                    ← 다시 변환하기
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}