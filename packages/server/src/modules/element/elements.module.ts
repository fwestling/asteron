import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigurationService } from '~/configuration/app-configuration.service';
import { Element, ElementSchema } from './element.schema';
import { ElementsController } from './elements.controller';
import { FirebaseModule } from '../firebase/firebase.module';
import { StorageModule } from '../storage/storage.module';
import { ElementsService } from './element.service';
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
      { name: Element.name, schema: ElementSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [AppConfigurationService, ElementsService, UsersService],
  exports: [ElementsService],
  controllers: [ElementsController],
})
export class ElementsModule {}
