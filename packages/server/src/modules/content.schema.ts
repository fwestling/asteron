import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type ContentDocument = Content & Document;

/**
 * Content is a collection of elements used in a variety of places.
 * It represents a list of lines of text, and should always be used as a nested
 * property in a parent document.
 */
@Schema({ _id: false })
export class Content {
  @ApiProperty({
    description:
      'Optional label of the content; e.g. for notes against an element, this would be the title of the note (e.g. "Appearance")',
    type: String,
    required: false,
  })
  @Prop({ type: String, required: false })
  label?: string;

  @Prop({ type: [String], required: true })
  lines: string[];

  @Prop({ type: Date, required: true, default: Date.now() })
  lastUpdated: Date;
}

export const ContentSchema = SchemaFactory.createForClass(Content);
