import { Offer, City, TypeOfHousing, UserType, Location } from '../types/index.js';

export function createOffer(offerData: string): Offer {
  const [
    title,
    description,
    createdDate,
    city,
    image,
    photos,
    isPremium,
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
    location
  ] = offerData.replace('\n', '').split('\t');

  const user = {
    name,
    email,
    avatar,
    password,
    userType: userType as UserType,
  };

  const [offerLatitude, offerLongitude] = location.split(';');
  const offerLocation = {
    latitude: offerLatitude,
    longitude: offerLongitude
  };

  return {
    title,
    description,
    postDate: new Date(createdDate),
    city: city as City,
    image,
    photos: photos.split(';'),
    isPremium: isPremium === 'true',
    typeOfHousing: typeOfHousing as TypeOfHousing,
    roomsCount: Number.parseInt(roomsCount, 10),
    guestsCount: Number.parseInt(guestsCount, 10),
    comforts: comforts.split(';'),
    price: Number.parseInt(price, 10),
    user,
    offerLocation: offerLocation as Location
  };
}
