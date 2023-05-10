import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './schemas/post.schema';
import { UserService } from '../user/user.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    private userService: UserService,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const { authorId, text, image } = createPostDto;

    const user = await this.userService.findOne(authorId);

    const post = new this.postModel({ text, image, author: user, likes: [] });

    await post.save();

    user.posts.push(post.id);

    await user.save();

    return post;
  }

  findAll() {
    return this.postModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    const post = await this.postModel.findById(id).exec();

    if (!post) throw new NotFoundException('Пост на найден!');

    return post;
  }

  update(id: string, updatePostDto: UpdatePostDto) {
    return this.postModel.findByIdAndUpdate(id, updatePostDto, { new: true }).exec();
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.postModel.deleteOne({ _id: id }).exec();
  }

  async findPostsForFriends(userId: string) {
    const user = await this.userService.findOne(userId);
    const friends = user.friends;

    const userIds = [userId, ...friends];

    const posts = await this.postModel
      .find({ author: { $in: userIds } })
      .sort({ createdAt: -1 })
      .exec();

    return posts;
  }

  async addLike(postId: string, userId: string) {
    const post = await this.findOne(postId);

    const likes = post.likes as string[];

    if (!likes.includes(userId)) {
      likes.push(userId);

      return post.save();
    }

    return post;
  }

  async removeLike(postId: string, userId: string) {
    const post = await this.findOne(postId);

    const likes = post.likes as string[];

    post.likes = likes.filter((like) => like.toString() !== userId.toString());

    return post.save();
  }
}
