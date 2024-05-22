import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
  return (
    <button
      className="p-5 bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-text-color)] border outline-none cursor-pointer"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
