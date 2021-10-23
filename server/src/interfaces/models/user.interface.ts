import { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  image_url: string;
  image_name: string;
  confirmed: boolean;
  role: string;
}
