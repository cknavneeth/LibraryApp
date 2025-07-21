import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {v2 as cloudinary} from 'cloudinary'
import { Readable } from 'stream';






@Injectable()
export class CloudinaryService {

    constructor(private _configService:ConfigService){
        cloudinary.config({
    cloud_name:_configService.get<string>('CLOUDINARY_NAME'),
    api_key:_configService.get<string>('CLOUDINARY_API_KEY'),
    api_secret:_configService.get<string>('CLOUDINARY_SECRET')
})

   console.log('CLOUDINARY CONFIG:', {
  name: _configService.get<string>('CLOUDINARY_NAME'),
  key: _configService.get<string>('CLOUDINARY_API_KEY'),
  secret: _configService.get<string>('CLOUDINARY_SECRET')
})
    }

   async uploadBuffer(fileBuffer:Buffer,folder:string,filename:string):Promise<string>{
     return new Promise((resolve,reject)=>{

         const uploadCloudinary=cloudinary.uploader.upload_stream(
            {
                folder,
                public_id:filename,
                resource_type:'auto'
            },
            (error,result)=>{
                if(error) return reject(error)
                if(result)
                resolve(result.secure_url)
            }
         )

         Readable.from(fileBuffer).pipe(uploadCloudinary)

     })

   }
}

