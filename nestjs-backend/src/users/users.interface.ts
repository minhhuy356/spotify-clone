export interface IUser {
  _id: string;
  name: string;
  email: string;
  date: Date;
  address: string;
  phoneNumber: string;
  gender: string;
  imgUrl: string;
  roles: IRole[];
  isVerify: boolean;
}

export interface IUserToken {
  _id: string;
  name: string;
  email: string;
  role: IRole[];
}

export interface IRole {
  _id: string;
  name: string;
}
export type TOrder = 'asc' | 'desc';
