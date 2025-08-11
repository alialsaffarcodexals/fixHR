import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['log','error','warn'] });
  app.enableCors({ origin: 'http://localhost:3001', credentials: true });
  app.use(helmet());
  app.use(cookieParser(process.env.COOKIE_SECRET || 'dev'));
  app.use(json({ limit: '2mb' }));
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder().setTitle('Enterprise Payroll API').setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.API_PORT ? parseInt(process.env.API_PORT) : 4000;
  await app.listen(port, '0.0.0.0'); // bind to all interfaces for Docker
  console.log(`API listening on ${port}`);
}
bootstrap();
