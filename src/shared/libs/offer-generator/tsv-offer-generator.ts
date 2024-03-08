import dayjs from 'dayjs';
import { OfferGenerator } from './offer-generator.interface.js';
import { MockServerData, UserType } from '../../types/index.js';
import { generateRandomValue, getRandomItem, getRandomItems, getRandomNItems } from '../../helpers/index.js';
import {
  PRICE_CONSTRAINT,
  ROOMS_CONSTRAINT,
  GUESTS_CONSTRAINT,
  PHOTOS_COUNT,
  WEEK_DAY
} from './index.js';

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const createdDate = dayjs()
      .subtract(generateRandomValue(WEEK_DAY.FIRST, WEEK_DAY.LAST), 'day')
      .toISOString();
    const city = getRandomItem<string>(this.mockData.cities);
    const image = getRandomItem<string>(this.mockData.offerImages);
    const photos = getRandomNItems<string>(this.mockData.offerImages, PHOTOS_COUNT).join(';');
    const isPremium = getRandomItem(['false', 'true']);
    const typeOfHousing = getRandomItem<string>(this.mockData.housingTypes);
    const roomsCount = generateRandomValue(ROOMS_CONSTRAINT.MIN, ROOMS_CONSTRAINT.MAX).toString();
    const guestsCount = generateRandomValue(GUESTS_CONSTRAINT.MIN, GUESTS_CONSTRAINT.MAX).toString();
    const comforts = getRandomItems<string>(this.mockData.improvements).join(';');
    const price = generateRandomValue(PRICE_CONSTRAINT.MIN, PRICE_CONSTRAINT.MAX).toString();
    const userType = getRandomItem([UserType.Common, UserType.Pro]);
    const name = getRandomItem(this.mockData.users);
    const email = getRandomItem(this.mockData.emails);
    const avatar = getRandomItem(this.mockData.avatars);
    const password = getRandomItem(this.mockData.userPasswords);
    const location = getRandomItem<string>(this.mockData.locations);
    return [
      title, description, createdDate, city, image, photos,
      isPremium, typeOfHousing, roomsCount,
      guestsCount, comforts, price, name, email, avatar,
      password, userType, location
    ].join('\t');
  }
}
