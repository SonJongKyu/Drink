import { useState, useRef, useEffect } from "react";
import { Button } from "@heroui/react";

export default function CardMenu({ onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <Button
        onPress={toggleMenu}
        className="w-7 h-7 flex items-center justify-center rounded-full bg-transparent hover:bg-gray-200 p-0 min-w-0 border-none appearance-none select-none"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M6 10a2 2 0 114 0 2 2 0 01-4 0zm5 0a2 2 0 114 0 2 2 0 01-4 0zm-10 0a2 2 0 114 0 2 2 0 01-4 0z" />
        </svg>
      </Button>

      {open && (
        <div className="absolute right-0 mt-1 w-20 bg-white border rounded shadow-lg z-50">
          <Button
            onPress={() => {
              onEdit();
              setOpen(false);
            }}
            className="flex w-full items-center justify-center p-0 px-2 py-1 bg-transparent hover:bg-gray-100 text-sm"
          >
            수정
          </Button>
          <Button
            onPress={() => {
              onDelete();
              setOpen(false);
            }}
            className="flex w-full items-center justify-center p-0 px-2 py-1 bg-transparent hover:bg-gray-100 text-sm"
          >
            삭제
          </Button>
        </div>
      )}
    </div>
  );
}
