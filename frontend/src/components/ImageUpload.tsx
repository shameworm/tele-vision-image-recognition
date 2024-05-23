import { useRef, useState, useEffect, ForwardedRef, useCallback } from "react";

import Button from "./Button";
import { useTelegram } from "../hooks/useTelegram";
import axios from "axios";

interface ImageUploadProps {
  id: string;
  errorText: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ id, errorText }) => {
  const [file, setFile] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [isValid, setIsValid] = useState(false);
  const { tg, onClose, queryId } = useTelegram();

  const filePickerRef = useRef<HTMLInputElement | null>();

  const onSendData = useCallback(() => {
    if (file) {
      const data = {
        queryId: queryId,
        image: file,
      };

      axios.post("http://localhost:3000", {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      tg.sendData(JSON.stringify(data));
    }
  }, [tg, queryId, file]);

  useEffect(() => {
    tg.onEvent("mainButtonClicked", onSendData);
    return () => {
      tg.offEvent("mainButtonClicked", onSendData);
    };
  }, [tg, onSendData]);

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

    if (!fileIsValid) {
      tg.MainButton.hide();
    } else {
      tg.MainButton.show();
      tg.MainButton.setParams({
        text: "Send",
      });
    }
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
          <Button type="submit" onClick={handleImagePick}>
            PICK IMAGE
          </Button>
        </div>
      </div>
      {!isValid && <p className="mt-2 text-center">{errorText}</p>}
    </div>
  );
};

export default ImageUpload;
