// "use client";

// import { useEffect, useState } from "react";
// import { ScrollShadow } from "@heroui/react";
// import { Tabs, Tab } from "@heroui/tabs";
// import WineSearchResultsPage from "@/components/searchresults/wineSearchResults";
// import YangjuSearchResults from "@/components/searchresults/yangjuSearchResults";
// import React, { Suspense } from 'react';
// import { useRouter, useSearchParams } from "next/navigation";
// import { Input, Button } from "@heroui/react";

// export default function Search() {
//   const [tabKey, setTabKey] = useState("Wine");
//   const searchParams = useSearchParams();
//   const initialKeyword = searchParams.get("query") || ""; // 현재 검색어 가져오기
//   const [searchQuery, setSearchQuery] = useState(initialKeyword);
//   const router = useRouter();

//   const handleSearch = () => {
//     if (!searchQuery.trim()) return;
//     router.push(`/searchresults?query=${encodeURIComponent(searchQuery)}`);
//   };

//   const tabs = [
//     { id: "Wine", label: "와인" },
//     { id: "Yangju", label: "양주" },
//   ];

//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <ScrollShadow className="w-full h-[90vh]">
//         <div className="flex w-full flex-col p-1 rounded-md shadow-md h-full">
//           {/* ✅ 상단 검색바 추가 */}
//           <div className="flex space-x-2 w-full items-center pb-2 pt-2">
//             <Input
//               className="flex-1"
//               placeholder="검색어를 입력하세요..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") handleSearch();
//               }}
//             />
//             <Button color="primary" className="bg-primary" onPress={handleSearch}>
//               검색
//             </Button>
//           </div>
//           <Tabs aria-label="Dynamic tabs" selectedKey={tabKey} onSelectionChange={setTabKey} fullWidth>
//             {tabs.map((tab) => (
//               <Tab key={tab.id} title={tab.label}>
//                 {tab.id === "Wine" ? (
//                   <WineSearchResultsPage setTabKey={setTabKey} />
//                 ) : (
//                   <YangjuSearchResults setTabKey={setTabKey} />
//                 )}
//               </Tab>
//             ))}
//           </Tabs>
//         </div>
//       </ScrollShadow>
//     </Suspense>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import { ScrollShadow, Input, Button } from "@heroui/react";
import { Tabs, Tab } from "@heroui/tabs";
import WineSearchResultsPage from "@/components/searchresults/wineSearchResults";
import YangjuSearchResultsPage from "@/components/searchresults/yangjuSearchResults";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

export default function Search() {
  const searchParams = useSearchParams();
  const initialKeyword = searchParams.get("query") || ""; // 현재 검색어 가져오기
  const [searchQuery, setSearchQuery] = useState(initialKeyword);
  const [tabKey, setTabKey] = useState("Wine");
  const [isSearchInitiated, setIsSearchInitiated] = useState(false); // ✅ 검색 실행 여부 확인
  const router = useRouter();

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setIsSearchInitiated(true); // ✅ 검색 실행됨
    router.push(`/searchresults?query=${encodeURIComponent(searchQuery)}`);
  };

  const tabs = [
    { id: "Wine", label: "와인" },
    { id: "Yangju", label: "양주" },
  ];

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ScrollShadow className="w-full h-[90vh]">
        <div className="flex w-full flex-col p-1 rounded-md shadow-md h-full">

          {/* ✅ 상단 검색바 */}
          <div className="flex space-x-2 w-full items-center pb-2 pt-2">
            <Input
              className="flex-1"
              placeholder="검색어를 입력하세요..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
            <Button color="primary" className="bg-primary" onPress={handleSearch}>
              검색
            </Button>
          </div>

          {/* ✅ 탭 추가 */}
          <Tabs
            aria-label="Dynamic tabs"
            selectedKey={tabKey}
            onSelectionChange={(key) => {
              setIsSearchInitiated(false); // ✅ 사용자가 탭을 직접 변경한 경우 검색 실행 여부 초기화
              setTabKey(key);
            }}
            fullWidth
          >
            {tabs.map((tab) => (
              <Tab key={tab.id} title={tab.label}>
                {tab.id === "Wine" ? (
                  <WineSearchResultsPage setTabKey={setTabKey} isSearchInitiated={isSearchInitiated} />
                ) : (
                  <YangjuSearchResultsPage setTabKey={setTabKey} isSearchInitiated={isSearchInitiated} />
                )}
              </Tab>
            ))}
          </Tabs>
        </div>
      </ScrollShadow>
    </Suspense>
  );
}
