"use client";
import { useEffect, useState, useRef, RefObject } from "react";
import { Vibrant } from "node-vibrant/browser";
import Color from "color"; // Import thư viện màu sắc
import { ITrack, IArtist, IAlbum, IAlbumByArtist } from "@/types/data";
import { frontendUrl } from "@/api/url";

import { album_service } from "@/service/album.service";
import { track_artist_service } from "@/service/track-artist.service";
import ListData from "@/components/list/list.data";
import ArtistSorter from "@/helper/artist/artist";
import { user_activity_service } from "@/service/user-activity.service";
import Skeleton from "@/components/skeleton/skeleton";
import Link from "next/link";
import {
  router_artist,
  router_track,
  router_url_artist,
  router_url_track,
} from "@/api/router";
interface IProps {
  track: ITrack;
}
const TrackListAlbum = ({ track }: IProps) => {
  const [isLoading, setIsLoading] = useState(true);

  // Các state như bạn đã khai báo
  const [listAlbumEpSingleTrending, setListAlbumEpSingleTrending] = useState<
    IAlbum[]
  >([]);
  const [listEpSingleTrending, setListEpSingleTrending] = useState<IAlbum[]>(
    []
  );
  const [listAlbumPopularReleasedBy, setListAlbumPopularReleasedBy] = useState<
    IAlbum[]
  >([]);
  const [listAlbumPopularArtist, setListAlbumPopularArtist] = useState<
    IAlbumByArtist[]
  >([]);
  const [listAlbumPropose, setListAlbumPropose] = useState<IAlbum[]>([]);
  const [listArtistAlsoLiked, setListArtistAlsoLiked] = useState<IArtist[]>([]);

  useEffect(() => {
    if (!track) return;

    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchListAlbumEpSingleRelated(),
          fetchListEpSingleRelated(),
          fetchListAlbumPopularReleasedBy(),
          fetchListAlbumPopularArtist(),
          fetchListAlbumPropose(),
          fetchListArtistAlsoLiked(),
        ]);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [track]);

  const fetchListAlbumEpSingleRelated = async () => {
    const albums = await track_artist_service.fetchAlbumsByArtist(
      track.album.releasedBy._id,
      {
        sort: "-countLike",
        limit: 15,
        type: ["album", "ep", "single"],
      }
    );
    if (albums) setListAlbumEpSingleTrending(albums);
  };

  const fetchListEpSingleRelated = async () => {
    const albums = await track_artist_service.fetchAlbumsByArtist(
      track.album.releasedBy._id,
      {
        sort: "-countLike",
        limit: 15,
        type: ["ep", "single"],
      }
    );
    if (albums) setListEpSingleTrending(albums);
  };

  const fetchListAlbumPopularReleasedBy = async () => {
    const albums = await album_service.fetchAlbumByReleasedBy(
      track.album.releasedBy._id,
      {
        sort: "-countLike",
        limit: 15,
        minScore: 50,
        type: ["album"],
      }
    );
    if (albums) setListAlbumPopularReleasedBy(albums);
  };

  const fetchListAlbumPopularArtist = async () => {
    const artists = ArtistSorter.sortAndGroupArtists(
      track.artists,
      track.releasedBy._id
    );
    const filtered = artists.filter(
      (item) => item.artist._id !== track.releasedBy._id
    );

    const albumByArtists = (
      await Promise.all(
        filtered.map(async (item) => {
          const albums = await track_artist_service.fetchAlbumsByArtist(
            item.artist._id
          );
          if (albums?.length) {
            return { artist: item.artist, albums };
          }
        })
      )
    ).filter(Boolean) as IAlbumByArtist[];

    setListAlbumPopularArtist(albumByArtists);
  };

  const fetchListAlbumPropose = async () => {
    const albums = await user_activity_service.fetchAlbumPropose(track._id);
    if (albums) setListAlbumPropose(albums);
  };

  const fetchListArtistAlsoLiked = async () => {
    const artists = await user_activity_service.fetchArtistAlsoLiked(
      track.releasedBy._id
    );
    if (artists) setListArtistAlsoLiked(artists);
  };

  if (isLoading) {
    return (
      <div className="w-full flex flex-col gap-8 px-5 mt-2 ">
        {[...Array(5)].map((_, i) => (
          <>
            {" "}
            <Skeleton key={i} style={{ width: "40%" }} />
            <div
              className="grid whitespace-nowrap overflow-hidden gap-4"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                maxHeight: `220px`,
              }}
            >
              {[...Array(15)].map((_, i) => (
                <div className="flex flex-col gap-4" key={i}>
                  <Skeleton key={i} style={{ height: "180px" }} />
                  <Skeleton key={i} style={{ width: "100%", height: "20px" }} />
                </div>
              ))}
            </div>
          </>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-8">
      {listAlbumEpSingleTrending.length > 0 && (
        <Section
          title={`Các bản phát thịnh hành của ${track.releasedBy.stageName}`}
          data={listAlbumEpSingleTrending}
          textMore={
            <Link
              href={`${frontendUrl}${router_artist}${track.releasedBy._id}${router_url_artist.discographyAll}`}
            >
              Hiện tất cả
            </Link>
          }
        />
      )}
      {listAlbumPopularReleasedBy.length > 0 && (
        <Section
          title={`Các album nổi tiếng của ${track.releasedBy.stageName}`}
          data={listAlbumPopularReleasedBy}
          textMore={
            <Link
              href={`${frontendUrl}${router_artist}${track.releasedBy._id}${router_url_artist.discographyAlbum}`}
            >
              Hiện tất cả
            </Link>
          }
        />
      )}
      {listEpSingleTrending.length > 0 && (
        <Section
          title={`Các đĩa đơn và EP thịnh hành của ${track.releasedBy.stageName}`}
          data={listEpSingleTrending}
          textMore={
            <Link
              href={`${frontendUrl}${router_artist}${track.releasedBy._id}${router_url_artist.discographySingle}`}
            >
              Hiện tất cả
            </Link>
          }
        />
      )}
      {/* {listAlbumPopularArtist.map((item) => (
        <Section
          key={item.artist._id}
          title={item.artist.stageName}
          data={item.albums}
          textHeader="Các album nổi tiếng"
        />
      ))} */}
      {listAlbumPropose.length > 0 && (
        <Section
          title="Bản phát hành đề xuất"
          data={listAlbumPropose}
          textMore={
            <Link
              href={`${frontendUrl}${router_track}${track._id}${router_url_track.moreLikeThis}`}
            >
              Hiện tất cả
            </Link>
          }
        />
      )}
      {listArtistAlsoLiked.length > 0 && (
        <Section
          title="Fan cũng thích"
          data={listArtistAlsoLiked}
          tData="artist"
          textMore={
            <Link
              href={`${frontendUrl}${router_artist}${track.releasedBy._id}${router_url_artist.related}`}
            >
              Hiện tất cả
            </Link>
          }
        />
      )}
    </div>
  );
};

const Section = ({
  title,
  data,
  tData = "album",
  textHeader = "",
  textMore = <p>Hiện tất cả</p>,
}: {
  title: string;
  data: any[];
  tData?: "album" | "artist";
  textHeader?: string;
  textMore?: React.ReactNode;
}) => (
  <div className="px-5 mt-2 flex flex-col gap-3">
    <ListData
      tData={tData}
      title={title}
      textMore={textMore}
      listDataRelated={data}
      textHeader={textHeader}
    />
  </div>
);

export default TrackListAlbum;
