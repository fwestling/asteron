/** ID of a user given the email */
export default class UserCheckEmailDto {
  id: string | null;
  email: string;
  providers: string[];

  constructor(fields: typeof UserCheckEmailDto) {
    Object.assign(this, fields);
  }
}
