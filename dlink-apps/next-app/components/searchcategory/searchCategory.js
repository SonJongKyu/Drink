"use client"

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Checkbox } from "@heroui/react";
import WineSearchResultsPage from "@/components/searchresults/wineSearchResults";
import YangjuResultsPage from "@/components/searchresults/yangjuSearchResults";

// export const dynamic = 'force-dynamic';

// const subcategoryToType = {
//   Gin: "진",
//   Rum: "럼",
//   Vodka: "보드카",
//   Brandy: "브랜디",
//   Liqueur: "리큐어",
//   Whiskey: "위스키",
//   Tequila: "데킬라",
// };

// export default function SearchCategory({
//   title,
//   filters,
//   alcoholCate,
//   subcategory: propSubcategory,
// }) {
//   const searchParams = useSearchParams();
//   const subcategory = propSubcategory || searchParams.get("subcategory");

//   // filters를 useMemo로 감싸서 참조가 변경되지 않도록 함
//   const validCategoryFilters = useMemo(() => filters || {}, [filters]);

//   const translatedSubcategory = subcategory ? subcategoryToType[subcategory] : null;

//   // useCallback으로 getInitialFilters를 정의
//   const getInitialFilters = useCallback(() => {
//     const initialFilters = Object.keys(validCategoryFilters).reduce(
//       (acc, key) => ({ ...acc, [key]: [] }),
//       {}
//     );

//     if (
//       alcoholCate === "양주" &&
//       translatedSubcategory &&
//       validCategoryFilters.type?.includes(translatedSubcategory)
//     ) {
//       initialFilters.type = [translatedSubcategory];
//     }

//     return initialFilters;
//   }, [validCategoryFilters, alcoholCate, translatedSubcategory]);

//   const [selectedFilters, setSelectedFilters] = useState(getInitialFilters);

//   useEffect(() => {
//     setSelectedFilters(getInitialFilters());
//   }, [getInitialFilters]);

//   // 양주 서브카테고리 자동 적용
//   useEffect(() => {
//     if (
//       alcoholCate === "양주" &&
//       translatedSubcategory &&
//       validCategoryFilters.type?.includes(translatedSubcategory)
//     ) {
//       setSelectedFilters((prev) => {
//         if (!prev.type.includes(translatedSubcategory)) {
//           return { ...prev, type: [...prev.type, translatedSubcategory] };
//         }
//         return prev;
//       });
//     }
//   }, [translatedSubcategory, alcoholCate, validCategoryFilters.type]);

//   // 필터 토글 함수
//   const toggleFilter = (filterCategory, value) => {
//     setSelectedFilters((prev) => {
//       const updatedCategory = prev[filterCategory]?.includes(value)
//         ? prev[filterCategory].filter((item) => item !== value)
//         : [...prev[filterCategory], value];

//       return { ...prev, [filterCategory]: updatedCategory };
//     });
//   };

//   return (
//     <div className="w-full max-w-full mx-auto p-4 md:p-6">
//       <h1 className="text-2xl font-bold text-primary mb-1">{title}</h1>
//       <div className="h-[3px] bg-primary mb-4" />
//       {alcoholCate === "yangju" ?
//         <div className="flex flex-col md:flex-row space-x-5">
//           {Object.entries(validCategoryFilters).map(([filterCategory, options]) => (
//             <div key={filterCategory} className="bg-gray-100 p-2 rounded">
//               <h3 className="text-md font-bold mb-2">{filterCategory}</h3>
//               <div className="flex space-x-1">
//                 {options.map((option) => (
//                   <Checkbox
//                     key={option}
//                     checked={selectedFilters[filterCategory]?.includes(option)}
//                     onChange={() => toggleFilter(filterCategory, option)}
//                   >
//                     {option}
//                   </Checkbox>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//         : <WineSearchResultsPage/>}
//     </div>
//   );
// }

// ✅ 양주 카테고리 목록 (컬렉션과 매칭)
const filterOptions = {
  type: ["gin", "rum", "vodka", "brandy", "liqueur", "whiskey", "tequila"],
};

export default function SearchCategory({ title, alcoholCate }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("");

  // ✅ URL이 변경되면 카테고리 업데이트
  useEffect(() => {
    setSelectedCategory(searchParams.get("subcategory")?.toLocaleLowerCase() || "");
  }, [searchParams]);

  // ✅ 서브카테고리 버튼 클릭 시 필터링 적용
  const handleCategorySelect = (newCategory) => {
    setSelectedCategory(newCategory);
    router.push(`/categories/yangju?subcategory=${newCategory}`, { scroll: false }); // ✅ URL 업데이트
  };

  return (
    <div className="w-full max-w-full mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold text-primary mb-1">{title}</h1>
      <div className="h-[3px] bg-primary mb-4" />

      {alcoholCate === "yangju" && (
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          {filterOptions.type.map((type) => (
            <button
              key={type}
              className={`px-4 py-2 border rounded-md ${selectedCategory === type ? "bg-primary text-white" : "bg-gray-100"
                }`}
              onClick={() => handleCategorySelect(type)}
            >
              {type}
            </button>
          ))}
        </div>
      )}

      {alcoholCate === "yangju" ? (
        <YangjuResultsPage subcategory={selectedCategory} />
      ) : (
        <WineSearchResultsPage />
      )}
    </div>
  );
}
