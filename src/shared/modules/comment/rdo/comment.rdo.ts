import { Expose, Type } from 'class-transformer';
import { UserRdo } from '../../index.js';

export class CommentRdo {
  @Expose()
  public id!: string;

  @Expose({ name: 'createdAt'})
  public postDate!: Date;

  @Expose()
  public text!: string;

  @Expose()
  public rating!: number;

  @Expose()
  public offerId!: string;

  @Expose({ name: 'userId'})
  @Type(() => UserRdo)
  public userId!: string;
}
