"use client";

import { useState } from "react";
import { addToast, Button } from "@heroui/react";
import { Alert } from "@heroui/alert";
import { CameraIcon } from "@/components/icons/cameraicon";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ImageUploadButton() {
  const [errorMessage, setErrorMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const router = useRouter();

  const triggerFileInput = () => {
    document.getElementById("file-upload")?.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const allowedTypes = ["image/jpeg", "image/png"];
      const maxSize = 5 * 1024 * 1024;

      if (!allowedTypes.includes(file.type)) {
        setErrorMessage("허용되지 않는 파일 형식입니다.");
        setTimeout(() => setErrorMessage(""), 1000);
        return;
      }

      if (file.size > maxSize) {
        setErrorMessage("파일 크기가 5MB를 초과했습니다.");
        setTimeout(() => setErrorMessage(""), 1000);
        return;
      }

      setIsImageUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      try {
        const textResponse = await axios.post("/api/v1/texttract", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        router.push(`/searchresults?query=${textResponse.data.text}`)

      } catch (error) {
        console.error("❌ 업로드 오류:", error);
        addToast({
          title: "업로드 오류",
          description: "파일 업로드에 실패했습니다.",
          color: "danger",
        })
        
      } finally {
        setIsImageUploading(false);
      }
    }
  };

  return (
    <div className="flex flex-col mr-2">
      <Button isLoading={isImageUploading} isIconOnly color="primary" className="bg-primary" onPress={triggerFileInput}>
        <CameraIcon fill="white" />
      </Button>

      <input
        id="file-upload"
        type="file"
        accept="image/jpeg, image/png"
        className="hidden"
        onChange={handleImageChange}
      />

      {/* 파일 업로드 성공 알림 */}
      {showAlert && (
        <div className="alert-container mt-2">
          <Alert color="success" title="파일 업로드 완료" />
        </div>
      )}

    </div>
  );
}
