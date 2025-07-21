import { Global, Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { ConfigService,ConfigModule } from '@nestjs/config';

@Global()
@Module({
    imports:[
         NestJwtModule.registerAsync({
              imports:[ConfigModule],
              inject:[ConfigService],
              useFactory:async (configService:ConfigService)=>({
              secret: configService.get('JWT_SECRET_KEY'),
              signOptions: { expiresIn: configService.get('JWT_ACCESS_EXPIRES_IN') }
        
              })
        
            }),
    ],
    exports:[NestJwtModule]
})
export class JwtModuleAuth {}
