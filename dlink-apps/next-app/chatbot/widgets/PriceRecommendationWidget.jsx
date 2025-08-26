import { Card, CardBody, CardFooter } from "@heroui/react";
import { useRouter } from "next/navigation";
import React from "react";
import RelatedQuestionsCards from "../components/RelatedQuestionsCards";

const PriceRecommendationWidget = ({ payload, actions }) => {
    return (
        <div>
            <div className={`gap-4 grid grid-cols-1 mx-10`}>
                {payload.data.map((item, index) => (
                    <Card
                        key={index}
                        isPressable
                        shadow="sm"
                        onPress={() =>
                            window.open(
                                `https://map.kakao.com/?q=${encodeURIComponent(item.address)}`,
                                "_blank"
                            )
                        }
                    >
                        <CardBody>
                            <p className="text-medium font-semibold">{item.name}</p>
                            <p className="text-small text-default-500">{item.address}</p>
                        </CardBody>
                        <CardFooter className="text-small text-right justify-end">
                            💰 {item.price.toLocaleString()}원
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

export default PriceRecommendationWidget;
