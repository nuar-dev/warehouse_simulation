import React, { createContext, useContext, useState } from 'react';

export interface Notification {
  id: string;
  message: string;
  route?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (message: string, route?: string) => void;
  removeNotification: (id: string) => void;
  removeNotificationByMessage: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotificationContext = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotificationContext must be used within NotificationProvider');
  return ctx;
};

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (message: string, route?: string) => {
    setNotifications((prev) => {
      if (prev.some((n) => n.message === message)) return prev;
      const id = Date.now().toString();
      return [...prev, { id, message, route }];
    });
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const removeNotificationByMessage = (message: string) => {
    setNotifications((prev) => prev.filter((n) => n.message !== message));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        removeNotificationByMessage,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
