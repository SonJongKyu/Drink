import { Card, CardBody, CardFooter, CardHeader, Image } from "@heroui/react";
import { useRouter } from "next/navigation";
import React from "react";
import RelatedQuestionsCards from "../components/RelatedQuestionsCards";

const HighballRecommendationWidget = ({ payload, actions }) => {
    const router = useRouter();

    return (
        <div>
            <div className={`gap-2 grid md:grid-cols-1 grid-cols-2 mx-10`}>
                {payload.data.map((item) => (
                    <Card
                        onPress={() =>
                            router.push(
                                `/highballs?subcategory=${item.category.toLowerCase()}&highballId=${
                                    item._id
                                }`
                            )
                        }
                        key={item._id}
                        isFooterBlurred
                        isPressable
                        className="w-full col-span-12 sm:col-span-5"
                    >
                        <CardHeader className="absolute z-10 top-1 flex-col items-start">
                            <p className="text-tiny text-white/60 uppercase font-bold">
                                {item.category.toLowerCase()}
                            </p>
                            <h4 className="text-white font-medium text-2xl">
                                {item.name}
                            </h4>
                        </CardHeader>
                        <Image
                            removeWrapper
                            alt="Card example background"
                            className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
                            src={item.imageUrl || "/LOGO.png"}
                        />
                        <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
                            <div className="flex flex-col items-start">
                                <p className="text-black text-tiny">
                                    하이볼 레시피
                                </p>
                                <p className="text-black text-tiny">보러가기</p>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
            <RelatedQuestionsCards questions={payload.relatedQuestion} handleChat={actions.handleChat} />
        </div>
    );
};

export default HighballRecommendationWidget;
