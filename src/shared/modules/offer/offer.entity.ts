import { defaultClasses, modelOptions, prop, Ref, Severity } from '@typegoose/typegoose';
import { City, TypeOfHousing, Location } from '../../types/index.js';
import { UserEntity } from '../index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  options: {
    allowMixed: Severity.ALLOW,
  },

  schemaOptions: {
    collection: 'offers',
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({ trim: true, required: true })
  public title!: string;

  @prop({trim: true, required: true})
  public description!: string;

  @prop()
  public postDate!: Date;

  @prop({
    type: () => String,
  })
  public city!: City;

  @prop({ required: true })
  public image!: string;

  @prop({ required: true })
  public photos!: string[];

  @prop({ default: false })
  public isPremium!: boolean;

  @prop({ default: 0})
  public rating!: number;

  @prop({
    type: () => String,
  })
  public typeOfHousing!: TypeOfHousing;

  @prop({ required: true })
  public roomsCount!: number;

  @prop({ required: true })
  public guestsCount!: number;

  @prop({ required: true })
  public price!: number;

  @prop({ default: []})
  public comforts!: string[];

  @prop({
    ref: () => UserEntity,
    required: true
  })
  public userId!: Ref<UserEntity>;

  @prop({ default: 0 })
  public commentCount!: number;

  @prop({
    required: true,
  })
  public offerLocation!: Location;
}
