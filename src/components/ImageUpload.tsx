import { useRef, useState, useEffect, ForwardedRef, useCallback } from "react";

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
  // const [description, setDescipriton] = useState("");
  const { tg, onClose, queryId, chatId } = useTelegram();

  const filePickerRef = useRef<HTMLInputElement | null>();

  const onSendData = useCallback(async () => {
    if (!file || !queryId || !chatId) return;
    const formData = new FormData();
    formData.append("image", file);
    formData.append("queryId", queryId);
    formData.append("chatId", chatId.toString());

    try {
      const response = await fetch(
        "https://tele-vision-9c692735ad8e.herokuapp.com/",
        {
          method: "POST",
          body: formData,
        }
      );

      console.log(response);
      const formDataEntries: { [key: string]: unknown } = {};
      formData.forEach((value, key) => {
        formDataEntries[key] = value;
      });

      tg.sendData(JSON.stringify(formDataEntries));
    } catch (err) {
      console.error("There was a problem with the fetch operation:", err);
    }
  }, [tg, queryId, chatId, file]);

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
        name="image"
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
