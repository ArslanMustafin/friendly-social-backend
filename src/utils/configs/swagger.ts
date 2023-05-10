import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Api Docs')
  .setDescription('The friendly-social API description')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
