import { TypeOfHousing } from './housing-type.enum.js';
import { User } from './user.type.js';

export type Offer = {
  title: string;
  description: string;
  postDate: Date;
  city: string;
  image: string;
  photos: string[];
  isPremium: boolean;
  isFavourites: boolean;
  rating: number;
  typeOfHousing: TypeOfHousing;
  roomsCount: number;
  guestsCount: number;
  price: number;
  comforts: string[];
  user: User;
  commentsCount: number;
  coordinates: string;
}
