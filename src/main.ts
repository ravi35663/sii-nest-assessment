import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const validationPipe = new ValidationPipe({
    whitelist:true, // Removes properties not in the DTO
    transform:true, //Automatically transform payloads to DTO instances
  })
  app.useGlobalPipes(validationPipe);
  await app.listen(3000);
}
bootstrap();