import { useRef, useState, useEffect, ForwardedRef } from "react";

import Button from "./Button";
import { useTelegram } from "../hooks/useTelegram";

interface ImageUploadProps {
  id: string;
  errorText: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ id, errorText }) => {
  const [file, setFile] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [isValid, setIsValid] = useState(false);
  const { onClose } = useTelegram();

  const filePickerRef = useRef<HTMLInputElement | null>();

  useEffect(() => {
    if (!file) {
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result as string);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const handlePick = (event: React.ChangeEvent<HTMLInputElement>) => {
    let pickedFile;
    let fileIsValid = isValid;

    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    console.log(fileIsValid);
    // onInput(id, pickedFile, fileIsValid);
  };

  const handleImagePick = () => {
    if (filePickerRef.current) {
      filePickerRef.current.click();
    }
  };

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
      {!isValid && <p className="mt-2 text-center">{errorText}</p>}
    </div>
  );
};

export default ImageUpload;
