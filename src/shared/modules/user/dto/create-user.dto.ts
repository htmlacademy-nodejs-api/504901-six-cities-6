import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length
} from 'class-validator';
import { UserType } from '../../../types/index.js';
//import { CreateUserMessages } from '../../index.js';
import {
  PASSWORD_CONSTRAINT,
  USER_NAME_CONSTRAINT
} from '../../../constants/index.js';

export class CreateUserDto {
  @IsString()
  @Length(USER_NAME_CONSTRAINT.MIN, USER_NAME_CONSTRAINT.MAX)
  public name!: string;

  @IsEmail()
  public email!: string;

  @IsOptional()
  @IsString()
  public avatar?: string;

  @Length(PASSWORD_CONSTRAINT.MIN, PASSWORD_CONSTRAINT.MAX)
  public password!: string;

  @IsEnum(UserType)
  public userType!: UserType;
}
