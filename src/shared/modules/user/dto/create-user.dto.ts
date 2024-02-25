import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length
} from 'class-validator';
import { UserType } from '../../../types/index.js';
import { CreateUserMessages } from '../../index.js';
import {
  PASSWORD_CONSTRAINT,
  USER_NAME_CONSTRAINT
} from '../../../constants/index.js';

export class CreateUserDto {
  @IsString({ message: CreateUserMessages.name.invalidFormat })
  @Length(USER_NAME_CONSTRAINT.MIN, USER_NAME_CONSTRAINT.MAX, { message: CreateUserMessages.name.lengthField })
  public name!: string;

  @IsEmail({}, { message: CreateUserMessages.email.invalidFormat })
  public email!: string;

  @IsOptional()
  @IsString({ message: CreateUserMessages.avatar.invalidFormat })
  public avatar?: string;

  @IsString({ message: CreateUserMessages.password.invalidFormat })
  @Length(PASSWORD_CONSTRAINT.MIN, PASSWORD_CONSTRAINT.MAX, { message: CreateUserMessages.password.lengthField })
  public password!: string;

  @IsEnum(UserType, { message: CreateUserMessages.userType.invalidFormat })
  public userType!: UserType;
}
