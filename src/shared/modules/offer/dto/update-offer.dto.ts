import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  IsUrl,
  IsOptional
} from 'class-validator';
import { TypeOfHousing, City, Location } from '../../../types/index.js';
import {
  TITLE_CONSTRAINT,
  DESCRIPTION_CONSTRAINT,
  PRICE_CONSTRAINT,
  ROOMS_CONSTRAINT,
  GUESTS_CONSTRAINT,
  PHOTOS_COUNT
} from '../../../constants/index.js';
import { Comfort } from '../../../types/comfort.enum.js';

export class UpdateOfferDto {
  @IsOptional()
  @MinLength(TITLE_CONSTRAINT.MIN)
  @MaxLength(TITLE_CONSTRAINT.MAX)
  public title?: string;

  @IsOptional()
  @MinLength(DESCRIPTION_CONSTRAINT.MIN)
  @MaxLength(DESCRIPTION_CONSTRAINT.MAX)
  public description?: string;

  @IsOptional()
  @IsEnum(City)
  public city?: City;

  @IsOptional()
  @IsUrl()
  @Matches(/\.(jpg|png)(\?.*)?$/i)
  public image?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(PHOTOS_COUNT)
  @ArrayMaxSize(PHOTOS_COUNT)
  public photos?: string[];

  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  public isPremium?: boolean;

  @IsOptional()
  public isFavorite?: boolean;

  @IsOptional()
  public rating?: number;

  @IsOptional()
  @IsEnum(TypeOfHousing)
  public typeOfHousing?: TypeOfHousing;

  @IsOptional()
  @IsInt()
  @Min(ROOMS_CONSTRAINT.MIN)
  @Max(ROOMS_CONSTRAINT.MAX)
  public roomsCount?: number;

  @IsOptional()
  @IsInt()
  @Min(GUESTS_CONSTRAINT.MIN)
  @Max(GUESTS_CONSTRAINT.MAX)
  public guestsCount?: number;

  @IsOptional()
  @IsInt()
  @Min(PRICE_CONSTRAINT.MIN)
  @Max(PRICE_CONSTRAINT.MAX)
  public price?: number;

  @IsOptional()
  @IsArray()
  @IsEnum(Comfort)
  public comforts?: string[];

  @IsOptional()
  public commentsCount?: number;

  @IsOptional()
  public offerLocation?: Location;
}
