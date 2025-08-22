import { useEffect, useRef, useState } from "react";
import { IoIosClose } from "react-icons/io";
import InputTextField from "../input/input.text";
import { RiMusic2Line } from "react-icons/ri";
import { FaRegUserCircle } from "react-icons/fa";
import { IoPencilSharp } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import ResizableTextField from "../input/admin/input.text.area";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { selectTemporaryPlaylist } from "@/lib/features/local/local.slice";
import UploadImage from "../upload/upload.image";
import {
  IUpdatePlaylist,
  user_playlist_service,
} from "@/service/user-playlist.service";
import { selectSession, setPlaylist } from "@/lib/features/auth/auth.slice";
import store from "@/lib/store";

interface IProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const ModalUpdatePlaylist = ({ isOpen, setIsOpen }: IProps) => {
  const dispatch = useAppDispatch();
  const session = useAppSelector(selectSession);
  const temporaryPlaylist = useAppSelector(selectTemporaryPlaylist);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState(false);
  const [animationVisible, setAnimationVisible] = useState(false);
  const [updatePlaylist, setUpdatePlaylist] = useState<IUpdatePlaylist>({
    _id: "",
    name: "",
    description: "",
  });

  useEffect(() => {
    if (temporaryPlaylist) {
      setUpdatePlaylist({
        _id: temporaryPlaylist._id,
        name: temporaryPlaylist.name || "",
        description: temporaryPlaylist.description || "",
      });
    }
  }, [temporaryPlaylist]);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      // Delay để cho phép CSS transition chạy khi bật modal
      setTimeout(() => setAnimationVisible(true), 10); // delay rất nhỏ là đủ
    } else {
      setAnimationVisible(false);
      const timeout = setTimeout(() => setShow(false), 100); // khớp với duration của transition
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleConfirm = async () => {
    if (session) {
      const res = await user_playlist_service.updatePlaylist(
        updatePlaylist,
        session.access_token
      );

      dispatch(setPlaylist({ playlist: res }));
    }
    setIsOpen(false);
  };

  const handleChange = async (name: keyof any, value: any) => {
    setUpdatePlaylist((prev) => ({
      ...prev,
      [name]: name === "artists" ? "" : value,
    }));
  };

  if (!show && !temporaryPlaylist) return null;

  return (
    <div
      className={`fixed inset-0 z-[10000] flex justify-center items-center transition-all duration-500 ${
        animationVisible ? "bg-black-03 visible" : "bg-transparent invisible"
      } text-white`}
    >
      <div
        className={`fixed inset-0 z-[10000] flex justify-center items-center transition-all duration-500 ${
          animationVisible
            ? "h-[90%] visible opacity-100"
            : "h-[75%] invisible opacity-0"
        }`}
      >
        <div
          className="w-[524px] min-h-[384px] bg-40 rounded-lg relative flex flex-col justify-between"
          ref={modalRef}
        >
          <div className="flex justify-between items-center px-6 pt-5">
            <span className="text-2xl font-bold">Sửa thông tin chi tiết</span>
            <div className="">
              <button
                className="font-bold text-xl p-3 cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                <IoIosClose className="scale-150 text-white-08 hover:bg-50 hover:rounded-full" />
              </button>
            </div>
          </div>

          <div className="px-6 pb-5 flex flex-col gap-2">
            <div className="flex gap-6 ">
              {" "}
              <div className="size-[180px] bg-50  ">
                {" "}
                <UploadImage onChange={(value) => handleChange("img", value)} />
              </div>
              <div className="flex flex-col gap-6 flex-1    ">
                <div className="bg-40">
                  <InputTextField
                    title="Tên"
                    value={updatePlaylist.name}
                    onChange={(value) => handleChange("name", value)}
                  />
                </div>
                <div className="bg-40 flex-1">
                  {" "}
                  <ResizableTextField
                    title="Nôi dụng mô tả"
                    value={updatePlaylist.description}
                    placeholder="Thêm phần mô tả không bắt buộc"
                    onChange={(value) => handleChange("description", value)}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-5 justify-end ">
              <button
                className="font-bold text-xl py-3 px-6 rounded-full bg-white text-black cursor-pointer hover:border-white border-2 hover:bg-black hover:text-white hover:scale-105 transition-all duration-150"
                onClick={handleConfirm}
              >
                Lưu
              </button>
            </div>
            <div className="text-[0.7rem] font-bold">
              Bằng cách tiếp tục, bạn đồng ý cho phép Spotify truy cập vào hình
              ảnh bạn đã chọn để tải lên. Vui lòng đảm bảo bạn có quyền tải lên
              hình ảnh.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ModalUpdatePlaylist;
