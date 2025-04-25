import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AppConfigurationService } from '~/configuration/app-configuration.service';
import SectionCreateDto from '~/data/dtos/SectionCreateDto.dto';
import SectionPatchDto from '~/data/dtos/SectionPatchDto.dto';
import { StorageService } from '../storage/storage.service';
import { Section, SectionDocument } from './section.schema';

export interface ISectionsService {
  findAll: () => Promise<SectionDocument[]>;
  findById: (id: Types.ObjectId) => Promise<SectionDocument | null>;
  findByUserId: (userId: Types.ObjectId) => Promise<SectionDocument[]>;
  create: (
    dto: SectionCreateDto,
    userId: Types.ObjectId,
  ) => Promise<SectionDocument>;
  update: (
    _id: Types.ObjectId,
    dto: SectionPatchDto,
  ) => Promise<SectionDocument | null>;
  remove: (id: Types.ObjectId) => Promise<SectionDocument | null>;
}

@Injectable()
export class SectionsService implements ISectionsService {
  constructor(
    @InjectModel(Section.name)
    private SectionModel: Model<SectionDocument>,
    private config: AppConfigurationService,
    private storage: StorageService,
  ) {}

  // Deleted field does not always exist, so ((deleted == false) || (deleted field doesnt exist))
  findAll = async () =>
    this.SectionModel.find().where({ deleted: false }).lean().exec();

  //NOTE: changed from Mongoose findById() method to find(), if performance issue change back
  // this.SectionModel.findById(_id).exec();
  findById = async (id: Types.ObjectId): Promise<SectionDocument | null> =>
    this.SectionModel.findById(id).where({ deleted: false }).exec();

  findByUserId = async (userId: Types.ObjectId): Promise<SectionDocument[]> =>
    this.SectionModel.find().where({ user: userId }).exec();

  create = async (
    dto: SectionCreateDto,
    userId: Types.ObjectId,
  ): Promise<SectionDocument> => {
    const createdSection = new this.SectionModel({
      name: dto.name,
      colour: dto.colour,
      icon: dto.icon,
      user: userId,
      timestamp: new Date(),
    });
    return createdSection.save();
  };

  update = async (
    _id: Types.ObjectId,
    dto: SectionPatchDto,
  ): Promise<SectionDocument | null> =>
    this.SectionModel.findByIdAndUpdate(_id, { $set: dto }, { new: true });

  remove = async (id: Types.ObjectId): Promise<SectionDocument | null> =>
    this.SectionModel.findByIdAndUpdate(
      id,
      { $set: { deleted: true } },
      { new: true },
    );
}
