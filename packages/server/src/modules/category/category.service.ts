import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AppConfigurationService } from '~/configuration/app-configuration.service';
import CategoryPatchDto from '~/data/dtos/CategoryPatchDto.dto';
import { StorageService } from '../storage/storage.service';
import { Category, CategoryDocument } from './category.schema';

export interface CategoryCreateDto {
  name: string;
  colour?: string;
  icon?: string;
}

export interface ICategoriesService {
  findById: (id: Types.ObjectId) => Promise<CategoryDocument | null>;
  findByUserId: (userId: Types.ObjectId) => Promise<CategoryDocument[]>;
  create: (
    dto: CategoryCreateDto,
    userId: Types.ObjectId,
  ) => Promise<CategoryDocument>;
  update: (
    _id: Types.ObjectId,
    dto: CategoryPatchDto,
  ) => Promise<CategoryDocument | null>;
  remove: (id: Types.ObjectId) => Promise<CategoryDocument | null>;
}

@Injectable()
export class CategoriesService implements ICategoriesService {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: Model<CategoryDocument>,
    private config: AppConfigurationService,
    private storage: StorageService,
  ) {}
  //NOTE: changed from Mongoose findById() method to find(), if performance issue change back
  // this.categoryModel.findById(_id).exec();
  findById = async (id: Types.ObjectId): Promise<CategoryDocument | null> =>
    this.categoryModel.findById(id).where({ deleted: false }).exec();

  findByUserId = async (userId: Types.ObjectId): Promise<CategoryDocument[]> =>
    this.categoryModel.find().where({ user: userId }).exec();

  create = async (
    dto: CategoryCreateDto,
    userId: Types.ObjectId,
  ): Promise<CategoryDocument> => {
    const createdCategory = new this.categoryModel({
      name: dto.name,
      colour: dto.colour,
      icon: dto.icon,
      user: userId,
      timestamp: new Date(),
    });
    return createdCategory.save();
  };

  update = async (
    _id: Types.ObjectId,
    dto: CategoryPatchDto,
  ): Promise<CategoryDocument | null> =>
    this.categoryModel.findByIdAndUpdate(_id, { $set: dto }, { new: true });

  remove = async (id: Types.ObjectId): Promise<CategoryDocument | null> =>
    this.categoryModel.findByIdAndUpdate(
      id,
      { $set: { deleted: true } },
      { new: true },
    );
}
