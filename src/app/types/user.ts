import { IdName } from "./id-name";

export class User {
    id: number
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    password: string;
    isActive: boolean;
    userType: IdName;
    token: any;
    registerDate: Date;
    isYearlyPay: boolean;
    payDate: Date;
    lender: IdName;
    manager: IdName;

    constructor() {
        this.userType = new IdName();
        this.lender = new IdName();
        this.lender.id = 0;
        this.lender.name ="";
        this.manager = new IdName();
        this.manager.id = 0;
        this.manager.name ="";
        this.registerDate = new Date();
    }
}

