import { inject, injectable } from 'inversify';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { CommentEntity, CreateCommentDto, CommentService } from './index.js';

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.CommentModel) private readonly CommentModel: types.ModelType<CommentEntity>
  ) {}

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const result = await this.CommentModel.create(dto);
    this.logger.info(`User ${dto.userId} created new comment`);

    return result;
  }

  public async findById(CommentId: string): Promise<DocumentType<CommentEntity> | null> {
    return this.CommentModel.findById(CommentId).exec();
  }
}
