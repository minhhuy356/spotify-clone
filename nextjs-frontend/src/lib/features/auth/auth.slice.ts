import {
  createSlice,
  PayloadAction,
  isPending,
  isRejected,
} from "@reduxjs/toolkit";

import {
  IAuth,
  IArtist,
  IAlbum,
  ITrack,
  IPlaylist,
  IFolder,
} from "@/types/data";
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

function updateItem<T extends { _id: string }>(array: T[], item: T) {
  const index = array.findIndex(
    (existingItem) => existingItem._id === item._id
  );
  if (index !== -1) {
    array[index] = item;
  }
}

export const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession(state, action) {
      state.session = action.payload;
    },
    setPinedAt(
      state,
      action: PayloadAction<{
        artist?: IArtist;
        track?: ITrack;
        album?: IAlbum;
        playlist?: IPlaylist;
        folder?: IFolder;
      }>
    ) {
      if (state.session) {
        if (action.payload.playlist) {
          updateItem(state.session.user.playlists, action.payload.playlist);
        }
        if (action.payload.track) {
          updateItem(state.session.user.tracks, action.payload.track);
        }
        if (action.payload.artist) {
          updateItem(state.session.user.artists, action.payload.artist);
        }
        if (action.payload.album) {
          updateItem(state.session.user.albums, action.payload.album);
        }
        if (action.payload.folder) {
          updateItem(state.session.user.folders, action.payload.folder);
        }
      }
    },
    setPlaylist(
      state,
      action: PayloadAction<{
        playlist?: IPlaylist;
      }>
    ) {
      if (action.payload.playlist && state.session) {
        updateItem(state.session.user.playlists, action.payload.playlist);
      }
    },
    setSessionActivity(
      state,
      action: PayloadAction<{
        artists?: IArtist[] | [];
        tracks?: ITrack[] | [];
        albums?: IAlbum[] | [];
        playlists?: IPlaylist[] | [];
        folders?: IFolder[] | [];
      }>
    ) {
      if (state.session) {
        if (action.payload.artists)
          state.session.user.artists = action.payload.artists;
        if (action.payload.tracks)
          state.session.user.tracks = action.payload.tracks;
        if (action.payload.albums)
          state.session.user.albums = action.payload.albums;
        if (action.payload.playlists)
          state.session.user.playlists = action.payload.playlists;
        if (action.payload.folders)
          state.session.user.folders = action.payload.folders;
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

export const { setSession, setSessionActivity, setPinedAt, setPlaylist } =
  AuthSlice.actions;

export const selectSession = (state: RootState) => state.auth.session;
export const selectIsSignin = (state: RootState) => state.auth.isSignin;
export const selectIsPending = (state: RootState) => state.auth.isPending;
export const selectIsError = (state: RootState) => state.auth.isError;

export default AuthSlice.reducer;
