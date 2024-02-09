import { getModelForClass } from "@typegoose/typegoose";
import { OfferEntity, UserEntity } from './index.js';

export const UserModel = getModelForClass(UserEntity);
export const OfferModel = getModelForClass(OfferEntity);
