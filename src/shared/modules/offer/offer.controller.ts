import { inject, injectable } from 'inversify';
import { BaseController,
  HttpError,
  HttpMethod,
  RequestQuery,
  ValidateObjectIdMiddleware,
  ValidateDtoMiddleware,
  DocumentExistsMiddleware,
  PrivateRouteMiddleware,
} from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component, City } from '../../types/index.js';
import {
  CreateOfferRequest,
  OfferService,
  OfferRdo,
  OfferPartRdo,
  UpdateOfferDto,
  CreateOfferDto,
  ParamOfferId,
  UserService,
  FavoriteOfferRequest,
} from '../index.js';
import { Request, Response } from 'express';
import { fillDTO } from '../../helpers/index.js';
import { StatusCodes } from 'http-status-codes';
import { FavoriteOfferDto } from './dto/favorite-offer.dto.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.UserService) private readonly userService: UserService,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController...');

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware,
        new ValidateDtoMiddleware(CreateOfferDto)],
    });

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.index
    });

    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Get,
      handler: this.getFavorites,
      middlewares: [new PrivateRouteMiddleware()],
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware,
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware,
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/:city/premium',
      method: HttpMethod.Get,
      handler: this.getPremium
    });

    this.addRoute({
      path: '/:offerId/favorite',
      method: HttpMethod.Put,
      handler: this.updateFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(FavoriteOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'offer', 'offerId'),
      ],
    });
  }

  public async create({ body, tokenPayload }: CreateOfferRequest, res: Response): Promise<void> {
    const result = await this.offerService.create({ ...body, userId: tokenPayload.id });
    const offer = await this.offerService.findById(result.id);
    this.created(res, fillDTO(OfferRdo, offer));
  }

  public async index({ query, tokenPayload }: Request<unknown, unknown, unknown, RequestQuery>, res: Response): Promise<void> {
    const { limit, city } = query;
    if (query.city && !(query.city in City)) {
      throw new HttpError(StatusCodes.BAD_REQUEST, 'Invalid city');
    }
    const count = limit === undefined ? undefined : Number(limit);
    const town = city ?? undefined;
    const userId = tokenPayload?.id;
    const offers = await this.offerService.find(count, town, userId);
    this.ok(res, fillDTO(OfferPartRdo, offers));
  }

  public async show({ params: { offerId }, tokenPayload }: Request<ParamOfferId>, res: Response): Promise<void> {

    const offer = await this.offerService.findById(offerId, tokenPayload?.id);
    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async update({ body, params, tokenPayload }: Request<ParamOfferId, unknown, UpdateOfferDto>, res: Response): Promise<void> {
    const offer = await this.offerService.updateById(String(params.offerId), body, tokenPayload);
    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async delete({ params, tokenPayload}: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.deleteById(offerId, tokenPayload);
    this.noContent(res, offer);
  }

  public async getPremium({ params, tokenPayload }: Request, res: Response): Promise<void> {
    const existsOffer = await this.offerService.findPremiumByCity(params.city, tokenPayload?.id);

    if (!existsOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with the specified ID:«${params.city}» not found.`,
        'OfferController',
      );
    }

    this.ok(res, fillDTO(OfferPartRdo, existsOffer));
  }

  public async updateFavorite(
    { body, params, tokenPayload: { id, email } }: FavoriteOfferRequest,
    res: Response
  ): Promise<void> {
    const user = await this.userService.findByEmail(email);
    const offerId: string = params.offerId as string;
    const favorites = new Set<string>(user!.favorites.map((item) => item._id.toString()));

    if (body.isFavorite) {
      favorites.add(offerId);
    } else {
      favorites.delete(offerId);
    }
    await this.userService.updateById(id, { favorites: Array.from(favorites) });
    this.noContent(res, null);
  }

  public async getFavorites({ tokenPayload: { id: userId } }: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findFavorites(userId);
    this.ok(res, fillDTO(OfferPartRdo, offers));
  }
}
