"use client";

import { Card, CardBody } from "@heroui/card";
import { Button, Image, Skeleton } from "@heroui/react";
import { useTheme } from "next-themes";
import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import LoadingAnimation from "@/components/cards/loadingAnimation";

const PairingCard = ({ alcohol }) => {
  const { resolvedTheme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState("Meat");
  const [alcoholCate, setAlcoholCate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [pairingData, setPairingData] = useState(null);
  const [youtubeLink, setYoutubeLink] = useState("");
  const categories = ["Meat", "Sea Food", "Fried", "Snack"];

  // AbortController 저장
  const pairingAbortControllerRef = useRef(null);
  const youtubeAbortControllerRef = useRef(null);

  // alcohol 객체의 tanin 유무에 따라 양주/와인 구분
  useEffect(() => {
    if (alcohol && Object.prototype.hasOwnProperty.call(alcohol, "tanin")) {
      setAlcoholCate("wine");
    } else {
      setAlcoholCate("yangju");
    }
  }, [alcohol]);

  // YouTube API 요청 함수 (Abort 적용)
  const fetchYoutubeLink = useCallback(async (dishName) => {
    // 기존 YouTube 요청이 있으면 취소
    if (youtubeAbortControllerRef.current) {
      youtubeAbortControllerRef.current.abort();
    }

    const controller = new AbortController();
    youtubeAbortControllerRef.current = controller;

    try {
      const ytResponse = await axios.get("/api/v1/pairing/shorts/search", {
        params: { dish: dishName + " 레시피" },
        signal: controller.signal,
      });

      setYoutubeLink(ytResponse.data.result);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("YouTube 요청이 취소되었습니다.");
      } else {
        console.error("Failed to fetch YouTube link:", error);
      }
    }
  }, []);

  const fetchPairing = useCallback(async (category, alcoholCategory) => {
    setIsLoading(true);
    // 기존 Pairing 요청이 있으면 취소
    if (pairingAbortControllerRef.current) {
      pairingAbortControllerRef.current.abort();
    }

    const controller = new AbortController();
    pairingAbortControllerRef.current = controller;

    setIsLoading(true);
    setPairingData(null);
    setYoutubeLink("");

    try {
      const endpoint = alcoholCategory === "yangju" ? "/api/v1/pairing/yangju" : "/api/v1/pairing/wine";
      const response = await axios.post(endpoint, { ...alcohol, category }, {
        signal: controller.signal,
      });
      setIsLoading(false);
      setPairingData(response.data.data);

      if (response.data.data && response.data.data.dish_name) {
        fetchYoutubeLink(response.data.data.dish_name);
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Pairing 요청이 취소되었습니다.");
      } else {
        console.error("Failed to fetch recommendation:", error);
      }
    }

  }, [alcohol, fetchYoutubeLink]);

  // 초기 데이터 로드 (Meat 카테고리 기본값)
  useEffect(() => {
    if (alcoholCate) {
      fetchPairing("Meat", alcoholCate);
    }
  }, [alcoholCate, fetchPairing]);

  // 유튜브 썸네일 링크 변환 함수
  const getYoutubeThumbnailFromLink = (link) => {
    if (!link) return "";
    const videoId = link.split("/").pop();
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

  const thumbnailUrl = getYoutubeThumbnailFromLink(youtubeLink);

  // 컴포넌트 언마운트 시 요청 취소
  useEffect(() => {
    return () => {
      if (pairingAbortControllerRef.current) pairingAbortControllerRef.current.abort();
      if (youtubeAbortControllerRef.current) youtubeAbortControllerRef.current.abort();
    };
  }, []);

  return (
    <Card className={`${resolvedTheme === "dark" ? "bg-content1" : "bg-white"}`}>
      <CardBody>
        <div className="flex justify-evenly space-x-2 mb-4">
          {categories.map((category) => (
            <Button
              key={category}
              size="sm"
              radius="sm"
              className={`${selectedCategory === category
                ? "bg-primary text-white"
                : "bg-gray-200 text-black"
                } transition duration-300 flex-1`}
              onPress={() => {
                setSelectedCategory(category);
                fetchPairing(category, alcoholCate);
              }}
            >
              {category}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <LoadingAnimation />
        ) : (
          <div className="flex items-center space-x-4">

            {youtubeLink ? (
              <a
                href={youtubeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block"
              >
                <Image
                  src={thumbnailUrl}
                  alt="YouTube Thumbnail"
                  className="w-24 h-40 rounded-md object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10 text-white opacity-80"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </a>
            ) : (
              <Skeleton className="w-24 h-40 rounded-md" />
            )}


            <div className="w-full flex flex-col">
              {pairingData ? (
                <>
                  <p className="text-lg font-bold">{pairingData.dish_name}</p>
                  <p className="text-sm text-gray-600">{pairingData.description}</p>
                  {pairingData.side_dish && pairingData.side_dish.length > 0 && (
                    <>
                      <p className="mt-2 text-sm font-bold">곁들임 요리</p>
                      <ul className="mt-2 list-disc pl-4">
                        {pairingData.side_dish.map((item, index) => (
                          <li key={index} className="text-sm">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-500">추천 결과가 없습니다.</p>
              )}
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default PairingCard;
