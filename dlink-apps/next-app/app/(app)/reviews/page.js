"use client";

import { Suspense } from "react";
import ReviewSection from "@/components/review/reviewsection";
import { Spinner } from "@heroui/react";

export default function RecipePage() {
  return (
    <Suspense fallback={<Spinner size="lg" color="primary" />}>
      <ReviewSection />
    </Suspense>
  );
}
