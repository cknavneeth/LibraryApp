import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModuleAuth } from 'src/JwtModule/jwt.module';
import { JwtAuthGuard } from '../jwt-auth/jwt-auth.guard';

@Module({
    imports:[
        JwtModuleAuth,
        ConfigModule,
    ],
    providers:[JwtAuthGuard],
    exports:[JwtAuthGuard]
})
export class AuthModuleModule {}
