"use client";

import { useState, useEffect } from "react";

const TypingText = () => {
  const message = "추천 안주가 생성 중입니다...";
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const typingSpeed = isDeleting ? 50 : 100;
    const delayBeforeDelete = 1000;

    const typingInterval = setTimeout(() => {
      if (!isDeleting && index < message.length) {
        setDisplayText((prev) => prev + message[index]);
        setIndex(index + 1);
      } else if (!isDeleting && index === message.length) {
        setTimeout(() => setIsDeleting(true), delayBeforeDelete);
      } else if (isDeleting && index > 0) {
        setDisplayText((prev) => prev.slice(0, -1));
        setIndex(index - 1);
      } else {
        setIsDeleting(false);
      }
    }, typingSpeed);

    return () => clearTimeout(typingInterval);
  }, [index, isDeleting, message]);

  return <p className="text-lg font-semibold text-gray-700">{displayText}</p>;
};

export default TypingText;
