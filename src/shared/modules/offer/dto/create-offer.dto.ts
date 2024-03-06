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
  IsUrl
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

export class CreateOfferDto {
  @MinLength(TITLE_CONSTRAINT.MIN)
  @MaxLength(TITLE_CONSTRAINT.MAX)
  public title!: string;

  @MinLength(DESCRIPTION_CONSTRAINT.MIN)
  @MaxLength(DESCRIPTION_CONSTRAINT.MAX)
  public description!: string;

  @IsEnum(City)
  public city!: City;

  @IsUrl()
  @Matches(/\.(jpg|png)(\?.*)?$/i)
  public image!: string;

  @IsArray()
  @ArrayMinSize(PHOTOS_COUNT)
  @ArrayMaxSize(PHOTOS_COUNT)
  public photos!: string[];

  @IsNotEmpty()
  @IsBoolean()
  public isPremium!: boolean;

  @IsEnum(TypeOfHousing)
  public typeOfHousing!: TypeOfHousing;

  @IsInt()
  @Min(ROOMS_CONSTRAINT.MIN)
  @Max(ROOMS_CONSTRAINT.MAX)
  public roomsCount!: number;

  @IsInt()
  @Min(GUESTS_CONSTRAINT.MIN)
  @Max(GUESTS_CONSTRAINT.MAX)
  public guestsCount!: number;

  @IsInt()
  @Min(PRICE_CONSTRAINT.MIN)
  @Max(PRICE_CONSTRAINT.MAX)
  public price!: number;

  @IsArray()
  @IsEnum(Comfort, { each: true})
  public comforts!: string[];

  public userId!: string;

  @IsNotEmpty()
  public offerLocation!: Location;
}
