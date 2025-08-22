import { api_genres, backendUrl, url_api_genres } from "@/api/url";
import { RootState } from "@/lib/store";
import { IAlbum, IArtist, IGenres } from "@/types/data";
import { sendRequest } from "@/api/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IDisplayAlbum } from "@/app/(user)/artist/[slug]/discography/[type]/classify.discography.header.artist";

interface IDiscography {
  albums: IAlbum[] | null;
  artist: IArtist | null;
  albumCurrent: IAlbum | null;
  type: TTypeAlbum;
  displayAlbum: IDisplayAlbum;
}

interface IScrollCenterChild {
  color: string;
  scroll: number;
  name: string;
  coverHeight: number;
  isPlay: boolean;
}

export type TTypeAlbum = "album" | "single" | "all" | "discography" | "ep";

interface ISetDiscography {
  albums: IAlbum[] | null;
  artist: IArtist | null;
}

// Define a type for the slice state
interface IScrollCenter {
  isPending: boolean;
  isError: boolean;
  error: any;
  scrollCenter: IScrollCenterChild;
  discography: IDiscography;
}

// Define the initial state using that type
const initialState: IScrollCenter = {
  isPending: false,
  isError: false,

  error: [],

  scrollCenter: {
    color: "",
    scroll: 0,
    name: "",
    coverHeight: 0,
    isPlay: false,
  },
  discography: {
    albums: null,
    artist: null,
    albumCurrent: null,
    type: "all",
    displayAlbum: {
      arange: "day",
      viewas: "list",
    },
  },
};

export const ScrollCenterSlice = createSlice({
  name: "scroll-center",
  initialState,
  reducers: {
    setColorAndName(
      state,
      action: PayloadAction<{ color: string; name: string }>
    ) {
      state.scrollCenter.color = action.payload.color;
      state.scrollCenter.name = action.payload.name;
    },
    setScrollCenter(state, action: PayloadAction<{ scroll: number }>) {
      state.scrollCenter.scroll = action.payload.scroll;
    },
    setCoverHeight(state, action: PayloadAction<{ coverHeight: number }>) {
      state.scrollCenter.coverHeight = action.payload.coverHeight;
    },
    setIsPlay(state, action: PayloadAction<{ isPlay: boolean }>) {
      state.scrollCenter.isPlay = action.payload.isPlay;
    },
    setDiscography(state, action: PayloadAction<ISetDiscography>) {
      state.discography.artist = action.payload.artist;
      state.discography.albums = action.payload.albums;
    },
    setDiscographyAlbumCurrent(
      state,
      action: PayloadAction<{ albumCurrent: IAlbum | null }>
    ) {
      state.discography.albumCurrent = action.payload.albumCurrent;
    },
    setDiscographyType(state, action: PayloadAction<{ type: TTypeAlbum }>) {
      state.discography.type = action.payload.type;
    },
    updateDisplayAlbum(state, action: PayloadAction<Partial<IDisplayAlbum>>) {
      const payload = action.payload;
      if (payload.arange !== undefined) {
        console.log(payload);
        state.discography.displayAlbum.arange = payload.arange;
      }
      if (payload.viewas !== undefined) {
        state.discography.displayAlbum.viewas = payload.viewas;
      }
    },
  },
});

export const {
  setColorAndName,
  setScrollCenter,
  setCoverHeight,
  setIsPlay,
  setDiscography,
  setDiscographyAlbumCurrent,
  setDiscographyType,
  updateDisplayAlbum,
} = ScrollCenterSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectScrollCenter = (state: RootState) =>
  state.scrollCenter.scrollCenter;
export const selectDiscography = (state: RootState) =>
  state.scrollCenter.discography;
export const selectDisplayAlbum = (state: RootState) =>
  state.scrollCenter.discography.displayAlbum;
export const selectIsPending = (state: RootState) =>
  state.scrollCenter.isPending;
export const selectIsError = (state: RootState) => state.scrollCenter.isError;
export default ScrollCenterSlice.reducer;
