"use client";

import { Button, Textarea } from "@heroui/react";
import { ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import StarRating from "@/components/starrating/starRating";

export default function ReviewForm({
  selectedRating,
  setSelectedRating,
  reviewText,
  setReviewText,
  onClose,
  onSubmit,
}) {
  return (
    <>
      <ModalHeader>평가 & 리뷰 작성</ModalHeader>
      <ModalBody>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">평점</label>
            <StarRating totalStars={5} value={selectedRating} onChange={setSelectedRating} />
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
              onClear={() => setReviewText("")}
            />
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onPress={onClose}>
          취소
        </Button>
        <Button color="primary" onPress={onSubmit}>
          등록
        </Button>
      </ModalFooter>
    </>
  );
}
