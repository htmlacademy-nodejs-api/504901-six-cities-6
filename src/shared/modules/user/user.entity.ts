import { defaultClasses, prop, modelOptions, Ref } from '@typegoose/typegoose';
import { User, UserType } from '../../types/index.js';
import { createSHA256 } from '../../helpers/index.js';
import { OfferEntity } from '../index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({
    required: true
  })
  public name!: string;

  @prop({
    unique: true,
    required: true
  })
  public email!: string;

  @prop({
    required: false,
  })
  public avatar?: string;

  @prop({
    required: true
  })
  public password!: string;

  @prop({
    type: () => String,
    required: true
  })
  public userType!: UserType;

  @prop({
    ref: () => OfferEntity,
    _id: false,
    default: [],
    type: () => [OfferEntity]
  })
  public favorites!: Ref<OfferEntity>[];

  constructor(userData: User) {
    super();

    this.name = userData.name;
    this.email = userData.email;
    this.avatar = userData.avatar;
    this.userType = userData.userType;
    this.setPassword(userData.password, process.env.SALT as string);
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  public verifyPassword(password: string, salt: string) {
    const hashPassword = createSHA256(password, salt);
    return hashPassword === this.password;
  }
}
