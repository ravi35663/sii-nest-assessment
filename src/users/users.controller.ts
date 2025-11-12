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