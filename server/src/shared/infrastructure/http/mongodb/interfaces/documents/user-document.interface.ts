export interface UserEntity {
  _id: string;
  name: string;
  email: string;
  password: string;
  image_url?: string;
  image_name?: string;
  confirmed: boolean;
  role: string;
}

export interface UserEntityDoc extends Omit<UserEntity, 'password'> {}
