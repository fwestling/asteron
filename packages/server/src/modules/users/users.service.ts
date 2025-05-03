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
import UserCreateDto from '~/data/dtos/UserCreateDto.dto';
import UserUpdateDto from '~/data/dtos/UserUpdateDto.dto';
import { StorageService } from '../storage/storage.service';
import { User, UserDocument } from './user.schema';

export interface IUsersService {
  findAll: () => Promise<UserDocument[]>;
  findAllDeleted: () => Promise<UserDocument[]>;
  findAllLocked: () => Promise<UserDocument[]>;
  findById: (id: Types.ObjectId) => Promise<UserDocument | null>;
  findByIdDeleted: (id: Types.ObjectId) => Promise<UserDocument | null>;
  findByIds: (userIds: Types.ObjectId[]) => Promise<UserDocument[]>;
  findByIdLean: (id: Types.ObjectId) => Promise<UserDocument | null>;
  findOneByFirebaseId: (firebaseId: string) => Promise<UserDocument | null>;
  findOneByEmail: (email: string) => Promise<UserDocument | null>;
  findAllPopulated: () => Promise<UserDocument[]>;
  findByIdPopulated: (userId: Types.ObjectId) => Promise<UserDocument | null>;
  findByIdDeletedPopulated: (
    userId: Types.ObjectId,
  ) => Promise<UserDocument | null>;
  create: (dto: UserCreateDto) => Promise<UserDocument>;
  update: (
    _id: Types.ObjectId,
    dto: UserUpdateDto & { emailVerified?: boolean },
  ) => Promise<UserDocument | null>;
  addRole: (
    userId: Types.ObjectId,
    role: UserRole,
  ) => Promise<UserDocument | null>;
  removeRole: (
    userId: Types.ObjectId,
    role: UserRole,
  ) => Promise<UserDocument | null>;
  addFirebase: (
    uid: Types.ObjectId,
    firebaseId: string,
    firebaseData: { emailVerified?: boolean; picture?: string },
  ) => Promise<UserDocument | null>;
  addFirebaseProvider: (
    uid: Types.ObjectId,
    provider: FirebaseProvider,
  ) => Promise<UserDocument | null>;
}

@Injectable()
export class UsersService implements IUsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private config: AppConfigurationService,
    private storage: StorageService,
  ) {}

  // Deleted field does not always exist, so ((deleted == false) || (deleted field doesnt exist))
  findAll = async () =>
    this.userModel.find().where({ deleted: false }).lean().exec();

  findAllDeleted = async () =>
    this.userModel.find({ deleted: true }).lean().exec();

  // Find locked AND ((deleted == false) || (deleted field does not exist))
  findAllLocked = async () =>
    this.userModel
      .find({
        $and: [{ locked: true }, { deleted: false }],
      })
      .lean()
      .exec();

  //NOTE: changed from Mongoose findById() methodd to find(), if performance issue change back
  // this.userModel.findById(_id).exec();
  findById = async (id: Types.ObjectId): Promise<UserDocument | null> =>
    this.userModel.findById(id).where({ deleted: false }).exec();

  findByIdDeleted = async (id: Types.ObjectId): Promise<UserDocument | null> =>
    this.userModel.findById(id).where({ deleted: true }).exec();

  findByIds = async (userIds: Types.ObjectId[]): Promise<UserDocument[]> =>
    this.userModel
      .find({ _id: { $in: userIds } })
      .where({ deleted: false })
      .lean()
      .exec();

  findByIdLean = async (id: Types.ObjectId): Promise<UserDocument | null> =>
    this.userModel.findById(id).where({ deleted: false }).lean().exec();

  findOneByFirebaseId = async (
    firebaseId: string,
  ): Promise<UserDocument | null> =>
    this.userModel.findOne({ firebaseId: firebaseId });

  findOneByEmail = async (email: string): Promise<UserDocument | null> =>
    this.userModel.findOne({ email: email.toLowerCase() }).exec();

  findAllPopulated = async (): Promise<UserDocument[]> =>
    this.userModel.find().where({ deleted: false }).lean().exec();

  findByIdPopulated = async (
    userId: Types.ObjectId,
  ): Promise<UserDocument | null> =>
    this.userModel.findById(userId).where({ deleted: false }).lean().exec();

  findByIdDeletedPopulated = async (
    userId: Types.ObjectId,
  ): Promise<UserDocument | null> =>
    this.userModel.findById(userId).where({ deleted: true }).lean().exec();

  create = async (dto: UserCreateDto): Promise<UserDocument> => {
    const createdUser = new this.userModel({
      ...dto,
      email: dto.email.toLowerCase(),
    });
    return createdUser.save();
  };

  update = async (
    _id: Types.ObjectId,
    dto: UserUpdateDto & { emailVerified?: boolean },
  ): Promise<UserDocument | null> =>
    this.userModel.findByIdAndUpdate(_id, { $set: dto }, { new: true });

  addRole = async (userId: Types.ObjectId, role: UserRole) => {
    const user = await this.userModel.findById(userId).lean().exec();
    if (!user) throw new NotFoundException('User not found');
    const updatedUser = await this.userModel.findByIdAndUpdate(userId, {
      roles: [...user.roles, role].filter((x, i, a) => a.indexOf(x) === i),
    });
    return updatedUser;
  };

  uploadProfilePhoto = async (
    userId: Types.ObjectId,
    file: Express.Multer.File,
  ) => {
    const url = await this.storage.uploadFile(file, 'user-avatars');
    return url;
  };

  removeRole = async (userId: Types.ObjectId, role: UserRole) => {
    const user = await this.userModel.findById(userId).lean().exec();
    if (!user) throw new NotFoundException('User not found');
    const updatedUser = this.userModel.findByIdAndUpdate(userId, {
      roles: user.roles.filter((r) => r !== role),
    });
    return updatedUser;
  };

  addFirebase = async (
    uid: Types.ObjectId,
    firebaseId: string,
    firebaseData: { emailVerified?: boolean; picture?: string },
  ) => {
    const user = await this.userModel.findById(uid);
    if (user) {
      if (user.firebaseId)
        throw new HttpException(
          'User is already associated to a firebase account',
          HttpStatus.BAD_REQUEST,
        );
      user.firebaseId = firebaseId;
      user.emailVerified =
        firebaseData.emailVerified === undefined
          ? false
          : firebaseData.emailVerified;
      if (firebaseData.picture) user.picture = firebaseData.picture;
      return user.save();
    } else {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  };

  addFirebaseProvider = async (
    uid: Types.ObjectId,
    provider: FirebaseProvider,
  ) => {
    const user = await this.userModel.findById(uid);
    if (user) {
      user.providers = [
        ...(user.providers ? user.providers : []),
        provider,
      ].filter((x, i, a) => a.indexOf(x) === i);
      return user.save();
    } else {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  };
}
