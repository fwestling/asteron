import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import toObjectId from '~/common/toObjectId';
import { AppConfigurationService } from '~/configuration/app-configuration.service';
import { FirebaseAuthGuard } from '~/modules/auth/firebase-auth.guard';
import { userIsAdmin, userIsElevated } from '~/modules/auth/userRoleCheckers';
import { UsersService } from './users.service';
import UserAuthGetDto, {
  toUserAuthGetDto,
} from '~/data/dtos/UserAuthGetDto.dto';
import UserGetDto, { toUserGetDto } from '~/data/dtos/UserGetDto.dto';
import UserPopulatedGetDto, {
  toUserPopulatedGetDto,
} from '~/data/dtos/UserPopulatedGetDto.dto';
import UserPatchDto from '~/data/dtos/UserPatchDto.dto';
import UserPublicGetDto, {
  toUserPublicGetDto,
} from '~/data/dtos/UserPublicGetDto.dto';
import UserPatchVisibilityDto from '~/data/dtos/UserPatchVisibilityDto.dto';
import UserCheckEmailDto from '~/data/dtos/UserCheckEmailDto.dto';
import { UserRole, UserRolesArray } from '@second/common';
import UserStatsGetDto from '~/data/dtos/UserStatsGetDto.dto';
import GraphGetDto, {
  createTimeSeries,
  isBefore,
} from '~/data/dtos/GraphGetDto.dto';
import UserCreateDto from '~/data/dtos/UserCreateDto.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private configService: AppConfigurationService,
    private usersService: UsersService,
  ) {}

  /** GET `/users` Get all users */
  @Get()
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'All users', type: [UserPublicGetDto] })
  async getAll(@Req() request: Request): Promise<UserPublicGetDto[]> {
    // if (!userIsElevated(request.user)) {
    //   throw new ForbiddenException('You do not have access to all users');
    // }
    const users = await this.usersService.findAll();
    return users.map(toUserPublicGetDto);
  }

  /** GET `/users/deleted` Get all deleted users */
  @Get('deleted')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'All deleted users', type: [UserGetDto] })
  async getAllDeleted(@Req() request: Request): Promise<UserGetDto[]> {
    if (!userIsAdmin(request.user))
      throw new ForbiddenException('You do not have access to deleted users');

    const users = await this.usersService.findAllDeleted();
    return users.map(toUserGetDto);
  }

  /** GET `/users/me` Get my user information */
  @Get('me')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns your user', type: UserAuthGetDto })
  async getMe(@Req() request: Request): Promise<UserAuthGetDto> {
    console.log('Has passed firebase auth guard');
    const user = await this.usersService.findById(request.user._id);
    console.log('User', user);
    if (!user) throw new NotFoundException('User not found');
    return toUserAuthGetDto(user);
  }

  /** GET `/users/:userId` Get a single user's information */
  @Get(':userId')
  @ApiParam({ name: 'userId' })
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Returns a single user's information",
    type: UserPopulatedGetDto,
  })
  @ApiForbiddenResponse({
    description: 'Only elevated users and the user themselves can see this.',
  })
  async getUser(
    @Param('userId') userId: string,
    @Req() request: Request,
  ): Promise<UserPopulatedGetDto> {
    const userOid = userId === 'me' ? request.user._id : toObjectId(userId);
    if (!request.user._id.equals(userOid) && !userIsElevated(request.user))
      throw new ForbiddenException('You do not have access to this user');

    const user = await this.usersService.findByIdPopulated(userOid);
    if (!user) throw new NotFoundException('User not found');
    return toUserPopulatedGetDto(user);
  }

  /** GET `/users/:userId/public` Get a single user's PUBLIC information */
  // NOTE: only public info should be released
  // (IE. NEVER D.O.B, email, address & phone number) (possibly others)
  @Get('/:userId/public')
  @ApiParam({ name: 'userId' })
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Returns a single user's public information",
    type: UserPublicGetDto,
  })
  async getUserPublic(
    @Param('userId') userId: string,
    @Req() request: Request,
  ): Promise<UserPublicGetDto> {
    const userOid = toObjectId(userId);

    const user = await this.usersService.findByIdPopulated(userOid);
    if (!user) throw new NotFoundException('User not found');
    return toUserPublicGetDto(user);
  }

  /** PATCH `/users/:userId` Update a user (me or admin only) */
  @Patch(':userId')
  @ApiParam({ name: 'userId' })
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Updates your user', type: UserAuthGetDto })
  async updateUser(
    @Req() request: Request,
    @Param('userId') userId: string,
    @Body() dto: UserPatchDto,
  ): Promise<UserAuthGetDto> {
    const userOid = userId === 'me' ? request.user._id : toObjectId(userId);
    if (!request.user._id.equals(userOid) && !userIsAdmin(request.user))
      throw new ForbiddenException('You do not have access to edit this user');

    const optional: Partial<UserPatchDto> = {};

    if (dto.givenName !== undefined) optional.givenName = dto.givenName;
    if (dto.familyName !== undefined) optional.familyName = dto.familyName;
    if (dto.phone !== undefined) optional.phone = dto.phone;

    const result = await this.usersService.update(userOid, optional);
    if (!result) throw new NotFoundException('User not found');

    return toUserGetDto(result);
  }

  /** PATCH `/users/:userId/visibility` Update a user visibility (admin only) */
  @Patch(':userId/visibility')
  @ApiParam({ name: 'userId' })
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Lock/unlock or delete/restore user',
    type: UserAuthGetDto,
  })
  async updateUserVisibility(
    @Req() request: Request,
    @Param('userId') userId: string,
    @Body() dto: UserPatchVisibilityDto,
  ): Promise<UserAuthGetDto> {
    if (!userIsAdmin(request.user))
      throw new ForbiddenException('You do not have access to edit this user');
    const userOid = toObjectId(userId);

    const optional: Partial<UserPatchVisibilityDto> = {};

    if (dto.locked !== undefined) optional.locked = dto.locked;
    if (dto.deleted !== undefined) optional.deleted = dto.deleted;

    const result = await this.usersService.update(userOid, optional);
    if (!result) throw new NotFoundException('User not found');

    return toUserGetDto(result);
  }

  /** GET `/users/email/:email` Check if a user exists (by email) */
  @Get('email/:email')
  @ApiParam({ name: 'email' })
  @ApiOkResponse({
    description: 'Checks if user exists',
    type: UserCheckEmailDto,
  })
  async checkEmail(@Param('email') email: string): Promise<UserCheckEmailDto> {
    const user = await this.usersService.findOneByEmail(email);
    return {
      email,
      id: user?.id,
      providers: user?.providers ?? [],
    };
  }

  /** POST `/users/:userId/role/:role` Add role to a user */
  @Post(':userId/role/:role')
  @ApiParam({ name: 'userId' })
  @ApiParam({ name: 'role' })
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Updates your user role',
    type: UserGetDto,
  })
  @ApiQuery({ name: 'userId' })
  @ApiQuery({ name: 'role', enum: UserRolesArray })
  async addUserRole(
    @Req() request: Request,
    @Param('userId') userId: string,
    @Param('role') role: string,
  ): Promise<UserAuthGetDto> {
    if (!UserRolesArray.includes(role as UserRole))
      throw new BadRequestException(`Invalid role provided: ${role}`);
    const userOid = userId === 'me' ? request.user._id : toObjectId(userId);
    if (!userIsAdmin(request.user))
      throw new ForbiddenException('You do not have access to edit this user');

    const result = await this.usersService.addRole(userOid, role as UserRole);
    if (!result) throw new NotFoundException('User not found');
    return toUserGetDto(result);
  }

  /** Delete `/users/:userId/role/:role` Remove role from a user */
  @Delete(':userId/role/:role')
  @ApiParam({ name: 'userId' })
  @ApiParam({ name: 'role' })
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Updates your user role',
    type: UserGetDto,
  })
  @ApiQuery({ name: 'userId' })
  @ApiQuery({ name: 'role', enum: UserRolesArray })
  async rmUserRole(
    @Req() request: Request,
    @Param('userId') userId: string,
    @Param('role') role: string,
  ): Promise<UserAuthGetDto> {
    if (role === undefined) throw new BadRequestException('Role not defined');
    if (!UserRolesArray.includes(role as UserRole))
      throw new BadRequestException(`Invalid role provided: ${role}`);
    const userOid = userId === 'me' ? request.user._id : toObjectId(userId);
    if (!userIsAdmin(request.user))
      throw new ForbiddenException('You do not have access to edit this user');

    const result = await this.usersService.removeRole(
      userOid,
      role as UserRole,
    );
    if (!result) throw new NotFoundException('User not found');
    return toUserGetDto(result);
  }

  /** POST `/users/:userId/avatar` Upload a user avatar */
  @Post(':userId/avatar')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Uploads a single file' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Uploads a user avatar',
    type: UserPublicGetDto,
  })
  async uploadUserAvatar(
    @Req() request: Request,
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(file);
    const userOid = userId === 'me' ? request.user._id : toObjectId(userId);
    if (!request.user._id.equals(userOid) && !userIsAdmin(request.user))
      throw new ForbiddenException('You do not have access to edit this user');

    const result = await this.usersService.uploadProfilePhoto(userOid, file);
    if (!result) throw new NotFoundException('User not found');

    console.log('Result', result);

    // Update the user avatar
    const res = await this.usersService.update(userOid, { picture: result });

    if (!res) throw new NotFoundException('User not found');

    return toUserGetDto(res);
  }

  /** GET `/users/stats/metrics`
   * Get statistics about users
   */
  @Get('stats/metrics')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: UserStatsGetDto,
    description: 'Statistics about registered users',
  })
  @ApiForbiddenResponse({
    description: 'Only elevated users can see overall stats.',
  })
  async getStatsByProgram(@Req() req: Request): Promise<UserStatsGetDto> {
    if (!userIsElevated(req.user))
      throw new ForbiddenException('Only elevated users can see overall stats');

    const users = await this.usersService.findAll();

    return {
      numberOfUsers: users.filter((u) => u.emailVerified).length,
    };
  }

  /** GET `/users/stats/graph/`
   * Get full time-series graph of users
   */
  @Get('stats/graph')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: [GraphGetDto],
    description: 'Time-series graph of registered teams',
  })
  @ApiForbiddenResponse({
    description: 'Only elevated users can see overall stats.',
  })
  async getGraph(@Req() req: Request): Promise<GraphGetDto[]> {
    if (!userIsElevated(req.user))
      throw new ForbiddenException('Only elevated users can see overall stats');

    const users = ((await this.usersService.findAll()) ?? []).filter(
      (u) => u.emailVerified,
    );
    const earliestDay = users
      .map((u) => u.timestamp)
      .sort((a, b) => a.getTime() - b.getTime())[0];
    //  This makes sure we have evenly spaced data.
    const days = createTimeSeries(earliestDay ?? new Date());

    return days
      .filter((x, i, a) => a.indexOf(x) === i)
      .map((d) => ({
        value: users.filter((t) => isBefore(t.timestamp, d)).length,
        day: d,
      }));
  }

  // NOTE Be careful of this API call please!
  // NOTE see relevant files, users.service.ts, auth.service.ts (validateUser)
  /** POST `/users/create`
   * Create a user in our backend, (NOT) in the Firebase
   * Please be careful with this API call
   * (though the Firebase user creation happends automatically when they first log in)
   */
  @Post('create')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserGetDto })
  async createUser(
    @Req() request: Request,
    @Body() dto: UserCreateDto,
  ): Promise<UserGetDto> {
    if (!userIsAdmin(request.user))
      throw new ForbiddenException('You do not have access to create users');

    const user = await this.usersService.create(dto);
    return toUserGetDto(user);
  }
}
