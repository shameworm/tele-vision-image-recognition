import { useTelegram } from "./hooks/useTelegram";

import { useEffect } from "react";

import Header from "./components/Header";
import ImageUpload from "./components/ImageUpload";

const App: React.FC = () => {
  const { onStart } = useTelegram();

  useEffect(() => {
    onStart();
  }, [onStart]);

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
