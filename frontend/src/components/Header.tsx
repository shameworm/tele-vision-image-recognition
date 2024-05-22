import { useEffect } from "react";
import { useTelegram } from "../hooks/useTelegram";

import Button from "./Button";

const Header: React.FC = () => {
  const { backButton, onClose } = useTelegram();

  useEffect(() => {
    backButton.show();
  }, [backButton]);

  return (
    <header className="w-full h-10 flex justify-between items-center py-3 px-3">
      <Button onClick={onClose}>{""}</Button>
      <h2 className="mx-auto text-[var(--tg-theme-text-color)]">
        Hello, please pick the image.
      </h2>
    </header>
  );
};

export default Header;
