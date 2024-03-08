import { IsBoolean } from 'class-validator';

export class FavoriteOfferDto {
  @IsBoolean()
  public isFavorite!: boolean;
}
