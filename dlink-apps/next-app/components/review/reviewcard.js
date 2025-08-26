// "use client";

// import { Card, CardBody } from "@heroui/card";
// import { Textarea } from "@heroui/react";
// import CardMenu from "@/components/review/cardmenu";
// import { useTheme } from "next-themes";
// import { useSession } from "next-auth/react";
// import StarRating from "@/components/starrating/starRating";
// import LoginUser from "../auth/loginUser";

// export default function ReviewCard({ session, review, resolvedTheme, onDelete, onEdit, readOnly = false }) {
//   if (!review) {
//     return <div className="text-center text-gray-500">리뷰 정보를 불러올 수 없습니다.</div>;
//   }

//   return (
//     <Card className="bg-content1 p-4 mb-4 relative">
//       <CardBody>
//         {session?.user?.id === review.writeUser && (
//           <div className="absolute top-2 right-2">
//             <CardMenu
//               onEdit={() => { if (onEdit) onEdit(review); }}
//               onDelete={() => { if (onDelete) onDelete(review); }}
//             />
//           </div>
//         )}

//         <div className="flex items-center mb-2">
//           <LoginUser userId={review.writeUser} />
//         </div>

//         <div className="flex items-center mb-2">
//           <p className="text-sm font-semibold mr-2">평점:</p>
//           <StarRating value={parseInt(review.rating, 10)} readOnly className="text-lg" />
//         </div>

//         <div className="mb-2">
//           {/* value를 사용하여 prop 변경 시 UI 업데이트 */}
//           <Textarea
//             isReadOnly
//             className="max-w-full mt-1"
//             value={review.content}
//             variant="bordered"
//           />
//         </div>

//         <div className="text-xs text-gray-500 mt-2">
//           작성 시간: {new Date(review.createdAt || Date.now()).toLocaleString()}
//         </div>
//       </CardBody>
//     </Card>
//   );
// }

"use client";

import { Card, CardBody } from "@heroui/card";
import { Textarea } from "@heroui/react";
import CardMenu from "@/components/review/cardmenu";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import StarRating from "@/components/starrating/starRating";
import LoginUser from "../auth/loginUser";

export default function ReviewCard({ session, review, resolvedTheme, onDelete, onEdit, readOnly = false }) {
  if (!review) {
    return <div className="text-center text-gray-500">리뷰 정보를 불러올 수 없습니다.</div>;
  }

  return (
    <Card className="bg-content1 p-4 mb-4 relative">
      <CardBody>
        {session?.user?.id === review.writeUser && (
          <div className="absolute top-2 right-2">
            <CardMenu
              onEdit={() => { if (onEdit) onEdit(review); }}
              onDelete={() => { if (onDelete) onDelete(review); }}
            />
          </div>
        )}

        <div className="flex items-center mb-2">
          <LoginUser userId={review.writeUser} />
        </div>

        <div className="flex items-center mb-2">
          <p className="text-sm font-semibold mr-2">평점:</p>
          <StarRating value={parseInt(review.rating, 10)} readOnly className="text-lg" />
        </div>

        <div className="mb-2">
          <Textarea
            isReadOnly
            className="max-w-full mt-1"
            value={review.content}
            variant="bordered"
          />
        </div>

        <div className="text-xs text-gray-500 mt-2">
          작성 시간: {new Date(review.createdAt || Date.now()).toLocaleString()}
        </div>
      </CardBody>
    </Card>
  );
}
