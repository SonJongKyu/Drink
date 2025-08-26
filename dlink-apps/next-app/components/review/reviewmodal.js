"use client";

import { Button, Textarea } from "@heroui/react";
import StarRating from "@/components/starrating/starRating";

export default function ReviewModal({
  isOpen,
  onClose,
  selectedRating,
  setSelectedRating,
  reviewText,
  setReviewText,
  onSubmit
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white w-full max-w-lg rounded-md shadow-lg p-4">
        <h2 className="text-xl font-bold mb-2">평가 & 리뷰 작성</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">평점</label>
            <StarRating
              totalStars={5}
              value={selectedRating}
              onChange={setSelectedRating}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">리뷰 내용</label>
            <Textarea
              isClearable
              className="mt-1 block w-full"
              placeholder="리뷰를 입력하세요"
              variant="bordered"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end mt-4 space-x-2">
          <Button color="danger" variant="light" onPress={onClose}>
            취소
          </Button>
          <Button color="bg-primary" onPress={onSubmit}>
            등록
          </Button>
        </div>
      </div>
    </div>
  );
}
