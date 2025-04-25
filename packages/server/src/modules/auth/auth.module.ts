import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AppConfigurationModule } from '~/configuration/app-configuration.module';
import { UsersModule } from '~/modules/users/users.module';
import { AuthService } from './auth.service';
import { FirebaseAuthStrategy } from './firebase.strategy';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    AppConfigurationModule,
    FirebaseModule,
  ],
  providers: [AuthService, FirebaseAuthStrategy],
})
export class AuthModule {}
