import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { createOffer, getErrorMessage, getMongoURI } from '../../shared/helpers/index.js';
import { UserService } from '../../shared/modules/user/types/user-service.interface.js';
import { DefaultOfferService, OfferModel, OfferService } from '../../shared/modules/index.js';
import { DatabaseClient, MongoDatabaseClient } from '../../shared/libs/database-client/index.js';
import { Logger } from '../../shared/libs/logger/index.js';
import { ConsoleLogger } from '../../shared/libs/logger/console.logger.js';
import { DefaultUserService, UserModel, CommentModel } from '../../shared/modules/index.js';
import { DEFAULT_USER_PASSWORD } from './command.constant.js';
import { Offer, ConfigSchema } from '../../shared/types/index.js';
import { Config } from '../../shared/libs/config/index.js';

export class ImportCommand implements Command {
  private userService: UserService;
  private offerService: OfferService;
  private databaseClient: DatabaseClient;
  private logger: Logger;
  private readonly config!: Config<ConfigSchema>;

  constructor() {

    this.onImportedLine = this.onImportedLine.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);

    this.logger = new ConsoleLogger();
    this.offerService = new DefaultOfferService(this.logger, OfferModel, UserModel, CommentModel);
    this.userService = new DefaultUserService(this.logger, UserModel);
    this.databaseClient = new MongoDatabaseClient(this.logger);
  }

  private async onImportedLine(line: string, resolve: () => void) {
    const offer = createOffer(line);
    await this.saveOffer(offer);
    resolve();
  }

  private onCompleteImport(count: number) {
    console.info(`${count} rows imported.`);
    this.databaseClient.disconnect();
  }

  private async saveOffer(offer: Offer) {
    const user = await this.userService.findOrCreate({
      ...offer.user,
      password: DEFAULT_USER_PASSWORD
    });

    await this.offerService.create({
      userId: user.id,
      title: offer.title,
      description: offer.description,
      city: offer.city,
      image: offer.image,
      photos: offer.photos,
      isPremium: offer.isPremium,
      typeOfHousing: offer.typeOfHousing,
      roomsCount: offer.roomsCount,
      guestsCount: offer.guestsCount,
      price: offer.price,
      comforts: offer.comforts,
      offerLocation: offer.offerLocation
    });
  }

  public getName(): string {
    return '--import';
  }

  public async execute(filename: string,
    login: string = this.config.get('DB_USER'),
    password: string = this.config.get('DB_PASSWORD'),
    host: string = this.config.get('DB_HOST'),
    port: string = this.config.get('DB_PORT'),
    dbname: string = this.config.get('DB_NAME'),
  ): Promise<void> {
    const uri = getMongoURI(login, password, host, port, dbname);

    await this.databaseClient.connect(uri);

    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('line', this.onImportedLine);
    fileReader.on('end', this.onCompleteImport);

    try {
      await fileReader.read();
    } catch (error) {
      console.error(`Can't import data from file: ${filename}`);
      console.error(getErrorMessage(error));
    }
  }
}
