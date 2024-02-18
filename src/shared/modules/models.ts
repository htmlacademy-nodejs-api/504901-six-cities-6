import { getModelForClass } from '@typegoose/typegoose';
import { CommentEntity, OfferEntity, UserEntity } from './index.js';

export const UserModel = getModelForClass(UserEntity);
export const OfferModel = getModelForClass(OfferEntity);
export const CommentModel = getModelForClass(CommentEntity);
