import React from "react";
import logoTapTap from "../../assets/logo-taptap.png";

export function Header() {
  return (
    <header className="w-full bg-white border-b border-gray-100">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-4 md:px-6">
        <div className="flex items-center gap-2"> 
          {/* 로고 이미지: 
             1. -mb-2 (하단 음수 마진)를 주어 그림자 영역만큼 바닥으로 끌어내립니다.
             2. h-12로 크기를 충분히 키웠습니다.
          */}
          <img
            src={logoTapTap}
            alt="TapTap" className="h-15 w-auto object-contain -mb-2 relative z-0 translate-y-[5px]" 
          />
          
          {/* 텍스트: 
             1. font-black(또는 bold)으로 이미지 무게감과 맞췄습니다.
             2. 그라데이션이 잘리지 않도록 넉넉한 line-height를 유지합니다.
          */}
          <span className="text-2xl font-black bg-gradient-to-r from-[#8A2BE2] to-[#007BFF] bg-clip-text text-transparent leading-relaxed tracking-tight">
            TapTap
          </span>
        </div>
      </div>
    </header>
  );
}