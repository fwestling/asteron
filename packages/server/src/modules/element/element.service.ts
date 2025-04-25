import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FirebaseProvider, UserRole } from '@second/common';
import { Model, Types } from 'mongoose';
import { AppConfigurationService } from '~/configuration/app-configuration.service';
import { Element, ElementDocument } from './element.schema';
import ElementCreateDto from '~/data/dtos/ElementCreateDto.dto';
import ElementPatchDto from '~/data/dtos/ElementPatchDto.dto';
import { FirebaseService } from '../firebase/firebase.service';
import { StorageService } from '../storage/storage.service';

export interface IElementsService {
  findAll: () => Promise<ElementDocument[]>;
  findById: (id: Types.ObjectId) => Promise<ElementDocument | null>;
  findByUserId: (userId: Types.ObjectId) => Promise<ElementDocument[]>;
  create: (
    dto: ElementCreateDto,
    userId: Types.ObjectId,
  ) => Promise<ElementDocument>;
  update: (
    _id: Types.ObjectId,
    dto: ElementPatchDto,
  ) => Promise<ElementDocument | null>;
  remove: (id: Types.ObjectId) => Promise<ElementDocument | null>;
}

@Injectable()
export class ElementsService implements IElementsService {
  constructor(
    @InjectModel(Element.name)
    private ElementModel: Model<ElementDocument>,
    private config: AppConfigurationService,
    private storage: StorageService,
  ) {}

  // Deleted field does not always exist, so ((deleted == false) || (deleted field doesnt exist))
  findAll = async () =>
    this.ElementModel.find().where({ deleted: false }).lean().exec();

  //NOTE: changed from Mongoose findById() method to find(), if performance issue change back
  // this.ElementModel.findById(_id).exec();
  findById = async (id: Types.ObjectId): Promise<ElementDocument | null> =>
    this.ElementModel.findById(id).where({ deleted: false }).exec();

  findByUserId = async (userId: Types.ObjectId): Promise<ElementDocument[]> =>
    this.ElementModel.find().where({ user: userId }).exec();

  create = async (
    dto: ElementCreateDto,
    userId: Types.ObjectId,
  ): Promise<ElementDocument> => {
    const createdElement = new this.ElementModel({
      name: dto.name,
      colour: dto.colour,
      icon: dto.icon,
      user: userId,
      timestamp: new Date(),
    });
    return createdElement.save();
  };

  update = async (
    _id: Types.ObjectId,
    dto: ElementPatchDto,
  ): Promise<ElementDocument | null> =>
    this.ElementModel.findByIdAndUpdate(_id, { $set: dto }, { new: true });

  remove = async (id: Types.ObjectId): Promise<ElementDocument | null> =>
    this.ElementModel.findByIdAndUpdate(
      id,
      { $set: { deleted: true } },
      { new: true },
    );
}
