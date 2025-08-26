"use client";

import WineProductInfo from "@/components/productinfo/wine-productinfo";
import WineTabs from "@/components/tabs/wineTabs";
import { Card, Skeleton, Spinner } from "@heroui/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function DetailsPage() {
  const [wine, setWine] = useState(null);
  const [isWineInfoLoading, setIsWineInfoLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/v1/details?id=${encodeURIComponent(id)}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setWine(data);
      } catch (err) {
        console.error("상품정보 호출 오류:", err);
      } finally {
        setIsWineInfoLoading(false);
      }
    }
    if (id) fetchProduct();
  }, [id]);

  return (
    <div className="p-4 space-y-4">
      {isWineInfoLoading ? (
        <Card className="p-4">
          <div className="flex items-center space-x-7 mb-4">
            <Skeleton className="rounded-xl w-36 h-48" />
            <div className="flex flex-col space-y-2">
              <Skeleton className="h-6 w-32 rounded-xl" />
              <Skeleton className="h-4 w-32 rounded-xl" />
            </div>
          </div>

          <div className="space-y-2">
            <Skeleton className="h-5 w-24 rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>

          <div className="space-y-3 mt-5">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-4 w-16 rounded-xl" />
                <Skeleton className="h-4 w-full rounded-xl" />
              </div>
              <div className="flex items-center space-x-4">
                <Skeleton className="h-4 w-16 rounded-xl" />
                <Skeleton className="h-4 w-full rounded-xl" />
              </div>
              <div className="flex items-center space-x-4">
                <Skeleton className="h-4 w-16 rounded-xl" />
                <Skeleton className="h-4 w-full rounded-xl" />
              </div>
              <div className="flex items-center space-x-4">
                <Skeleton className="h-4 w-16 rounded-xl" />
                <Skeleton className="h-4 w-full rounded-xl" />
              </div>
          </div>
        </Card>
      ) : (
        <WineProductInfo wine={wine} />
      )}
      <WineTabs 
        alcohol={wine}
      />
    </div>
  );
}
