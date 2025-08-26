import { Image } from "@heroui/react";
import { Divider } from "@heroui/divider";

interface Props {
    children: React.ReactNode;
}

export const AuthLayoutWrapper = ({ children }: Props) => {
    return (
        <div className="flex h-screen">
            <div className="flex-1 flex-col flex items-center justify-center p-6">
                <div className="md:hidden absolute left-0 right-0 bottom-0 top-0 z-0">
                    <Image
                        className="w-full h-full"
                        src="https://nextui.org/gradients/docs-right.png"
                        alt="gradient"
                    />
                </div>
                {children}
            </div>

            <div className="hidden my-10 md:block">
                <Divider orientation="vertical" />
            </div>

            <div className="hidden md:flex flex-1 relative flex items-center justify-center p-6">
                <div className="absolute left-0 right-0 bottom-0 top-0 z-0">
                    <Image
                        className="w-full h-full"
                        src="https://nextui.org/gradients/docs-right.png"
                        alt="gradient"
                    />
                </div>

                <div className="z-10">
                    <h1 className="font-bold text-[45px]">DLink Application</h1>
                    <div className="text-slate-500 mt-4">
                        좋은 술과 안주, 그리고 다양한 하이볼 레시피를 제공하는
                        애플리케이션입니다. <br />
                        취향에 맞는 술과 완벽한 페어링을 찾아보세요!
                    </div>
                </div>
            </div>
        </div>
    );
};
