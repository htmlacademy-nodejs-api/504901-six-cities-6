import * as Mongoose from 'mongoose';
import { inject, injectable } from 'inversify';
import { setTimeout } from 'node:timers/promises';
import { DatabaseClient } from './database-client.interface.js';
import { Component } from '../../types/index.js';
import { Logger } from '../logger/index.js';
import { RETRY_OPTIONS } from '../../constants/index.js';

@injectable()
export class MongoDatabaseClient implements DatabaseClient {
  private mongoose!: typeof Mongoose;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger
  ) {
  }

  public get isConnectedToDatabase() {
    return this.mongoose?.connection.readyState === 1;
  }

  public async connect(uri: string): Promise<void> {
    if (this.isConnectedToDatabase) {
      throw new Error('MongoDB client already connected');
    }

    this.logger.info('Trying to connect to MongoDB...');

    let attempt = 0;
    while (attempt < RETRY_OPTIONS.COUNT) {
      try {
        this.mongoose = await Mongoose.connect(uri);
        this.logger.info('Database connection established.');
        return;
      } catch (error) {
        attempt++;
        this.logger.error(`Failed to connect to the database. Attempt ${attempt}`, error as Error);
        await setTimeout(RETRY_OPTIONS.TIMEOUT);
      }
    }

    throw new Error(`Unable to establish database connection after ${RETRY_OPTIONS.COUNT}`);
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnectedToDatabase || !this.mongoose) {
      throw new Error('Not connected to the database');
    }

    try {
      await this.mongoose.disconnect?.();
      this.logger.info('Database connection closed.');
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error('Database connection is not closed', error);
      }
      throw new Error('Database connection is not closed');
    }
  }
}
