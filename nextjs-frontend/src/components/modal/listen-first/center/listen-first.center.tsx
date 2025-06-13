import {
  selectIsPending,
  selectListenFirst,
  selectPlayingSource,
} from "@/lib/features/tracks/tracks.slice";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { HTMLAttributes, useEffect, useRef, useState } from "react";
import "./style.css";
import { backendUrl, disk_tracks } from "@/api/url";
import { selectSession } from "@/lib/features/auth/auth.slice";
import { useMediaQuery } from "@mui/material";
import { useNotification } from "@/components/notification/notification-context";
import Skeleton from "@/components/skeleton/skeleton";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
}

const CenterListenFirst = ({ index, setIndex }: IProps) => {
  const { setNotification } = useNotification();
  const isPending = useAppSelector(selectIsPending);
  const listenFirst = useAppSelector(selectListenFirst);
  const session = useAppSelector(selectSession);
  const xl = useMediaQuery("(min-width: 1200px)");
  const lg = useMediaQuery("(min-width:992px)");

  const dispatch = useAppDispatch();
  const playingSource = useAppSelector(selectPlayingSource);
  const videoRefs = useRef<HTMLVideoElement[]>([]);
  const [y, setY] = useState<number>(0);
  const allTrackRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const scrollStepCount = useRef(0);
  const lastScrollDirection = useRef<"up" | "down" | null>(null);
  const pendingScrollDirection = useRef<"up" | "down" | null>(null);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const [pendingIndexUpdate, setPendingIndexUpdate] = useState<number | null>(
    null
  );
  const [containerHeight, setContainerHeight] = useState(0);
  const [itemHeight, setItemHeight] = useState(0);

  const visibleOffset = itemHeight * 0.23; // 15% phần ảnh sẽ lòi ra
  const [firstRenderDone, setFirstRenderDone] = useState(false);

  useEffect(() => {
    const updateSizes = () => {
      if (allTrackRef.current) {
        setContainerHeight(allTrackRef.current.clientHeight);
      }
      if (trackRef.current) {
        setItemHeight(trackRef.current.clientHeight);
      }
    };

    updateSizes();
    window.addEventListener("resize", updateSizes);
    return () => window.removeEventListener("resize", updateSizes);
  }, []);

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const container = allTrackRef.current;
    const sampleItem = trackRef.current;
    if (!container || !sampleItem) return;
    setFirstRenderDone(true);
    const deltaY = e.deltaY;
    const itemHeight = sampleItem.clientHeight;
    const gap = 15;
    const offset = itemHeight + gap;
    const maxIndex = listenFirst.playingAudioListenFirst.allTrack.length - 1;

    const overScrollLimit = 280;

    let newY = y - deltaY;
    const minY = -maxIndex * offset;
    const maxY = 0;

    if (newY < minY - overScrollLimit) newY = minY - overScrollLimit;
    if (newY > maxY + overScrollLimit) newY = maxY + overScrollLimit;

    setY(newY);

    const direction: "up" | "down" = deltaY > 0 ? "down" : "up";

    if (lastScrollDirection.current !== direction) {
      scrollStepCount.current = 0;
    }
    lastScrollDirection.current = direction;
    pendingScrollDirection.current = direction;
    scrollStepCount.current += 1;

    const stepThreshold = 5;

    if (scrollStepCount.current >= stepThreshold) {
      const newIndex =
        direction === "down"
          ? Math.min(index + 1, maxIndex)
          : Math.max(index - 1, 0);
      setPendingIndexUpdate(newIndex);
      scrollStepCount.current = 0;
    }

    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      if (scrollStepCount.current > 0 && pendingScrollDirection.current) {
        const direction = pendingScrollDirection.current;
        const newIndex =
          direction === "down"
            ? Math.min(index + 1, maxIndex)
            : Math.max(index - 1, 0);
        setPendingIndexUpdate(newIndex);
        scrollStepCount.current = 0;
        pendingScrollDirection.current = null;
      } else {
        let finalY = -index * offset;
        if (y < minY) finalY = minY;
        else if (y > maxY) finalY = maxY;
        setY(finalY);
      }
    }, 150);
  };

  useEffect(() => {
    if (pendingIndexUpdate !== null) {
      setIndex(pendingIndexUpdate);
      const sampleItem = trackRef.current;
      if (sampleItem) {
        const offset = sampleItem.clientHeight + 15;
        setY(-pendingIndexUpdate * offset);
      }
      setPendingIndexUpdate(null);
    }
  }, [pendingIndexUpdate]);

  useEffect(() => {
    const handleResize = () => {
      const sampleItem = trackRef.current;
      if (!sampleItem) return;
      const itemHeight = sampleItem.clientHeight;
      const gap = 15;
      const offset = itemHeight + gap;
      setY(-index * offset);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [index]);

  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    let resizeTimer: NodeJS.Timeout;

    const handleResize = () => {
      setIsResizing(true);
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setIsResizing(false);
      }, 200);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === index) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => console.error("Playback failed", err));
        }
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [index, listenFirst]);

  if (!session) return <></>;

  return (
    <div
      ref={allTrackRef}
      className={`flex flex-col gap-[15px] px-[5%] w-[41%] h-full absolute top-0`}
      style={{
        transform: `translateY(${y}px)`,
        transition: isResizing ? "none" : "transform 0.5s ease",
      }}
      onWheel={handleWheel}
    >
      {listenFirst.playingAudioListenFirst.allTrack.map((item, i) => (
        <div
          key={item._id}
          className={`relative ${
            item.videoListenFirstUrl !== "" ? "aspect-[9/16]" : "aspect-[9/16] "
          } flex items-center p-2 justify-center h-[90%] ${
            i === 0 ? "mt-[12%]" : ""
          }`}
          ref={trackRef}
        >
          {isPending ? (
            <Skeleton height={"100%"} width={"100%"} />
          ) : (
            <>
              {" "}
              {item.videoListenFirstUrl !== "" ? (
                <video
                  ref={(el) => {
                    if (el) videoRefs.current[i] = el;
                  }}
                  key={item._id}
                  loop
                  muted
                  playsInline
                  className="aspect-[9/16] rounded-lg h-full object-cover  transition-all duration-500 group-hover:brightness-100 group-hover:blur-0 object-center"
                >
                  <source
                    src={`${backendUrl}${disk_tracks.videoListenFirst}${item?.videoListenFirstUrl}`}
                    type="video/mp4"
                  />
                </video>
              ) : (
                <div
                  className="relative z-[2]"
                  style={{
                    transform:
                      i === index
                        ? "scale(0.85)"
                        : `translateY(${
                            (i < index ? 1 : -1) * visibleOffset
                          }px)`,
                    transition:
                      isResizing || !firstRenderDone
                        ? "none"
                        : "transform 0.3s ",
                  }}
                >
                  <img
                    src={`${backendUrl}${disk_tracks.images}${item.imgUrl}`}
                    alt=""
                    className="rounded-lg object-cover group-hover:brightness-100  group-hover:blur-0 object-center"
                  />
                </div>
              )}
              {!item.videoListenFirstUrl && (
                <div
                  className={`${
                    i === index ? "opacity-100" : " opacity-0"
                  } absolute items-center top-0 flex h-full w-[105%] z-[1] 2xl:gap-0 transition-all duration-300`}
                  style={{
                    WebkitMaskImage:
                      "linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)",
                    maskImage:
                      "linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)",
                  }}
                >
                  <div className="rounded-[3vw] h-[5%] w-[min(1.7%,8px)] bg-90 mx-1 l4"></div>
                  <div className="rounded-[3vw] h-[5%] w-[min(1.7%,8px)] bg-90 mx-1 l3"></div>
                  <div className="rounded-[3vw] h-[5%] w-[min(1.7%,8px)] bg-90 mx-1 l2"></div>
                  <div className="rounded-[3vw] h-[5%] w-[min(1.7%,8px)] bg-90 mx-1 l1"></div>
                  <div className="flex-1"></div>
                  <div className="rounded-[3vw] h-[5%] w-[min(1.7%,8px)] bg-90 mx-1 r1"></div>
                  <div className="rounded-[3vw] h-[5%] w-[min(1.7%,8px)] bg-90 mx-1 r2"></div>
                  <div className="rounded-[3vw] h-[5%] w-[min(1.7%,8px)] bg-90 mx-1 r3"></div>
                  <div className="rounded-[3vw] h-[5%] w-[min(1.7%,8px)] bg-90 mx-1 r4"></div>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default CenterListenFirst;
