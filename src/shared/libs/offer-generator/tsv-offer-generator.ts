import dayjs from 'dayjs';
import { OfferGenerator } from './offer-generator.interface.js';
import { MockServerData, UserType } from '../../types/index.js';
import { generateRandomValue, getRandomItem, getRandomItems, getRandomNItems } from '../../helpers/index.js';
import {MIN_PRICE, MAX_PRICE, MAX_RATING, MIN_RATING, PRECISION, MIN_ROOMS, MAX_ROOMS} from '../../constants/index.js';
import {MIN_GUESTS, MAX_GUESTS, FIRST_WEEK_DAY, LAST_WEEK_DAY, FALSE, TRUE, MIN_REVIEW, MAX_REVIEW } from '../../constants/index.js';

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const createdDate = dayjs()
      .subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();
    const city = getRandomItem<string>(this.mockData.cities);
    const image = getRandomItem<string>(this.mockData.offerImages);
    const photos = getRandomNItems<string>(this.mockData.offerImages, 6).join(';');
    const isPremium = getRandomItem([FALSE, TRUE]);
    const isFavourites = getRandomItem([FALSE, TRUE]);
    const rating = generateRandomValue(MIN_RATING, MAX_RATING, PRECISION).toString();
    const typeOfHousing = getRandomItem<string>(this.mockData.housingTypes);
    const roomsCount = generateRandomValue(MIN_ROOMS, MAX_ROOMS).toString();
    const guestsCount = generateRandomValue(MIN_GUESTS, MAX_GUESTS).toString();
    const comforts = getRandomItems<string>(this.mockData.improvements).join(';');
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE).toString();
    const userType = getRandomItem([UserType.Common, UserType.Pro]);
    const name = getRandomItem(this.mockData.users);
    const email = getRandomItem(this.mockData.emails);
    const avatar = getRandomItem(this.mockData.avatars);
    const password = getRandomItem(this.mockData.userPasswords);
    const commentsCount = generateRandomValue(MIN_REVIEW, MAX_REVIEW).toString();

    return [
      title, description, createdDate, city, image, photos,
      isPremium, isFavourites, rating, typeOfHousing, roomsCount,
      guestsCount, comforts, price, name, email, avatar,
      password, userType, commentsCount
    ].join('\t');
  }
}
