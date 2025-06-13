export interface IPlaylist {
  _id: string;
  name: string;
  imgUrl: string;
  folder: string;
  order: number;
  addLibraryAt: Date;
  pinnedAt: Date | null;
  description: string;
}

export interface IFolder {
  _id: string;
  name: string;
  addLibraryAt: Date;
  pinnedAt: Date | null;
}

export interface ITrackArtist {
  artist: IArtist;
  artistTypeDetail: IArtistTypeDetail;
  useStageName: boolean;
}

export interface ITrack {
  _id: string;
  title: string;
  artists: ITrackArtist[];
  releasedBy: IArtist;
  category: string;
  imgUrl: string;
  audioUrl: string;
  videoUrl: string;
  videoListenFirstUrl: string;
  countLike: number;
  countPlay: number;
  user: IUser;
  genres: IGenres[];
  isDeleted: boolean;
  __v: number;
  createdAt: string;
  updatedAt: string;
  duration: number;
  order: number;
  album: IAlbum;
  addLibraryAt: Date;
  pinnedAt: Date | null;
  copyrightNotice: string;
  phonogramCopyright: string;
  tags: ITag[];
}

export interface ITag {
  _id: string;
  name: string;
}

export interface IAlbum {
  _id: string;
  name: string;
  imgUrl: string;
  releasedBy: IArtist;
  countLike: number;
  addLibraryAt: Date;
  type: string;
  pinnedAt: Date | null;
  createdAt: Date;
  copyrightNotice: string;
  phonogramCopyright: string;
}
export interface IArtist {
  _id: string;
  stageName: string;
  realName: string;
  date: Date;
  country: string;
  description: string;
  countLike: number;
  avatarImgUrl: string;
  profileImgUrl: string;
  coverImgUrl: string;
  addLibraryAt: Date;
  pinnedAt: Date | null;
}

export interface IMonthlyListener {
  artistId: string;
  count: number;
}

export interface IChooseByArtist {
  _id: string;
  artist: IArtist;
  chooseTrack: ITrack;
  chooseTitle: string;
  chooseImgUrl: string;
}

export interface IArtistTypeDetail {
  _id: string;
  name: string;
  artistTypeGroup: IArtistTypeGroup;
  order: number;
}

export interface IArtistTypeGroup {
  _id: string;
  name: string;
}

export interface IGenres {
  _id: string;
  name: string;
}

export interface IUser {
  _id: string;
  email: string;
  name: string;
  imgUrl: string;
  roles: IRole[];
  type: string;
  tracks: ITrack[]; // Không cần `| []`
  artists: IArtist[];
  albums: IAlbum[];
  playlists: IPlaylist[];
  folders: IFolder[];
}

export interface IAuth {
  refresh_token: string;
  access_token: string;
  user: IUser;
}

export interface IGenres {
  _id: string;
  name: string;
}
export interface IRole {
  _id: string;
  name: string;
}

export interface IUserActivity<T> {
  _id: string;
  data: T;
}
