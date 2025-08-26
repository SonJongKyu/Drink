import { Card, CardBody, CardFooter, Image, Tooltip } from "@heroui/react";

const AlcoholsCard = ({ searchResults, handleCardClick }) => {

    return <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {searchResults.map((result) => (
            <Card isPressable onPress={() => handleCardClick(result.id)} key={result.id} className="pt-2 flex justify-center">
                <CardBody className="overflow-visible pb-0">
                    <Image
                        isZoomed
                        shadow="sm"
                        alt={result.name}
                        className="object-cover rounded-xl"
                        src={result.image || "/LOGO4.png"}
                        width={270}
                    />
                </CardBody>
                <CardFooter className="flex flex-col justify-center">
                    <Tooltip content={result.name}>
                        <p className="font-bold text-md">{result.korName}</p>
                    </Tooltip>
                    <p className="text-default-400 text-sm">{result.origin}</p>
                </CardFooter>
            </Card>
        ))}
    </div>;
};

export default AlcoholsCard;