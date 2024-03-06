import { Expose } from 'class-transformer';
import {
  TypeOfHousing,
  City
} from '../../../types/index.js';

export class OfferPartRdo {
  @Expose()
  public price!: number;

  @Expose()
  public title!: string;

  @Expose()
  public typeOfHousing!: TypeOfHousing;

  @Expose()
  public isFavorites!: boolean;

  @Expose()
  public postDate!: string;

  @Expose()
  public city!: City;

  @Expose()
  public image!: string;

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public rating!: number;

  @Expose()
  public commentCount!: number;

}
