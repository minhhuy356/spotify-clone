import { selectSession } from "@/lib/features/auth/auth.slice";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { IFolder } from "@/types/data";
import { setOpenContextMenuFolder } from "@/lib/features/local/local.slice";
import { ChooseLibraryBy } from "../../left.main";
import { FiFolder } from "react-icons/fi";
import ModalDeleteFolder from "@/components/modal/modal.custom";
import { useEffect, useState } from "react";
import { RiPushpinLine } from "react-icons/ri";
import { ILayout } from "@/app/layout";

interface IProps {
  chooseLibraryBy: ChooseLibraryBy;
  setChooseLibraryBy: (value: ChooseLibraryBy) => void;
  folder: IFolder;
}

const FolderCard = ({ chooseLibraryBy, folder }: IProps) => {
  const dispatch = useAppDispatch();

  const session = useAppSelector(selectSession);

  const rawLayout = localStorage.getItem("layout");
  const layout: ILayout = rawLayout ? JSON.parse(rawLayout) : {};
  const [isLeftClose, setIsLeftClose] = useState<boolean>();
  useEffect(() => {
    if (layout.left.width < 280) {
      setIsLeftClose(true);
    } else {
      setIsLeftClose(false);
    }
  }, [layout]);
  const handleOpenContextMenuFolder = (
    folder: IFolder,
    event: React.MouseEvent
  ) => {
    if (!folder) return;

    const position = {
      x: event.clientX,
      y: event.clientY,
    };

    dispatch(
      setOpenContextMenuFolder({
        isOpenContextMenuFolder: true,
        temporaryFolder: folder,
        position,
      })
    );
  };

  if (
    !session ||
    chooseLibraryBy !== "all" ||
    !session.user.folders ||
    session.user.folders.length < 1
  )
    return <></>;

  return (
    <>
      <div
        className="hover:bg-40  rounded cursor-pointer group flex justify-between s"
        key={folder._id}
        onContextMenu={(event) => {
          handleOpenContextMenuFolder(folder, event);
        }}
      >
        <div className="flex gap-4 items-center p-2 hover:bg-40 rounded cursor-pointer  ">
          <div className="size-[48px] p-2 bg-50 rounded flex items-center justify-center text-white-06">
            <FiFolder size={30} />
          </div>
          {!isLeftClose && (
            <div className=" flex-col flex flex-1">
              <span>{folder.name}</span>{" "}
              <div className="text-white-06 text-[0.85rem] flex gap-1">
                {folder.pinnedAt && (
                  <RiPushpinLine size={20} className="text-green-500" />
                )}

                <span className=" line-clamp-1">
                  Thư mục - {session.user.name || session.user.email}
                </span>
              </div>
              <span className="text-white-06 text-[0.85rem] line-clamp-1"></span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FolderCard;
