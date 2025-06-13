import { RootState } from "@/lib/store";
import { IAlbum, IArtist, IFolder, IPlaylist, ITrack } from "@/types/data";

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import React, { ReactNode } from "react";

interface INotification {
  content: string;
  isOpen: boolean;
}

// Define a type for the slice state
interface ILocalState {
  isOpenContextMenuTrack: boolean;
  temporaryTrack?: ITrack | null;

  isOpenContextMenuArtist: boolean;
  temporaryArtist?: IArtist | null;

  isOpenContextMenuAlbum: boolean;
  temporaryAlbum?: IAlbum | null;

  isOpenContextMenuFolder: boolean;
  temporaryFolder?: IFolder | null;

  isOpenContextMenuPlaylist: boolean;
  temporaryPlaylist?: IPlaylist | null;

  isOpenDialogCreateFolder: boolean;

  inLibrary: boolean;

  position?: { x: number; y: number } | null;

  notification: INotification;
}

// Define the initial state using that type
const initialState: ILocalState = {
  isOpenContextMenuTrack: false,
  temporaryTrack: null,

  isOpenContextMenuArtist: false,
  temporaryArtist: null,

  isOpenContextMenuAlbum: false,
  temporaryAlbum: null,

  isOpenContextMenuFolder: false,
  temporaryFolder: null,

  isOpenContextMenuPlaylist: false,
  temporaryPlaylist: null,

  isOpenDialogCreateFolder: false,

  inLibrary: false,
  position: null,

  notification: {
    content: "",

    isOpen: false,
  },
};

export const localSlice = createSlice({
  name: "local",
  initialState,
  reducers: {
    setOpenContextMenuTrack(
      state,
      action: PayloadAction<{
        isOpenContextMenuTrack: boolean;
        temporaryTrack?: ITrack;
        position?: { x: number; y: number } | null;
        inLibrary: boolean;
      }>
    ) {
      state.isOpenContextMenuTrack = action.payload.isOpenContextMenuTrack;
      if (action.payload.isOpenContextMenuTrack === true) {
        state.temporaryTrack = action.payload.temporaryTrack;
        state.position = action.payload.position;
      } else {
        state.position = action.payload.position;
      }
    },
    setOpenContextMenuArtist(
      state,
      action: PayloadAction<{
        isOpenContextMenuArtist: boolean;
        temporaryArtist?: IArtist;
        position?: { x: number; y: number } | null;
        inLibrary: boolean;
      }>
    ) {
      state.isOpenContextMenuArtist = action.payload.isOpenContextMenuArtist;
      if (action.payload.isOpenContextMenuArtist === true) {
        state.temporaryArtist = action.payload.temporaryArtist;
        state.position = action.payload.position;
        state.inLibrary = action.payload.inLibrary;
      } else {
        state.position = action.payload.position;
        state.inLibrary = action.payload.inLibrary;
      }
    },
    setOpenContextMenuAlbum(
      state,
      action: PayloadAction<{
        isOpenContextMenuAlbum: boolean;
        temporaryAlbum?: IAlbum;
        position?: { x: number; y: number } | null;
        inLibrary: boolean;
      }>
    ) {
      state.isOpenContextMenuAlbum = action.payload.isOpenContextMenuAlbum;
      if (action.payload.isOpenContextMenuAlbum === true) {
        state.temporaryAlbum = action.payload.temporaryAlbum;
        state.position = action.payload.position;
        state.inLibrary = action.payload.inLibrary;
      } else {
        state.position = action.payload.position;
        state.inLibrary = action.payload.inLibrary;
      }
    },
    setOpenContextMenuPlaylist(
      state,
      action: PayloadAction<{
        isOpenContextMenuPlaylist: boolean;
        temporaryPlaylist?: IPlaylist;
        position?: { x: number; y: number } | null;
        inLibrary: boolean;
      }>
    ) {
      state.isOpenContextMenuPlaylist =
        action.payload.isOpenContextMenuPlaylist;
      if (action.payload.isOpenContextMenuPlaylist === true) {
        state.temporaryPlaylist = action.payload.temporaryPlaylist;
        state.position = action.payload.position;
        state.inLibrary = action.payload.inLibrary;
      } else {
        state.position = action.payload.position;
        state.inLibrary = action.payload.inLibrary;
      }
    },
    setOpenContextMenuFolder(
      state,
      action: PayloadAction<{
        isOpenContextMenuFolder: boolean;
        temporaryFolder?: IFolder;
        position?: { x: number; y: number } | null;
      }>
    ) {
      state.isOpenContextMenuFolder = action.payload.isOpenContextMenuFolder;
      if (action.payload.isOpenContextMenuFolder === true) {
        state.temporaryFolder = action.payload.temporaryFolder;
        state.position = action.payload.position;
      } else {
        state.position = action.payload.position;
      }
    },

    setOpenDialogCreateFolder(
      state,
      action: PayloadAction<{
        isOpenDialogCreateFolder: boolean;
        position?: { x: number; y: number } | null;
      }>
    ) {
      state.isOpenDialogCreateFolder = action.payload.isOpenDialogCreateFolder;
      state.position = action.payload.position;
    },
    setPosition(state, action: PayloadAction<{ x: number; y: number }>) {
      state.position = action.payload;
    },
    setNotification(state, action: PayloadAction<INotification>) {
      if (action.payload) {
        state.notification.content = action.payload.content;
        state.notification.isOpen = action.payload.isOpen;
      }
    },
  },
});

export const {
  setOpenContextMenuTrack,
  setOpenContextMenuArtist,
  setOpenContextMenuAlbum,
  setOpenContextMenuPlaylist,
  setOpenContextMenuFolder,
  setPosition,
  setOpenDialogCreateFolder,
  setNotification,
} = localSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectPosition = (state: RootState) => state.local.position;
export const selectIsOpenContextMenuTrack = (state: RootState) =>
  state.local.isOpenContextMenuTrack;
export const selectTemporaryTrack = (state: RootState) =>
  state.local.temporaryTrack;

export const selectIsOpenContextMenuArtist = (state: RootState) =>
  state.local.isOpenContextMenuArtist;
export const selectTemporaryArtist = (state: RootState) =>
  state.local.temporaryArtist;

export const selectIsOpenContextMenuAlbum = (state: RootState) =>
  state.local.isOpenContextMenuAlbum;
export const selectTemporaryAlbum = (state: RootState) =>
  state.local.temporaryAlbum;

export const selectIsOpenContextMenuFolder = (state: RootState) =>
  state.local.isOpenContextMenuFolder;
export const selectTemporaryFolder = (state: RootState) =>
  state.local.temporaryFolder;

export const selectIsOpenContextMenuPlaylist = (state: RootState) =>
  state.local.isOpenContextMenuPlaylist;
export const selectTemporaryPlaylist = (state: RootState) =>
  state.local.temporaryPlaylist;

export const selectIsOpenDialogCreateFolder = (state: RootState) =>
  state.local.isOpenDialogCreateFolder;

export const selectInLibrary = (state: RootState) => state.local.inLibrary;

export const selectNotification = (state: RootState) =>
  state.local.notification;

export default localSlice.reducer;
