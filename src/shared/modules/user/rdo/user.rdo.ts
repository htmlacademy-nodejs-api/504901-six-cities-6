import { Expose } from 'class-transformer';
import { UserType } from '../../../types/user-type.enum.js';

export class UserRdo {
  @Expose()
  public name!: string;

  @Expose()
  public type!: UserType;

  @Expose()
  public email!: string;

  @Expose()
  public avatarUrl!: string;
}
