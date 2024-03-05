import { inject, injectable } from 'inversify';
import { Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  BaseController,
  HttpError,
  HttpMethod,
  PrivateRouteMiddleware,
  UploadFileMiddleware,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware
} from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import {
  CreateUserRequest,
  UserService,
  UserRdo,
  LoginUserRequest,
  CreateUserDto,
  LoginUserDto,
  UploadUserAvatarRdo,
  LoggedUserRdo
} from '../index.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { fillDTO } from '../../helpers/index.js';
import { AuthService } from '../auth/index.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
    @inject(Component.AuthService) private readonly authService: AuthService,
  ) {
    super(logger);
    this.logger.info('Register routes for UserController…');

    this.addRoute({
      path: '/registration',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)]
    });

    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)]
    });

    this.addRoute({
      path: '/login',
      method: HttpMethod.Get,
      handler: this.checkAuthenticate,
      middlewares: [new PrivateRouteMiddleware()]
    });

    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new PrivateRouteMiddleware,
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'avatar'),
      ]
    });
  }

  public async create(
    { body }: CreateUserRequest,
    res: Response,
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.email}» exists.`,
        'UserController'
      );
    }

    const user = await this.userService.create(body);
    this.created(res, fillDTO(UserRdo, user));
  }

  public async login(
    { body }: LoginUserRequest,
    res: Response,
  ): Promise<void> {
    const user = await this.authService.verify(body);
    const token = await this.authService.authenticate(user);
    const responseData = fillDTO(LoggedUserRdo, user);
    this.ok(res, Object.assign(responseData, { token }));
  }

  public async uploadAvatar({ params, file }: Request, res: Response) {
    const { userId } = params;
    const uploadFile = { avatar: file?.filename };
    await this.userService.updateById(userId, uploadFile);
    this.created(res, fillDTO(UploadUserAvatarRdo, uploadFile));
  }

  public async checkAuthenticate({ tokenPayload: { email }}: Request, res: Response) {
    const foundedUser = await this.userService.findByEmail(email);

    if (! foundedUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    this.ok(res, fillDTO(LoggedUserRdo, foundedUser));
  }
}
