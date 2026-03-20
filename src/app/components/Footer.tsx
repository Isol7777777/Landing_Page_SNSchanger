import { motion } from "motion/react";
import svgPaths from "../../imports/svg-eir802r15e";

export function Footer() {
  return (
    <footer className="relative bg-background px-4 py-12 md:px-8 md:py-16 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Logo & Company Info */}
          <div className="flex items-center gap-3">
            <div className="relative shrink-0 size-10">
              <div className="absolute inset-[-5%_-30%_-55%_-30%]">
                <svg className="block size-full" fill="none" viewBox="0 0 64 64">
                  <g filter="url(#filter0_dd_footer)" id="Container">
                    <path d={svgPaths.p12f49700} fill="url(#paint0_linear_footer)" shapeRendering="crispEdges" />
                    <g id="Union">
                      <path d={svgPaths.p1a2b3400} fill="white" />
                      <path d={svgPaths.pd0b5d00} fill="white" />
                      <path d={svgPaths.p1daf9200} fill="white" />
                      <path d={svgPaths.p35ba3100} fill="white" />
                      <path d={svgPaths.pb97e030} fill="white" />
                      <path d={svgPaths.pac47f00} fill="white" />
                      <path d={svgPaths.p2e59cc00} fill="white" />
                      <path d={svgPaths.p1ef9e900} fill="white" />
                      <path d={svgPaths.p32ec9440} fill="white" />
                      <path d={svgPaths.pea30680} fill="white" />
                    </g>
                  </g>
                  <defs>
                    <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="64" id="filter0_dd_footer" width="64" x="0" y="0">
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                      <feMorphology in="SourceAlpha" operator="erode" radius="4" result="effect1_dropShadow_footer" />
                      <feOffset dy="4" />
                      <feGaussianBlur stdDeviation="3" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix type="matrix" values="0 0 0 0 0.678431 0 0 0 0 0.27451 0 0 0 0 1 0 0 0 0.3 0" />
                      <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_footer" />
                      <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                      <feMorphology in="SourceAlpha" operator="erode" radius="3" result="effect2_dropShadow_footer" />
                      <feOffset dy="10" />
                      <feGaussianBlur stdDeviation="7.5" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix type="matrix" values="0 0 0 0 0.678431 0 0 0 0 0.27451 0 0 0 0 1 0 0 0 0.3 0" />
                      <feBlend in2="effect1_dropShadow_footer" mode="normal" result="effect2_dropShadow_footer" />
                      <feBlend in="SourceGraphic" in2="effect2_dropShadow_footer" mode="normal" result="shape" />
                    </filter>
                    <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_footer" x1="32" x2="32" y1="2" y2="42">
                      <stop stopColor="#8A2BE2" />
                      <stop offset="1" stopColor="#007BFF" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            <span className="text-2xl font-bold text-white">TapTap</span>
          </div>

          {/* Description */}
          <p className="max-w-2xl leading-relaxed text-muted-foreground">
            AI 기반 SNS 통합 포스팅으로 여러분의 콘텐츠 발행을 더욱 쉽고 빠르게 만들어드립니다.
          </p>
          <p className="max-w-2xl leading-relaxed text-muted-foreground">
            하나의 메모가 모든 플랫폼에 최적화된 콘텐츠로 탄생합니다.
          </p>

          {/* Copyright */}
          <div className="border-t border-border pt-8">
            <p className="text-sm text-muted-foreground">© 2026 TapTap Inc. All rights reserved.</p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
