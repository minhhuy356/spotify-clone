import { backendUrl, disk_tracks } from "@/api/url";
import { order } from "@/contants/artist.type";
import { selectSession } from "@/lib/features/auth/auth.slice";
import { useAppSelector } from "@/lib/hook";
import Link from "next/link";
import { Fragment } from "react";
import { GroupedArtist } from "../../right/main.right";

const TracksCard = () => {
  const session = useAppSelector(selectSession);

  if (!session?.user?.tracks?.length) return null; // Kiểm tra tránh lỗi

  return (
    <>
      {session.user.tracks.map((track) => {
        // Sắp xếp nghệ sĩ theo nhóm
        const sortedArtist = [...track.artists].sort((a, b) => {
          const groupA = a.artistTypeDetail.artistTypeGroup.name.toUpperCase();
          const groupB = b.artistTypeDetail.artistTypeGroup.name.toUpperCase();
          return order[groupA] - order[groupB];
        });

        // Gom nhóm nghệ sĩ
        const groupedArtistList = Object.values(
          sortedArtist
            .sort((a, b) => a.artistTypeDetail.order - b.artistTypeDetail.order)
            .reduce((acc, item) => {
              const key = `${item.artist._id}-${item.useStageName}`;
              if (!acc[key]) {
                acc[key] = {
                  artist: item.artist,
                  useStageName: item.useStageName,
                  artistTypeGroup: item.artistTypeDetail.artistTypeGroup,
                  artistTypeDetails: [],
                };
              }
              acc[key].artistTypeDetails.push(item.artistTypeDetail);
              return acc;
            }, {} as Record<string, GroupedArtist>)
        );

        // Lọc những nghệ sĩ có useStageName === true
        const filteredArtists = groupedArtistList.filter(
          (item) => item.useStageName === true
        );

        return (
          <div
            className="flex gap-4 items-center p-2 hover:bg-40 rounded cursor-pointer"
            key={track._id}
          >
            <img
              src={`${backendUrl}${disk_tracks.images}${track.imgUrl}`}
              alt={track.title}
              className="size-[48px] rounded"
            />
            <div className="flex flex-col gap-1">
              <Link
                href={`${track.album ? "album" : "track"}/${track._id}`}
                className="hover:underline"
              >
                {track.title}
              </Link>
              <span className="text-white-06 text-[0.85rem] line-clamp-1">
                Đĩa đơn -{" "}
                {filteredArtists.map((item, index) => (
                  <Fragment key={item.artist._id}>
                    <Link
                      href={`artist/${item.artist._id}`}
                      className="hover:underline hover:text-white"
                    >
                      {item.artist.stageName}
                    </Link>
                    {index < filteredArtists.length - 1 && ", "}
                  </Fragment>
                ))}
              </span>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default TracksCard;
