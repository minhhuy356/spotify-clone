import { RootState } from "@/lib/store";
import { IAlbum, IArtist, ITrack } from "@/types/data";

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import React from "react";

type TabType = "local" | "drawer" | null;

// Define a type for the slice state
interface ILocalState {
  isOpenContextMenuTrack: boolean;
  isOpenContextMenuArtist: boolean;
  isOpenContextMenuAlbum: boolean;
  temporaryAlbum?: IAlbum | null;
  temporaryArtist?: IArtist | null;
  temporaryTrack?: ITrack | null;
  position?: { x: number; y: number } | null;
}

// Define the initial state using that type
const initialState: ILocalState = {
  isOpenContextMenuTrack: false,
  isOpenContextMenuArtist: false,
  isOpenContextMenuAlbum: false,
  temporaryAlbum: null,
  temporaryArtist: null,
  temporaryTrack: null,
  position: null,
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
      }>
    ) {
      state.isOpenContextMenuTrack = action.payload.isOpenContextMenuTrack;
      if (action.payload.isOpenContextMenuTrack === true) {
        state.temporaryTrack = action.payload.temporaryTrack;
        state.position = action.payload.position;
      } else {
        state.temporaryTrack = null;
        state.position = action.payload.position;
      }
    },
    setOpenContextMenuArtist(
      state,
      action: PayloadAction<{
        isOpenContextMenuArtist: boolean;
        temporaryArtist?: IArtist;
        position?: { x: number; y: number } | null;
      }>
    ) {
      state.isOpenContextMenuArtist = action.payload.isOpenContextMenuArtist;
      if (action.payload.isOpenContextMenuArtist === true) {
        state.temporaryArtist = action.payload.temporaryArtist;
        state.position = action.payload.position;
      } else {
        state.temporaryTrack = null;
        state.position = action.payload.position;
      }
    },
    setOpenContextMenuAlbum(
      state,
      action: PayloadAction<{
        isOpenContextMenuAlbum: boolean;
        temporaryAlbum?: IAlbum;
        position?: { x: number; y: number } | null;
      }>
    ) {
      state.isOpenContextMenuAlbum = action.payload.isOpenContextMenuAlbum;
      if (action.payload.isOpenContextMenuAlbum === true) {
        state.temporaryAlbum = action.payload.temporaryAlbum;
        state.position = action.payload.position;
      } else {
        state.temporaryTrack = null;
        state.position = action.payload.position;
      }
    },
    setPosition(state, action: PayloadAction<{ x: number; y: number }>) {
      state.position = action.payload;
    },
  },
});

export const {
  setOpenContextMenuTrack,
  setOpenContextMenuArtist,
  setOpenContextMenuAlbum,
  setPosition,
} = localSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectPosition = (state: RootState) => state.local.position;
export const selectIsOpenContextMenuTrack = (state: RootState) =>
  state.local.isOpenContextMenuTrack;
export const selectIsOpenContextMenuArtist = (state: RootState) =>
  state.local.isOpenContextMenuArtist;
export const selectIsOpenContextMenuAlbum = (state: RootState) =>
  state.local.isOpenContextMenuAlbum;

export const selectTemporaryTrack = (state: RootState) =>
  state.local.temporaryTrack;
export const selectTemporaryArtist = (state: RootState) =>
  state.local.temporaryArtist;
export const selectTemporaryAlbum = (state: RootState) =>
  state.local.temporaryAlbum;

export default localSlice.reducer;
