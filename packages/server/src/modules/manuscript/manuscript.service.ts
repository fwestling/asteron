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
import { Manuscript, ManuscriptDocument } from './manuscript.schema';
import ManuscriptCreateDto from '~/data/dtos/ManuscriptCreateDto.dto';
import ManuscriptPatchDto from '~/data/dtos/ManuscriptPatchDto.dto';
import { FirebaseService } from '../firebase/firebase.service';
import { StorageService } from '../storage/storage.service';

export interface IManuscriptsService {
  findAll: () => Promise<ManuscriptDocument[]>;
  findById: (id: Types.ObjectId) => Promise<ManuscriptDocument | null>;
  findByUserId: (userId: Types.ObjectId) => Promise<ManuscriptDocument[]>;
  create: (
    dto: ManuscriptCreateDto,
    userId: Types.ObjectId,
  ) => Promise<ManuscriptDocument>;
  update: (
    _id: Types.ObjectId,
    dto: ManuscriptPatchDto,
  ) => Promise<ManuscriptDocument | null>;
  remove: (id: Types.ObjectId) => Promise<ManuscriptDocument | null>;
}

@Injectable()
export class ManuscriptsService implements IManuscriptsService {
  constructor(
    @InjectModel(Manuscript.name)
    private ManuscriptModel: Model<ManuscriptDocument>,
    private config: AppConfigurationService,
    private storage: StorageService,
  ) {}

  // Deleted field does not always exist, so ((deleted == false) || (deleted field doesnt exist))
  findAll = async () =>
    this.ManuscriptModel.find().where({ deleted: false }).lean().exec();

  //NOTE: changed from Mongoose findById() method to find(), if performance issue change back
  // this.ManuscriptModel.findById(_id).exec();
  findById = async (id: Types.ObjectId): Promise<ManuscriptDocument | null> =>
    this.ManuscriptModel.findById(id).where({ deleted: false }).exec();

  findByUserId = async (
    userId: Types.ObjectId,
  ): Promise<ManuscriptDocument[]> =>
    this.ManuscriptModel.find().where({ user: userId }).exec();

  create = async (
    dto: ManuscriptCreateDto,
    userId: Types.ObjectId,
  ): Promise<ManuscriptDocument> => {
    const createdManuscript = new this.ManuscriptModel({
      name: dto.name,
      colour: dto.colour,
      icon: dto.icon,
      user: userId,
      timestamp: new Date(),
    });
    return createdManuscript.save();
  };

  update = async (
    _id: Types.ObjectId,
    dto: ManuscriptPatchDto,
  ): Promise<ManuscriptDocument | null> =>
    this.ManuscriptModel.findByIdAndUpdate(_id, { $set: dto }, { new: true });

  remove = async (id: Types.ObjectId): Promise<ManuscriptDocument | null> =>
    this.ManuscriptModel.findByIdAndUpdate(
      id,
      { $set: { deleted: true } },
      { new: true },
    );
}
