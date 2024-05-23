import { useRef, useState, useEffect, ForwardedRef, useCallback } from "react";
import Button from "./Button";
import { useTelegram } from "../hooks/useTelegram";

interface ImageUploadProps {
  id: string;
  errorText: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ id, errorText }) => {
  const [file, setFile] = useState<File | null>(null); // Use null instead of undefined
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // Use null instead of undefined
  const { tg, onClose } = useTelegram();
  const filePickerRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Set main button visibility initially
    if (file) {
      tg.MainButton.show();
      tg.MainButton.setParams({
        text: "Send",
      });
    } else {
      tg.MainButton.hide();
    }
  }, [file, tg.MainButton]);

  const handlePick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const pickedFile =
      event.target.files && event.target.files.length === 1
        ? event.target.files[0]
        : null;
    setFile(pickedFile);
    if (pickedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setPreviewUrl(reader.result);
        }
      };
      reader.readAsDataURL(pickedFile);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleImagePick = () => {
    if (filePickerRef.current) {
      filePickerRef.current.click();
    }
  };

  const onSendData = useCallback(() => {
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      fetch("http://localhost:3000/", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to upload image.");
          }
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
        });
    }
  }, [file]);

  useEffect(() => {
    tg.onEvent("mainButtonClicked", onSendData);
    return () => {
      tg.offEvent("mainButtonClicked", onSendData);
    };
  }, [tg, onSendData]);

  return (
    <div className="my-8 mx-0">
      <input
        id={id}
        ref={filePickerRef as ForwardedRef<HTMLInputElement>}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={handlePick}
      />
      <div className={"flex justify-center items-center flex-col text-center"}>
        <div className="w-52 h-52 border border-solid border-b-[var(--tg-theme-button-color)] flex justify-center items-center text-center mb-4">
          {previewUrl && (
            <img
              src={previewUrl}
              className="w-full h-full object-cover"
              alt="Preview"
            />
          )}
          {!previewUrl && <p>Please pick an image.</p>}
        </div>
        <div className="flex flex-wrap justify-between items-center gap-2">
          <Button type="button" onClick={onClose}>
            Close
          </Button>
          <Button type="button" onClick={handleImagePick}>
            PICK IMAGE
          </Button>
        </div>
      </div>
      {!file && <p className="mt-2 text-center">{errorText}</p>}
    </div>
  );
};

export default ImageUpload;
