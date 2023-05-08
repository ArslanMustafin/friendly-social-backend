import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocumentType = HydratedDocument<User>;

@Schema()
export class User {
  _id: string;

  @Prop({ required: true })
  firstname: string;

  @Prop({ required: true })
  lastname: string;

  @Prop()
  middlename?: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  avatar?: string;

  @Prop()
  age?: number;

  @Prop()
  city?: string;

  @Prop()
  university?: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] })
  friends: User[];
}

export const UserSchema = SchemaFactory.createForClass(User);

export const UserModel = { name: User.name, schema: UserSchema };
