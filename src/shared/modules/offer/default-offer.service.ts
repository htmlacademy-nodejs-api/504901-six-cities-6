import { inject, injectable } from 'inversify';
import { Component, SortType, City } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { DocumentType, types, mongoose } from '@typegoose/typegoose';
import {
  OfferEntity,
  CreateOfferDto,
  OfferService,
  UpdateOfferDto,
  CommentEntity,
  UserEntity
} from '../index.js';
import { OFFER_LIMITS, RATING_PRECISION } from '../../constants/index.js';
import { Types } from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../../libs/rest/index.js';
import { TokenPayload } from '../auth/index.js';
import { getPipeline } from './offer.aggregation.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>,
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const offer = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

    return offer;
  }

  public async findById(offerId: string, userId?: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $toObjectId: '$_id' }, { $toObjectId: offerId }]
          }
        }
      },
      ...getPipeline(userId),
    ])
      .exec()
      .then((result) => {
        if (result.length === 0) {
          return null;
        }
        return result[0];
      });
  }

  public async deleteById(offerId: string, tokenPayload: TokenPayload): Promise<DocumentType<OfferEntity> | null> {
    const userOffer = await this.offerModel.find({_id: offerId, userId: tokenPayload.id});
    if (!userOffer.length) {
      throw new HttpError(
        StatusCodes.FORBIDDEN, 'This is not you offer'
      );
    }

    const offer = await this.offerModel.findByIdAndDelete(offerId).exec();

    if (offer) {
      await this.commentModel.deleteMany({ offerId: new Types.ObjectId(offerId) }).exec();
    }

    return offer;
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel
      .exists({_id: documentId})) !== null;
  }

  public async updateById(offerId: string, dto: UpdateOfferDto, tokenPayload: TokenPayload): Promise<DocumentType<OfferEntity> | null> {
    const offer = await this.offerModel.find({_id: offerId, userId: tokenPayload.id});
    if (!offer.length) {
      throw new HttpError(
        StatusCodes.FORBIDDEN, 'This is not you offer'
      );
    }
    return this.offerModel.findByIdAndUpdate(offerId, dto, { new: true }).populate(['userId']).exec();
  }

  public async find(
    count?: number,
    town?: string,
    userId?: string
  ): Promise<DocumentType<OfferEntity>[]> {
    const limit = count ?? OFFER_LIMITS.OFFER_COUNT;

    const matchStage = town ? { city: town } : {};

    return this.offerModel
      .aggregate([
        { $match: matchStage },
        ...getPipeline(userId),

        { $limit: limit },
        { $sort: { createdAt: SortType.Down }},

      ]).exec();
  }

  public async changeRating(offerId: string, newRating: number): Promise<DocumentType<OfferEntity> | null> {
    const offer = await this.offerModel.findById(offerId);
    if (!offer) {
      throw new Error('Offer not found');
    }

    const currentRating = offer.rating ?? 0;
    const currentCommentCount = offer.commentCount ?? 0;
    const totalRating = currentRating * currentCommentCount + newRating;
    const newCommentsCount = currentCommentCount + 1;
    const newAverageRating = totalRating / newCommentsCount;

    const updatedOffer = await this.offerModel.findByIdAndUpdate(
      offerId,
      {
        $set: { rating: newAverageRating.toFixed(RATING_PRECISION) },
        $inc: { commentCount: 1 }
      },
      { new: true }
    ).exec();
    return updatedOffer;
  }

  public async findPremiumByCity(city: string, userId?: string): Promise<DocumentType<OfferEntity>[]> {
    if (city in City) {
      return this.offerModel
        .aggregate([
          { $match: {city}},
          { $match :{isPremium: true}},
          ...getPipeline(userId),
          { $limit: OFFER_LIMITS.PREMIUM_COUNT },
          { $sort: { createdAt: SortType.Down }},
        ]).exec();
    } else {
      throw new Error(`${city} is wrong`);
    }
  }

  public async findFavorites(userId: string): Promise<DocumentType<OfferEntity>[]> {
    return this.userModel.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(userId) }
      },
      {
        $project: {
          _id: 0,
          favoriteOffers: {
            $map: {
              input: '$favorites',
              as: 'fav',
              in: {
                $toObjectId: '$$fav'
              }
            }
          }
        }
      },
      {
        $lookup: {
          from: 'offers',
          localField: 'favoriteOffers',
          foreignField: '_id',
          as: 'favoriteOffers'
        }
      },
      {
        $unwind: {
          path: '$favoriteOffers'
        }
      },
      {
        $replaceRoot: { newRoot: '$favoriteOffers' }
      },
      { $addFields: {
        isFavorite: true
      }},
      { $project: {
        _id: 0,
        id: { $toString: '$_id' },
        city: 1,
        rating: 1,
        isFavorite: 1,
        commentCount: 1,
        image: 1,
        createdAt: 1,
        isPremium: 1,
        price: 1,
        title: 1,
        description: 1,
        location: 1,
        comforts: 1,
        typeOfHousing: 1,
        roomsCount: 1,
        guestsCount: 1,
      }}
    ]).exec();
  }

}
