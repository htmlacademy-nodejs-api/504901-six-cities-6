import { Container } from 'inversify';
import { Component } from '../../types/index.js';
import { OfferEntity, OfferModel, OfferService, DefaultOfferService, OfferController } from '../index.js';
import { types } from '@typegoose/typegoose';
import { Controller } from '../../libs/rest/index.js';

export function createOfferContainer() {
  const offerContainer = new Container();

  offerContainer.bind<OfferService>(Component.OfferService).to(DefaultOfferService);
  offerContainer.bind<types.ModelType<OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);
  offerContainer.bind<Controller>(Component.OfferController).to(OfferController).inSingletonScope();

  return offerContainer;
}
