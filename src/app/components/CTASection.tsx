import { useState } from "react";
import { motion } from "motion/react";
import { Check, Phone, ChevronRight } from "lucide-react";

// Google Form 연동 설정
const GOOGLE_FORM_ACTION =
  "https://docs.google.com/forms/d/e/1FAIpQLSd24_cPKP2NmZJtm9wpSHoaQ-OFZZnId3QE75V6zXGgBKZI6g/formResponse";

const FIELD_PHONE = "entry.634217926";
const FIELD_AGE = "entry.1143548964";
const FIELD_PRIVACY = "entry.311931167";
const FIELD_MARKETING = "entry.2061777063";

export function CTASection() {
  const [phone, setPhone] = useState("");
  const [agreements, setAgreements] = useState({
    age: false,
    privacy: false,
    marketing: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPrivacyDetails, setShowPrivacyDetails] = useState(false);

  const isSubmittable =
    agreements.age && agreements.privacy && phone.replace(/[^0-9]/g, "").length >= 10;

  const allAgreed = agreements.age && agreements.privacy && agreements.marketing;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSubmittable || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const normalizedPhone = phone.replace(/[^0-9]/g, "");

      // Google Forms는 브라우저 네비게이션(쿼리 스트링 기반)으로 보내는 것이
      // CORS/401 문제를 피하는 가장 안정적인 방식입니다.
      const url = new URL(GOOGLE_FORM_ACTION);

      // 필수 항목
      url.searchParams.set(FIELD_PHONE, normalizedPhone);
      url.searchParams.set(FIELD_AGE, "동의");
      url.searchParams.set(FIELD_PRIVACY, "동의");

      // 선택 항목(광고성 정보 수신) — 동의 시에만 "동의" 전송
      if (agreements.marketing) {
        url.searchParams.set(FIELD_MARKETING, "동의");
      }

      // 새 탭에서 구글 폼에 직접 전송 (브라우저가 폼 응답 페이지를 처리)
      window.open(url.toString(), "_blank", "noopener,noreferrer");

      alert("사전예약 신청이 완료되었습니다!");
      setPhone("");
      setAgreements({ age: false, privacy: false, marketing: false });
    } catch (error) {
      console.error("Google Form submit navigation error", error);
      alert("전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="cta-section"
      className="py-24 px-6 bg-gradient-to-br from-purple-600 via-[#8A2BE2] to-blue-600"
    >
      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-xl rounded-[40px] p-8 md:p-16 border border-white/20 shadow-2xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            가장 나다운 콘텐츠 발행의 시작
          </h2>
          <p className="text-xl text-white/80">
            지금 사전 예약하고 혜택을 놓치지 마세요!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 휴대폰 번호 입력 */}
          <div className="relative">
            <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 size-6" />
            <input
              type="tel"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/[^0-9]/g, ""))
              }
              placeholder="휴대전화 번호를 입력하세요 (- 제외)"
              className="w-full pl-16 pr-6 py-6 bg-white rounded-2xl text-lg focus:ring-4 focus:ring-purple-400/30 outline-none transition-all text-gray-900"
              required
            />
          </div>

          {/* 약관 동의 */}
          <div className="space-y-4 bg-white/5 rounded-2xl p-6 border border-white/10">
            {/* 모두 동의 (개별 동의 체크박스와 동일한 UI) */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="hidden"
                checked={allAgreed}
                onChange={() => {
                  const next = !allAgreed;
                  setAgreements({ age: next, privacy: next, marketing: next });
                }}
              />
              <div
                className={`size-6 rounded-md border-2 flex items-center justify-center transition-all ${
                  allAgreed ? "bg-white border-white" : "border-white/30"
                }`}
              >
                {allAgreed && <Check className="size-4 text-purple-600" />}
              </div>
              <span className="text-white font-bold leading-relaxed">
                모두 동의합니다.
              </span>
            </label>

            {/* 만 14세 이상 */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                className="hidden"
                checked={agreements.age}
                onChange={() =>
                  setAgreements((prev) => ({ ...prev, age: !prev.age }))
                }
              />
              <div
                className={`size-6 rounded-md border-2 flex items-center justify-center transition-all ${
                  agreements.age ? "bg-white border-white" : "border-white/30"
                }`}
              >
                {agreements.age && (
                  <Check className="size-4 text-purple-600" />
                )}
              </div>
              <span className="text-white font-medium">
                (필수) 만 14세 이상입니다.
              </span>
            </label>

            {/* 개인정보 동의 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label className="flex items-center gap-3 cursor-pointer flex-1">
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={agreements.privacy}
                    onChange={() =>
                      setAgreements((prev) => ({
                        ...prev,
                        privacy: !prev.privacy,
                      }))
                    }
                  />
                  <div
                    className={`size-6 rounded-md border-2 flex items-center justify-center transition-all ${
                      agreements.privacy
                        ? "bg-white border-white"
                        : "border-white/30"
                    }`}
                  >
                    {agreements.privacy && (
                      <Check className="size-4 text-purple-600" />
                    )}
                  </div>
                  <span className="text-white font-medium">
                    (필수) 개인정보 수집 및 이용에 동의합니다.
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowPrivacyDetails((prev) => !prev)}
                  className="ml-3 text-xs text-white/70 hover:text-white underline-offset-2 hover:underline whitespace-nowrap"
                >
                  {showPrivacyDetails ? "닫기" : "자세히 보기"}
                </button>
              </div>
              {showPrivacyDetails && (
                <div className="ml-9 p-4 bg-black/20 rounded-xl text-xs text-white/60 leading-relaxed">
                  1. 목적: 사전예약 신청 및 보상 전달 <br />
                  2. 항목: 휴대전화번호 <br />
                  3. 보유 기간: 동의일로부터 1년 이내
                </div>
              )}
            </div>

            {/* 광고성 정보 수신 */}
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="hidden"
                  checked={agreements.marketing}
                  onChange={() =>
                    setAgreements((prev) => ({
                      ...prev,
                      marketing: !prev.marketing,
                    }))
                  }
                />
                <div
                  className={`size-6 rounded-md border-2 flex items-center justify-center transition-all ${
                    agreements.marketing
                      ? "bg-white border-white"
                      : "border-white/30"
                  }`}
                >
                  {agreements.marketing && (
                    <Check className="size-4 text-purple-600" />
                  )}
                </div>
                <span className="text-white font-medium">
                  (선택) 광고성 정보 수신에 동의합니다.
                </span>
              </label>
              <p className="ml-9 text-[10px] text-white/40 leading-snug">
                탭탭의 소식 및 서비스 안내를 전달합니다. 언제든 거부하실 수
                있습니다.
              </p>
            </div>
          </div>

          {/* 제출 버튼 */}
          <motion.button
            whileHover={isSubmittable && !isSubmitting ? { scale: 1.02 } : {}}
            whileTap={isSubmittable && !isSubmitting ? { scale: 0.98 } : {}}
            disabled={!isSubmittable || isSubmitting}
            className={`w-full py-6 rounded-2xl text-xl font-bold transition-all flex items-center justify-center gap-3 shadow-2xl ${
              isSubmittable && !isSubmitting
                ? "bg-gray-900 text-white hover:bg-gray-800"
                : "bg-white/20 text-white/40 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? "전송 중..." : "사전 예약하고 혜택 받기"}
            <ChevronRight className="size-6" />
          </motion.button>
        </form>
      </div>
    </section>
  );
}