import { Card, CardBody, CardFooter, Image } from "@heroui/react";
import { useRouter } from "next/navigation";
import React from "react";
import RelatedQuestionsCards from "../components/RelatedQuestionsCards";

const YangjuRecommendationWidget = ({ payload, actions }) => {
    const router = useRouter();

    return (
        <div>
            <div className={`gap-2 grid md:grid-cols-2 grid-cols-1 mx-10`}>
                {payload.data.map((item) => (
                    <Card
                        key={item._id}
                        isPressable
                        shadow="sm"
                        onPress={() =>
                            router.push(`/yangju-details/${item._id}`)
                        }
                    >
                        <CardBody className="overflow-visible p-0">
                            <Image
                                alt={item._id}
                                className="w-full object-cover max-h-[30vh]"
                                radius="lg"
                                shadow="sm"
                                src={item.image}
                                width="100%"
                            />
                        </CardBody>
                        <CardFooter className="text-small justify-start flex flex-col">
                            <b>{item.korName}</b>
                            <p className="text-default-500">{item.category}</p>
                        </CardFooter>
                    </Card>
                ))}
            </div>
            <RelatedQuestionsCards
                questions={payload.relatedQuestion}
                handleChat={actions.handleChat}
            />
        </div>
    );
};

export default YangjuRecommendationWidget;
