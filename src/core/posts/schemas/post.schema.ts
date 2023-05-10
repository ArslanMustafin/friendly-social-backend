import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/core/user/schemas/user.schema';

export type PostDocumentType = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post {
  _id: string;

  @Prop({ required: true })
  text: string;

  @Prop()
  image?: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  likes: User[] | string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  author: User;
}

export const PostSchema = SchemaFactory.createForClass(Post);

export const PostModel = { name: Post.name, schema: PostSchema };
