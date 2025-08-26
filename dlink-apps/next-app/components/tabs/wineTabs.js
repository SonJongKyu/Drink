"use client";

import { Tabs, Tab } from "@heroui/tabs";
import { useTheme } from "next-themes";
import { Spinner } from "@heroui/spinner";
import { useState, useEffect } from "react";
import { Link } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import PairingCard from "../cards/pairingCard";
import ReviewCard from "@/components/review/reviewcard";

export default function WineTabs({ alcohol }) {
  // 모든 훅은 항상 최상위에서 호출되어야 합니다.
  const { resolvedTheme } = useTheme();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reviews, setReviews] = useState([]);
  const [loadingReview, setLoadingReview] = useState(false);
  const [errorReview, setErrorReview] = useState(null);

  // alcohol이 없을 경우에도 훅은 호출되었으므로, 여기서는 값이 없으면 빈 문자열 등을 할당합니다.
  const category = alcohol ? alcohol.category : "";
  const drinkId =
    alcohol && alcohol._id && typeof alcohol._id === "object" && alcohol._id.$oid
      ? alcohol._id.$oid
      : alcohol
        ? alcohol._id
        : "";

  useEffect(() => {
    async function fetchReviews() {
      try {
        setLoadingReview(true);
        const res = await fetch(
          `/api/v1/reviews/search?category=${category}&drinkId=${drinkId}`
        );
        // 만약 404 응답이면 리뷰가 없는 것으로 처리
        if (res.status === 404) {
          setReviews([]);
          setErrorReview("리뷰가 없습니다.");
          return;
        }
        if (!res.ok) {
          throw new Error(
            `리뷰 목록을 불러오지 못했습니다. 서버 응답 코드: ${res.status}`
          );
        }
        const data = await res.json();
        if (!data || Object.keys(data).length === 0) {
          setReviews([]);
          return;
        }
        // 응답 객체를 배열로 변환 (각 리뷰의 key 값을 writeUser 및 id로 설정)
        const transformedReviews = Object.entries(data).map(
          ([userId, review]) => ({
            ...review,
            writeUser: userId,
            id: userId,
          })
        );
        setReviews(transformedReviews);
        setErrorReview(null);
      } catch (error) {
        console.error("❌ 리뷰 불러오기 실패:", error.message);
        setReviews([]);
        setErrorReview(error.message);
      } finally {
        setLoadingReview(false);
      }
    }
    if (category && drinkId) {
      fetchReviews();
    }
  }, [category, drinkId]);

  // useEffect(() => {
  //   // category와 drinkId가 모두 존재할 때만 리뷰를 불러옵니다.
  //   if (!category || !drinkId) return;
  //   async function fetchReviews() {
  //     try {
  //       setLoadingReview(true);
  //       const res = await fetch(
  //         `/api/v1/reviews/search?category=${category}&drinkId=${drinkId}`
  //       );
  //       if (!res.ok) {
  //         throw new Error(
  //           `리뷰 목록을 불러오지 못했습니다. 서버 응답 코드: ${res.status}`
  //         );
  //       }
  //       const data = await res.json();
  //       if (!data || Object.keys(data).length === 0) {
  //         console.warn("🚨 리뷰 데이터가 비어있습니다.");
  //         setReviews([]);
  //         return;
  //       }
  //       // 응답 객체를 배열로 변환 (각 리뷰의 key 값을 writeUser 및 id로 설정)
  //       const transformedReviews = Object.entries(data).map(
  //         ([userId, review]) => ({
  //           ...review,
  //           writeUser: userId,
  //           id: userId,
  //         })
  //       );
  //       setReviews(transformedReviews);
  //     } catch (error) {
  //       console.error("❌ 리뷰 불러오기 실패:", error.message);
  //       setReviews([]);
  //       setErrorReview(error.message);
  //     } finally {
  //       setLoadingReview(false);
  //     }
  //   }
  //   fetchReviews();
  // }, [category, drinkId]);

  const tabs = [
    {
      id: "review",
      label: "평가 & 리뷰",
      content: (
        <>
          {loadingReview ? (
            <div className="py-4 text-center">
              <Spinner />
            </div>
          ) : errorReview ? (
            <div className="py-4 text-center">
              {errorReview}
            </div>
          ) : reviews && reviews.length > 0 ? (
            <div className="space-y-4 mx-auto max-w-2xl">
              {/* 최대 3개의 리뷰만 보여줌 */}
              {reviews.slice(0, 3).map((review) => (
                <ReviewCard
                  key={review.id}
                  session={session}
                  review={review}
                  resolvedTheme={resolvedTheme}
                />
              ))}
            </div>
          ) : (
            <div className="py-4 text-center">
              리뷰가 없습니다.
            </div>
          )}
          <div className="flex justify-center mt-4">
            <Link
              isBlock
              showAnchorIcon
              className="text-blue-500 hover:underline text-sm"
              onPress={() => {
                router.push(`/reviews?category=${category}&drinkId=${drinkId}`);
              }}
            >
              다른 리뷰 더보기
            </Link>
          </div>
        </>
      ),
    },
    {
      id: "recommend",
      label: "추천 안주",
      content: <PairingCard alcohol={alcohol} />,
    },
  ];

  return (
    <div className="flex w-full flex-col rounded-md shadow-md">
      {/* alcohol 데이터가 없으면 spinner를, 있으면 탭 내용을 보여줍니다. */}
      {!alcohol ? (
        <div className="py-4 text-center">
          <Spinner />
        </div>
      ) : (
        <Tabs aria-label="Dynamic tabs" items={tabs} fullWidth>
          {(item) => (
            <Tab key={item.id} title={item.label}>
              {item.content}
            </Tab>
          )}
        </Tabs>
      )}
    </div>
  );
}
