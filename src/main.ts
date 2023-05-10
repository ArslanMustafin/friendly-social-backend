import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './filters/all-exception.filter';
import { swaggerConfig } from './utils/configs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  // app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(3001);
}
bootstrap();
