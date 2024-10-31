import { IdName } from "./id-name";

export class Task {
    id: number;
    description: string;
    userId: number;
    status: IdName;
    createDate: Date;
    comments: string;
    urgency: IdName;
    doDate: Date;
    inEdit:boolean;
    constructor() {
        this.status = new IdName();
        this.urgency = new IdName();
        this.createDate= new Date(Date.now());
        this.doDate = new Date();
        this.status.id=0;
        this.urgency.id=0;
        
    }
}
