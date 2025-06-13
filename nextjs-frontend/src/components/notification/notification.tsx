// Notification.tsx
import { useEffect, useState } from "react";
import { useNotification } from "./notification-context";

const Notification = () => {
  const { notification } = useNotification();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (notification.isOpen) {
      const id = Date.now();

      const newNotification = {
        ...notification,
        id,
        progress: 100,
        fadingOut: false,
      };

      setNotifications((prev) => [...prev, newNotification]);

      const intervalId = setInterval(() => {
        setNotifications((prevNotifications) => {
          return prevNotifications.map((notif) => {
            if (notif.id === id) {
              const newProgress = notif.progress - 1;
              if (newProgress <= 0 && !notif.fadingOut) {
                notif.fadingOut = true;
                setTimeout(() => {
                  setNotifications((current) =>
                    current.filter((n) => n.id !== id)
                  );
                }, 300);
              }
              return { ...notif, progress: Math.max(0, newProgress) };
            }
            return notif;
          });
        });
      }, 40);

      setTimeout(() => clearInterval(intervalId), 4100);
    }
  }, [notification]);

  return (
    <>
      {notifications.map((notif, index) => (
        <div
          key={notif.id}
          className={`bg-white py-2 px-4 flex gap-3 items-center text-black rounded fixed z-[1000000] transition-all duration-300 ease-out min-w-[240px] ${
            notif.fadingOut ? "opacity-0" : "opacity-100"
          }`}
          style={{
            // Ưu tiên style được truyền từ customStyle
            ...notif.customStyle,
            // Nếu không có customStyle thì fallback vị trí mặc định
            bottom: notif.customStyle?.bottom
              ? notif.customStyle?.bottom
              : `${48 + index * 60 + 12}px`,
            left: notif.customStyle?.left ? notif.customStyle?.left : "50%",
            transform: "translateY(-100%) translatex(-50%)",
          }}
        >
          {notif.icon}
          <div>{notif.content}</div>
          <div className="w-[95%] h-[2px] bg-gray-300 rounded mt-2 absolute bottom-[0px] left-1">
            <div
              className="h-full bg-blue-500 rounded"
              style={{ width: `${notif.progress}%` }}
            />
          </div>
        </div>
      ))}
    </>
  );
};

export default Notification;
