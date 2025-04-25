import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigurationService } from '~/configuration/app-configuration.service';
import { FirebaseModule } from '../firebase/firebase.module';
import { StorageModule } from '../storage/storage.module';
import { User, UserSchema } from '../users/user.schema';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { Section, SectionSchema } from './section.schema';
import { SectionsService } from './section.service';
import { SectionsController } from './sections.controller';

@Module({
  imports: [
    FirebaseModule,
    StorageModule,
    ConfigModule,
    UsersModule,
    MongooseModule.forFeature([
      { name: Section.name, schema: SectionSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [AppConfigurationService, SectionsService, UsersService],
  exports: [SectionsService],
  controllers: [SectionsController],
})
export class SectionsModule {}
