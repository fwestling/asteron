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
import { CollectionsService } from './collection.service';
import CollectionCreateDto from '~/data/dtos/CollectionCreateDto.dto';
import { toCollectionGetDto } from '~/data/dtos/CollectionGetDto.dto';
import CollectionGetDto from '~/data/dtos/CollectionGetDto.dto';
import CollectionPatchDto from '~/data/dtos/CollectionPatchDto.dto';

@ApiTags('Collections')
@Controller('collections')
export class CollectionsController {
  constructor(
    private configService: AppConfigurationService,
    private collectionsService: CollectionsService,
    private usersService: UsersService,
  ) {}

  /** GET `/collections` Get all collections */
  @Get()
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'All collections', type: [CollectionGetDto] })
  async getAll(@Req() request: Request): Promise<CollectionGetDto[]> {
    if (!userIsElevated(request.user)) {
      throw new ForbiddenException('You do not have access to all collections');
    }
    const collections = await this.collectionsService.findAll();
    return collections.map(toCollectionGetDto);
  }

  /** GET `/collections/mine` Get my collections */
  @Get('mine')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'My collections', type: [CollectionGetDto] })
  async getMyCollection(@Req() request: Request): Promise<CollectionGetDto[]> {
    const collections = await this.collectionsService.findByUserId(
      request.user._id,
    );
    if (!collections) throw new NotFoundException('Collection not found');
    return collections.map(toCollectionGetDto);
  }

  /** GET `/collections/:collectionId` Get a single collection's information */
  @Get(':collectionId')
  @ApiParam({ name: 'collectionId' })
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Returns a single collection's information",
    type: CollectionGetDto,
  })
  @ApiForbiddenResponse({
    description:
      'Only elevated collections and the collection themselves can see this.',
  })
  async getCollection(
    @Param('collectionId') collectionId: string,
    @Req() request: Request,
  ): Promise<CollectionGetDto> {
    const collectionOid = toObjectId(collectionId);

    const collection = await this.collectionsService.findById(collectionOid);
    if (!collection) throw new NotFoundException('Collection not found');

    if (
      !request.user._id?.equals(collection.user) &&
      !userIsElevated(request.user)
    )
      throw new ForbiddenException('You do not have access to this collection');

    return toCollectionGetDto(collection);
  }

  /** PATCH `/collections/:collectionId` Update a collection (mine or admin only) */
  @Patch(':collectionId')
  @ApiParam({ name: 'collectionId' })
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Updates your collection',
    type: CollectionGetDto,
  })
  async updateCollection(
    @Req() request: Request,
    @Param('collectionId') collectionId: string,
    @Body() dto: CollectionPatchDto,
  ): Promise<CollectionGetDto> {
    const collectionOid = toObjectId(collectionId);
    const collection = await this.collectionsService.findById(collectionOid);
    if (!collection) throw new NotFoundException('Collection not found');
    if (
      !request.user._id?.equals(collection.user) &&
      !userIsElevated(request.user)
    )
      throw new ForbiddenException(
        'You do not have access to edit this collection',
      );

    const optional: Partial<CollectionPatchDto> = {};

    if (dto.name !== undefined) optional.name = dto.name;

    const result = await this.collectionsService.update(
      collectionOid,
      optional,
    );
    if (!result) throw new InternalServerErrorException('Something went wrong');

    return toCollectionGetDto(result);
  }

  /** POST `/collections/create`
   * Create a collection in our backend, (NOT) in the Firebase
   * Please be careful with this API call
   * (though the Firebase collection creation happends automatically when they first log in)
   */
  @Post('create')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: CollectionGetDto })
  async createCollection(
    @Req() request: Request,
    @Body() dto: CollectionCreateDto,
  ): Promise<CollectionGetDto> {
    const collection = await this.collectionsService.create(
      {
        name: dto.name,
        colour: dto.colour,
        icon: dto.icon,
      },
      request.user._id,
    );

    return toCollectionGetDto(collection);
  }

  /** DELETE `/collections/:collectionId` Delete a collection */
  @Delete(':collectionId')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Deletes a collection',
    type: CollectionGetDto,
  })
  async deleteCollection(
    @Req() request: Request,
    @Param('collectionId') collectionId: string,
  ) {
    const collectionOid = toObjectId(collectionId);
    const collection = await this.collectionsService.findById(collectionOid);
    if (!collection) throw new NotFoundException('Collection not found');
    if (
      !request.user._id?.equals(collection.user) &&
      !userIsElevated(request.user)
    )
      throw new ForbiddenException('You do not have access to this collection');

    const result = await this.collectionsService.remove(collectionOid);
    if (!result)
      throw new InternalServerErrorException('Failed to delete collection');

    return toCollectionGetDto(result);
  }
}
