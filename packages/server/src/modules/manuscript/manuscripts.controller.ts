import {
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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import toObjectId from '~/common/toObjectId';
import { AppConfigurationService } from '~/configuration/app-configuration.service';
import { FirebaseAuthGuard } from '~/modules/auth/firebase-auth.guard';
import { userIsElevated } from '../auth/userRoleCheckers';
import { UsersService } from '../users/users.service';
import { ManuscriptsService } from './manuscript.service';
import ManuscriptCreateDto from '~/data/dtos/ManuscriptCreateDto.dto';
import { toManuscriptGetDto } from '~/data/dtos/ManuscriptGetDto.dto';
import ManuscriptGetDto from '~/data/dtos/ManuscriptGetDto.dto';
import ManuscriptPatchDto from '~/data/dtos/ManuscriptPatchDto.dto';

@ApiTags('Manuscripts')
@Controller('manuscript')
export class ManuscriptsController {
  constructor(
    private configService: AppConfigurationService,
    private manuscriptService: ManuscriptsService,
    private usersService: UsersService,
  ) {}

  /** GET `/manuscript` Get all manuscript */
  @Get()
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'All manuscript', type: [ManuscriptGetDto] })
  async getAll(@Req() request: Request): Promise<ManuscriptGetDto[]> {
    if (!userIsElevated(request.user)) {
      throw new ForbiddenException('You do not have access to all manuscript');
    }
    const manuscript = await this.manuscriptService.findAll();
    return manuscript.map(toManuscriptGetDto);
  }

  /** GET `/manuscript/mine` Get my manuscript */
  @Get('mine')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'My manuscript', type: [ManuscriptGetDto] })
  async getMyManuscript(@Req() request: Request): Promise<ManuscriptGetDto[]> {
    const manuscript = await this.manuscriptService.findByUserId(
      request.user._id,
    );
    if (!manuscript) throw new NotFoundException('Manuscript not found');
    return manuscript.map(toManuscriptGetDto);
  }

  /** GET `/manuscript/:collectionId` Get a single collection's information */
  @Get(':collectionId')
  @ApiParam({ name: 'collectionId' })
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Returns a single collection's information",
    type: ManuscriptGetDto,
  })
  @ApiForbiddenResponse({
    description:
      'Only elevated manuscript and the collection themselves can see this.',
  })
  async getManuscript(
    @Param('collectionId') collectionId: string,
    @Req() request: Request,
  ): Promise<ManuscriptGetDto> {
    const collectionOid = toObjectId(collectionId);

    const collection = await this.manuscriptService.findById(collectionOid);
    if (!collection) throw new NotFoundException('Manuscript not found');

    if (
      !request.user._id?.equals(collection.user) &&
      !userIsElevated(request.user)
    )
      throw new ForbiddenException('You do not have access to this collection');

    return toManuscriptGetDto(collection);
  }

  /** PATCH `/manuscript/:collectionId` Update a collection (mine or admin only) */
  @Patch(':collectionId')
  @ApiParam({ name: 'collectionId' })
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Updates your collection',
    type: ManuscriptGetDto,
  })
  async updateManuscript(
    @Req() request: Request,
    @Param('collectionId') collectionId: string,
    @Body() dto: ManuscriptPatchDto,
  ): Promise<ManuscriptGetDto> {
    const collectionOid = toObjectId(collectionId);
    const collection = await this.manuscriptService.findById(collectionOid);
    if (!collection) throw new NotFoundException('Manuscript not found');
    if (
      !request.user._id?.equals(collection.user) &&
      !userIsElevated(request.user)
    )
      throw new ForbiddenException(
        'You do not have access to edit this collection',
      );

    const optional: Partial<ManuscriptPatchDto> = {};

    if (dto.name !== undefined) optional.name = dto.name;

    const result = await this.manuscriptService.update(collectionOid, optional);
    if (!result) throw new InternalServerErrorException('Something went wrong');

    return toManuscriptGetDto(result);
  }

  /** POST `/manuscript/create`
   * Create a collection in our backend, (NOT) in the Firebase
   * Please be careful with this API call
   * (though the Firebase collection creation happends automatically when they first log in)
   */
  @Post('create')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ManuscriptGetDto })
  async createManuscript(
    @Req() request: Request,
    @Body() dto: ManuscriptCreateDto,
  ): Promise<ManuscriptGetDto> {
    const collection = await this.manuscriptService.create(
      {
        name: dto.name,
        colour: dto.colour,
        icon: dto.icon,
      },
      request.user._id,
    );

    return toManuscriptGetDto(collection);
  }

  /** DELETE `/manuscript/:collectionId` Delete a collection */
  @Delete(':collectionId')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Deletes a collection',
    type: ManuscriptGetDto,
  })
  async deleteManuscript(
    @Req() request: Request,
    @Param('collectionId') collectionId: string,
  ) {
    const collectionOid = toObjectId(collectionId);
    const collection = await this.manuscriptService.findById(collectionOid);
    if (!collection) throw new NotFoundException('Manuscript not found');
    if (
      !request.user._id?.equals(collection.user) &&
      !userIsElevated(request.user)
    )
      throw new ForbiddenException('You do not have access to this collection');

    const result = await this.manuscriptService.remove(collectionOid);
    if (!result)
      throw new InternalServerErrorException('Failed to delete collection');

    return toManuscriptGetDto(result);
  }
}
