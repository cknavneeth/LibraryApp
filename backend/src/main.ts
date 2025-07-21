import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin:['http://localhost:4200','https://library-app.vercel.app'],
    credentials:true,
    methods:'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization'
  })

  app.use(cookieParser())

  app.useGlobalPipes(new ValidationPipe())


  console.log('gonna start the app')
  
  await app.listen(process.env.PORT ?? 3000,'0.0.0.0');
}
bootstrap();
