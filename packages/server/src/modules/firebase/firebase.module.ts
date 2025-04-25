import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { AppConfigurationService } from '~/configuration/app-configuration.service';
import { FirebaseService } from './firebase.service';

const firebaseProvider = {
  provide: 'FIREBASE_APP',
  inject: [AppConfigurationService],
  useFactory: (configService: AppConfigurationService) => {
    return admin.initializeApp({
      credential: admin.credential.cert(configService.firebaseParams),
      // databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`,
      // storageBucket: `${firebaseConfig.projectId}.appspot.com`,
    });
  },
};

@Module({
  imports: [ConfigModule],
  providers: [AppConfigurationService, firebaseProvider, FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {}
