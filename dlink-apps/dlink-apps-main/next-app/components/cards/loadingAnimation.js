// "use client";

// import { useState, useEffect } from "react";

// const LoadingAnimation = () => {
//   const message = "추천 안주가 생성 중입니다...";
//   const [displayText, setDisplayText] = useState("");
//   const [index, setIndex] = useState(0);
//   const [isDeleting, setIsDeleting] = useState(false); // 글자를 지우는 중인지 체크

//   useEffect(() => {
//     const typingSpeed = isDeleting ? 50 : 100; // 지울 때는 더 빠르게
//     const delayBeforeDelete = 1000; // 문장이 완성된 후 유지 시간

//     const typingInterval = setTimeout(() => {
//       if (!isDeleting && index < message.length) {
//         setDisplayText((prev) => prev + message[index]);
//         setIndex(index + 1);
//       } else if (!isDeleting && index === message.length) {
//         setTimeout(() => setIsDeleting(true), delayBeforeDelete); // 일정 시간 유지 후 삭제 시작
//       } else if (isDeleting && index > 0) {
//         setDisplayText((prev) => prev.slice(0, -1));
//         setIndex(index - 1);
//       } else {
//         setIsDeleting(false); // 삭제가 끝나면 다시 타이핑 시작
//       }
//     }, typingSpeed);

//     return () => clearTimeout(typingInterval);
//   }, [index, isDeleting, message]);

//   return (
//     <div className="flex flex-col items-center justify-center h-32 space-y-4">
//       <p className="text-lg font-semibold text-gray-600">{displayText}</p>
//     </div>
//   );
// };

// export default LoadingAnimation;





"use client";

import BottleLoader from "./BottleLoader";
import TypingText from "./TypingText";

const LoadingAnimation = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[250px]">
      {/* 병 SVG 애니메이션 */}
      <BottleLoader />

      {/* 타이핑 애니메이션 문구 */}
      <TypingText />

      <style>
        {`
          @keyframes bar {
            0% { width: 0; }
            100% { width: 100%; }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingAnimation;
