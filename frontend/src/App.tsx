import { useTelegram } from "./hooks/useTelegram";

import { useEffect } from "react";

import Header from "./components/Header";
import Form from "./components/Form";

const App: React.FC = () => {
  const { onStart } = useTelegram();

  useEffect(() => {
    onStart();
  }, [onStart]);

  return (
    <>
      <Header />
      <main className="w-full mx-auto">
        <Form />
      </main>
    </>
  );
};

export default App;
