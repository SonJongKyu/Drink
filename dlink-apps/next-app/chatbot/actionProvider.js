import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const { data: session } = useSession();

  const handleChat = (message) => {
    const loadingMessage = createChatBotMessage("");
    const loadingMessageId = loadingMessage.id;

    loadingMessage.requestFunc = () => {
      return axios.post("/api/v1/chatbot/chat", {
        user_input: message,
        session_id: session?.user?.id || "testuuid"
      });
    };

    loadingMessage.onResponse = (res) => {

      setState((prev) => {
        const updatedMessages = prev.messages.map((msg) => {
          if (msg.id === loadingMessageId) {
            return {
              ...msg,
              widget: getWidgetByType(res.type),
              loading: false,
              message: res.message,
              payload: res,
            };
          }
          return msg;
        });

        return { ...prev, messages: updatedMessages };
      });

      return res.message || "응답이 없습니다.";
    };

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, loadingMessage],
    }));
  };

  const getWidgetByType = (type) => {
    switch (type) {
      case "yangjuRecommendation":
        return "yangjuRecommendationWidget";
      case "highballRecommendation":
        return "highballRecommendationWidget";
      case "wineRecommendation":
        return "wineRecommendationWidget";
      case "priceRecommendation":
        return "priceRecommendationWidget";
      default:
        return "relatedQuestionsWidget";
    }
  };

  return (
    <>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          actions: {
            handleChat,
          },
        })
      )}
    </>
  );
};

export default ActionProvider;
