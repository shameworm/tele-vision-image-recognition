import { useTelegram } from "../hooks/useTelegram";

const Header: React.FC = () => {
  const { user } = useTelegram();

  return (
    <header className="w-full h-10 flex justify-between items-center py-3 px-3">
      <h2 className="mx-auto text-[var(--tg-theme-text-color)]">
        TeleVision welcomes you {user?.username}
      </h2>
    </header>
  );
};

export default Header;
