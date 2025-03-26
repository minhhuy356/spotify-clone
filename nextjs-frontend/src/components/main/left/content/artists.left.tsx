import { backendUrl, disk_artists } from "@/api/url";
import { selectSession } from "@/lib/features/auth/auth.slice";
import { useAppSelector } from "@/lib/hook";
import { IArtist } from "@/types/data";
import Link from "next/link";

interface IProps {}
const ArtistsCard = ({}: IProps) => {
  const session = useAppSelector(selectSession);

  return (
    <>
      {session?.user.artists.map((artist, index) => {
        return (
          <div
            className="flex gap-4 items-center p-2 hover:bg-40 rounded cursor-pointer"
            key={`${artist._id}-artist-library`}
          >
            <img
              src={`${backendUrl}${disk_artists.avatar}${artist.avatarImgUrl}`}
              alt=""
              className="size-[48px] rounded-full"
            />
            <div className="flex flex-col gap-1">
              {" "}
              <Link href={`artist/${artist._id}`} className="hover:underline">
                {artist.stageName}
              </Link>
              <span className="text-white-06 text-[0.85rem]">Nghệ sĩ</span>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ArtistsCard;
