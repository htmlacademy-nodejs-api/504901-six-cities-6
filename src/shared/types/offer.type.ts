import { TypeOfHousing, User, CityLocation, Location } from './index.js';

export interface Offer {
  title: string;
  description: string;
  postDate: Date;
  cityLocation: CityLocation;
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
