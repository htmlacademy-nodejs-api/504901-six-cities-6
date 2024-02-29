import { defaultClasses, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { UserEntity, OfferEntity } from '../index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface CommentEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'comments',
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class CommentEntity extends defaultClasses.TimeStamps {
  @prop({ trim: true, required: true })
  public text!: string;

  @prop()
  public postDate!: Date;

  @prop({ default: 0 })
  public rating!: number;

  @prop({
    ref: () => UserEntity,
    required: true
  })
  public userId!: Ref<UserEntity>;

  @prop({
    ref:() => OfferEntity,
    required: true
  })
  public offerId!: Ref<OfferEntity>;
}
