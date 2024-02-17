import { } from './dto/create-offer.dto.js';
import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity, CreateOfferDto, UpdateOfferDto } from './index.js';

export interface OfferService {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  findByCity(city: string, count?: number): Promise<DocumentType<OfferEntity>[]>;
  incCommentCountAndUpdateRating(offerId: string, newRating: number): Promise<DocumentType<OfferEntity> | null>;
  exists(documentId: string): Promise<boolean>;
  getPremiumOffersByCity(city: string, limit?: number): Promise<DocumentType<OfferEntity>[]>;
  getFavoriteOffersByUser(userId: string): Promise<DocumentType<OfferEntity>[]>;
}
