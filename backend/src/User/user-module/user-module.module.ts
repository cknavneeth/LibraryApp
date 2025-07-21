import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userAllSchema } from '../schema/user.schema';
import { UserControllerController } from '../controller/user-controller.controller';
import { UserServiceService } from '../service/user-service.service';
import { UserRepositoryService } from '../repository/user-repository.service';
import { USER_REPOSITORY, USER_SERVICE } from '../constants/user.constant';
import { JwtModule } from '@nestjs/jwt';
import { JwtModuleAuth } from 'src/JwtModule/jwt.module';
import { Book, BookSchema } from '../schema/book.schema';
import { CloudModuleModule } from 'src/common/service/cloudinary/cloud-module/cloud-module.module';

@Module({
    imports:[
        MongooseModule.forFeature([{name:User.name,schema:userAllSchema},{name:Book.name,schema:BookSchema}]),
        JwtModuleAuth,
        CloudModuleModule
        
    ],
    controllers:[UserControllerController],
    providers:[
        UserServiceService,
        UserRepositoryService,
        {
            provide:USER_SERVICE,
            useClass:UserServiceService
        },
        {
            provide:USER_REPOSITORY,
            useClass:UserRepositoryService
        }
    ],
    exports:[UserServiceService,UserRepositoryService]
})
export class UserModuleModule {
    
}
