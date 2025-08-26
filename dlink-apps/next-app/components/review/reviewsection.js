"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Spinner, Button, addToast } from "@heroui/react";
import { useTheme } from "next-themes";
import { Modal, ModalContent } from "@heroui/modal";
import { useSearchParams } from "next/navigation";
import ReviewCard from "@/components/review/reviewcard";
import ReviewForm from "@/components/review/reivewform";
import FilterDropdown from "@/components/dropdown/filterDropdown";

export const dynamic = 'force-dynamic';

export default function ReviewSection() {
  const { data: session, status } = useSession();
  const { resolvedTheme } = useTheme();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const drinkId = searchParams.get("drinkId");

  // 리뷰 목록 및 정렬 옵션 상태
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState("최신순");

  // 신규 리뷰 작성 모달 및 폼 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  // 리뷰 수정 모달 및 폼 상태
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [reviewToEdit, setReviewToEdit] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editReviewText, setEditReviewText] = useState("");

  // 리뷰 목록 불러오기 (응답 데이터는 { [userId]: reviewData } 형태라고 가정)
  const fetchReviews = async () => {
    try {
      const res = await fetch(
        `/api/v1/reviews/search?category=${category}&drinkId=${drinkId}`
      );
      if (!res.ok) {
        throw new Error(
          `리뷰 목록을 불러오지 못했습니다. 서버 응답 코드: ${res.status}`
        );
      }
      const data = await res.json();
      // console.log("🔍 리뷰 데이터 확인:", data);
      if (!data || Object.keys(data).length === 0) {
        console.warn("🚨 리뷰 데이터가 비어있습니다.");
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
      // console.log("변환된 리뷰 데이터:", transformedReviews);
      setReviews(transformedReviews);
    } catch (error) {
      console.error("❌ 리뷰 불러오기 실패:", error.message);
      setReviews([]);
    }
  };

  // 의존성 배열에서 reviews를 제거 → category와 drinkId가 변경될 때만 fetchReviews 호출
  useEffect(() => {
    if (category && drinkId) {
      fetchReviews();
    }
  }, [category, drinkId]);

  // 리뷰 등록 처리 (POST)
  const handleSubmitReview = async () => {
    try {
      const userId = session?.user?.id;
      if (!userId) throw new Error("로그인이 필요합니다.");
      if ( !selectedRating ) addToast({ title: '제출 실패', description: '별점을 선택해주세요.', color: 'danger' });

      const res = await fetch("/api/v1/reviews/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          drinkId,
          userId,
          rating: selectedRating,
          content: reviewText,
        }),
      });

      if (!res.ok) throw new Error("리뷰 생성에 실패했습니다.");

      // 등록 후 폼 초기화 및 모달 닫기 후 최신 리뷰 목록 불러오기
      setSelectedRating(0);
      setReviewText("");
      setIsModalOpen(false);
      fetchReviews();
    } catch (error) {
      console.error("리뷰 생성 에러:", error);
    }
  };

  // 리뷰 삭제 처리
  const handleDeleteReview = async (review) => {
    if (review.writeUser !== session?.user?.id) {
      console.error("삭제 권한이 없습니다.");
      return;
    }
    try {
      const url = `/api/v1/reviews/delete?category=${category}&drinkId=${drinkId}&userId=${review.writeUser}`;
      // console.log("리뷰 삭제 API 요청 URL:", url);
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) {
        throw new Error("삭제 실패");
      }
      // 삭제 성공 시 local state에서 해당 리뷰 제거하여 UI 즉시 업데이트
      setReviews((prevReviews) =>
        prevReviews.filter((r) => r.id !== review.id)
      );
    } catch (error) {
      console.error("리뷰 삭제 오류:", error);
    }
  };

  // 리뷰 수정 버튼 클릭 시 – 현재 리뷰 데이터를 수정 폼에 채워서 수정 모달 오픈
  const handleEditReview = (review) => {
    setReviewToEdit(review);
    setEditRating(review.rating);
    setEditReviewText(review.content);
    setIsEditModalOpen(true);
  };

  // 리뷰 수정 처리 (PUT)
  const handleSubmitEdit = async () => {
    try {
      if (reviewToEdit.writeUser !== session?.user?.id) {
        console.error("수정 권한이 없습니다.");
        return;
      }
      const url = `/api/v1/reviews/modify?category=${category}&drinkId=${drinkId}&userId=${reviewToEdit.writeUser}`;
      // console.log("리뷰 수정 API 요청 URL:", url);
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: editRating,
          content: editReviewText,
        }),
      });
      if (!res.ok) {
        throw new Error("리뷰 수정 실패");
      }
      // 수정 성공 후 모달 닫고 최신 리뷰 목록 불러오기
      setIsEditModalOpen(false);
      fetchReviews();
    } catch (error) {
      console.error("리뷰 수정 오류:", error);
    }
  };

  const sortedReviews = Array.isArray(reviews)
    ? [...reviews].sort((a, b) => {
      if (filter === "최신순") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (filter === "추천순") {
        return b.rating - a.rating;
      } else {
        return 0;
      }
    })
    : [];

  const sortOptions = [{ value: "최신순", label: "최신순" }];

  if (status === "loading") {
    return <Spinner className="flex mt-5" />;
  }

  return (
    <div className="w-full max-w-full mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold text-[#6F0029] mb-1">평가 & 리뷰</h1>
      <div className="h-[3px] bg-[#6F0029] mb-4" />

      <div className="flex justify-between items-center mb-4">
        <FilterDropdown
          title="정렬 옵션"
          options={sortOptions}
          selectedOption={filter}
          onOptionChange={setFilter}
          className="mr-2"
        />
        <Button
          onPress={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-1 text-sm text-white bg-[#6F0029] px-3 py-1.5 rounded hover:bg-[#8F0033]"
          isDisabled={status === "authenticated" ? false : true}
        >
          리뷰 작성
        </Button>
      </div>

      {sortedReviews.length > 0 ? (
        sortedReviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            resolvedTheme={resolvedTheme}
            session={session}
            onDelete={handleDeleteReview}
            onEdit={handleEditReview}
          />
        ))
      ) : (
        <div className="py-4 text-center">리뷰가 없습니다.</div>
      )}

      {/* 신규 리뷰 작성 모달 */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          placement="center"
          className="mx-4"
        >
          <ModalContent>
            <ReviewForm
              selectedRating={selectedRating}
              setSelectedRating={setSelectedRating}
              reviewText={reviewText}
              setReviewText={setReviewText}
              onClose={() => setIsModalOpen(false)}
              onSubmit={handleSubmitReview}
            />
          </ModalContent>
        </Modal>
      )}

      {/* 리뷰 수정 모달 */}
      {isEditModalOpen && (
        <Modal
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          placement="center"
          className="mx-4"
        >
          <ModalContent>
            <ReviewForm
              selectedRating={editRating}
              setSelectedRating={setEditRating}
              reviewText={editReviewText}
              setReviewText={setEditReviewText}
              onClose={() => setIsEditModalOpen(false)}
              onSubmit={handleSubmitEdit}
            />
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}
