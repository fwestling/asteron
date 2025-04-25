import { Types } from 'mongoose';

const isObjectId = (id: string): boolean => {
  return Types.ObjectId.isValid(id)
	 ? String(new Types.ObjectId(id)) === id
	 ? true : false : false;
};

export default isObjectId;
