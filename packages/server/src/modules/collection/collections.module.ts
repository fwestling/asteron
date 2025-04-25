import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigurationService } from '~/configuration/app-configuration.service';
import { Collection, CollectionSchema } from './collection.schema';
import { CollectionsController } from './collections.controller';
import { FirebaseModule } from '../firebase/firebase.module';
import { StorageModule } from '../storage/storage.module';
import { CollectionsService } from './collection.service';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { UserSchema } from '../users/user.schema';
import { User } from '../users/user.schema';

@Module({
  imports: [
    FirebaseModule,
    StorageModule,
    ConfigModule,
    UsersModule,
    MongooseModule.forFeature([
      { name: Collection.name, schema: CollectionSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [AppConfigurationService, CollectionsService, UsersService],
  exports: [CollectionsService],
  controllers: [CollectionsController],
})
export class CollectionsModule {}
