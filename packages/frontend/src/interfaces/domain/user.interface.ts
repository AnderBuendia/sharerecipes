export interface UserMainData {
  _id: string;
  name: string;
  email: string;
}

export interface UserImage {
  imageName?: string;
  imageUrl?: string;
}

export interface UserProfile extends UserMainData {
  confirmed: boolean;
  role: string;
}

export interface UserComment extends UserMainData, UserImage {}

export interface UserCompleteProfile extends UserProfile, UserImage {}
