import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { CoreModule } from './core/core.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [DatabaseModule, FilesModule, CoreModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
