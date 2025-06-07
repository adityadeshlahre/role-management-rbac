import react from "react";
import toast, { Toaster } from "react-hot-toast";

type NotificationContextProps = {
  notifySuccess: (message: string) => void;
  notifyError: (message: string) => void;
  notifyInfo: (message: string) => void;
};

const NotificationContext = react.createContext<
  NotificationContextProps | undefined
>(undefined);

type NotificationProviderProps = {
  children: react.ReactNode;
};

export const NotificationProvider: react.FC<NotificationProviderProps> = ({
  children,
}: NotificationProviderProps) => {
  const notifySuccess = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);
  const notifyInfo = (message: string) => toast(message);

  return (
    <NotificationContext.Provider
      value={{ notifySuccess, notifyError, notifyInfo }}
    >
      {children}
      <Toaster position="bottom-left" />
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = react.useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotificationContext must be used within a NotificationProvider"
    );
  }
  return context;
};
