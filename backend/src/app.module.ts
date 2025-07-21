import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModuleModule } from './User/user-module/user-module.module';
import { JwtModule } from '@nestjs/jwt';
import {Logger} from '@nestjs/common'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true
    }),
    MongooseModule.forRootAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory:(configservice:ConfigService)=>({
        uri:configservice.get<string>('MONGO_URI')
      })
    }),
    JwtModule.registerAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory: (configService:ConfigService)=>{
         const secret = configService.get('JWT_SECRET_KEY');
    const expiresIn = configService.get('JWT_ACCESS_EXPIRES_IN');

    // Make sure you've imported Logger from @nestjs/common
    // import { Module, Logger } from '@nestjs/common'; 
    Logger.log(`[AppModule] Loading JWT_SECRET_KEY. Value found: ${secret ? 'YES' : 'NO'}`);
    if (!secret) {
      Logger.error('[AppModule] JWT_SECRET_KEY is undefined! Check your .env file and its location.');
    }
    Logger.log(`[AppModule] Loading JWT_ACCESS_EXPIRES_IN. Value found: ${expiresIn}`);

    return {
      secret: secret,
      signOptions: { expiresIn: expiresIn }
    };
      }

    }),
    UserModuleModule
    
  ],
  controllers: [AppController],
  providers: [AppService],
  exports:[JwtModule]
})
export class AppModule {}
