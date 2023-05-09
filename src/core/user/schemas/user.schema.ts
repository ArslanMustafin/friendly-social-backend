import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { SALT_NUMBER } from 'src/utils/contants';

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

  @Prop({ required: true })
  password: string;

  @Prop()
  token?: string;

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

UserSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }

    const hashed = await bcrypt.hash(this['password'], SALT_NUMBER);

    this['password'] = hashed;

    return next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.token;
  return userObject;
};

export const UserModel = { name: User.name, schema: UserSchema };
