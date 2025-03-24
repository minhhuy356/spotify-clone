export interface ITrack {
  _id: string;
  title: string;
  artists: {
    artist: IArtist;
    artistTypeDetail: IArtistTypeDetail;
    useStageName: boolean;
  }[];
  releasedBy: IArtist;
  category: string;
  imgUrl: string;
  audioUrl: string;
  videoUrl: string;
  countLike: number;
  countPlay: number;
  user: IUser;
  genres: IGenres[];
  isDeleted: boolean;
  __v: number;
  createdAt: string;
  updatedAt: string;
  duration: number;
}

export interface IMonthlyListener {
  artistId: string;
  count: number;
}

export interface IArtist {
  index?: number;
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
  roles: IRole[];
  type: string;
  tracks: ITrack[] | [];
  artists: IArtist[] | [];
  albums: IAlbum[] | [];
}

export interface IAuth {
  refresh_token: string;
  access_token: string;
  user: IUser;
}

export interface IAlbum {
  title: string;
  track: ITrack[];
  user: IUser;

  countLike: number;
}

export interface IGenres {
  _id: string;
  name: string;
}
export interface IRole {
  _id: string;
  name: string;
}

export interface ITrackComment {
  _id: string;
  content: string;
  moment: number;
  user: {
    _id: string;
    email: string;
    name: string;
    role: string;
    type: string;
  };
  track: string;
  isDeleted: boolean;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

export interface IAddComment {
  content: string;
  moment: number;
  user?: string;
  track: string;
  isDeleted?: false;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface IUserActivity {
  _id: string;
  tracks: ITrack[];
  artists: IArtist[];
  albums: IAlbum[];
  user: IUser;
}
