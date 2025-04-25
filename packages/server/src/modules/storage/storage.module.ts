import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { AppConfigurationService } from '~/configuration/app-configuration.service';
import { StorageService } from './storage.service';
import { Storage } from '@google-cloud/storage';

const storageProvider = {
  provide: 'CLOUD_STORAGE',
  inject: [AppConfigurationService],
  useFactory: (configService: AppConfigurationService) => {
    return new Storage({
      credentials: configService.firebaseParams,
      // projectId: configService.cloudStorageProjectId,
    });
  },
};

@Module({
  imports: [ConfigModule],
  providers: [AppConfigurationService, storageProvider, StorageService],
  exports: [StorageService],
})
export class StorageModule {}
