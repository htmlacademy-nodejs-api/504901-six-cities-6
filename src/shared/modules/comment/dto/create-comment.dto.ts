// import {
//   IsMongoId,
//   Min,
//   Max,
//   IsInt,
//   IsString,
//   Length
// } from 'class-validator';
// import { CreateCommentMessages } from '../../index.js';
// import {
//   COMMENT_RAITING_CONSTRAINT,
//   COMMENT_TEXT_CONSTRAINT
// } from '../../../constants/index.js';

export class CreateCommentDto {
  // @IsString({ message: CreateCommentMessages.text.invalidFormat })
  // @Length(COMMENT_TEXT_CONSTRAINT.MIN, COMMENT_TEXT_CONSTRAINT.MAX, { message: CreateCommentMessages.text.lengthField })
  public text!: string;

  // @IsInt({ message: CreateCommentMessages.rating.invalidFormat })
  // @Min(COMMENT_RAITING_CONSTRAINT.MIN, { message: CreateCommentMessages.rating.minValue })
  // @Max(COMMENT_RAITING_CONSTRAINT.MAX, { message: CreateCommentMessages.rating.maxValue })
  public rating!: number;

  //@IsMongoId({ message: CreateCommentMessages.userId.invalidFormat })
  public userId!: string;

  //@IsMongoId({ message: CreateCommentMessages.offerId.invalidFormat })
  public offerId!: string;
}
