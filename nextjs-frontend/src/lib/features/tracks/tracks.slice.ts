import { RootState } from "@/lib/store";
import { ITrack } from "@/types/data";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type Where = "track" | "artist" | "album";
type PlayingSource = "track" | "artist" | "album" | null;

interface IWhere {
  where: Where | null;
  data: any | null;
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

  playingSource: PlayingSource; // Thêm trạng thái nguồn phát (album/artist)

  isFooter: boolean;
  isPlay: boolean;
  currentTime: number;
  totalDuration: number;

  isInWaitlist: boolean;
  inWhere: IWhere;
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

  playingSource: null,

  isFooter: true,
  isPlay: false,
  currentTime: 0,
  totalDuration: 0,

  isInWaitlist: false,
  inWhere: {
    where: null,
    data: null,
  },
};

export const tracksSlice = createSlice({
  name: "track",
  initialState,
  reducers: {
    play: (
      state,
      action: PayloadAction<{
        waitTrackList: ITrack[];
        currentTrack: ITrack;
        isInWaitlist: boolean;
        playingSource: PlayingSource; // Thêm trạng thái nguồn phát (album/artist)
      }>
    ) => {
      state.isPlay = true;
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
    setIsFooter: (state) => {
      state.isFooter = !state.isFooter;
    },
    setCurrentTime(state, action) {
      state.currentTime = action.payload;
    },
    setIsInWaitlist(state, action) {
      state.isInWaitlist = action.payload;
    },
    setInWhere(state, action: PayloadAction<IWhere>) {
      state.inWhere = action.payload;
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
  setIsFooter,
  setCurrentTrack,
  setIsInWaitlist,
  setInWhere,
} = tracksSlice.actions;

// Other code such as selectors can use the imported `RootState` type

export const selectIsInWaitlist = (state: RootState) =>
  state.track.isInWaitlist;
export const selectPlayingSource = (state: RootState) =>
  state.track.playingSource;
export const selectInWhere = (state: RootState) => state.track.inWhere;
export const selectIsPlay = (state: RootState) => state.track.isPlay;
export const selectIsFooter = (state: RootState) => state.track.isFooter;
export const selectTrack = (state: RootState) => state.track.currentTrack;
export const selectAllTrack = (state: RootState) => state.track.allTrack;
export const selectWaitTrackList = (state: RootState) =>
  state.track.waitTrackList;
export const selectIsOpenWaitTrackList = (state: RootState) =>
  state.track.isOpenWaitTrackList;
export const selectCurrentTrack = (state: RootState) =>
  state.track.currentTrack;
// export const selectCurrentTrack = (state: RootState) =>
//   state.track.currentTrack;
export const selectTotalDuration = (state: RootState) =>
  state.track.totalDuration;
export const selectCurrentTime = (state: RootState) => state.track.currentTime;

export default tracksSlice.reducer;
