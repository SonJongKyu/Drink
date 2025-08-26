"use client";

import { useState, useEffect } from "react";

export default function IngredientInput({ ingredients = [], onChange }) {
  const [items, setItems] = useState(ingredients);

  // prop ingredients가 변경되면 내부 상태 업데이트
  useEffect(() => {
    if (JSON.stringify(ingredients) !== JSON.stringify(items)) {
      setItems(ingredients);
    }
  }, [ingredients]);


  useEffect(() => {
    onChange && onChange(items);
  }, [items, onChange]);

  const handleChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { key: "", value: "" }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div className="max-h-[300px] overflow-y-auto">
      {items.map((item, i) => (
        <div key={i} className="flex space-x-1 mt-1">
          <input
            type="text"
            placeholder="재료명"
            value={item.key}
            onChange={(e) => handleChange(i, "key", e.target.value)}
            className="border p-1 rounded text-sm w-20"
          />
          <input
            type="text"
            placeholder="수량"
            value={item.value}
            onChange={(e) => handleChange(i, "value", e.target.value)}
            className="border p-1 rounded text-sm w-20"
          />
          <button
            onClick={() => removeItem(i)}
            className="bg-red-200 px-2 py-1 rounded text-sm"
          >
            삭제
          </button>
        </div>
      ))}
      <button
        onClick={addItem}
        className="mt-2 bg-blue-200 px-2 py-1 rounded text-sm"
      >
        재료 추가
      </button>
    </div>
  );
}
