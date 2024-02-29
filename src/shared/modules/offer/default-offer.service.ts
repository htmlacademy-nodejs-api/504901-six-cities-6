import { inject, injectable } from 'inversify';
import { Component, SortType } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { OfferEntity, CreateOfferDto, OfferService, UpdateOfferDto, UserEntity} from '../index.js';
import { OFFER_LIMITS } from '../../constants/index.js';
import mongoose from 'mongoose';
import { PipelineStage } from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../../libs/rest/index.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>,
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findById(offerId)
      .populate(['userId'])
      .exec();
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndDelete(offerId)
      .exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel
      .exists({_id: documentId})) !== null;
  }

  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    try {
      const updatedOffer = await this.offerModel
        .findByIdAndUpdate(offerId, dto, { new: true }).populate('userId').exec();
      if (!updatedOffer) {
        throw new Error(`Offer with ID ${offerId} not found`);
      }
      this.logger.info(`Offer ${offerId} updated `);
      return updatedOffer;
    } catch (error) {
      this.logger.error('Error updating offer', error as Error);
      throw error;
    }
  }

  public async incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {'$inc': {
        commentCount: 1,
      }}).exec();
  }

  public async find(count?: number): Promise<DocumentType<OfferEntity>[]> {
    const limit = count ?? OFFER_LIMITS.OFFER_COUNT;
    return this.offerModel
      .find({}, {}, {limit: limit})
      .sort({ createdAt: SortType.Down })
      .exec();
  }

  public async findByCity(city: string, count?: number): Promise<DocumentType<OfferEntity>[]> {
    const limit = count ?? OFFER_LIMITS.OFFER_COUNT;
    return this.offerModel
      .find({city: city}, {}, {limit: limit})
      .sort({ createdAt: SortType.Down })
      .exec();
  }

  public async findPremiumByCity(city: string, limit: number = OFFER_LIMITS.PREMIUM_COUNT): Promise<DocumentType<OfferEntity>[]> {
    try {
      const offers = await this.offerModel
        .find({city: city}, {isPremium: true})
        .sort({ createdAt: SortType.Down })
        .limit(limit)
        .exec();
      this.logger.info(`Premium offers fetched for city ${city}`);
      return offers;
    } catch (error) {
      this.logger.error('Error fetching premium offers by city:', error as Error);
      throw error;
    }
  }

  public async getFavoriteOffersByUser(userId: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.aggregate([
      { $match: { isFavorite: true } },
      { $sort: {createdAt: SortType.Down} },
      ...this.addFavoriteFlagPipeline(userId),
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'authorId'
        }
      },
      { $unwind: '$authorId' },
      {
        $project: { title: 1, postDate: 1, city: 1, image: 1, isPremium: 1, rating: 1, typeOfHousing: 1, price: 1 }
      }
    ]).exec();
  }

  private addFavoriteFlagPipeline(userId: string): PipelineStage[] {
    const userIdObj = new mongoose.Types.ObjectId(userId);

    return [
      {
        $lookup: {
          from: 'users',
          let: { offerId: '$_id' },
          pipeline: [
            { $match: { _id: userIdObj } },
            { $project: { favoriteOffers: 1 } },
            { $unwind: '$favoriteOffers' },
            { $match: { 'favoriteOffers': { $eq: '$$offerId' } } },
          ],
          as: 'isFavoriteArray'
        }
      },
      {
        $addFields: {
          isFavorite: { $gt: [{ $size: '$isFavoriteArray' }, 0] }
        }
      },
      { $unset: 'isFavoriteArray' },
    ];
  }

  public async toggleFavorites(userId: string, offerId: string): Promise<boolean> {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new HttpError(StatusCodes.NOT_FOUND, `User with id ${userId} not found.`, 'DefaultOfferService');
    }

    const offer = await this.offerModel.findById(offerId).exec();

    if (!offer) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Offer with id ${offerId} not found.`, 'DefaultOfferService');
    }
    if (user.favorites.includes(offer)) {
      user.favorites = user.favorites.filter((item) => item !== offer);
      await user.save();
      return false;
    } else {
      user.favorites.push(offer);
      await user.save();
      return true;
    }
  }


}
