import { IAlbum } from "@/types/data";
import { HTMLAttributes } from "react";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  album: IAlbum;
}

const AlbumCopyright = ({ album }: IProps) => {
  const createdAt = new Date(album.createdAt);
  const day = createdAt.getDate();
  const month = createdAt.getMonth() + 1; // getMonth() trả về từ 0-11
  const year = createdAt.getFullYear();

  return (
    <div className="flex flex-col text-white-06">
      <div className="text-sm">{`${day} tháng ${month}, ${year}`}</div>
      <div className=" text-2xs">
        © {new Date(album.createdAt).getFullYear()} {album.copyrightNotice}
      </div>
      <div className=" text-2xs">
        ℗ {new Date(album.createdAt).getFullYear()} {album.phonogramCopyright}
      </div>
    </div>
  );
};

export default AlbumCopyright;
