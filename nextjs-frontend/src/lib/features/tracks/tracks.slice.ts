import { RootState } from "@/lib/store";
import { IAlbum, ITrack } from "@/types/data";
import { createSlice } from "@reduxjs/toolkit";
import type { isPending, PayloadAction } from "@reduxjs/toolkit";

type Where = "album" | "track" | "artist" | "collection" | "listen-first";

interface PlayAudioMain {
  waitTrackList: ITrack[];
  currentTrack: ITrack;
  playingSource?: PlayingSource;
  inWaitList?: boolean;
}

interface PlayAudioListenFirst {
  isPlayListenFirst: boolean;
  title: string;
  isTag?: boolean;
  allTrack: ITrack[] | [];
  trackIndex: number;
}

interface PlayingSource {
  _id: string;
  in: Where | null;
  title?: string;
  before: Where | null;
}

interface IModalListenFirst {
  isOpen: boolean;
  color?: string;
}

interface ISetListenFirst {
  modalListenFirst: IModalListenFirst;
  playingSource: PlayingSource;
  playingAudioListenFirst: PlayAudioListenFirst;
}

interface ISetListenFirstTag {
  playingAudioListenFirst: PlayAudioListenFirst;
  isPending: boolean;
}

export interface IListenFirst {
  modalListenFirst: IModalListenFirst;
  playingAudioListenFirst: PlayAudioListenFirst;
}

// Define a type for the slice state
interface ItracksState {
  isPending: boolean;
  isError: boolean;
  error: any;

  allTrack: ITrack[];
  waitTrackList: ITrack[];
  isOpenWaitTrackList: boolean;
  currentTrack: ITrack | null;

  // Thêm trạng thái nguồn phát (album/artist)

  isPlay: boolean;
  inWaitList: boolean;

  currentTime: number;
  totalDuration: number;
  playingSource: PlayingSource;
  listenFirst: IListenFirst;
}

// Define the initial state using that type
const initialState: ItracksState = {
  isPending: false,
  isError: false,
  error: [],

  allTrack: [],
  waitTrackList: [],
  isOpenWaitTrackList: false,
  currentTrack: null,

  isPlay: false,
  currentTime: 0,
  totalDuration: 0,

  inWaitList: false,

  listenFirst: {
    modalListenFirst: {
      color: "",
      isOpen: false,
    },
    playingAudioListenFirst: {
      isPlayListenFirst: false,
      title: "",
      isTag: false,
      allTrack: [],
      trackIndex: 0,
    },
  },

  playingSource: {
    _id: "",
    in: null,
    title: "",
    before: null,
  },
};

export const tracksSlice = createSlice({
  name: "track",
  initialState,
  reducers: {
    setIsPending: (state, action: PayloadAction<{ isPending: boolean }>) => {
      state.isPending = action.payload.isPending;
    },
    play: (state, action: PayloadAction<PlayAudioMain>) => {
      state.isPlay = true;
      if (!state.inWaitList) state.inWaitList = false;
      state.waitTrackList = action.payload.waitTrackList;
      state.currentTrack = action.payload.currentTrack;
      if (action.payload.playingSource)
        state.playingSource = action.payload.playingSource;
    },
    pause: (state) => {
      state.isPlay = false;
    },
    change: (state, action: PayloadAction<{ currentTrack: ITrack }>) => {
      state.isPlay = true;
      state.currentTrack = action.payload.currentTrack;
    },
    setWaitTrackList: (state, action) => {
      state.waitTrackList = action.payload;
    },
    setCurrentTrack: (state, action) => {
      state.currentTrack = action.payload;
    },
    setIsOpenWaitTrackList: (state, action) => {
      state.isOpenWaitTrackList = action.payload;
    },
    setCurrentTime(state, action) {
      state.currentTime = action.payload;
    },
    setInWaitList(state, action) {
      state.inWaitList = action.payload;
    },
    setListenFirst(state, action: PayloadAction<ISetListenFirst>) {
      if (action.payload) {
        state.listenFirst.modalListenFirst = action.payload.modalListenFirst;
        state.listenFirst.playingAudioListenFirst =
          action.payload.playingAudioListenFirst;
        state.playingSource = action.payload.playingSource;
      }
    },
    setListenFirstTag(state, action: PayloadAction<ISetListenFirstTag>) {
      if (action.payload) {
        state.listenFirst.playingAudioListenFirst =
          action.payload.playingAudioListenFirst;
        state.isPending = action.payload.isPending;
      }
    },
    setListenFirstTrackIndex(state, action: PayloadAction<number>) {
      if (
        !(
          action.payload >
          state.listenFirst.playingAudioListenFirst.allTrack.length - 1
        )
      ) {
        state.listenFirst.playingAudioListenFirst.trackIndex = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // .addCase(trackActions.fetchTrackById.success, (state, action) => {
      //   state.isPending = false;
      //   state.error = false;
      //   state.track = action.payload;
      // })
      // .addCase(, (state, action) => {
      //   state.isPending = false;
      //   state.error = false;
      //   state.totalDuration = action.payload;
      // })
      // .addCase(, (state, action) => {
      //   state.isPending = false;
      //   state.error = false;
      // })
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.isPending = true;
          state.error = false;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state) => {
          state.isPending = false;
          state.error = true;
        }
      );
  },
});

export const {
  play,
  pause,
  change,
  setCurrentTime,
  setIsOpenWaitTrackList,
  setWaitTrackList,
  setListenFirst,
  setCurrentTrack,
  setListenFirstTrackIndex,
  setInWaitList,
  setListenFirstTag,
  setIsPending,
} = tracksSlice.actions;

// Other code such as selectors can use the imported `RootState` type

export const selectPlayingSource = (state: RootState) =>
  state.track.playingSource;
export const selectIsPending = (state: RootState) => state.track.isPending;
export const selectIsPlay = (state: RootState) => state.track.isPlay;

export const selectTrack = (state: RootState) => state.track.currentTrack;
export const selectAllTrack = (state: RootState) => state.track.allTrack;
export const selectWaitTrackList = (state: RootState) =>
  state.track.waitTrackList;
export const selectIsOpenWaitTrackList = (state: RootState) =>
  state.track.isOpenWaitTrackList;
export const selectCurrentTrack = (state: RootState) =>
  state.track.currentTrack;

export const selectTotalDuration = (state: RootState) =>
  state.track.totalDuration;
export const selectCurrentTime = (state: RootState) => state.track.currentTime;
export const selectListenFirst = (state: RootState) => state.track.listenFirst;

export default tracksSlice.reducer;
