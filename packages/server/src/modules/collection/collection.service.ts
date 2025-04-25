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
import { Collection, CollectionDocument } from './collection.schema';
import CollectionCreateDto from '~/data/dtos/CollectionCreateDto.dto';
import CollectionPatchDto from '~/data/dtos/CollectionPatchDto.dto';
import { FirebaseService } from '../firebase/firebase.service';
import { StorageService } from '../storage/storage.service';

export interface ICollectionsService {
  findAll: () => Promise<CollectionDocument[]>;
  findById: (id: Types.ObjectId) => Promise<CollectionDocument | null>;
  findByUserId: (userId: Types.ObjectId) => Promise<CollectionDocument[]>;
  create: (
    dto: CollectionCreateDto,
    userId: Types.ObjectId,
  ) => Promise<CollectionDocument>;
  update: (
    _id: Types.ObjectId,
    dto: CollectionPatchDto,
  ) => Promise<CollectionDocument | null>;
  remove: (id: Types.ObjectId) => Promise<CollectionDocument | null>;
}

@Injectable()
export class CollectionsService implements ICollectionsService {
  constructor(
    @InjectModel(Collection.name)
    private collectionModel: Model<CollectionDocument>,
    private config: AppConfigurationService,
    private storage: StorageService,
  ) {}

  // Deleted field does not always exist, so ((deleted == false) || (deleted field doesnt exist))
  findAll = async () =>
    this.collectionModel.find().where({ deleted: false }).lean().exec();

  //NOTE: changed from Mongoose findById() method to find(), if performance issue change back
  // this.collectionModel.findById(_id).exec();
  findById = async (id: Types.ObjectId): Promise<CollectionDocument | null> =>
    this.collectionModel.findById(id).where({ deleted: false }).exec();

  findByUserId = async (
    userId: Types.ObjectId,
  ): Promise<CollectionDocument[]> =>
    this.collectionModel.find().where({ user: userId }).exec();

  create = async (
    dto: CollectionCreateDto,
    userId: Types.ObjectId,
  ): Promise<CollectionDocument> => {
    const createdCollection = new this.collectionModel({
      name: dto.name,
      colour: dto.colour,
      icon: dto.icon,
      user: userId,
      timestamp: new Date(),
    });
    return createdCollection.save();
  };

  update = async (
    _id: Types.ObjectId,
    dto: CollectionPatchDto,
  ): Promise<CollectionDocument | null> =>
    this.collectionModel.findByIdAndUpdate(_id, { $set: dto }, { new: true });

  remove = async (id: Types.ObjectId): Promise<CollectionDocument | null> =>
    this.collectionModel.findByIdAndUpdate(
      id,
      { $set: { deleted: true } },
      { new: true },
    );
}
