import { City } from '../types/index.js';
import { Location } from '../types/index.js';

export enum PRICE {
  MIN = 100,
  MAX = 100000
}

export enum RATING {
  MIN = 1,
  MAX = 5
}

export const RATING_PRECISION = 1;

export enum ROOMS {
  MIN = 1,
  MAX = 8
}

export enum GUESTS {
  MIN = 1,
  MAX = 10
}

export const CHUNK_SIZE = 16384;

export const cities: Record<City, Location> = {
  [City.Paris]: {
    latitude: 48.85661,
    longitude: 2.351499
  },
  [City.Cologne]: {
    latitude: 50.938361,
    longitude: 6.959974
  },
  [City.Brussels]: {
    latitude: 50.846557,
    longitude: 4.351697
  },
  [City.Amsterdam]: {
    latitude: 52.370216,
    longitude: 4.895168
  },
  [City.Hamburg]: {
    latitude: 53.550341,
    longitude: 10.000654
  },
  [City.Dusseldorf]: {
    latitude: 51.225402,
    longitude: 6.776314
  },
} as const;

export const RETRY = {
  COUNT: 5,
  TIMEOUT: 1000,
} as const;

export enum OFFER_LIMITS {
  OFFER_COUNT = 60,
  COMMENTS_COUNT = 50,
  PREMIUM_COUNT = 3
}
