import { DocumentType } from '@typegoose/typegoose';
import { CreateUserDto, UserEntity } from '../index.js';

export interface UserService {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findById(id: string): Promise<DocumentType<UserEntity> | null>;
  //addToFavorites(dto: FavoriteDto): Promise<DocumentType<UserEntity> | null>;
  //removeFromFavorites(dto: FavoriteDto): Promise<DocumentType<UserEntity> | null>;
}
