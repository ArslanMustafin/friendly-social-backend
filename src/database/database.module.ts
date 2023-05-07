import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigsModule } from 'src/configs/configs.module';

const DB_CONNECTION = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@socialsfriendlycluster.vfhzzer.mongodb.net/?retryWrites=true&w=majority`;

@Module({
  imports: [ConfigsModule, MongooseModule.forRoot(DB_CONNECTION)],
})
export class DatabaseModule {}
