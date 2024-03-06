import { inject, injectable } from 'inversify';
import { Component, SortType, City } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import {
  OfferEntity,
  CreateOfferDto,
  OfferService,
  UpdateOfferDto,
  UserEntity,
  CommentEntity,
} from '../index.js';
import { OFFER_LIMITS, RATING_PRECISION } from '../../constants/index.js';
import { PipelineStage, Types } from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../../libs/rest/index.js';
import { TokenPayload } from '../auth/index.js';

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

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findById(offerId)
      .populate(['userId'])
      .exec();
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
    favorite?: boolean,
    userId?: string
  ): Promise<DocumentType<OfferEntity>[]> {
    const limit = count ?? OFFER_LIMITS.OFFER_COUNT;

    const matchStage = town ? { city: town } : {};

    const aggregationPipeline: PipelineStage[] = [
      { $match: matchStage },
    ];

    if (favorite && userId) {
      const user = await this.userModel.findById(userId);

      if (user && user.favorites) {
        aggregationPipeline.unshift({
          $match: {
            _id: {
              $in: user.favorites,
            },
          },
        });

        aggregationPipeline.push({
          $set: {
            isFavorite: true,
          },
        });
      }
    }

    aggregationPipeline.push(
      { $sort: { createdAt: SortType.Down }},
      { $limit: limit },
      {
        $set: {
          publicationDate: '$createdAt',
          id: '$_id',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user', },
      {
        $addFields: {
          userId: { $toString: '$user._id'},
        }
      },
      {
        $set: {
          'user.id': '$user._id',
        },
      },
    );

    return this.offerModel.aggregate(aggregationPipeline).exec();
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

  public async findPremiumByCity(city: string, limit: number = OFFER_LIMITS.PREMIUM_COUNT): Promise<DocumentType<OfferEntity>[]> {
    if (city in City) {
      return this.offerModel
        .aggregate([
          { $match: {city}},
          { $match :{isPremium: true} },
          { $sort: { createdAt: SortType.Down }},
          { $limit: limit },
        ]).exec();
    } else {
      throw new Error(`${city} is wrong`);
    }
  }

  public async toggleFavorites(userId: string, offerId: string, isFavorite: boolean): Promise<boolean> {

    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new HttpError(StatusCodes.NOT_FOUND, `User with id ${userId} not found.`, 'DefaultOfferService');
    }

    const offer = await this.offerModel.findById(offerId).exec();

    if (!offer) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Offer with id ${offerId} not found.`, 'DefaultOfferService');
    }
    const offerIdObectId = new Types.ObjectId(offerId);
    if (isFavorite) {
      if (!user.favorites.includes(offerIdObectId)) {
        user.favorites.push(offerIdObectId);
        await user.save();
      }
      return true;
    } else {
      const index = user.favorites.indexOf(offerIdObectId);
      if (index >= 0) {
        user.favorites.splice(index, 1);
      }
      await user.save();
      return false;
    }
  }

  public async findFavorites(userId: string): Promise<DocumentType<OfferEntity>[]> {
    return await this.offerModel.aggregate<DocumentType<OfferEntity>>([
      {
        $lookup: {
          from: 'users',
          let: { offerId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: [{ $convert: { input: '$_id', to: 'string' } }, userId] } } },
            { $match: { $expr: { $in: [{ $convert: { input: '$$offerId', to: 'string' } }, '$favourites'] } } },
          ],
          as: 'favourites'
        }
      },
      {
        $addFields: {
          isFavourite: userId ? { $toBool: { $size: '$favourites'} } : false
        }
      },
      { $sort: { createdAt: SortType.Down }},
    ]).exec();
  }
}
