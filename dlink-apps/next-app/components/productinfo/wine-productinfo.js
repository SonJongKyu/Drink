"use client";

import { Card, CardBody } from "@heroui/card";
import { Image, ScrollShadow } from "@heroui/react";
import { Progress } from "@heroui/react";

export default function wineDetail({ wine }) {
  // wine.details를 줄바꿈 기준으로 배열로 변환
  const detailsLines = wine.details ? wine.details.split('\n') : [];

  return (
    <Card className="p-4 shadow-lg">
      <div className="flex flex-row mb-4">
        <div className="flex-shrink-0">
          <Image
            alt={wine.korName}
            className="object-cover rounded-xl"
            src={wine.image || "/LOGO4.png"}
            width={150}
            height={188}
          />
        </div>
        <div className="flex flex-col justify-center ml-6">
          <h6 className="font-bold text-xl mt-1">{wine.korName}</h6>
          <p className="text-tiny uppercase font-bold text-gray-500">{wine.engName}</p>
          <p className="text-sm mt-2">
            <p>원산지: {wine.origin}</p>
            <p>도수: {wine.percent}%</p>
            <p>용량: {wine.volume}ml</p>
            <p>가격: {wine?.price?.toLocaleString()}원</p>
            <p>카테고리: {wine.category}</p>
          </p>
        </div>
      </div>

      <CardBody>
        {/* wine.details 줄 단위로 렌더링 */}
        <div className="max-w-full border p-2 rounded-md bg-content1">
          <ScrollShadow hideScrollBar className="h-[25vh]">
          {detailsLines.map((line, index) => (
            <p
              key={index}
              className={`${index % 2 === 0 ? "font-bold" : ""} text-sm`}
            >
              {line}
            </p>
          ))}
          </ScrollShadow>
        </div>


        <div className="space-y-3 mt-5">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-semibold w-16">단맛</span>
            <Progress value={wine.sweetness * 20} />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-semibold w-16">신맛</span>
            <Progress value={wine.acidity * 20} />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-semibold w-16">목넘김</span>
            <Progress value={wine.body * 20} />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-semibold w-16">떫은맛</span>
            <Progress value={wine.tannin * 20} />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
