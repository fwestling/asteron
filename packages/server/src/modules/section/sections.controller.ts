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
import SectionCreateDto from '~/data/dtos/SectionCreateDto.dto';
import SectionGetDto, { toSectionGetDto } from '~/data/dtos/SectionGetDto.dto';
import SectionPatchDto from '~/data/dtos/SectionPatchDto.dto';
import { FirebaseAuthGuard } from '~/modules/auth/firebase-auth.guard';
import { userIsElevated } from '../auth/userRoleCheckers';
import { UsersService } from '../users/users.service';
import { SectionsService } from './section.service';

@ApiTags('Sections')
@Controller('manuscript')
export class SectionsController {
  constructor(
    private configService: AppConfigurationService,
    private manuscriptService: SectionsService,
    private usersService: UsersService,
  ) {}

  /** GET `/manuscript` Get all manuscript */
  @Get()
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'All manuscript', type: [SectionGetDto] })
  async getAll(@Req() request: Request): Promise<SectionGetDto[]> {
    if (!userIsElevated(request.user)) {
      throw new ForbiddenException('You do not have access to all manuscript');
    }
    const manuscript = await this.manuscriptService.findAll();
    return manuscript.map(toSectionGetDto);
  }

  /** GET `/manuscript/mine` Get my manuscript */
  @Get('mine')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'My manuscript', type: [SectionGetDto] })
  async getMySection(@Req() request: Request): Promise<SectionGetDto[]> {
    const manuscript = await this.manuscriptService.findByUserId(
      request.user._id,
    );
    if (!manuscript) throw new NotFoundException('Section not found');
    return manuscript.map(toSectionGetDto);
  }

  /** GET `/manuscript/:collectionId` Get a single collection's information */
  @Get(':collectionId')
  @ApiParam({ name: 'collectionId' })
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Returns a single collection's information",
    type: SectionGetDto,
  })
  @ApiForbiddenResponse({
    description:
      'Only elevated manuscript and the collection themselves can see this.',
  })
  async getSection(
    @Param('collectionId') collectionId: string,
    @Req() request: Request,
  ): Promise<SectionGetDto> {
    const collectionOid = toObjectId(collectionId);

    const collection = await this.manuscriptService.findById(collectionOid);
    if (!collection) throw new NotFoundException('Section not found');

    if (
      !request.user._id?.equals(collection.user) &&
      !userIsElevated(request.user)
    )
      throw new ForbiddenException('You do not have access to this collection');

    return toSectionGetDto(collection);
  }

  /** PATCH `/manuscript/:collectionId` Update a collection (mine or admin only) */
  @Patch(':collectionId')
  @ApiParam({ name: 'collectionId' })
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Updates your collection',
    type: SectionGetDto,
  })
  async updateSection(
    @Req() request: Request,
    @Param('collectionId') collectionId: string,
    @Body() dto: SectionPatchDto,
  ): Promise<SectionGetDto> {
    const collectionOid = toObjectId(collectionId);
    const collection = await this.manuscriptService.findById(collectionOid);
    if (!collection) throw new NotFoundException('Section not found');
    if (
      !request.user._id?.equals(collection.user) &&
      !userIsElevated(request.user)
    )
      throw new ForbiddenException(
        'You do not have access to edit this collection',
      );

    const optional: Partial<SectionPatchDto> = {};

    if (dto.name !== undefined) optional.name = dto.name;

    const result = await this.manuscriptService.update(collectionOid, optional);
    if (!result) throw new InternalServerErrorException('Something went wrong');

    return toSectionGetDto(result);
  }

  /** POST `/manuscript/create`
   * Create a collection in our backend, (NOT) in the Firebase
   * Please be careful with this API call
   * (though the Firebase collection creation happends automatically when they first log in)
   */
  @Post('create')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: SectionGetDto })
  async createSection(
    @Req() request: Request,
    @Body() dto: SectionCreateDto,
  ): Promise<SectionGetDto> {
    const collection = await this.manuscriptService.create(
      {
        name: dto.name,
        colour: dto.colour,
        icon: dto.icon,
      },
      request.user._id,
    );

    return toSectionGetDto(collection);
  }

  /** DELETE `/manuscript/:collectionId` Delete a collection */
  @Delete(':collectionId')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Deletes a collection',
    type: SectionGetDto,
  })
  async deleteSection(
    @Req() request: Request,
    @Param('collectionId') collectionId: string,
  ) {
    const collectionOid = toObjectId(collectionId);
    const collection = await this.manuscriptService.findById(collectionOid);
    if (!collection) throw new NotFoundException('Section not found');
    if (
      !request.user._id?.equals(collection.user) &&
      !userIsElevated(request.user)
    )
      throw new ForbiddenException('You do not have access to this collection');

    const result = await this.manuscriptService.remove(collectionOid);
    if (!result)
      throw new InternalServerErrorException('Failed to delete collection');

    return toSectionGetDto(result);
  }
}
