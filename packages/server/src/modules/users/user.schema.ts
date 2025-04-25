import { UserRole, FirebaseProviders, UserRolesArray } from '@second/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ type: Boolean, default: false })
  locked: boolean;
  @Prop({ type: Boolean, default: false })
  deleted: boolean;
  @Prop({ type: Types.ObjectId, required: false })
  familyId?: Types.ObjectId;
  @Prop()
  givenName: string;
  @Prop()
  familyName: string;
  @Prop()
  email: string;
  @Prop()
  phone: string;
  @Prop({ type: [String], enum: UserRolesArray })
  roles: UserRole[];
  @Prop({ type: String, required: false })
  firebaseId: string;
  @Prop({ type: [String], required: false, enum: FirebaseProviders })
  providers: string[];
  @Prop({ type: String, required: false })
  picture: string;
  @Prop({ type: Boolean, default: false })
  emailVerified: boolean;
  @Prop({ type: Date, required: true, default: Date.now() })
  timestamp: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
