import { UserRole } from '@second/common';
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as firebase from 'firebase-admin';
import { ObjectId, Types } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-firebase-jwt';
import { AppConfigurationService } from '~/configuration/app-configuration.service';
import { AuthService } from './auth.service';
import { FirebaseService } from '../firebase/firebase.service';

export type RequestUser = {
  _id: Types.ObjectId;
  roles: UserRole[];
  familyId?: Types.ObjectId;
};

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(
  Strategy,
  'firebase-auth',
) {
  defaultApp: firebase.app.App;

  constructor(
    configService: AppConfigurationService,
    private firebaseService: FirebaseService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });

    this.defaultApp = firebaseService.firebaseApp;
  }

  async validate(token: string): Promise<RequestUser | null> {
    if (!token)
      throw new UnauthorizedException('No valid token, authentication denied.');
    try {
      const decodedToken = await this.defaultApp
        .auth()
        .verifyIdToken(token, true)
        .catch((error) => {
          console.log(error);
          throw new UnauthorizedException(error.message);
        });
      // console.log(JSON.stringify({ decodedToken }));

      const user = await this.authService.validateUser(decodedToken);
      return {
        _id: user._id as Types.ObjectId,
        roles: user.roles,
        familyId: user.familyId,
      };
    } catch (error: any) {
      console.error(error);
      throw new InternalServerErrorException(error?.message);
    }
  }
}
