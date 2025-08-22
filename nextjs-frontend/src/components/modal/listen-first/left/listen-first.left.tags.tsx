import {
  IListenFirst,
  selectPlayingSource,
  setIsPending,
  setListenFirst,
  setListenFirstTag,
} from "@/lib/features/tracks/tracks.slice";
import { HTMLAttributes, useEffect, useState } from "react";
import "./tags.css";
import { ITag } from "@/types/data";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { track_artist_service } from "@/service/track-artist.service";
import { sortBy } from "lodash";

type ITagWithStatus = ITag & {
  status: "normal" | "enter" | "exit";
};

interface IProps extends HTMLAttributes<HTMLDivElement> {
  index: number;
  listenFirst: IListenFirst;
}

const ListenFirstLeftTags = ({ listenFirst, index }: IProps) => {
  const [prevTags, setPrevTags] = useState<ITag[]>([]);
  const [displayTags, setDisplayTags] = useState<ITagWithStatus[]>([]);
  const dispatch = useAppDispatch();
  const playingSource = useAppSelector(selectPlayingSource);
  const xxl = useMediaQuery("(min-width: 1536px)");
  const lg = useMediaQuery("(min-width:992px)");
  useEffect(() => {
    const newTags = listenFirst.playingAudioListenFirst.allTrack[index].tags;

    const newTagNamesSet = new Set(newTags.map((tag) => tag.name));
    const prevTagNamesSet = new Set(prevTags.map((tag) => tag.name));

    const fullList: ITagWithStatus[] = [];

    // Tag cũ: giữ lại hoặc đánh dấu exit
    prevTags.forEach((tag) => {
      if (!newTagNamesSet.has(tag.name)) {
        fullList.push({ ...tag, status: "exit" });
      } else {
        fullList.push({ ...tag, status: "normal" });
      }
    });

    // Tag mới: thêm vào
    newTags.forEach((tag) => {
      if (!prevTagNamesSet.has(tag.name)) {
        fullList.push({ ...tag, status: "enter" });
      }
    });

    setDisplayTags(fullList);
    setPrevTags(newTags);

    // Remove tag "exit" sau animation
    const timeout = setTimeout(() => {
      setDisplayTags((current) =>
        current.filter((tag) => tag.status !== "exit")
      );
    }, 300); // đồng bộ với transition.duration

    return () => clearTimeout(timeout);
  }, [index]);

  const handleFetchTrackByTag = async (tag: ITag) => {
    dispatch(setIsPending({ isPending: true }));

    const takenTracksId = listenFirst.playingAudioListenFirst.allTrack.map(
      (item) => item._id
    );

    const tracks = await track_artist_service.fetchTrackByTag(
      tag._id,
      "-countPlay",
      takenTracksId
    );
    console.log(tracks);
    if (tracks) {
      dispatch(
        setListenFirstTag({
          playingAudioListenFirst: {
            allTrack: tracks,
            isPlayListenFirst: true,
            title: tag.name,
            trackIndex: 0,
            isTag: true,
          },
          isPending: false,
        })
      );
    }
  };

  return (
    <div className="flex gap-2 overflow-hidden transition-all duration-300">
      <AnimatePresence>
        {displayTags
          .map((tag) => (
            <motion.div
              onClick={() => handleFetchTrackByTag(tag)}
              key={tag.name}
              layout
              initial={{ opacity: 0, x: tag.status === "enter" ? 30 : 0 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={`
              py-0.5 px-2 xl:py-1 xl:px-2.5 bg-50 rounded-2xl 
              line-clamp-1 hover:bg-60 cursor-pointer
            `}
            >
              #{tag.name}
            </motion.div>
          ))
          .slice(0, xxl ? 3 : 2)}
      </AnimatePresence>
    </div>
  );
};

export default ListenFirstLeftTags;
