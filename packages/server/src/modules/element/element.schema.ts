import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { Content, ContentSchema } from '../content.schema';
import { ElementName, ElementNameSchema } from './element-name.schema';

export type ElementDocument = Element & Document;

@Schema()
export class Element {
  @Prop({ type: Boolean, default: false })
  deleted: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: [ElementNameSchema], required: true })
  names: ElementName[];

  @Prop({ type: String, required: true })
  defaultName: string;

  @Prop({ type: [ContentSchema], required: true })
  notes: Content[];

  @Prop()
  colour: string;

  @ApiProperty({
    description: 'Thumbnail image of the element',
    type: String,
  })
  @Prop({ type: String })
  image: string;

  @Prop({ type: [Types.ObjectId], ref: 'Collection' })
  collections: Types.ObjectId[];

  @Prop({ type: Date, required: true, default: Date.now() })
  timestamp: Date;
}

export const ElementSchema = SchemaFactory.createForClass(Element);
