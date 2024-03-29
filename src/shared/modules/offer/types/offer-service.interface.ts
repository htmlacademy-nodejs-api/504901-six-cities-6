import { } from '../dto/create-offer.dto.js';
import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity, CreateOfferDto, UpdateOfferDto } from '../../index.js';
import { DocumentExists } from '../../../types/index.js';
import { TokenPayload } from '../../auth/index.js';

export interface OfferService extends DocumentExists {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findById(offerId: string, userId?: string): Promise<DocumentType<OfferEntity> | null>;
  deleteById(offerId: string, tokenPayload: TokenPayload): Promise<DocumentType<OfferEntity> | null>;
  updateById(offerId: string, dto: UpdateOfferDto, tokenPayload: TokenPayload): Promise<DocumentType<OfferEntity> | null>;
  find(count?: number, city?: string, userId?: string): Promise<DocumentType<OfferEntity>[]>;
  changeRating(offerId: string, newRating: number): Promise<DocumentType<OfferEntity> | null>;
  findFavorites(userId: string): Promise<DocumentType<OfferEntity>[]>
  exists(documentId: string): Promise<boolean>;
  findPremiumByCity(city: string, userId?: string): Promise<DocumentType<OfferEntity>[]>;
}
