import { useTelegram } from "../hooks/useTelegram";

import Button from "./Button";

const Header: React.FC = () => {
  const { user, onClose } = useTelegram();

  return (
    <header className="w-full h-10 flex items-center py-3 px-3">
      <nav>
        <ul className="list-none flex justify-between items-center">
          <li>
            <Button onClick={onClose}>Close</Button>
          </li>
          <li>{user?.username}</li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
