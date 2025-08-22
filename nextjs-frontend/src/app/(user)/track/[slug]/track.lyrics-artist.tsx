import { router_artist } from "@/api/router";
import { backendUrl, disk_artists, frontendUrl } from "@/api/url";
import ShowMoreButton from "@/components/button/button.showmore";
import ArtistSorter from "@/helper/artist/artist";
import { useResponsiveBreakpoint } from "@/hooks/useResponsiveBreakpoint";
import { lyrics_service } from "@/service/lyrics.serice";
import { ILyrics, ITrack } from "@/types/data";
import Link from "next/link";
import { HtmlHTMLAttributes, useEffect, useRef, useState } from "react";

interface IProps extends HtmlHTMLAttributes<HTMLDivElement> {
  track: ITrack;
}

const PageTrackLyricsArtist = ({ track }: IProps) => {
  const [lyrics, setLyrics] = useState<ILyrics>();
  const [expanded, setExpanded] = useState(false);
  const { ref: wrapperRef, breakpoint } = useResponsiveBreakpoint();

  const fetchLyricByTrack = async () => {
    if (track) {
      const res = await lyrics_service.fetchLyricsByTrack(track._id.toString());
      if (res) {
        setLyrics(res);
      }
    }
  };

  useEffect(() => {
    fetchLyricByTrack();
  }, []);

  const minLyric = 10;
  const maxLyric = lyrics?.lines.length;

  const displayedLines = expanded
    ? lyrics && lyrics.lines
    : lyrics && lyrics.lines.slice(0, minLyric);

  const filteredArtists = ArtistSorter.sortAndGroupArtists(
    track.artists,
    track.releasedBy._id
  );

  return (
    <div
      ref={wrapperRef}
      className={`flex gap-10 ${
        breakpoint.below1200 ? "flex-col" : "flex-row"
      }`}
    >
      {lyrics && (
        <div className={` ${!lyrics ? "" : "flex-1"}`}>
          <h2 className="text-2xl font-bold mb-4">Lời bài hát</h2>

          {displayedLines &&
            displayedLines.map((item, index) => (
              <p key={item._id} className="text-white-06">
                {item.text}
              </p>
            ))}

          <ShowMoreButton
            isExpanded={expanded}
            onToggle={() => {
              console.log(expanded);
              setExpanded((prev) => !prev);
            }}
            totalCount={lyrics.lines?.length || 0}
            minCount={minLyric}
            maxCount={maxLyric || 0}
            showCountLabel={true}
            showLessText="...Hiển thị ít hơn"
            showMoreText="...Xem thêm"
          />
        </div>
      )}

      <div
        className={`flex-1 flex  ${
          !lyrics ? "flex-row gap-12 my-4" : " flex-col gap-4"
        }`}
      >
        {filteredArtists.map((item, index) => {
          if (item.useStageName) {
            return (
              <div
                className={`flex gap-4 font-bold items-center w-[100%]  hover:bg-50 h-fit p-2 rounded`}
                key={item.artist._id}
              >
                <div className="size-20 rounded-full overflow-hidden object-cover object-center">
                  {item.artist.avatarImgUrl ? (
                    <img
                      src={`${backendUrl}${disk_artists.avatar}${item.artist.avatarImgUrl}`}
                      alt=""
                    />
                  ) : (
                    <div className="text-4xl p-4 rounded-full bg-90 grid place-items-center h-full">
                      ?
                    </div>
                  )}
                </div>
                <div className="flex flex-col ">
                  <p className="text-white-06">Nghệ sĩ</p>
                  <Link
                    href={`${frontendUrl}${router_artist}${item.artist._id}`}
                    className="hover:underline cursor-pointer"
                  >
                    {item.artist.stageName}
                  </Link>
                </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default PageTrackLyricsArtist;
