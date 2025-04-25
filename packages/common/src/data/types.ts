import {
  FirebaseProviders,
  UserRoles,
} from './constants';
import { Locale } from '../locales/locale';

export type Contact = {
  name: string;
  phone: string;
  email: string;
};

export type State = typeof Locale.states[number];
export type FirebaseProvider = typeof FirebaseProviders[number];
export type UserRoleName = keyof typeof UserRoles;
export type UserRole = typeof UserRoles[UserRoleName];
