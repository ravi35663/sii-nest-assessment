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