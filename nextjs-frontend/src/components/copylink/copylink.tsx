import { CSSProperties, ReactNode } from "react";
import { useNotification } from "../notification/notification-context";
import { setNotification } from "@/lib/features/local/local.slice";

interface CopyLinkProps {
  url: string;
  children: ReactNode; // Có thể là icon hoặc text
  customStyleForNotifyCation?: CSSProperties;
}

const CopyLink = ({
  customStyleForNotifyCation,
  url,
  children,
}: CopyLinkProps) => {
  const { setNotification } = useNotification();

  const handleCopy = () => {
    navigator.clipboard
      .writeText(url)
      .then(() =>
        setNotification({
          content: "Đã sao chép liên kết!",
          isOpen: true,
          customStyle: customStyleForNotifyCation,
        })
      )
      .catch(() =>
        setNotification({
          content: "Không thể sao chép liên kết!",
          isOpen: true,
          customStyle: customStyleForNotifyCation,
        })
      );
  };

  return (
    <div
      onClick={handleCopy}
      className="cursor-pointer text-white-06 hover:text-white"
    >
      {children}
    </div>
  );
};

export default CopyLink;
