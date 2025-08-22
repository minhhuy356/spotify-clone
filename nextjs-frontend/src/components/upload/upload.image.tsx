import { CircularProgress } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { BiShowAlt } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import Preview from "../preview/preview";
import { RiMusic2Line } from "react-icons/ri";
import { IoPencilSharp } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";

type TypeImage = "profile" | "cover" | "avatar" | "video";
type TypeAccept = "audio" | "video" | "image";

interface IProps {
  title?: string;
  accept?: TypeAccept;
  type?: TypeImage;
  preview?: boolean;
  file?: File | null; // Thêm prop file
  onChange?: (value: File | null) => void;
  reset?: boolean; // Prop mới để yêu cầu reset file
}

const UploadImage: React.FC<IProps> = ({
  title,
  accept = "*",
  type,
  preview = false,
  reset, // Nhận prop reset từ component cha
  onChange,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileURL, setFileURL] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (reset) {
      setFile(null);
      setFileURL(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }, [reset]); // Khi reset thay đổi, reset file

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith(`image/`)) {
      let progressValue = 0;
      const interval = setInterval(() => {
        progressValue += 2; // Tăng chậm hơn để dễ thấy

        if (progressValue >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setFile(file);
            setFileURL(URL.createObjectURL(file));
            onChange?.(file);
          }, 200); // Delay 200ms để tránh cảm giác nhảy đột ngột
        }
      }, 25); // Giữ thời gian update vừa phải
    } else {
      alert("Vui lòng chọn một tệp File hợp lệ!");
    }
  };

  const handleUploadFile = () => {
    inputRef.current?.click();
  };

  return (
    <div className=" w-full h-full flex justify-center items-center rounded-[0.3rem] overflow-hidden relative group">
      <input
        type="file"
        accept={`image/*`}
        ref={inputRef}
        onChange={handleFileUpload}
        hidden
      />
      {fileURL ? (
        <>
          {" "}
          <img
            src={fileURL}
            alt="Preview"
            className="w-full h-auto rounded-md"
          />{" "}
        </>
      ) : (
        <>
          <RiMusic2Line
            size={60}
            className="text-white-04 block group-hover:hidden"
          />
        </>
      )}
      <div
        className={`text-white-04 hidden  cursor-pointer absolute z-10  ${
          fileURL && "bg-black-07"
        } w-full h-full group-hover:flex justify-center items-center`}
        onClick={handleUploadFile}
      >
        <IoPencilSharp size={60} />
      </div>

      <div className="absolute top-2 right-3">
        <BsThreeDots
          size={30}
          className="text-white-06 p-2 rounded-full bg-40 hidden group-hover:block  cursor-pointer"
        />
      </div>
      {/* Xem trước */}
    </div>
  );
};

export default UploadImage;
