import { readFileSync } from 'node:fs';
import { FileReader } from './file-reader.interface.js';
import { Offer, TypeOfHousing } from '../../types/index.js';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string
  ) {}

  public read(): void {
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
        price,
        comforts,
        name,
        email,
        avatarPath,
        coordinates
      ]) => ({
        title,
        description,
        postDate: new Date(postDate),
        city,
        image,
        price: Number.parseInt(price, 10),
        photos: photos.split(';'),
        isPremium: isPremium === 'true',
        isFavourites: isFavourites === 'true',
        rating: Number.parseFloat(rating),
        typeOfHousing: typeOfHousing as TypeOfHousing,
        roomsCount: Number.parseInt(roomsCount, 10),
        guestsCount: Number.parseInt(guestsCount, 10),
        comforts: comforts.split(';'),
        user: { email, avatarPath, name },
        coordinates,
        commentsCount: 0
      }));
  }
}
