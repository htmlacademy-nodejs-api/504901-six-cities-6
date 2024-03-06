import { Request } from 'express';
import { RequestBody, RequestParams } from '../../../libs/rest/index.js';
import { FavoriteUserDto } from '../../index.js';

export type TFavoriteUserRequest = Request<RequestParams, RequestBody, FavoriteUserDto>;
