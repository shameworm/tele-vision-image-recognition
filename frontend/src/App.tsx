import { useEffect } from "react";

import { useTelegram } from "./hooks/useTelegram";

import Header from "./components/Header";
import ImageUpload from "./components/ImageUpload";

const App: React.FC = () => {
  const { tg } = useTelegram();

  useEffect(() => {
    tg.ready();
  }, [tg]);

  return (
    <>
      <Header />
      <main className="w-full mx-auto">
        <ImageUpload id="image" errorText="Please provide a image." />
      </main>
    </>
  );
};

export default App;
