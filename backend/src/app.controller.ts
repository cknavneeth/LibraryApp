import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/health')
  getValue(
    @Req() req,@Res() res
  ){
    try {
      return res.status(200).json({message:'success'})
    } catch (error) {
      throw error
    }
  }
}
