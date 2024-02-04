import { TypeOfHousing, User, City, Location } from './index.js';

export interface Offer {
  title: string;
  description: string;
  postDate: Date;
  city: City;
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
  offerLocation: Location;
}
