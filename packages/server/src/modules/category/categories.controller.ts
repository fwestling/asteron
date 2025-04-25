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
import CategoryGetDto, {
  toCategoryGetDto,
} from '~/data/dtos/CategoryGetDto.dto';
import CategoryPatchDto from '~/data/dtos/CategoryPatchDto.dto';
import { FirebaseAuthGuard } from '~/modules/auth/firebase-auth.guard';
import { userIsElevated } from '../auth/userRoleCheckers';
import { UsersService } from '../users/users.service';
import { CategoriesService } from './category.service';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(
    private configService: AppConfigurationService,
    private categoriesService: CategoriesService,
    private usersService: UsersService,
  ) {}

  /** GET `/categories` Get all my categories */
  @Get()
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'All categories', type: [CategoryGetDto] })
  async getAll(@Req() request: Request): Promise<CategoryGetDto[]> {
    const categories = await this.categoriesService.findByUserId(
      request.user._id,
    );
    if (!categories) throw new NotFoundException('Category not found');
    return categories.map(toCategoryGetDto);
  }

  /** GET `/categories/:categoryId` Get a single category's information */
  @Get(':categoryId')
  @ApiParam({ name: 'categoryId' })
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Returns a single category's information",
    type: CategoryGetDto,
  })
  @ApiForbiddenResponse({
    description:
      'Only elevated categories and the category themselves can see this.',
  })
  async getCategory(
    @Param('categoryId') categoryId: string,
    @Req() request: Request,
  ): Promise<CategoryGetDto> {
    const categoryOid = toObjectId(categoryId);

    const category = await this.categoriesService.findById(categoryOid);
    if (!category) throw new NotFoundException('Category not found');

    if (
      !request.user._id?.equals(category.user) &&
      !userIsElevated(request.user)
    )
      throw new ForbiddenException('You do not have access to this category');

    return toCategoryGetDto(category);
  }

  /** PATCH `/categories/:categoryId` Update a category (mine or admin only) */
  @Patch(':categoryId')
  @ApiParam({ name: 'categoryId' })
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Updates your category',
    type: CategoryGetDto,
  })
  async updateCategory(
    @Req() request: Request,
    @Param('categoryId') categoryId: string,
    @Body() dto: CategoryPatchDto,
  ): Promise<CategoryGetDto> {
    const categoryOid = toObjectId(categoryId);
    const category = await this.categoriesService.findById(categoryOid);
    if (!category) throw new NotFoundException('Category not found');
    if (
      !request.user._id?.equals(category.user) &&
      !userIsElevated(request.user)
    )
      throw new ForbiddenException(
        'You do not have access to edit this category',
      );

    const optional: Partial<CategoryPatchDto> = {};

    if (dto.name !== undefined) optional.name = dto.name;

    const result = await this.categoriesService.update(categoryOid, optional);
    if (!result) throw new InternalServerErrorException('Something went wrong');

    return toCategoryGetDto(result);
  }

  /** DELETE `/categories/:categoryId` Delete a category */
  @Delete(':categoryId')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Deletes a category',
    type: CategoryGetDto,
  })
  async deleteCategory(
    @Req() request: Request,
    @Param('categoryId') categoryId: string,
  ) {
    const categoryOid = toObjectId(categoryId);
    const category = await this.categoriesService.findById(categoryOid);
    if (!category) throw new NotFoundException('Category not found');
    if (
      !request.user._id?.equals(category.user) &&
      !userIsElevated(request.user)
    )
      throw new ForbiddenException('You do not have access to this category');

    const result = await this.categoriesService.remove(categoryOid);
    if (!result)
      throw new InternalServerErrorException('Failed to delete category');

    return toCategoryGetDto(result);
  }
}
