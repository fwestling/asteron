import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigurationService } from '~/configuration/app-configuration.service';
import { Manuscript, ManuscriptSchema } from './manuscript.schema';
import { ManuscriptsController } from './manuscripts.controller';
import { FirebaseModule } from '../firebase/firebase.module';
import { StorageModule } from '../storage/storage.module';
import { ManuscriptsService } from './manuscript.service';
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
      { name: Manuscript.name, schema: ManuscriptSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [AppConfigurationService, ManuscriptsService, UsersService],
  exports: [ManuscriptsService],
  controllers: [ManuscriptsController],
})
export class ManuscriptsModule {}
