// import {
//   ArrayMaxSize,
//   ArrayMinSize,
//   IsArray,
//   IsBoolean,
//   IsEnum,
//   IsInt,
//   //IsMongoId,
//   IsNotEmpty,
//   IsString,
//   Matches,
//   Max,
//   MaxLength,
//   Min,
//   MinLength,
//   IsDateString,
//   IsUrl,
//   IsOptional
// } from 'class-validator';
import { TypeOfHousing, City, Location } from '../../../types/index.js';
// import { CreateOfferValidationMessage } from '../../index.js';
// import {
//   TITLE_CONSTRAINT,
//   DESCRIPTION_CONSTRAINT,
//   PRICE_CONSTRAINT,
//   ROOMS_CONSTRAINT,
//   GUESTS_CONSTRAINT,
//   PHOTOS_COUNT
// } from '../../../constants/index.js';
// import { Comfort } from '../../../types/comfort.enum.js';

export class UpdateOfferDto {
  // @IsOptional()
  // @IsString({ message: CreateOfferValidationMessage.title.invalidFormat })
  // @MinLength(TITLE_CONSTRAINT.MIN, { message: CreateOfferValidationMessage.title.minLength })
  // @MaxLength(TITLE_CONSTRAINT.MAX, { message: CreateOfferValidationMessage.title.maxLength })
  public title?: string;

  // @IsOptional()
  // @IsString({ message: CreateOfferValidationMessage.description.invalidFormat })
  // @MinLength(DESCRIPTION_CONSTRAINT.MIN, { message: CreateOfferValidationMessage.description.minLength })
  // @MaxLength(DESCRIPTION_CONSTRAINT.MAX, { message: CreateOfferValidationMessage.description.maxLength })
  public description?: string;

  // @IsOptional()
  // @IsDateString({}, { message: CreateOfferValidationMessage.postDate.invalidFormat })
  public postDate?: Date;

  // @IsOptional()
  // @IsEnum(City,
  //   { message: CreateOfferValidationMessage.city.invalidFormat,
  //   },
  // )
  public city?: City;

  // @IsOptional()
  // @IsUrl({}, { message: CreateOfferValidationMessage.image.isUrl})
  // @Matches(/\.(jpg|png)(\?.*)?$/i, {
  //   message: CreateOfferValidationMessage.image.matches,
  // })
  public image?: string;

  // @IsOptional()
  // @IsArray({ message: CreateOfferValidationMessage.photos.invalidFormat })
  // @ArrayMinSize(PHOTOS_COUNT, { message: CreateOfferValidationMessage.photos.ArrayMinSize })
  // @ArrayMaxSize(PHOTOS_COUNT, { message: CreateOfferValidationMessage.photos.ArrayMaxSize })
  public photos?: string[];

  // @IsOptional()
  // @IsNotEmpty()
  // @IsBoolean({ message: CreateOfferValidationMessage.isPremium.invalidFormat })
  public isPremium?: boolean;

  //@IsOptional()
  public rating?: number;

  // @IsOptional()
  // @IsEnum(TypeOfHousing,
  //   { message: CreateOfferValidationMessage.typeOfHousing.invalidFormat,
  //   },
  // )
  public typeOfHousing?: TypeOfHousing;

  // @IsOptional()
  // @IsInt({ message: CreateOfferValidationMessage.roomsCount.invalidFormat })
  // @Min(ROOMS_CONSTRAINT.MIN, { message: CreateOfferValidationMessage.roomsCount.minValue })
  // @Max(ROOMS_CONSTRAINT.MAX, { message: CreateOfferValidationMessage.roomsCount.maxValue })
  public roomsCount?: number;

  // @IsOptional()
  // @IsInt({ message: CreateOfferValidationMessage.guestsCount.invalidFormat })
  // @Min(GUESTS_CONSTRAINT.MIN, { message: CreateOfferValidationMessage.guestsCount.minValue })
  // @Max(GUESTS_CONSTRAINT.MAX, { message: CreateOfferValidationMessage.guestsCount.maxValue })
  public guestsCount?: number;

  // @IsOptional()
  // @IsInt({ message: CreateOfferValidationMessage.price.invalidFormat })
  // @Min(PRICE_CONSTRAINT.MIN, { message: CreateOfferValidationMessage.price.minValue })
  // @Max(PRICE_CONSTRAINT.MAX, { message: CreateOfferValidationMessage.price.maxValue })
  public price?: number;

  // @IsOptional()
  // @IsArray({ message: CreateOfferValidationMessage.comforts.invalidFormat })
  // @IsEnum(Comfort, { each: true, message: CreateOfferValidationMessage.comforts.invalidFormat})
  public comforts?: string[];

  //@IsOptional()
  public commentsCount?: number;

  //@IsOptional()
  public offerLocation?: Location;
}
