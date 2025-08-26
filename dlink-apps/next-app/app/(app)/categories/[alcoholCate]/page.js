"use client";

import SearchCategory from "@/components/searchcategory/searchCategory";
import filterData from "../data/filterData";
import { useEffect } from "react";

// export default function WinePage({ params, searchParams }) {

//   const { category } = params;
//   const subcategory = searchParams?.subcategory;
//   const convertCate = {wine: "와인", yangju: "양주"}

//   return (
//     <SearchCategory
//       title={convertCate[category]}
//       filters={filterData[category]}
//       category={category}
//       subcategory={subcategory}
//     />
//   );
// }

export default function Page({ params }) {
  const { alcoholCate } = params;
  const convertCate = { wine: "와인", yangju: "양주" };

  return (
    <SearchCategory
      title={convertCate[alcoholCate] || alcoholCate}
      alcoholCate={alcoholCate}
    />
  );
}
