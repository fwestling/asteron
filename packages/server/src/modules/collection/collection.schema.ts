import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CollectionDocument = Collection & Document;

@Schema()
export class Collection {
  @Prop({ type: Boolean, default: false })
  deleted: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Collection', required: true })
  parent: Types.ObjectId;

  @Prop()
  name: string;

  @Prop()
  colour: string;

  @Prop()
  icon: string;

  @Prop({ type: Date, required: true, default: Date.now() })
  timestamp: Date;
}

export const CollectionSchema = SchemaFactory.createForClass(Collection);
