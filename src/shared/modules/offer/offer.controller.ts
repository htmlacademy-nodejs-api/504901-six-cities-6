import { inject, injectable } from 'inversify';
import { BaseController, HttpError, HttpMethod } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { CreateOfferRequest, OfferService, OfferRdo, UpdateOfferRequest } from '../index.js';
import { Request, Response } from 'express';
import { fillDTO } from '../../helpers/index.js';
import { StatusCodes } from 'http-status-codes';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController...');

    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/:id/', method: HttpMethod.Get, handler: this.findById });
    this.addRoute({ path: '/:id/', method: HttpMethod.Patch, handler: this.update });
    this.addRoute({ path: '/:id/', method: HttpMethod.Delete, handler: this.delete });
    this.addRoute({ path: '/:city/', method: HttpMethod.Delete, handler: this.findByCity });
    this.addRoute({ path: '/:city/premium', method: HttpMethod.Delete, handler: this.findPremiumByCity });
  }

  public async create({ body }: CreateOfferRequest, res: Response): Promise<void> {
    const result = await this.offerService.create(body);
    this.created(res, fillDTO(OfferRdo, result));
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.find();
    const responseData = fillDTO(OfferRdo, offers);
    this.ok(res, responseData);
  }

  public async findById({ params }: Request, res: Response): Promise<void> {
    const existsOffer = await this.offerService.findById(params.id);

    if (!existsOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with the specified ID:«${params.id}» not found.`,
        'OfferController',
      );
    }

    this.ok(res, fillDTO(OfferRdo, existsOffer));
  }

  public async update({ body, params }: UpdateOfferRequest, res: Response): Promise<void> {
    const offer = await this.offerService.updateById(String(params.id), body);
    const responseData = fillDTO(OfferRdo, offer);
    this.ok(res, responseData);
  }

  public async delete({ params }: Request, res: Response): Promise<void> {
    const existsOffer = await this.offerService.deleteById(params.id);

    if (!existsOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with the specified ID:«${params.id}» not found.`,
        'OfferController',
      );
    }

    this.noContent(res, existsOffer);
  }

  public async findByCity({ params }: Request, res: Response): Promise<void> {
    const existsOffer = await this.offerService.findByCity(params.city);

    if (!existsOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with the specified ID:«${params.city}» not found.`,
        'OfferController',
      );
    }

    this.ok(res, fillDTO(OfferRdo, existsOffer));
  }

  public async findPremiumByCity({ params }: Request, res: Response): Promise<void> {
    const existsOffer = await this.offerService.findPremiumByCity(params.city);

    if (!existsOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with the specified ID:«${params.city}» not found.`,
        'OfferController',
      );
    }

    this.ok(res, fillDTO(OfferRdo, existsOffer));
  }
}
