import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigurationService } from '~/configuration/app-configuration.service';
import { FirebaseModule } from '../firebase/firebase.module';
import { StorageModule } from '../storage/storage.module';
import { User, UserSchema } from '../users/user.schema';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { CategoriesController } from './categories.controller';
import { Category, CategorySchema } from './category.schema';
import { CategoriesService } from './category.service';

@Module({
  imports: [
    FirebaseModule,
    StorageModule,
    ConfigModule,
    UsersModule,
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [AppConfigurationService, CategoriesService, UsersService],
  exports: [CategoriesService],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
