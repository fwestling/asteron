// import UserRole from '../data/user-role';

/** Data about the user population. */
export default class UserStatsGetDto {
  /** Number of confirmed users */
  numberOfUsers: number;

  constructor(fields: typeof UserStatsGetDto) {
    Object.assign(this, fields);
  }
}
