import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {Document, Types} from 'mongoose'

export type BookDocument= Book& Document

@Schema()
export class Book{

    @Prop({required:true,type:Types.ObjectId})
    admin:Types.ObjectId
   
    @Prop({required:true})
    title:string

    @Prop({required:true})
    author:string

    @Prop({required:true})
    publisher:string

    @Prop({required:true})
    publicationYear:number

    @Prop({required:true})
    edition:string

    @Prop({required:true})
    language:string

    @Prop({required:true})
    genre:string

    @Prop({required:true})
    description:string

    @Prop({required:true})
    totalCopies:number

    @Prop({required:true})
    availableCopies:number

    @Prop({required:true})
    coverUrl:string

    @Prop({required:true})
    pdfUrl:string

}

export const BookSchema=SchemaFactory.createForClass(Book)