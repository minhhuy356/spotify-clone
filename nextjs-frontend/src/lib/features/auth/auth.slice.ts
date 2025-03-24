import {
  createSlice,
  PayloadAction,
  isPending,
  isRejected,
} from "@reduxjs/toolkit";

import { IAuth, IArtist, IAlbum, ITrack } from "@/types/data";
import { RootState } from "@/lib/store";
import { login, logout } from "./auth.thunk";

interface IAuthState {
  isPending: boolean;
  isError: boolean;
  session: IAuth | null;
  isSignin: boolean;
  error: any;
}

const initialState: IAuthState = {
  isPending: false,
  isError: false,
  session: null,
  isSignin: false,
  error: null,
};

export const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession(state, action) {
      state.session = action.payload;
    },
    setSessionActivity(
      state,
      action: PayloadAction<{
        artists: IArtist[] | [];
        tracks: ITrack[] | [];
        albums: IAlbum[] | [];
      }>
    ) {
      if (state.session) {
        state.session.user.artists = action.payload.artists;
        state.session.user.tracks = action.payload.tracks;
        state.session.user.albums = action.payload.albums;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isPending = false;
        state.isSignin = true;
        state.session = action.payload;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isPending = false;
        state.isSignin = false;
        state.session = null;
        state.error = null;
      })
      // Rút gọn xử lý trạng thái pending cho tất cả API async
      .addMatcher(isPending(login), (state) => {
        state.isPending = true;
        state.error = null;
      })
      // Rút gọn xử lý trạng thái rejected cho tất cả API async
      .addMatcher(isRejected(login), (state, action) => {
        state.isPending = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSession, setSessionActivity } = AuthSlice.actions;

export const selectSession = (state: RootState) => state.auth.session;
export const selectIsSignin = (state: RootState) => state.auth.isSignin;
export const selectIsPending = (state: RootState) => state.auth.isPending;
export const selectIsError = (state: RootState) => state.auth.isError;

export default AuthSlice.reducer;
