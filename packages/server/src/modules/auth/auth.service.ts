import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  displayNameToSplit,
  FirebaseProvider,
  UserRoles,
} from '@second/common';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { UsersService } from '~/modules/users/users.service';
import { UserDocument } from '../users/user.schema';

export interface IAuthService {
  validateUser(decodedToken: DecodedIdToken): Promise<any>;
}

@Injectable()
export class AuthService implements IAuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(
    decodedToken: DecodedIdToken,
  ): Promise<Pick<UserDocument, '_id' | 'roles'>> {
    const user = await this.usersService.findOneByFirebaseId(decodedToken.uid);
    console.log('User', user);
    if (user) {
      // Update user if needed, then return.
      if (
        !user.providers ||
        !user.providers.includes(decodedToken.firebase.sign_in_provider)
      ) {
        user.providers = [
          ...(user.providers ? user.providers : []),
          decodedToken.firebase.sign_in_provider,
        ].filter((x, i, a) => a.indexOf(x) === i);
        await user.save();
      }
      if (
        (decodedToken.name && !user.givenName && !user.familyName) ||
        (decodedToken.emailVerified && !user.emailVerified) ||
        (decodedToken.picture && !user.picture)
      ) {
        console.log('Calling display name split');
        const { givenName, familyName } = displayNameToSplit(decodedToken.name);
        console.log('Name is', givenName, familyName);
        if (givenName) user.givenName = givenName;
        if (familyName) user.familyName = familyName;
        user.emailVerified =
          decodedToken.emailVerified === undefined
            ? false
            : decodedToken.emailVerified;
        user.picture = decodedToken.picture ?? '';
        await user.save();
      }

      return { _id: user._id, roles: user.roles };
    } else if (decodedToken.email) {
      // Check if this user exists without firebase (e.g. added as a coach)
      const candidate = await this.usersService.findOneByEmail(
        decodedToken.email,
      );
      if (!candidate) {
        // No user exists, so create one.
        const newUser = await this.usersService.create({
          email: decodedToken.email,
          phone: decodedToken.phoneNumber,
          roles: [UserRoles.User],
          firebaseId: decodedToken.uid,
          picture: decodedToken.picture,
          providers: [
            decodedToken.firebase.sign_in_provider as FirebaseProvider,
          ],
          emailVerified:
            decodedToken.emailVerified === undefined
              ? false
              : decodedToken.emailVerified,
          ...displayNameToSplit(decodedToken.name ? decodedToken.name : ''),
        });
        console.log('new user', newUser);
        return {
          _id: newUser._id,
          roles: newUser.roles,
        };
      } else {
        // user does exist, so add this firebase data to it.
        if (candidate.firebaseId && candidate.firebaseId !== decodedToken.uid)
          throw new BadRequestException(
            'User is already associated to a firebase account',
          );
        candidate.firebaseId = decodedToken.uid;
        candidate.emailVerified = decodedToken.emailVerified ?? false;
        candidate.picture = decodedToken.picture ?? '';

        if (
          !candidate.providers ||
          !candidate.providers.includes(
            decodedToken.firebase.sign_in_provider as FirebaseProvider,
          )
        )
          candidate.providers = [
            ...(candidate.providers ? candidate.providers : []),
            decodedToken.firebase.sign_in_provider,
          ].filter((x, i, a) => a.indexOf(x) === i);
      }
      await candidate.save();
      return {
        _id: candidate._id,
        roles: candidate.roles,
      };
    }
    throw new UnauthorizedException();
  }
  catch(error: any) {
    console.log(error);
    throw new InternalServerErrorException(error.message);
  }
}
