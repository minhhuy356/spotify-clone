import { CircularProgress } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { BiShowAlt } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import Preview from "../preview/preview";

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

const UploadFile: React.FC<IProps> = ({
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
  const FileRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (reset) {
      setFile(null);
      setFileURL(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }, [reset]); // Khi reset thay đổi, reset file

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith(`${accept}/`)) {
      setIsUploading(true);
      setProgress(0);

      let progressValue = 0;
      const interval = setInterval(() => {
        progressValue += 2; // Tăng chậm hơn để dễ thấy
        setProgress(progressValue);

        if (progressValue >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
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

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleDelete = () => {
    setFile(null);
    setFileURL(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <input
        type="file"
        accept={`${accept}/*`}
        ref={inputRef}
        onChange={handleFileUpload}
        hidden
      />
      <div className="text-white-06 hover:text-white ">
        {isUploading ? (
          // Hiển thị thanh tiến trình khi đang tải lên
          <div className="border-white-06 border-solid border-[1px] hover:border-white p-3 cursor-pointer rounded-md flex gap-3 items-center h-[48px]">
            <CircularProgress size={15} className="!text-white-06" />
            <div className="w-full bg-gray-700 rounded-full h-1">
              <div
                className="bg-white h-1 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        ) : file ? (
          <div className="border p-3 cursor-pointer rounded-md  h-[48px]">
            <div className="flex items-center justify-between rounded-md cursor-pointer gap-6">
              <span className="line-clamp-1">{file.name}</span>
              <div className="flex gap-2">
                <span
                  className="opacity-60 hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPreview(true);
                  }}
                >
                  <BiShowAlt size={25} />
                </span>
                <span
                  className="opacity-60 hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                >
                  <IoMdClose size={25} />
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="border-white-06 border-solid border-[1px] hover:border-white p-3 cursor-pointer text-center rounded-md  h-[48px]"
            onClick={handleButtonClick}
          >
            <span>{title}</span>
          </div>
        )}
      </div>
      <Preview open={showPreview} onClose={() => setShowPreview(false)}>
        {fileURL && (
          <div ref={FileRef} className="relative p-4 rounded-lg">
            {file?.type.startsWith("image/") ? (
              <img
                src={fileURL}
                alt="Preview"
                className="w-[580px] h-auto rounded-md"
              />
            ) : (
              <video controls className="max-w-[980px] h-auto">
                <source src={fileURL} type={file?.type} />
                Trình duyệt của bạn không hỗ trợ định dạng này.
              </video>
            )}
            <span
              className="fixed top-2 right-2 cursor-pointer text-white"
              onClick={() => setShowPreview(false)}
            >
              <IoMdClose size={30} />
            </span>
          </div>
        )}
      </Preview>

      {fileURL && preview && (
        <>
          {type !== "video" && accept !== "audio" && (
            <div className="flex-1 flex justify-center items-center">
              <div
                className={`overflow-hidden text-white-06  hover:text-white text-3xl grid place-items-center  font-bold border border-white-06  hover:border-white ${
                  type === "profile"
                    ? "rounded-md aspect-[3/2] max-w-[288px] max-h-[288px] w-full h-full "
                    : ""
                } ${
                  type === "avatar" ? "rounded-full  w-[190px] h-[190px]" : ""
                } ${type === "cover" ? "aspect-[7/2] w-full" : ""} ${
                  !type ? " aspect-[3/3] " : ""
                }
              `}
              >
                {!fileURL ? (
                  <span>Preview</span>
                ) : (
                  <img
                    className={`${
                      type === "profile"
                        ? " aspect-[3/2] object-cover object-center"
                        : ""
                    } ${
                      type === "cover"
                        ? " aspect-[7/3] w-full object-cover object-center"
                        : ""
                    }`}
                    src={`${fileURL}`}
                    alt=""
                  />
                )}
              </div>
            </div>
          )}
        </>
      )}
      {/* Xem trước */}
    </div>
  );
};

export default UploadFile;
