import { Roles,Groups } from "./types";
import { PartialType } from '@nestjs/mapped-types';
import {ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty, IsString, MaxLength} from 'class-validator'
export class CreateUserDto{
    @IsString()
    @IsNotEmpty()
    @MaxLength(100,{message:"Name must be less and equal to 100 characters."})
    name:string;

    @IsArray()
    @ArrayNotEmpty({message:"At least one role is required."})
    @IsEnum(Roles,{each:true,message:"Each role must be a valid from valid predefined roles"})
    roles:Roles[];

    @IsArray()
    @ArrayNotEmpty({message:'At least one group is required.'})
    @IsEnum(Groups,{each:true, message:'Each group must be a valid from predefined groups'})
    groups:Groups[];
}

// export class UpdateUserDto extends PartialType(CreateUserDto) {}
export class UpdateUserDto extends PartialType(CreateUserDto){}