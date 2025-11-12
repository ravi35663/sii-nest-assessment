import { Groups, Roles } from "./types";

export interface UsersInterface{
    id?:number;
    name: string;
    roles: Roles[];
    groups: Groups[]
}