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
import { ElementsService } from './element.service';
import ElementCreateDto from '~/data/dtos/ElementCreateDto.dto';
import { toElementGetDto } from '~/data/dtos/ElementGetDto.dto';
import ElementGetDto from '~/data/dtos/ElementGetDto.dto';
import ElementPatchDto from '~/data/dtos/ElementPatchDto.dto';

@ApiTags('Elements')
@Controller('element')
export class ElementsController {
  constructor(
    private configService: AppConfigurationService,
    private elementService: ElementsService,
    private usersService: UsersService,
  ) {}

  /** GET `/element` Get all element */
  @Get()
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'All element', type: [ElementGetDto] })
  async getAll(@Req() request: Request): Promise<ElementGetDto[]> {
    if (!userIsElevated(request.user)) {
      throw new ForbiddenException('You do not have access to all element');
    }
    const element = await this.elementService.findAll();
    return element.map(toElementGetDto);
  }

  /** GET `/element/mine` Get my element */
  @Get('mine')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'My element', type: [ElementGetDto] })
  async getMyElement(@Req() request: Request): Promise<ElementGetDto[]> {
    const element = await this.elementService.findByUserId(request.user._id);
    if (!element) throw new NotFoundException('Element not found');
    return element.map(toElementGetDto);
  }

  /** GET `/element/:collectionId` Get a single collection's information */
  @Get(':collectionId')
  @ApiParam({ name: 'collectionId' })
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Returns a single collection's information",
    type: ElementGetDto,
  })
  @ApiForbiddenResponse({
    description:
      'Only elevated element and the collection themselves can see this.',
  })
  async getElement(
    @Param('collectionId') collectionId: string,
    @Req() request: Request,
  ): Promise<ElementGetDto> {
    const collectionOid = toObjectId(collectionId);

    const collection = await this.elementService.findById(collectionOid);
    if (!collection) throw new NotFoundException('Element not found');

    if (
      !request.user._id?.equals(collection.user) &&
      !userIsElevated(request.user)
    )
      throw new ForbiddenException('You do not have access to this collection');

    return toElementGetDto(collection);
  }

  /** PATCH `/element/:collectionId` Update a collection (mine or admin only) */
  @Patch(':collectionId')
  @ApiParam({ name: 'collectionId' })
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Updates your collection',
    type: ElementGetDto,
  })
  async updateElement(
    @Req() request: Request,
    @Param('collectionId') collectionId: string,
    @Body() dto: ElementPatchDto,
  ): Promise<ElementGetDto> {
    const collectionOid = toObjectId(collectionId);
    const collection = await this.elementService.findById(collectionOid);
    if (!collection) throw new NotFoundException('Element not found');
    if (
      !request.user._id?.equals(collection.user) &&
      !userIsElevated(request.user)
    )
      throw new ForbiddenException(
        'You do not have access to edit this collection',
      );

    const optional: Partial<ElementPatchDto> = {};

    if (dto.name !== undefined) optional.name = dto.name;

    const result = await this.elementService.update(collectionOid, optional);
    if (!result) throw new InternalServerErrorException('Something went wrong');

    return toElementGetDto(result);
  }

  /** POST `/element/create`
   * Create a collection in our backend, (NOT) in the Firebase
   * Please be careful with this API call
   * (though the Firebase collection creation happends automatically when they first log in)
   */
  @Post('create')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ElementGetDto })
  async createElement(
    @Req() request: Request,
    @Body() dto: ElementCreateDto,
  ): Promise<ElementGetDto> {
    const collection = await this.elementService.create(
      {
        name: dto.name,
        colour: dto.colour,
        icon: dto.icon,
      },
      request.user._id,
    );

    return toElementGetDto(collection);
  }

  /** DELETE `/element/:collectionId` Delete a collection */
  @Delete(':collectionId')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Deletes a collection',
    type: ElementGetDto,
  })
  async deleteElement(
    @Req() request: Request,
    @Param('collectionId') collectionId: string,
  ) {
    const collectionOid = toObjectId(collectionId);
    const collection = await this.elementService.findById(collectionOid);
    if (!collection) throw new NotFoundException('Element not found');
    if (
      !request.user._id?.equals(collection.user) &&
      !userIsElevated(request.user)
    )
      throw new ForbiddenException('You do not have access to this collection');

    const result = await this.elementService.remove(collectionOid);
    if (!result)
      throw new InternalServerErrorException('Failed to delete collection');

    return toElementGetDto(result);
  }
}
