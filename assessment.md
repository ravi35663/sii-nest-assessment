```ts
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const validationPipe = new ValidationPipe({
    whitelist:true, // Removes properties not in the DTO
    transform:true, //Automatically transform payloads to DTO instances
  })
  app.useGlobalPipes(validationPipe);
  await app.listen(3000);
}
bootstrap();
```

```ts
app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

<!-- Users-Module -->

```ts

// users.module.ts
import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
    imports:[],
    controllers:[UsersController],
    providers:[UsersService]
})
export class UsersModule {};
```

```ts
// users.controller.ts
import { Controller,Get,Post,Patch,Put, Body, Param, Delete } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto, UpdateUserDto } from "./users.dto";


@Controller('/users')
export class UsersController{
    constructor(private readonly userService:UsersService){}

    @Get('/')
    findAll(){
        return this.userService.findAll();
    }

    @Post('/')
    create(@Body() createUserDto:CreateUserDto){
        return this.userService.create(createUserDto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() userData: UpdateUserDto) {
        return this.userService.update(+id, userData);
    }

    @Delete(':id')
    delete(@Param('id') id:string){
        return this.userService.delete(+id);
    }

    @Get("/managed/:id")
    managedUser(@Param("id") id:string){
        return this.userService.managedUser(+id);
    }
}
```


```ts
// users.service.ts
import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { Data, } from "./data"
import { UsersInterface } from "./users.interface"
import { CreateUserDto, UpdateUserDto } from "./users.dto";
import { Roles } from "./types";

@Injectable()
export class UsersService{
    private userData: UsersInterface[];
    constructor(){
        this.userData = Data;
    }

    async findAll():Promise<UsersInterface[]>{
        return this.userData;
    }

    async create(createUserDto:CreateUserDto):Promise<UsersInterface>{
        let id:number = 0;
        if(this.userData.length){
            id = this.userData[this.userData.length-1].id + 1;
        }
        const user = {id,...createUserDto}
        this.userData.push(user);
        return user;
    }

    async update(id:number, updateUserDto:UpdateUserDto):Promise<UsersInterface>{
        let user = this.userData.find(user=> (user.id == id));
        if(!user){
            throw new HttpException('Invalid User!!',HttpStatus.BAD_REQUEST);
        }
        const index = this.userData.findIndex(user=> user.id == id);
        user = {...user,...updateUserDto};
        this.userData[index] = user;
        return user;
    }

    async delete(id:number){
        const data = this.userData.filter(user=>user.id != id);
        if(data.length == this.userData.length){
            throw new HttpException('Invalid User!!',HttpStatus.BAD_REQUEST);
        }
        this.userData = data;
    }

    async managedUser(id:number):Promise<UsersInterface[]>{
        const manager = this.userData.find(user=> user.id == id);
        if(!manager){
            return [];
        }
        if(!manager.roles.includes(Roles.ADMIN)){
            return []
        }
        const users = this.userData.filter(user=>{
            if(user.id != manager.id){
                
                for(let item of manager.groups){
                    if(user.groups.includes(item)){
                        return true;
                    }
                }
            }
        })
        return users
        // return this.users.filter(user =>
        //     user.id !== manager.id &&
        //     user.groups.some(g => manager.groups.includes(g))
        //   );
    }
}
```

```ts

// users.interface.ts
import { Groups, Roles } from "./types";

export interface UsersInterface{
    id?:number;
    name: string;
    roles: Roles[];
    groups: Groups[]
}

```

```ts
// users.dto.ts
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
```

```ts
// user.types.ts
export enum Groups{ 
    GROUP_1 = "GROUP_1", 
    GROUP_2 = "GROUP_2"
}
export enum Roles {
    ADMIN = 'ADMIN',  
    PERSONAL = 'PERSONAL', 
    VIEWER = 'VIEWER'
};

```

```ts
// data.ts
import { UsersInterface } from "./users.interface";

export const Data:UsersInterface[] = [
    { id: 1, name: "John Doe", roles: ["ADMIN", "PERSONAL"], groups: ["GROUP_1", "GROUP_2"] },
    { id: 2, name: "Grabriel Monroe", roles: ["PERSONAL"], groups: ["GROUP_1", "GROUP_2"] },
    { id: 3, name: "Alex Xavier", roles: ["PERSONAL"], groups: ["GROUP_2"] },
    { id: 4, name: "Jarvis Khan", roles: ["ADMIN", "PERSONAL"], groups: ["GROUP_2"] },
    { id: 5, name: "Martines Polok", roles: ["ADMIN", "PERSONAL"], groups: ["GROUP_1"] },
    { id: 6, name: "Gabriela Wozniak", roles: ["VIEWER", "PERSONAL"], groups: ["GROUP_1"] }
] as UsersInterface[];
```