import { api_genres, backendUrl, url_api_genres } from "@/api/url";
import { RootState } from "@/lib/store";
import { IGenres } from "@/types/data";
import { sendRequest } from "@/api/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IScrollCenter {
  color: string;
  scroll: number;
  name: string;
  coverHeight: number;
  isPlay: boolean;
}

// Define a type for the slice state
interface IGenrestate {
  isPending: boolean;
  isError: boolean;
  error: any;
  scrollCenter: IScrollCenter;
}

// Define the initial state using that type
const initialState: IGenrestate = {
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
  },
});

export const { setColorAndName, setScrollCenter, setCoverHeight, setIsPlay } =
  ScrollCenterSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectScrollCenter = (state: RootState) =>
  state.scrollCenter.scrollCenter;
export const selectIsPending = (state: RootState) =>
  state.scrollCenter.isPending;
export const selectIsError = (state: RootState) => state.scrollCenter.isError;
export default ScrollCenterSlice.reducer;
