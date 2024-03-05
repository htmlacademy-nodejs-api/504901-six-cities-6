import { inject, injectable } from 'inversify';
import { Component, SortType } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { CommentEntity, CreateCommentDto, CommentService } from '../index.js';
import {OFFER_LIMITS} from '../../constants/index.js';
import { Types } from 'mongoose';

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>
  ) {}

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);
    this.logger.info(`User ${dto.userId} created new comment`);

    return comment.populate('userId');
  }

  public async findByOfferId(offerId: string, count?: number): Promise<DocumentType<CommentEntity>[]> {
    const limit = count ?? OFFER_LIMITS.COMMENTS_COUNT;
    return this.commentModel
      .aggregate([
        { $match: { offerId: new Types.ObjectId(offerId) }},
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
     ]);
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel
      .deleteMany({offerId})
      .exec();

    return result.deletedCount;
  }
}
