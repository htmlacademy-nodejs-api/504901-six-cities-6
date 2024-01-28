import { readFileSync } from 'node:fs';
import { FileReader } from './file-reader.interface.js';
import { City, CityLocation, Offer, TypeOfHousing, UserType} from '../../types/index.js';


export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string
  ) {}

  private parseCity(city: string):CityLocation {
    const [name, latitude, longitude] = city.split(',');
    return {
      name: name as City,
      location:{
        latitude: Number.parseFloat(latitude),
        longitude: Number.parseFloat(longitude)
      }
    };
  }

  public read(): void {
    if (!this.filename) {
      throw new Error('File not found');
    }
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): Offer[] {
    if (!this.rawData) {
      throw new Error('File was not read');
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => line.split('\t'))
      .map(([
        title,
        description,
        postDate,
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
        avatarPath,
        password,
        userType
      ]) => ({
        title,
        description,
        postDate: new Date(postDate),
        cityLocation: this.parseCity(city),
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
        user: { email, avatarPath, name, password, userType: userType as UserType },
        commentsCount: 0
      }));
  }
}
