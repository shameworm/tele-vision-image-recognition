import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, type }) => {
  return (
    <button
      type={type || "button"}
      className="p-5 bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-text-color)] border outline-none cursor-pointer"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
