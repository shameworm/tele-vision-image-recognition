const tg = window.Telegram.WebApp;

export const useTelegram = () => {
  const onClose = () => {
    tg.close();
  };

  const onStart = () => {
    tg.ready();
  };

  return {
    tg,
    user: tg.initDataUnsafe.user,
    onClose,
    onStart,
    backButton: tg.BackButton
  };
};
