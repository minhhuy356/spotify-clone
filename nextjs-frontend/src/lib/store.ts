import { configureStore } from "@reduxjs/toolkit";
import localReducer from "./features/local/local.slice";
import authReducer from "./features/auth/auth.slice";
import tracksReducer from "./features/tracks/tracks.slice";
import artistReducer from "./features/artists/artist.slice";
import genreReducer from "./features/genres/genre.slice";
import seekReducer from "./features/seek.slice";
import scrollCenterReducer from "./features/scroll-center/scroll-center.slice";
const store = configureStore({
  reducer: {
    local: localReducer,
    auth: authReducer,
    track: tracksReducer,
    artist: artistReducer,
    genre: genreReducer,
    seek: seekReducer,
    scrollCenter: scrollCenterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
export default store;
