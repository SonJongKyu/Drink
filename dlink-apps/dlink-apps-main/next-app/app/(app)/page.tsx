import DlinkChatbot from "@/chatbot/dlinkChatbot";
import Content from "@/components/home/content";
import type { NextPage } from "next";

const Home: NextPage = () => {
    return (
        <>
            <Content/>
            <DlinkChatbot/>
        </>
    );
};

export default Home;
