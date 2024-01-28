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
    name,
    email,
    avatar,
    password,
    userType,
    commentsCount
  ] = offerData.replace('\n', '').split('\t');

  const user = {
    name,
    email,
    avatar,
    password,
    userType: userType as UserType,
  };

  const [cityName, latitude, longitude] = city.split(',');
  const cityLocation = {
    name: cityName as City,
    location: {
      latitude: Number.parseFloat(latitude),
      longitude: Number.parseFloat(longitude)
    }
  };

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
    price: Number.parseInt(price, DECIMAL),
    user,
    commentsCount: Number.parseInt(commentsCount, DECIMAL)
  };
}
