/**
 * Interface for mongoose user's schema
 */
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

/**
 * Interface for mongoose user's document
 */
export interface UserEntityDoc {
  _id: string;
  name: string;
  email: string;
  imageUrl?: string;
  imageName?: string;
  confirmed: boolean;
  role: string;
}
