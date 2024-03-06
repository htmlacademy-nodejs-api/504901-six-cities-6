import { IsMongoId } from 'class-validator';

export class FavoriteUserDto {
  @IsMongoId()
  public offerId!: string;
}
