import { motion } from "motion/react";
import svgPaths from "../../imports/svg-eir802r15e";
import img from "../../assets/problem-bg-749fb7e3.png";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

export function ProblemSection() {
  const problems = [
    {
      title: "플랫폼별 피로도",
      description: "인스타는 감성적으로, X는 간결하게, 네이버 블로그는 친근하게... 플랫폼마다 다른 톤앤매너에 지쳐버렸어요",
      gradient: "from-pink-500 to-pink-400",
      icon: (
        <svg className="size-full" viewBox="0 0 32 32" fill="none">
          {/* 얼굴 원형 */}
          <circle cx="16" cy="16" r="11" stroke="white" strokeWidth="2.5" />
          {/* 왼쪽 눈 */}
          <circle cx="12" cy="13" r="1.3" fill="white" />
          {/* 오른쪽 눈 */}
          <circle cx="20" cy="13" r="1.3" fill="white" />
          {/* 피곤한 입 모양 (살짝 내려간 곡선) */}
          <path
            d="M11 20c1.5-2 3.2-3 5-3s3.5 1 5 3"
            stroke="white"
            strokeWidth="2.3"
            strokeLinecap="round"
          />
          {/* 위로 번지는 피곤한 선 */}
          <path
            d="M9 9.5C10.2 8.3 11.7 7.6 13.5 7.4"
            stroke="white"
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity={0.8}
          />
          <path
            d="M18.5 7.4C20.3 7.6 21.8 8.3 23 9.5"
            stroke="white"
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity={0.8}
          />
        </svg>
      )
    },
    {
      title: "이미지 선택 어려움",
      description: "어떤 이미지가 어울릴까? 어디 이미지를 배치할까? 이미지를 고르다가 시간만 흘러가요",
      gradient: "from-orange-500 to-yellow-500",
      icon: (
        <svg className="size-full" viewBox="0 0 32 32" fill="none">
          {/* 사진 프레임 */}
          <rect
            x="6"
            y="7"
            width="20"
            height="18"
            rx="3"
            stroke="white"
            strokeWidth="2.3"
          />
          {/* 해/썸네일 점 */}
          <circle cx="12" cy="13" r="2" fill="white" />
          {/* 산 / 이미지 레이아웃 */}
          <path
            d="M9 22l4.5-5 3.5 3 4-5 3 4.5"
            stroke="white"
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    },
    {
      title: "결국 포기",
      description: "완벽하게 만들려다 번아웃... 결국 초안만 쌓여가고 포스팅은 미뤄지기만 해요",
      gradient: "from-purple-500 to-purple-400",
      icon: (
        <svg className="size-full" fill="none" viewBox="0 0 32 32">
          <path d={svgPaths.p1dee4500} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
          <path d="M20 12L12 20" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
          <path d="M12 12L20 20" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
        </svg>
      )
    }
  ];

  return (
    <section className="relative bg-white px-4 py-16 md:px-8 md:py-24 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center md:mb-16"
        >
          <h2 className="mb-4 text-4xl md:text-5xl font-bold text-gray-900">
            콘텐츠는 있는데,
          </h2>
          <h2
            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%), url('${img}')`,
              backgroundRepeat: "repeat, no-repeat",
              backgroundSize: "auto auto, cover",
              backgroundPosition: "top left, center"
            }}
          >
            올릴 엄두가 안 나시나요?
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative overflow-hidden rounded-3xl border border-gray-200/50 bg-gradient-to-br from-gray-50 to-gray-100/50 p-8 backdrop-blur-sm transition-shadow hover:shadow-xl"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
                className={`mb-6 inline-flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br ${problem.gradient} p-4 shadow-lg`}
              >
                {problem.icon}
              </motion.div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900">
                {problem.title}
              </h3>
              <p className="leading-relaxed text-gray-600">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
