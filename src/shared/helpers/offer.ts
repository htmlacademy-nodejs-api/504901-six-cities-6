import { Offer, City, TypeOfHousing, UserType } from '../types/index.js';
import { TRUE, DECIMAL } from '../constants/index.js';

export function createOffer(offerData: string): Offer {
  const [
    title,
    description,
    createdDate,
    city,
    image,
    photos,
    isPremium,
    isFavourites,
    rating, 
    typeOfHousing,
    roomsCount,
    guestsCount,
    comforts,
    price,
    userType,
    name,
    email,
    avatar,
    password,
    commentsCount
  ] = offerData.replace('\n', '').split('\t');

  const user = {
    userType: userType as  UserType,
    name,
    email,
    avatar,
    password,
  };

  const [cityName, latitude, longitude] = city.split(',');
  const cityLocation = {
    name: cityName as City,
    location: {
      latitude: Number.parseFloat(latitude),
      longitude: Number.parseFloat(longitude)
    }
  }

  return {
    title,
    description,
    postDate: new Date(createdDate),
    cityLocation,
    image,
    photos: photos.split(';'),
    isPremium: isPremium === TRUE,
    isFavourites: isFavourites === TRUE,
    rating: Number.parseFloat(rating),
    typeOfHousing: typeOfHousing as TypeOfHousing,
    roomsCount: Number.parseInt(roomsCount, DECIMAL),
    guestsCount: Number.parseInt(guestsCount, DECIMAL),
    comforts: comforts.split(';'),
    user,
    price: Number.parseInt(price, DECIMAL),
    commentsCount: Number.parseInt(commentsCount, DECIMAL)
    };
}
