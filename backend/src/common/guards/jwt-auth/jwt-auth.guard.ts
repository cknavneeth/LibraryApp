import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {

  constructor(
    private _jwtService:JwtService,
    private readonly _configService:ConfigService
  ){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
      
     const request=context.switchToHttp().getRequest()

     const token=this.extractTokenFromHeader(request)

     if(!token){
      throw new UnauthorizedException('No Token Provided')
     }

     try {
         const payload=this._jwtService.verify(token,{secret:this._configService.get<string>('JWT_SECRET_KEY')})
         request.user=payload
         return true
     } catch (error) {
         throw new UnauthorizedException('Invalid Token')
     }
     
  }


  private extractTokenFromHeader(request:any):string|undefined{

    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type === 'Bearer' && token) {
      console.log('authheder noki nok (from Authorization header):', token);
      return token;
    }




     const authtoken=request.cookies?.access_token
     console.log('authheder noki nok',authtoken)
     
    if(authtoken){
      return authtoken
    }

    return undefined
  }
}




