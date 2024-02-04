import { TypeOfHousing, City, Location } from '../../../types/index.js';

export class CreateOfferDto {
  public title!: string;
  public description!: string;
  public postDate!: Date;
  public city!: City;
  public image!: string;
  public photos!: string[];
  public isPremium!: boolean;
  public isFavourites!: boolean;
  public rating!: number;
  public typeOfHousing!: TypeOfHousing;
  public roomsCount!: number;
  public guestsCount!: number;
  public price!: number;
  public comforts!: string[];
  public userId!: string;
  public commentsCount!: number;
  public offerLocation!: Location;
}
