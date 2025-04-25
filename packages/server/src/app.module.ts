import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { AppConfigurationModule } from './configuration/app-configuration.module';
import { AppConfigurationService } from './configuration/app-configuration.service';
import { AuthModule } from './modules/auth/auth.module';
import { AuthService } from './modules/auth/auth.service';
import { PingModule } from './modules/ping/ping.module';
import { UsersModule } from './modules/users/users.module';
// import { ServeStaticModule } from '@nestjs/serve-static';
import { CategoriesModule } from './modules/category/categories.module';
import { CollectionsModule } from './modules/collection/collections.module';
import { ElementsModule } from './modules/element/elements.module';
import { ManuscriptsModule } from './modules/manuscript/manuscripts.module';
import { SectionsModule } from './modules/section/sections.module';

@Module({
  imports: [
    AppConfigurationModule,
    MongooseModule.forRootAsync({
      imports: [
        AppConfigurationModule,
        // ServeStaticModule.forRoot({
        //   rootPath: join(__dirname, '.', 'public'),
        // }),
      ],
      inject: [AppConfigurationService],
      useFactory: (appConfigService: AppConfigurationService) => {
        const options: MongooseModuleOptions = {
          uri: appConfigService.connectionString,
          dbName: appConfigService.dbName,
          // useNewUrlParser: true,
          // useUnifiedTopology: true,
        };
        return options;
      },
    }),
    PingModule,
    CategoriesModule,
    CollectionsModule,
    SectionsModule,
    ManuscriptsModule,
    ElementsModule,
    AuthModule,
    UsersModule,
  ],
  providers: [AppService, AuthService, AppConfigurationService, ConfigService],
})
export class AppModule {}
