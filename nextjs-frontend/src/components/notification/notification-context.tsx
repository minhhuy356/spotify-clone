// notification-context.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  JSX,
  CSSProperties,
} from "react";

interface Notification {
  isOpen: boolean;
  content: string;
  icon?: JSX.Element | null;
  customStyle?: CSSProperties; // Thêm thuộc tính customStyle để xác định vị trí
}

interface NotificationContextProps {
  notification: Notification;
  setNotification: React.Dispatch<React.SetStateAction<Notification>>;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notification, setNotification] = useState<Notification>({
    isOpen: false,
    content: "",
    icon: null,
    customStyle: {},
  });

  return (
    <NotificationContext.Provider value={{ notification, setNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextProps => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
