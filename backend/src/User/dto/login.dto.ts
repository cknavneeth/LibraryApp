import { registerDto } from "./register.dto";
import { PartialType, PickType, OmitType } from '@nestjs/mapped-types';


export class loginDto extends PartialType(registerDto){}