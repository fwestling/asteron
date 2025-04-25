import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ _id: false })
export class ElementFormat {
  @ApiProperty({
    description: "Label of the format, e.g. 'Noun' or 'Possessive'",
  })
  @Prop()
  label: 'Default' | string;

  @ApiProperty()
  @Prop({ type: String })
  value: string;
}

export const ElementFormatSchema = SchemaFactory.createForClass(ElementFormat);
