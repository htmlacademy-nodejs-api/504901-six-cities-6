import { DocumentType } from '@typegoose/typegoose';
import { CreateUserDto, UserEntity } from '../index.js';

export interface UserService {
  create(dto: CreateUserDto): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDto): Promise<DocumentType<UserEntity>>;
  findById(id: string): Promise<DocumentType<UserEntity> | null>;
}
