"use client";

import React from "react";

export default function BottleLoader() {
  return (
    <div className="loader-container">
      <div className="loader-wrap">
        <div className="bottle-wrap">
          {/* 병 4개 렌더링 */}
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bottle-container">
              {/* 병뚜껑 */}
              <div className={`cap cap-${i}`}></div>

              {/* 병 */}
              <div className="bottle">
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="26.81px"
                  height="106.124px"
                  viewBox="0 0 26.81 106.124"
                  xmlSpace="preserve"
                >
                  <defs>
                    {/* 각 병의 물 채우기 패턴 */}
                    <pattern
                      id={`water_fill_${i}`}
                      width="1"
                      height="1"
                      patternContentUnits="objectBoundingBox"
                    >
                      <rect x="0" y="0" width="1" height="1" fill="#900020" />
                    </pattern>

                    {/* 병 내부 영역 클리핑 */}
                    <clipPath id={`bottle_clip_${i}`}>
                      <path
                        d="M17.905,38.109V9.734c0,0,1.75-3.125,1.375-5.5
                          s-5.875-2.232-5.875-2.232s-5.5-0.143-5.875,2.232s1.375,5.5,1.375,5.5v28.375
                          c0,0-7.405,1.311-7.405,16.03s0,40.72,0,45.47s5.515,5.515,5.515,5.515h6.39h6.39
                          c0,0,5.515-0.765,5.515-5.515s0-30.75,0-45.47S17.905,38.109,17.905,38.109z"
                      />
                    </clipPath>
                  </defs>

                  {/* 병 외곽선 */}
                  <path
                    d="M17.905,38.109V9.734c0,0,1.75-3.125,1.375-5.5
                      s-5.875-2.232-5.875-2.232s-5.5-0.143-5.875,2.232s1.375,5.5,1.375,5.5v28.375
                      c0,0-7.405,1.311-7.405,16.03s0,40.72,0,45.47s5.515,5.515,5.515,5.515h6.39h6.39
                      c0,0,5.515-0.765,5.515-5.515s0-30.75,0-45.47S17.905,38.109,17.905,38.109z"
                    fill="none"
                    stroke="#900020"
                    strokeWidth="3"
                  />

                  {/* 병 내부의 물 */}
                  <rect
                    className="bottle-fill"
                    x="0"
                    y="106.124"
                    width="26.81"
                    height="0"
                    clipPath={`url(#bottle_clip_${i})`}
                    fill={`url(#water_fill_${i})`}
                    style={{
                      animation: `fillUp 2.5s infinite ease-in-out ${i * 0.5}s`,
                    }}
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* 진행 바 */}
        <div className="bar"></div>
      </div>

      {/* 스타일 */}
      <style jsx>{`
        .loader-wrap {
          width: 100%;
          height: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .bottle-wrap {
          display: flex;
          justify-content: center;
          gap: 10px;
        }

        .bottle-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }

        .bottle {
          width: 26.81px;
          height: 106.124px;
        }

        /* 병뚜껑 (각 병 위에 개별적으로 배치) */
        .cap {
          width: 10px;
          height: 5px;
          background-color: #900020;
          opacity: 1;
          position: absolute;
          top: -5px;
          transition: transform 0.5s ease-in-out;
        }

        /* 각 병마다 다른 시간 간격으로 뚜껑이 날아감 */
        .cap.cap-0 { animation: capFly 2.5s infinite ease-in-out 0s; }
        .cap.cap-1 { animation: capFly 2.5s infinite ease-in-out 0.5s; }
        .cap.cap-2 { animation: capFly 2.5s infinite ease-in-out 1s; }
        .cap.cap-3 { animation: capFly 2.5s infinite ease-in-out 1.5s; }

        .bar {
          height: 5px;
          width: 100%;
          max-width: 200px;
          margin: 10px 0 5px 0;
          position: relative;
          background-color: #900020;
        }

        .bar:before {
          top: 0;
          left: 0;
          width: 0;
          content: '';
          height: inherit;
          position: absolute;
          background-color: #900020;
          animation: bar 2.5s linear infinite;
        }

        /* 물 채우기 애니메이션 */
        @keyframes fillUp {
          0% { height: 0; y: 106.124px; }
          100% { height: 80px; y: 26px; }
        }

        /* 뚜껑이 날아가는 애니메이션 */
        @keyframes capFly {
          0%, 85% { transform: translateY(0); opacity: 1; }
          90% { transform: translateY(-10px); opacity: 1; }
          100% { transform: translateY(-20px); opacity: 0; }
        }

        /* 로딩 바 */
        @keyframes bar {
          0% { width: 0; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
