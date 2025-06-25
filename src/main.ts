import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import * as express from 'express';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ValidationPipe } from '@nestjs/common';
import { RedisAdapter } from './sockets/redis.adapter';
import { HttpExceptionFilter, JwtAuthGuard } from './libs/common';
import helmet from 'helmet';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // swagger config
  app.setGlobalPrefix('api');
  const config = new DocumentBuilder()
    .setTitle('Chat')
    .setDescription('Chat API Documentation')
    .setVersion('1.0')
    .setContact(
      'Kachamale Software Solution',
      'https://kachamale.com',
      'info@kachamale.com',
    )
    .build();
  app.useGlobalFilters(new HttpExceptionFilter(app.get(EventEmitter2)));
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  // pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: false,
      docExpansion: 'none',
    },
    customSiteTitle: 'Chat API Documentation',
  };

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document, customOptions);
  app.use(helmet());
  app.enableCors();

  // const redisAdapter = new RedisAdapter(app);
  // await redisAdapter.connectToRedis();
  // app.useWebSocketAdapter(redisAdapter);
  app.use(express.json());

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
  const PORT = process.env.PORT || 3000;
  await app
    .listen(PORT)
    .then(() => console.log(`app is running at port ${PORT}, ${new Date()}`));
}
bootstrap();
