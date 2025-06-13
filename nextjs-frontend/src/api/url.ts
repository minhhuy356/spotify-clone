import { profile } from "console";

export const backendUrl = "http://localhost:8080/";
export const frontendUrl = "http://localhost:3000/";

export const url_api_user_daily_fetched_tracks =
  "api/v1/user-daily-fetched-tracks/";
export const api_user_daily_fetched_tracks = {
  fetch_by_track: `${url_api_user_daily_fetched_tracks}fetch-by-track/`,
};

export const url_api_track_artists = "api/v1/track-artists/";
export const api_track_artists = {
  genres_name: `${url_api_track_artists}genres-name/`,
  user: `${url_api_track_artists}user`,
  artist: `${url_api_track_artists}artist/`,
  album: `${url_api_track_artists}album/`,
  tag: `${url_api_track_artists}tag/`,
};

export const url_api_tracks = "api/v1/tracks/";
export const api_tracks = {
  increaseView: `${url_api_tracks}increase-view/`,
  stream: `${url_api_tracks}stream/audio/`,
  get: `${url_api_tracks}get/`,
};

export const url_api_user_activity = "api/v1/user-activity/";
export const api_user_activity = {
  track: `${url_api_user_activity}track/`,
  album: `${url_api_user_activity}album/`,
  artist: `${url_api_user_activity}artist/`,
  folder: `${url_api_user_activity}folder/`,
  playlist: `${url_api_user_activity}playlist/`,
};

export const url_api_albums = "api/v1/albums/";
export const api_albums = {
  related: `${url_api_albums}related/`,
};

export const url_api_choose_by_artist = "api/v1/choose-by-artist/";
export const url_api_artists = "api/v1/artists/";
export const api_artists = {
  choose: `${url_api_choose_by_artist}`,
};

export const url_api_artist_type_detail = "api/v1/artist-type-detail/";
export const api_artist_type_detail = {};

export const url_api_artist_type_group = "api/v1/artist-type-group/";
export const api_artist_type_group = {};

export const url_api_genres = "api/v1/genres/";
export const api_genres = {};

export const url_api_types = "api/v1/types/";
export const api_types = {};

export const url_api_files = "api/v1/files/";
export const api_files = {
  upload: `${url_api_files}upload`,
};

export const url_disk_preview = "preview/";

export const url_api_auth = "api/v1/auth/";
export const api_auth = {
  refresh: `${url_api_auth}refresh`,
  login: `${url_api_auth}login`,
  logout: `${url_api_auth}logout`,
};

export const url_api_user_playlist = "api/v1/user-playlist/";
export const url_api_user_folder = "api/v1/user-folder/";
export const url_api_monthly_listeners = "api/v1/monthly-listeners/";

//**** DISK *** */
export const url_disk_artists = "artists/";
export const disk_artists = {
  profile: `${url_disk_artists}profile/`,
  avatar: `${url_disk_artists}avatar/`,
  cover: `${url_disk_artists}cover/`,
  choose: `${url_disk_artists}choose/`,
};

export const url_disk_tracks = "tracks/";
export const disk_tracks = {
  images: `${url_disk_tracks}images/`,
  audios: `${url_disk_tracks}audios/`,
  videos: `${url_disk_tracks}videos/`,
  videoListenFirst: `${url_disk_tracks}preview/`,
};

export const url_disk_albums = "albums/";
export const disk_albums = {
  images: `${url_disk_albums}images/`,
};
export const url_disk_playlists = "playlists/";

export const url_disk_users = "users/";

export const image_favorite =
  "https://misc.scdn.co/liked-songs/liked-songs-300.jpg";
