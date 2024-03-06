import { IsBoolean, IsMongoId } from 'class-validator';

export class FavoriteUserDto {
  @IsMongoId()
  public offerId!: string;

  @IsBoolean()
  public isFavorite!: boolean;
}
