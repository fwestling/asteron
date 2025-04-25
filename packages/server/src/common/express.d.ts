import { Types } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      user: {
        _id: Types.ObjectId;
        roles: string[];
        familyId?: Types.ObjectId;
      };
    }
  }
}
s;
