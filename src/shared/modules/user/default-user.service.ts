import { DocumentType, types } from '@typegoose/typegoose';
import { CreateUserDto, UserEntity, UserService } from '../index.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
//import { DefaultOfferService } from '../offer/index.js';
import mongoose from 'mongoose';
//import { Types } from 'mongoose';

@injectable()
export class DefaultUserService implements UserService {
  //@inject(Component.OfferService) private readonly offerService!: DefaultOfferService;
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>,
    //@inject(Component.OfferService) private readonly offerService: DefaultOfferService,
  ) {}

  //public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
  public async create(dto: CreateUserDto): Promise<DocumentType<UserEntity>> {
    try {
      const user = new UserEntity(dto);
      //user.setPassword(dto.password, salt); //вынести в конструктор

      const result = await this.userModel.create(user);
      this.logger.info(`New user created: ${user.email}`);

      return result;
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError && error.errors.userType) {
        throw new Error('User type is required');
      }
      throw error;
    }
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({email});
  }

  public async findOrCreate(dto: CreateUserDto): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    //return this.create(dto, salt);
    return this.create(dto);
  }

  public async findById(id: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findById(id);
  }

  // async addToFavorites(dto: FavoriteDto): Promise<DocumentType<UserEntity> | null> {
  //   const { userId, offerId } = dto;

  //   const user = await this.userModel.findById(userId);
  //   if (!user) {
  //     throw new Error('User not found');
  //   }

  //   const offerExists = await this.offerService.exists(offerId);
  //   if (!offerExists) {
  //     throw new Error('Offer not found');
  //   }

  //   const offerObjectId = new Types.ObjectId(offerId);
  //   if (!user.favoriteOffers.map((id) => id.toString()).includes(offerId)) {
  //     user.favoriteOffers.push(offerObjectId);
  //     await user.save();
  //   }

  //   return user;
  // }

  // async removeFromFavorites(dto: FavoriteDto): Promise<DocumentType<UserEntity> | null> {
  //   const { userId, offerId } = dto;

  //   const user = await this.userModel.findById(userId);
  //   if (!user) {
  //     throw new Error('User not found');
  //   }

  //   const offerExists = await this.offerService.exists(offerId);
  //   if (!offerExists) {
  //     throw new Error('Offer not found');
  //   }

  //   user.favoriteOffers = user.favoriteOffers.filter((id) => id.toString() !== offerId);
  //   await user.save();

  //   return user;
  // }
}


