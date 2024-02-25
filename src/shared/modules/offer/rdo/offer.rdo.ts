import { Expose, Type } from 'class-transformer';
import {
  TypeOfHousing,
  Location
} from '../../../types/index.js';
import { UserRdo } from '../../user/rdo/user.rdo.js';

export class OfferRdo {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public description!: string;

  @Expose()
  public postDate!: string;

  @Expose()
  public city!: string;

  @Expose()
  public image!: string;

  @Expose()
  public photos!: string[];

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public isFavorites!: boolean;

  @Expose()
  public rating!: number;

  @Expose()
  public typeOfHousing!: TypeOfHousing;

  @Expose()
  public roomsCount!: number;

  @Expose()
  public guestsCount!: number;

  @Expose()
  public price!: number;

  @Expose()
  public comforts!: string[];

  @Expose()
  public commentCount!: number;

  @Expose({ name: 'userId'})
  @Type(() => UserRdo)
  public user!: UserRdo;

  @Expose()
  public location!: Location;
}
