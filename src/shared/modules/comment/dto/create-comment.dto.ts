import {
  IsMongoId,
  Min,
  Max,
  IsInt,
  Length
} from 'class-validator';
import {
  COMMENT_RAITING_CONSTRAINT,
  COMMENT_TEXT_CONSTRAINT
} from '../../../constants/index.js';

export class CreateCommentDto {
  @Length(COMMENT_TEXT_CONSTRAINT.MIN, COMMENT_TEXT_CONSTRAINT.MAX)
  public text!: string;

  @IsInt()
  @Min(COMMENT_RAITING_CONSTRAINT.MIN)
  @Max(COMMENT_RAITING_CONSTRAINT.MAX)
  public rating!: number;

  public userId!: string;

  @IsMongoId()
  public offerId!: string;
}
