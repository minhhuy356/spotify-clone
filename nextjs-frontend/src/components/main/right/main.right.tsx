"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { HiDotsHorizontal } from "react-icons/hi";
import VideoInformation from "../../video/video.information";
import { IoClose } from "react-icons/io5";
import Link from "next/link";
import { CiLink } from "react-icons/ci";
import { IoAddCircleOutline } from "react-icons/io5";

import Marquee from "../../marquee/marquee";
import ScrollBar from "../../scroll/scroll";
import { artist_type_group, order } from "@/contants/artist.type";
import { IoMdClose } from "react-icons/io";
import Preview from "../../preview/preview";
import { sendRequest } from "@/api/api";
import {
  IArtist,
  IArtistTypeDetail,
  IArtistTypeGroup,
  ITrack,
  IUserActivity,
} from "@/types/data";
import ButtonSubscribe from "../../button/button.subscribe";

import { FaPause, FaPlay } from "react-icons/fa";
import Waitlist from "./waitlist";
import WaitlistDrawer from "./waitlist.drawer";
import {
  api_user_activity,
  backendUrl,
  disk_artists,
  disk_tracks,
  url_api_artist_type_group,
} from "@/api/url";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/lib/hook";
import {
  selectSession,
  setSessionActivity,
} from "@/lib/features/auth/auth.slice";
import {
  selectCurrentTrack,
  selectWaitTrackList,
} from "@/lib/features/tracks/tracks.slice";
import store from "@/lib/store";
import Loading from "@/components/loading/loading";

interface IProps {
  fatherRef: React.RefObject<HTMLDivElement | null>;
  rightWidth: number;
}
interface GroupedArtist {
  artist: IArtist;
  useStageName: boolean;
  artistTypeDetails: IArtistTypeDetail[];
  artistTypeGroup: IArtistTypeGroup;
}

const Right = (props: IProps) => {
  const { fatherRef, rightWidth } = props;
  const router = useRouter();
  const dispatch = useDispatch();

  const session = useAppSelector(selectSession);
  const waitTrackList = useAppSelector(selectWaitTrackList);
  const currentTrack = useAppSelector(selectCurrentTrack);

  const [artistTypeGroups, setArtistTypeGroups] =
    useState<IArtistTypeGroup[]>(); // 1: đi tới, -1: đi lui

  const [showPreview, setShowPreview] = useState<boolean>(false);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [scroll, setScroll] = useState<number>(0);

  const [showWaitlist, setShowWaitlist] = useState<boolean>(false);
  const headeWaitlistRef = useRef<HTMLDivElement | null>(null);
  const [scrollWaitlist, setScrollWaitlist] = useState<number>(0);

  const fetchAllartistTypeGroups = async () => {
    const res = await sendRequest<
      IBackendRes<IModelPaginate<IArtistTypeGroup[]>>
    >({
      url: `${backendUrl}${url_api_artist_type_group}`,
      method: "GET",
    });
    if (res) {
      setArtistTypeGroups(res.data?.result);
    }
  };

  useEffect(() => {
    fetchAllartistTypeGroups();
  }, []); // Chỉ chạy khi hover

  if (currentTrack && waitTrackList.length === 0) return <Loading />;

  if (!currentTrack) return <></>;

  const sortedArtist = [...currentTrack.artists].sort((a, b) => {
    const groupA = a.artistTypeDetail.artistTypeGroup.name.toUpperCase();
    const groupB = b.artistTypeDetail.artistTypeGroup.name.toUpperCase();
    return order[groupA] - order[groupB];
  });

  const groupedArtistList = Object.values(
    [...sortedArtist]
      .sort((a, b) => a.artistTypeDetail.order - b.artistTypeDetail.order) // Sắp xếp theo order
      .reduce((acc, item) => {
        const key = `${item.artist._id}-${item.useStageName}`;

        (acc[key] ||= {
          artist: item.artist,
          useStageName: item.useStageName,
          artistTypeGroup: item.artistTypeDetail.artistTypeGroup,
          artistTypeDetails: [],
        }).artistTypeDetails.push(item.artistTypeDetail);

        return acc;
      }, {} as Record<string, GroupedArtist>)
  );

  if (!artistTypeGroups) return <></>;

  const sortedArtistGroup = [...artistTypeGroups].sort((a, b) => {
    const groupA = a.name.toUpperCase();
    const groupB = b.name.toUpperCase();
    return (order[groupA] || 99) - (order[groupB] || 99);
  });

  return (
    <div className={`relative ${rightWidth <= 42 ? "hidden " : "block"}`}>
      <div className={`overflow-hidden rounded-lg group `}>
        <ScrollBar setScroll={setScroll} fatherRef={fatherRef}>
          <div className="relative">
            {" "}
            <VideoInformation fatherRef={fatherRef} headerRef={headerRef} />
            {/* Card Song */}
            <div className="relative ">
              <div
                className={`h-auto flex justify-center w-full rounded-lg overflow-hidden `}
                style={{
                  paddingTop: `${
                    headerRef && headerRef.current?.clientHeight
                  }px`,
                }}
              >
                {currentTrack.videoUrl ? (
                  <div className="w-full h-auto aspect-square"></div>
                ) : (
                  <img
                    src={`${backendUrl}${disk_tracks.images}${
                      waitTrackList.find(
                        (item: ITrack) => item._id === currentTrack?._id
                      )?.imgUrl
                    }`}
                    alt=""
                  />
                )}
              </div>
              <div className="mb-4 px-4 flex flex-col gap-4">
                {/* Div song*/}
                <div className="flex justify-between items-center relative">
                  <div
                    className="flex flex-col overflow-hidden flex-1"
                    style={{
                      maskImage:
                        "linear-gradient(to right, rgba(0,0,0,1) 90%, rgba(0,0,0,0) 100%)",
                      WebkitMaskImage:
                        "linear-gradient(to right, rgba(0,0,0,1) 90%, rgba(0,0,0,0) 100%)",
                    }}
                  >
                    <div className="flex ">
                      <Marquee>
                        <Link
                          href={`track/${currentTrack._id}`}
                          className="cursor-pointer hover:underline font-semibold text-2xl"
                        >
                          {currentTrack.title}
                        </Link>
                      </Marquee>
                    </div>
                    <div
                      className={`relative w-full flex whitespace-nowrap text-white-06`}
                    >
                      <Marquee>
                        <>
                          <Link
                            href={`artist/${currentTrack.releasedBy._id}`}
                            className="hover:underline hover:text-white"
                          >
                            {currentTrack.releasedBy.stageName}
                          </Link>
                          {currentTrack.artists
                            .filter(
                              (artists: any) =>
                                artists.artistTypeDetail?.artistTypeGroup.name.toUpperCase() ===
                                  artist_type_group.performing &&
                                artists.artist.stageName !==
                                  currentTrack.releasedBy.stageName // Loại bỏ trùng với releasedBy
                            )
                            .map((artists: any, index: any, self: any) => {
                              const isDuplicate =
                                self.findIndex(
                                  (a: any) =>
                                    a.artist._id === artists.artist._id
                                ) !== index;

                              return !isDuplicate ? (
                                <span key={artists.artist._id}>
                                  {", "}
                                  <Link
                                    href={`artist/${artists.artist._id}`}
                                    className="hover:underline hover:text-white"
                                  >
                                    {artists.artist.stageName}
                                  </Link>
                                </span>
                              ) : null;
                            })}
                        </>
                      </Marquee>
                    </div>
                  </div>
                  <div className="flex ml-2 gap-4">
                    <div className="max-w-0 group-hover:max-w-[40px] overflow-hidden cursor-pointer text-white-05 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <CiLink size={30} />
                    </div>
                    <div className="cursor-pointer text-white-05 hover:text-white">
                      <IoAddCircleOutline size={30} />
                    </div>
                  </div>
                </div>
                {/* Card Profile Artist */}
                <div className="w-full h-auto rounded-md overflow-hidden bg-30 ">
                  <div className="relative w-full h-auto  overflow-hidden cursor-pointer ">
                    {/* Ảnh nền */}
                    <img
                      src={`${backendUrl}${disk_artists.profile}${currentTrack.releasedBy.profileImgUrl}`}
                      alt=""
                      className="w-full h-full aspect-[3/2] object-cover object-center"
                    />

                    {/* Overlay đen mờ dần */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent "></div>

                    {/* Tên nghệ sĩ */}
                    <div className="absolute top-4 left-3 text-white  font-bold z-10">
                      <span>Giới thiệu về nghệ sĩ</span>
                    </div>
                  </div>

                  <div className="px-4 flex flex-col gap-3 py-5">
                    <div>
                      <Link
                        href={`artist/${currentTrack.releasedBy._id}`}
                        className="cursor-pointer hover:underline font-semibold "
                      >
                        {currentTrack.releasedBy.stageName}
                      </Link>
                    </div>
                    <div className="text-white-04 flex gap-3 flex-col">
                      <div className="flex items-center justify-between gap-3">
                        <span className="line-clamp-3">
                          100000 người nghe hàng tháng
                        </span>
                        <div>
                          <ButtonSubscribe
                            artist={currentTrack.releasedBy}
                            isSubscribe={
                              (session &&
                                session?.user.artists.some(
                                  (a) => a._id === currentTrack.releasedBy._id
                                )) ||
                              false
                            }
                          />
                        </div>
                      </div>
                      <div className="text-sm line-clamp-3">
                        <span> {currentTrack.releasedBy.description}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Card Artists */}
                <div className="w-full h-auto rounded-md overflow-hidden bg-30 ">
                  <div className="p-4 flex flex-col gap-4 ">
                    <div className="flex justify-between gap-2">
                      <div className="font-semibold flex-1  line-clamp-1 ">
                        <span className="">Người tham gia thực hiện</span>
                      </div>
                      <div
                        className="text-white-06 whitespace-nowrap hover:text-white hover:scale-105 hover:underline cursor-pointer"
                        onClick={() => setShowPreview(true)}
                      >
                        <span>Hiện tất cả</span>
                      </div>
                    </div>
                    <div className="flex gap-3 flex-col">
                      {groupedArtistList
                        .map((item: GroupedArtist) => (
                          <div
                            className="flex items-center justify-between gap-3"
                            key={item.artist._id + item.useStageName}
                          >
                            <div>
                              <span className="line-clamp-1 hover:underline cursor-pointer">
                                {item.useStageName
                                  ? item.artist.stageName
                                  : item.artist.realName}
                              </span>
                              <span className="line-clamp-1 hover:underline cursor-pointer text-white-06">
                                {item.artistTypeDetails
                                  .map((item: any) => item.name)
                                  .join(", ")}
                                {/* Hiển thị danh sách role */}
                              </span>
                            </div>
                            <div>
                              {item.artistTypeGroup.name.toUpperCase() !==
                                artist_type_group.manufacturer &&
                                item.useStageName !== false && (
                                  <ButtonSubscribe
                                    artist={item.artist}
                                    isSubscribe={
                                      (session &&
                                        session?.user.artists.some(
                                          (a) => a._id === item.artist._id
                                        )) ||
                                      false
                                    }
                                  />
                                )}
                            </div>
                          </div>
                        ))
                        .slice(0, 3)}
                    </div>
                  </div>
                </div>
                <Waitlist setShowWaitlist={setShowWaitlist} />
              </div>
            </div>
          </div>
        </ScrollBar>
      </div>

      {/* Header */}
      <div
        className={`${
          scroll !== 0 && "bg-base shadow-[0_10px_10px_rgba(0,0,0,0.5)]"
        } absolute top-0 z-100 w-full p-4 transition-all duration-300`}
        ref={headerRef}
      >
        <div className="flex justify-between items-center">
          <div>
            <Link
              href={`track/${currentTrack._id}`}
              className="cursor-pointer hover:underline font-semibold"
            >
              {currentTrack.title}
            </Link>
          </div>
          <div className="flex gap-4 items-center">
            <div className="text-white-05 hover:text-white cursor-pointer">
              <HiDotsHorizontal size={20} />
            </div>
            <div className="text-white-05 hover:text-white cursor-pointer">
              <IoClose size={20} />
            </div>
          </div>
        </div>
      </div>
      <WaitlistDrawer
        fatherRef={fatherRef}
        headeWaitlistRef={headeWaitlistRef}
        scrollWaitlist={scrollWaitlist}
        setScrollWaitlist={setScrollWaitlist}
        setShowWaitlist={setShowWaitlist}
        showWaitlist={showWaitlist}
      />
      {/*Giới thiệu nghệ sĩ tham gia */}
      <Preview open={showPreview} onClose={() => setShowPreview(false)}>
        <div className="bg-40 max-w-[548px] w-full rounded-sm ">
          <div className="p-6 border-b border-border ">
            <div className="flex justify-between font-semibold items-center gap-4 ">
              <div className="text-4xl">Người tham gia thực hiện</div>
              <div
                className="= cursor-pointer text-white"
                onClick={() => {
                  setShowPreview(false);
                }}
              >
                <IoMdClose size={30} />
              </div>
            </div>
          </div>
          <div className="p-6  font-semibold flex flex-col gap-3">
            <div className="text-xl">{currentTrack.title}</div>
            {sortedArtistGroup &&
              sortedArtistGroup.map((artistTypeGroup, index) => (
                <div key={index} className="flex flex-col text-lg">
                  <div>{artistTypeGroup.name}</div>
                  <div className="text-white-06 bg-base flex">
                    {groupedArtistList &&
                      (() => {
                        const filteredArtists = groupedArtistList
                          .filter((item: any) =>
                            item.artistTypeDetails.some(
                              (detail: any) =>
                                detail.artistTypeGroup._id ===
                                artistTypeGroup._id
                            )
                          )
                          .map((item: any) =>
                            item.useStageName
                              ? item.artist.stageName
                              : item.artist.realName
                          );

                        return <>{filteredArtists.join(", ")}</>;
                      })()}
                  </div>
                </div>
              ))}

            <div>Nguồn: </div>
          </div>
        </div>
      </Preview>
    </div>
  );
};

export default Right;
