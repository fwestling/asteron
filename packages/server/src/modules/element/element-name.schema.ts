import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { ElementFormat, ElementFormatSchema } from './element-formats.schema';

@Schema({ _id: false })
export class ElementName {
  @ApiProperty({
    description: 'Index of the name',
    type: Number,
  })
  @Prop({ type: Number })
  index: number;

  @Prop({ type: [ElementFormatSchema], required: true })
  formats: ElementFormat[];
}

export const ElementNameSchema = SchemaFactory.createForClass(ElementName);
