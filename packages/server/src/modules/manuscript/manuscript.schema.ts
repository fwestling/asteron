import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ManuscriptDocument = Manuscript & Document;

@Schema()
export class Manuscript {
  @Prop({ type: Boolean, default: false })
  deleted: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop()
  name: string;

  @Prop()
  colour?: string;

  @Prop()
  icon?: string;

  @Prop({ type: String })
  image?: string;

  @Prop({ type: [Types.ObjectId], ref: 'Collection' })
  collections: Types.ObjectId[];

  @Prop({ type: Date, required: true, default: Date.now() })
  timestamp: Date;
}

export const ManuscriptSchema = SchemaFactory.createForClass(Manuscript);
