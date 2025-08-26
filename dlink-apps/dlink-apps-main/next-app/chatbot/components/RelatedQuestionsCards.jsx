import React, { useState } from "react";

function RelatedQuestionsCards({ questions, handleChat }) {
    const [selectedIndex, setSelectedIndex] = useState(null);

    const onClick = (question, index) => {
        setSelectedIndex(index); // 선택 표시만 변경
        handleChat(question);    // 클릭 시 처리
    };

    return (
        <div className="flex gap-2 mt-4 text-tiny">
            {questions.slice(0, 3).map((question, index) => (
                <button
                    key={index}
                    onClick={() => onClick(question, index)}
                    className={`flex-1 border px-1 py-2 rounded transition
                        ${selectedIndex === index ? "bg-primary text-white font-semibold" : ""}
                    `}
                >
                    {question}
                </button>
            ))}
        </div>
    );
}

export default RelatedQuestionsCards;
