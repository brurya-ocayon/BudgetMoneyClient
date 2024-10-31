import { TableCode } from "./table-code";

export class IdName {
    id: number;
    name: string;
    inEdit: boolean = false;
    isActive?: boolean;
    type?:number;


}

export class IdNameDB extends IdName{
    tableCode:TableCode;
 
}
