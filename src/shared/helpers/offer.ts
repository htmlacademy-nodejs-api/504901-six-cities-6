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
    commentsCount,
    location
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
  const [offerLatitude, offerLongitude] = location.split(',');
  const offerLocation = {
    latitude: Number.parseFloat(offerLatitude),
    longitude: Number.parseFloat(offerLongitude)
  };

  return {
    title,
    description,
    postDate: new Date(createdDate),
    cityLocation,
    image,
    photos: photos.split(';'),
    isPremium: isPremium === 'true',
    isFavourites: isFavourites === 'true',
    rating: Number.parseFloat(rating),
    typeOfHousing: typeOfHousing as TypeOfHousing,
    roomsCount: Number.parseInt(roomsCount, 10),
    guestsCount: Number.parseInt(guestsCount, 10),
    comforts: comforts.split(';'),
    price: Number.parseInt(price, 10),
    user,
    commentsCount: Number.parseInt(commentsCount, 10),
    offerLocation: offerLocation as Location
  };
}
