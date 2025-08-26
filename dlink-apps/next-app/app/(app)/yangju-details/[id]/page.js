"use client";

import YangjuProductInfo from "@/components/productinfo/yangju-productinfo";
import YangjuTabs from "@/components/tabs/yangjuTabs";
import { Card, Skeleton } from "@heroui/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function DetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isProductInfoLoading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/v1/details?id=${encodeURIComponent(id)}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("상품정보 호출 오류:", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProduct();
  }, [id]);

  return (
    <div className="p-4 space-y-4">
      {isProductInfoLoading ? (
        <Card className="p-4">
          <div className="flex items-center space-x-6 mb-4">
            <Skeleton className="rounded-xl w-36 h-48" />
            <div className="flex flex-col space-y-2">
              <Skeleton className="h-6 w-32 rounded-xl" />
              <Skeleton className="h-4 w-28 rounded-xl" />
              <Skeleton className="h-4 w-28 rounded-xl" />
              <Skeleton className="h-4 w-28 rounded-xl" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-24 rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
        </Card>

      ) : (
        <YangjuProductInfo product={product} />
      )}

      {isProductInfoLoading ? (<div></div>)
        :
        (<YangjuTabs product={product} />)
      }
    </div>
  );
}
