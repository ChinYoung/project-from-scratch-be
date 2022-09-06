export type tAddress = {
  province: string;
  city: string;
  district: string;
  detailAddress: string;
  cellphone: string;
};

export type tUser = {
  user_id?: string;
  name: string;
  gender: string;
  age: number;
  avatar?: string;
  cellphone?: string;
  address?: tAddress;
};
