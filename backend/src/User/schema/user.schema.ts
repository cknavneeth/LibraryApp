import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId, Types ,Document} from "mongoose";
import { Book, BookSchema } from "./book.schema";

export type userDocument= User & Document

@Schema()
export class User{

    
    _id:Types.ObjectId
 
    @Prop({required:true,type:String})
    name:string

    @Prop({required:true,type:String})
    emailAddress:string

    @Prop({required:true})
    password:string

    @Prop()
    role:string

    @Prop({type:[{type:Types.ObjectId,ref:'Book'}]})
    borrowedBooks:Types.ObjectId[]
}

export const userAllSchema=SchemaFactory.createForClass(User)