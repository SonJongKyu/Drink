"use client";

import { useTheme } from "next-themes";
import { Textarea } from "@heroui/react";

export default function ReviewList() {
  const { resolvedTheme } = useTheme();

  return (
    <>
      <Textarea
        isClearable
        className="max-w-xs"
        defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        label="Description"
        placeholder="Description"
        variant="bordered"
        onClear={() => console.log("textarea cleared")}
      />
      <Textarea
        isClearable
        className="max-w-xs"
        defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        label="Description"
        placeholder="Description"
        variant="bordered"
        onClear={() => console.log("textarea cleared")}
      />
      <Textarea
        isClearable
        className="max-w-xs"
        defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        label="Description"
        placeholder="Description"
        variant="bordered"
        onClear={() => console.log("textarea cleared")}
      />
    </>
  );
}
