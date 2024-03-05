import {
  IsEmail,
  IsEnum,
  IsUrl,
  Length,
  Matches,
  IsOptional
} from 'class-validator';
import { UserType } from '../../../types/index.js';

import {
  PASSWORD_CONSTRAINT,
  USER_NAME_CONSTRAINT
} from '../../../constants/index.js';

export class UpdateUserDto {
  @IsOptional()
  @Length(USER_NAME_CONSTRAINT.MIN, USER_NAME_CONSTRAINT.MAX)
  public name?: string;
  @IsOptional()
  @IsEmail()
  public email?: string;
  @IsOptional()
  @IsUrl()
  @Matches(/\.(jpg|png)(\?.*)?$/i)
  public avatar?: string;
  @IsOptional()
  @IsEnum(UserType)
  public userType?: UserType;
  @IsOptional()
  @Length(PASSWORD_CONSTRAINT.MIN, PASSWORD_CONSTRAINT.MAX)
  public password?: string;
}
